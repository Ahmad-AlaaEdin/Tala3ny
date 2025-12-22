import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
}

// Define expected schema
interface NotificationData {
  toUserId: string;
  plateNumber: string;
  message: string;
}

interface UserData {
  fcmToken?: string;
  fcmTokens?: string[];
}

export const sendCarNotification = onDocumentCreated(
  "notifications/{notificationId}",
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      console.error("No snapshot data available");
      return;
    }

    const notificationData = snapshot.data() as NotificationData;
    const { toUserId, plateNumber, message } = notificationData;

    // Validate required fields
    if (!toUserId || !plateNumber || !message) {
      console.error("Missing required fields:", {
        toUserId,
        plateNumber,
        message,
      });
      return;
    }

    try {
      // Fetch user document
      const userDoc = await admin
        .firestore()
        .collection("users")
        .doc(toUserId)
        .get();

      if (!userDoc.exists) {
        console.error(`User not found: ${toUserId}`);
        // Update notification document to mark as failed
        await snapshot.ref.update({
          status: "failed",
          error: "User not found",
          processedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return;
      }

      const userData = userDoc.data() as UserData;

      // Support both single token (legacy) and multiple tokens
      let tokens: string[] = [];
      if (userData.fcmTokens && Array.isArray(userData.fcmTokens)) {
        tokens = userData.fcmTokens;
      } else if (userData.fcmToken) {
        tokens = [userData.fcmToken];
      }

      if (tokens.length === 0) {
        console.warn(`User ${toUserId} has no FCM tokens`);
        await snapshot.ref.update({
          status: "failed",
          error: "No FCM tokens available",
          processedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        return;
      }

      // Prepare notification payload with enhanced configuration
      const payload: admin.messaging.MulticastMessage = {
        tokens: tokens,
        notification: {
          title: "⚠️ تنبيه سيارة",
          body: `${message} - رقم اللوحة: ${plateNumber}`,
        },
        data: {
          type: "car_alert",
          plateNumber,
          notificationId: snapshot.ref.id,
          timestamp: new Date().toISOString(),
        },
        android: {
          priority: "high",
          notification: {
            sound: "default",
            priority: "high",
            channelId: "car_alerts",
          },
        },
        webpush: {
          notification: {
            requireInteraction: true,
            vibrate: [200, 100, 200],
            icon: "/icons/icon.png",
            badge: "/icons/badge.png",
          },
          fcmOptions: {
            link: "/", // Deep link to app
          },
        },
      };

      // Send notification
      const response = await admin.messaging().sendEachForMulticast(payload);

      console.log(
        `Notification ${snapshot.ref.id}: ${response.successCount} sent, ${response.failureCount} failed`
      );

      // Handle failed tokens
      const invalidTokens: string[] = [];
      if (response.failureCount > 0) {
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            const error = resp.error;
            console.error(`Failed to send to token ${idx}:`, error?.message);

            // Check if token is invalid/unregistered
            if (
              error?.code === "messaging/invalid-registration-token" ||
              error?.code === "messaging/registration-token-not-registered"
            ) {
              invalidTokens.push(tokens[idx]);
            }
          }
        });

        // Remove invalid tokens from user document
        if (invalidTokens.length > 0) {
          const validTokens = tokens.filter(
            (token) => !invalidTokens.includes(token)
          );

          console.log(
            `Removing ${invalidTokens.length} invalid token(s) from user ${toUserId}`
          );

          await admin.firestore().collection("users").doc(toUserId).update({
            fcmTokens: validTokens,
            lastTokenCleanup: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      }

      // Update notification document with delivery status
      await snapshot.ref.update({
        status: response.successCount > 0 ? "sent" : "failed",
        deliveryStats: {
          totalTokens: tokens.length,
          successCount: response.successCount,
          failureCount: response.failureCount,
          invalidTokensRemoved: invalidTokens.length,
        },
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`Notification ${snapshot.ref.id} processing complete`);
    } catch (error) {
      console.error("Error sending notification:", error);

      // Update notification document with error
      try {
        await snapshot.ref.update({
          status: "error",
          error: error instanceof Error ? error.message : "Unknown error",
          processedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (updateError) {
        console.error("Failed to update notification status:", updateError);
      }
    }
  }
);
