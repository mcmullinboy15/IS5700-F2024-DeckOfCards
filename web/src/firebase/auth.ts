import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./config";
import { doc, setDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";

export const register = async (
  email: string,
  password: string,
  username: string,
  access: string
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredential.user;
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    username: username,
    access: access,
  });

  login(email, password);

  return user;
};

// @ts-ignore
export const login = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    console.error("Error during sign in:", error);
  }
};
