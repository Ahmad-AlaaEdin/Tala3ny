const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

exports.notifyByPlateNumber = functions.https.onCall(
  async (plateNumber: string, context) => {
    if (!plateNumber)
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Missing required fields"
      );

    const userDoc = await db.collection("users").doc(plateNumber).get();
    if (!userDoc.exists) return { success: false, message: "User not found" };

    const userData = userDoc.data();
    if (!userData.token)
      return { success: false, message: "User has no notifications" };
    const title = "";
    const body = "";
    await admin.messaging().sendToDevice(userData.token, {
      notification: { title, body, icon: "/icons/icon-192.png" },
    });
    return { success: true };
  }
);
