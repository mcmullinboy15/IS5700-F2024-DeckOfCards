// https://firebase.google.com/docs/web/setup#available-libraries

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDaDYQcYcce3vn3tHLOGh119KNe5-4w4Ls",
  authDomain: "f2024-is5700.firebaseapp.com",
  projectId: "f2024-is5700",
  storageBucket: "f2024-is5700.firebasestorage.app",
  messagingSenderId: "440921741843",
  appId: "1:440921741843:web:55096d942e19080ac9bde6",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
