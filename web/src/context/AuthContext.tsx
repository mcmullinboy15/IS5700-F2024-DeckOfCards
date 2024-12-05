import { User, onAuthStateChanged } from "firebase/auth";
import { createContext, useState, useContext, ReactNode } from "react";
import { auth } from "../firebase/config";

interface AuthContextType {
  user: User | null;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      setUser(user);
      console.log("User is signed in:", user);
    } else {
      // User is signed out
      setUser(null);
      console.log("User is signed out");
    }
  });

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
