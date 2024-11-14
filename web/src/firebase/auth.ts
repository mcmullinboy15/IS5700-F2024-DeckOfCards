import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./config";

export const register = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  return userCredential.user;
};

// @ts-ignore
export const login = async (email: string, password: string) => {
  // ... TODO ...
};
