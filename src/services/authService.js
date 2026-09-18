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
const useNativeGoogle = () => import.meta.env.VITE_GOOGLE_USE_NATIVE_AUTH === '1';
let nativeGoogleReady = false;

/** Bản APK có đang dùng Google Sign-In native không (mặc định là không). */
export const isNativeGoogleAuthEnabled = () => isCapacitor() && useNativeGoogle();

export const hasNativeGoogleConfig = () => Boolean(getGoogleWebClientId());

export const initializeNativeGoogleAuth = async () => {
  if (!isCapacitor() || !useNativeGoogle()) return;
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
 */
export const signInWithGoogle = async () => {
  if (!isCapacitor()) return signInWithPopup(auth, googleProvider);
  if (!getGoogleWebClientId()) {
    const error = new Error('Chưa có Google Web Client ID. Vào Cài đặt → Tài khoản để dán client ID.');
    error.code = 'lingua/missing-client-id';
    throw error;
  }
  if (useNativeGoogle()) return signInWithNativeGoogle();
  return startGoogleBrowserSignIn();
};

export const getGoogleRedirectResult = () =>
  isCapacitor() ? Promise.resolve(null) : getRedirectResult(auth);
