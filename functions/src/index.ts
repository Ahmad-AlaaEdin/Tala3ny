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
      const fcmToken = userData.fcmToken;

      if (!fcmToken) {
        console.log("User has no device token saved.");
        return;
      }

      const payload: admin.messaging.Message = {
        token: fcmToken,
        notification: {
          title: "⚠️ تنبيه سيارة",
          body: `${message} - رقم اللوحة: ${plateNumber}`,
        },
        data: {
          type: "car_alert",
          plateNumber,
        },
      };

      await admin.messaging().send(payload);
      console.log("Notification sent successfully!");
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }
);
