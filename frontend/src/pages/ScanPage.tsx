import { useState, useEffect } from "react";

import {
  messaging,
  getToken,
  doc,
  getDoc,
  setDoc,
  db,
  auth,
  VAPID_KEY,
} from "../config/firebase";

import NotifyOwner from "@/components/NotifyOwner";
const ScanPage = () => {
  // Initialize with current permission, but allow local updates
  const [permission, setPermission] = useState<NotificationPermission>(
    Notification.permission
  );
  const [loading, setLoading] = useState(false);

  async function registerToken() {
    try {
      if (!("serviceWorker" in navigator) || !messaging) {
        console.log("Service Worker or Messaging not supported");
        return;
      }

      // Wait for the service worker (PWA) to be ready
      const registration = await navigator.serviceWorker.ready;

      // 1. Get FCM token using the existing registration
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (!token || !auth.currentUser) {
        console.log("No FCM token available or user not logged in.");
        return;
      }

      // 2. Reference to the user's Firestore doc
      const userRef = doc(db, "users", auth.currentUser.uid);

      // 3. Save/update the token (store as array if multiple devices)
      const userDoc = await getDoc(userRef);

      let tokens: string[] = [];
      if (userDoc.exists()) {
        const data = userDoc.data();
        tokens = data.fcmTokens || [];
      }

      if (!tokens.includes(token)) {
        tokens.push(token);

        await setDoc(
          userRef,
          { fcmTokens: tokens },
          { merge: true } // merge with existing data
        );
        console.log("FCM token saved successfully:", token);
      }
    } catch (error) {
      console.error("Error saving FCM token:", error);
    }
  }

  async function askForNotificationPermission() {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
      return;
    }

    setLoading(true);

    try {
      // 1. Request permission
      const result = await Notification.requestPermission();

      // 2. Update local state immediately
      setPermission(result);

      if (result === "granted") {
        console.log("Permission granted!");
        await registerToken();
      } else if (result === "denied") {
        console.log("Permission denied by user.");
        alert("يرجى تفعيل الإشعارات من إعدادات المتصفح لتلقي التنبيهات.");
      }
    } catch (error) {
      console.error("Error asking for permission: ", error);
    } finally {
      setLoading(false);
    }
  }

  // Check permission on mount (double check)
  useEffect(() => {
    setPermission(Notification.permission);
  }, []);

  return (
    <>
      {permission !== "granted" && (
        <div className="w-full flex justify-center">
          <button
            onClick={askForNotificationPermission}
            className="bg-amber-600 p-3 rounded-2xl m-2"
          >
            {loading ? "جاري التحميل" : "تفعبل التنبيهات"}{" "}
          </button>
        </div>
      )}
      <NotifyOwner />
    </>
  );
};

export default ScanPage;
