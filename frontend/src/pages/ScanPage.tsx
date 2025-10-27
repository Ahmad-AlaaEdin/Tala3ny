import { useNotificationPermission } from "../hooks/useNotificationPermission";
import {
  messaging,
  getToken,
  doc,
  getDoc,
  setDoc,
  db,
  auth,
} from "../config/firebase";

const ScanPage = () => {
  const permission = useNotificationPermission();

  async function askForNotificationPermission() {
    // 1. Check if the browser supports notifications
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
      return;
    }

    // 2. Check the current permission status
    if (Notification.permission === "granted") {
      console.log("Permission already granted!");
      // You can show a notification or get the push token
      return;
    }

    if (Notification.permission === "denied") {
      console.log(
        "Permission was permanently denied. User must change it in browser settings."
      );
      // Show a message guiding them to browser settings
      return;
    }

    // 3. If permission is 'default' (not yet asked), then ask
    if (Notification.permission === "default") {
      try {
        // This shows the browser's native prompt
        const result = await Notification.requestPermission();
        if (result === "granted") {
          try {
            const registration = await navigator.serviceWorker.register(
              "/firebase-messaging-sw.js"
            );
            // 1. Get FCM token
            const token = await getToken(messaging, {
              vapidKey:
                "BH9P5AqfYpCWga7LfsWJKOsc7x6okn9SoEyAWfluyj4_pe5Uyi7HYZOmY_-MmGXzQc4A0HQxaE4tDZhWx-I9erY",
              serviceWorkerRegistration: registration,
            });

            if (!token || !auth.currentUser) {
              console.log("No FCM token available.");
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
            }

            await setDoc(
              userRef,
              { fcmTokens: tokens },
              { merge: true } // merge with existing data
            );

            console.log("FCM token saved successfully:", token);
          } catch (error) {
            console.error("Error saving FCM token:", error);
          }
        } else if (result === "denied") {
          console.log("Permission denied by user.");
          // Don't bother them again
        } else {
          // result === 'default'
          console.log("Permission request dismissed.");
          // The user closed the box. You can ask again later.
        }
      } catch (error) {
        console.error("Error asking for permission: ", error);
      }
    }
  }
  const handleComplete = (plate: string) => {
    console.log("Car plate entered:", plate); // e.g., "ABC123"
  };
  return (
    <>
      {permission !== "granted" && (
        <button onClick={askForNotificationPermission} className="bg-amber-600">
          Allow Notifications
        </button>
      )}
      <div className="flex flex-col items-center justify-center h-screen gap-6">
        <h2 className="text-lg font-semibold">Enter Car Plate</h2>
      </div>
    </>
  );
};

export default ScanPage;
