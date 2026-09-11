import { getApp, getApps, initializeApp } from 'firebase/app'
import { browserLocalPersistence, getAuth, GoogleAuthProvider, setPersistence, signOut, onAuthStateChanged } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDbfWmStltXb9l8YC5ySE7jtffoqU1J3hBY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'lingua-49fc1.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'lingua-49fc1',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'lingua-49fc1.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '138926081617',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:138926081617:web:4d64b990f6dfc6c9e41a70',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-JG9KNJ4Y4Y',
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

// Khởi tạo các dịch vụ
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
export const authPersistence = setPersistence(auth, browserLocalPersistence)

// Export các hàm tiện ích
export { signOut, onAuthStateChanged }