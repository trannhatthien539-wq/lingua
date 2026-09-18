import {
  getRedirectResult,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { GOOGLE_WEB_CLIENT_ID } from '../config/googleAuth';
import { auth, googleProvider } from './firebase';

// Web client ID dùng làm serverClientId cho Google Sign-In trên Android.
// Ưu tiên biến môi trường khi build, sau đó tới file src/config/googleAuth.js.
const nativeGoogleClientId = import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID || GOOGLE_WEB_CLIENT_ID;
let nativeGoogleReady = false;
let nativeGoogleInit = null;

export const hasNativeGoogleConfig = () => Boolean(nativeGoogleClientId);

export const isCapacitor = () => typeof window !== 'undefined' && (window.Capacitor?.isNativePlatform?.() || window.location.protocol === 'capacitor:');

export const initializeNativeGoogleAuth = async () => {
  if (!isCapacitor()) return;
  if (!nativeGoogleClientId) {
    throw new Error('Bản cài này chưa có Google Client ID nên không thể đăng nhập Google. Hãy dùng email/mật khẩu.');
  }
  if (nativeGoogleReady) return;
  if (nativeGoogleInit) return nativeGoogleInit;
  const { GoogleAuth } = await import('@codetrix-studio/capacitor-google-auth');
  nativeGoogleInit = GoogleAuth.initialize({
      clientId: nativeGoogleClientId,
      scopes: ['profile', 'email'],
      grantOfflineAccess: true,
    }).then(() => {
      nativeGoogleReady = true;
    }).finally(() => {
      nativeGoogleInit = null;
    });
  return nativeGoogleInit;
};

const getNativeGoogleAuth = async () => {
  const { GoogleAuth } = await import('@codetrix-studio/capacitor-google-auth');
  await initializeNativeGoogleAuth();
  return GoogleAuth;
};

export const signInWithGoogle = async () => {
  if (!isCapacitor()) return signInWithPopup(auth, googleProvider);
  if (!nativeGoogleClientId) {
    throw new Error('Bản cài này chưa có Google Client ID nên không thể đăng nhập Google. Hãy dùng email/mật khẩu.');
  }
  const GoogleAuth = await getNativeGoogleAuth();
  const googleUser = await GoogleAuth.signIn();
  const idToken = googleUser.authentication?.idToken;
  if (!idToken) throw new Error('Google không trả về ID token.');
  const credential = GoogleAuthProvider.credential(idToken);
  const userCredential = await signInWithCredential(auth, credential);
  return userCredential.user;
};

export const getGoogleRedirectResult = () =>
  isCapacitor() ? Promise.resolve(null) : getRedirectResult(auth);
