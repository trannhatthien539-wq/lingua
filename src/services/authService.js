import {
  getRedirectResult,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { getGoogleWebClientId } from './googleAuthConfig';
import { startGoogleBrowserSignIn } from './googleBrowserAuth';
import { isCapacitor, platformName } from './platform';

export { isCapacitor, platformName };

// Google Sign-In native (plugin @codetrix-studio/capacitor-google-auth) chỉ dùng khi bật rõ
// ràng bằng VITE_GOOGLE_USE_NATIVE_AUTH=1. Mặc định bản APK dùng luồng mở Chrome vì không cần
// SHA-1/Android client — xem src/services/googleBrowserAuth.js.
const nativeGoogleRequested = () => import.meta.env.VITE_GOOGLE_USE_NATIVE_AUTH === '1';
let nativeGoogleReady = false;

/** Bản APK có đang dùng Google Sign-In native không (mặc định là không). */
export const isNativeGoogleAuthEnabled = () => isCapacitor() && nativeGoogleRequested();

export const hasNativeGoogleConfig = () => Boolean(getGoogleWebClientId());

export const initializeNativeGoogleAuth = async () => {
  if (!isCapacitor() || !nativeGoogleRequested()) return;
  const clientId = getGoogleWebClientId();
  if (!clientId) {
    throw new Error('Bản cài này chưa có Google Client ID nên không thể đăng nhập Google. Hãy dùng email/mật khẩu.');
  }
  if (nativeGoogleReady) return;

  const { GoogleAuth } = await import('@codetrix-studio/capacitor-google-auth');
  await GoogleAuth.initialize({
    clientId,
    scopes: ['profile', 'email'],
    grantOfflineAccess: true,
  });
  nativeGoogleReady = true;
};

const signInWithNativeGoogle = async () => {
  const { GoogleAuth } = await import('@codetrix-studio/capacitor-google-auth');
  await initializeNativeGoogleAuth();
  const googleUser = await GoogleAuth.signIn();
  const idToken = googleUser.authentication?.idToken;
  if (!idToken) throw new Error('Google không trả về ID token.');
  const credential = GoogleAuthProvider.credential(idToken);
  const userCredential = await signInWithCredential(auth, credential);
  return userCredential.user;
};

/**
 * Đăng nhập Google.
 * - Web: popup của Firebase.
 * - APK: mở Chrome để đăng nhập; phiên Firebase được tạo khi deep link quay về app,
 *   nên hàm trả về `{ pending: true }` thay vì user.
 *   Mặc định dùng chế độ tự động (handler của Firebase) — không cần client ID.
 */
export const signInWithGoogle = async () => {
  if (!isCapacitor()) return signInWithPopup(auth, googleProvider);
  if (nativeGoogleRequested()) {
    if (!getGoogleWebClientId()) {
      const error = new Error('Chế độ Google Sign-In native cần một Web client ID.');
      error.code = 'lingua/missing-client-id';
      throw error;
    }
    return signInWithNativeGoogle();
  }
  return startGoogleBrowserSignIn();
};

export const getGoogleRedirectResult = () =>
  isCapacitor() ? Promise.resolve(null) : getRedirectResult(auth);
