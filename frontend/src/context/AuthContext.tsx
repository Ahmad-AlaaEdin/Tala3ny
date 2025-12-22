import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "../config/firebase";
import { useFCMToken } from "../hooks/useFCMToken";

interface AuthContextType {
  user: User | null;
  logout: () => void;
  tokenRegistered: boolean;
  tokenError: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: () => {},
  tokenRegistered: false,
  tokenError: null,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Use the new FCM token hook
  const { tokenRegistered, error: tokenError } = useFCMToken(user);

  useEffect(() => {
    // Observe user login state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, logout, tokenRegistered, tokenError }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
