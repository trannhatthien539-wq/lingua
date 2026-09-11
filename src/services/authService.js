import {
  getRedirectResult,
  signInWithPopup,
  signInWithRedirect,
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

export const isCapacitor = () => typeof window !== 'undefined' && (window.Capacitor !== undefined || window.location.protocol === 'capacitor:');

export const signInWithGoogle = () => isCapacitor()
  ? signInWithRedirect(auth, googleProvider)
  : signInWithPopup(auth, googleProvider);

export const getGoogleRedirectResult = () => getRedirectResult(auth);
