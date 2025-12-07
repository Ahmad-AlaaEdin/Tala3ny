import {onDocumentCreated} from "firebase-functions/v2/firestore";
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
      return;
    }
    const notificationData = snapshot.data() as NotificationData;

    const {toUserId, plateNumber, message} = notificationData;

    try {
      const userDoc = await admin
        .firestore()
        .collection("users")
        .doc(toUserId)
        .get();

      if (!userDoc.exists) {
        console.log("No user found");
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
        console.log("User has no device token saved.");
        return;
      }

      const payload: admin.messaging.MulticastMessage = {
        tokens: tokens,
        notification: {
          title: "⚠️ تنبيه سيارة",
          body: `${message} - رقم اللوحة: ${plateNumber}`,
        },
        data: {
          type: "car_alert",
          plateNumber,
        },
      };

      const response = await admin.messaging().sendEachForMulticast(payload);
      console.log(
        `Notifications sent: ${response.successCount}, Failed: ${response.failureCount}`
      );
      
      // Optional: Remove invalid tokens if needed
      if (response.failureCount > 0) {
        const failedTokens: string[] = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(tokens[idx]);
          }
        });
        console.log("Failed tokens:", failedTokens);
      }

    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }
);
