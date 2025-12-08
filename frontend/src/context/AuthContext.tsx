import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import {
  auth,
  messaging,
  getToken,
  doc,
  getDoc,
  setDoc,
  db,
  VAPID_KEY,
} from "../config/firebase";

interface AuthContextType {
  user: User | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function registerToken(currentUser: User) {
    try {
      if (
        !("serviceWorker" in navigator) ||
        Notification.permission !== "granted"
      ) {
        return;
      }

      // Wait for the service worker (PWA) to be ready
      const registration = await navigator.serviceWorker.ready;

      // 1. Get FCM token using the existing registration
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (!token) {
        console.log("No FCM token available.");
        return;
      }

      // 2. Reference to the user's Firestore doc
      const userRef = doc(db, "users", currentUser.uid);

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

  useEffect(() => {
    // Observe user login state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        registerToken(currentUser);
      }
    });
    return unsubscribe;
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
