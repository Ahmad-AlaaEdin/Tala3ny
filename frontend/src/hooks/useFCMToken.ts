import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import {
  messaging,
  getToken,
  doc,
  getDoc,
  setDoc,
  db,
  VAPID_KEY,
} from "../config/firebase";

/**
 * Custom hook to handle FCM token registration
 * Consolidates duplicate logic from AuthContext and ScanPage
 */
export function useFCMToken(user: User | null) {
  const [tokenRegistered, setTokenRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setTokenRegistered(false);
      return;
    }

    registerToken(user);
  }, [user]);

  async function registerToken(
    currentUser: User,
    retryCount = 0
  ): Promise<boolean> {
    try {
      // Check for service worker support
      if (!("serviceWorker" in navigator)) {
        setError("Service Worker not supported");
        return false;
      }

      // Check for notification permission
      if (Notification.permission !== "granted") {
        setError("Notification permission not granted");
        return false;
      }

      // Check for messaging support
      if (!messaging) {
        setError("Firebase Messaging not supported");
        return false;
      }

      // Wait for service worker with timeout
      const registration = await waitForServiceWorker();
      if (!registration) {
        // Retry up to 3 times with exponential backoff
        if (retryCount < 3) {
          const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
          console.log(`Service worker not ready, retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return registerToken(currentUser, retryCount + 1);
        }
        setError("Service worker failed to initialize");
        return false;
      }

      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (!token) {
        setError("Failed to get FCM token");
        return false;
      }

      // Reference to the user's Firestore doc
      const userRef = doc(db, "users", currentUser.uid);

      // Get existing tokens
      const userDoc = await getDoc(userRef);
      let tokens: string[] = [];
      if (userDoc.exists()) {
        const data = userDoc.data();
        tokens = data.fcmTokens || [];
      }

      // Add new token if not already present
      if (!tokens.includes(token)) {
        tokens.push(token);

        await setDoc(
          userRef,
          {
            fcmTokens: tokens,
            lastTokenUpdate: new Date(),
          },
          { merge: true }
        );

        console.log("FCM token registered successfully:", token);
      }

      setTokenRegistered(true);
      setError(null);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      console.error("Error registering FCM token:", err);
      setError(errorMessage);
      setTokenRegistered(false);
      return false;
    }
  }

  /**
   * Wait for service worker to be ready with timeout
   */
  async function waitForServiceWorker(
    timeoutMs = 10000
  ): Promise<ServiceWorkerRegistration | null> {
    try {
      const registration = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), timeoutMs)
        ),
      ]);
      return registration;
    } catch {
      return null;
    }
  }

  /**
   * Manually trigger token refresh (useful after permission grant)
   */
  async function refreshToken() {
    if (!user) return false;
    setTokenRegistered(false);
    setError(null);
    return registerToken(user);
  }

  return {
    tokenRegistered,
    error,
    refreshToken,
  };
}
