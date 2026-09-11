import { getApp, getApps, initializeApp } from 'firebase/app'
import { browserLocalPersistence, getAuth, GoogleAuthProvider, setPersistence, signOut, onAuthStateChanged } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDbfWmStltXb9l8YC5ySE7jtffoqU1J3hBY',
  authDomain: 'lingua-49fc1.firebaseapp.com',
  projectId: 'lingua-49fc1',
  storageBucket: 'lingua-49fc1.firebasestorage.app',
  messagingSenderId: '138926081617',
  appId: '1:138926081617:web:4d64b990f6dfc6c9e41a70',
  measurementId: 'G-JG9KNJ4Y4Y',
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

// Khởi tạo các dịch vụ
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
export const authPersistence = setPersistence(auth, browserLocalPersistence)

// Export các hàm tiện ích
export { signOut, onAuthStateChanged }