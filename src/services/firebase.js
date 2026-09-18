import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDbfWmStltxB9l8YC5ySE7jtffqU1J3hBY",
  authDomain: "lingua-49fc1.firebaseapp.com",
  projectId: "lingua-49fc1",
  storageBucket: "lingua-49fc1.firebasestorage.app",
  messagingSenderId: "138926081617",
  appId: "1:138926081617:web:4d64b990f6dfc6c9e41a70",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Bật cache ngoại tuyến của Firestore để vẫn đọc/ghi được khi mất mạng.
const createFirestore = () => {
  try {
    return initializeFirestore(app, {
      localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
    });
  } catch (error) {
    console.warn("Không bật được cache ngoại tuyến của Firestore, dùng bộ nhớ tạm.", error);
    return getFirestore(app);
  }
};

export const db = createFirestore();

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
};
