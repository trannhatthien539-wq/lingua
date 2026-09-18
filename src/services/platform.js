/** Nhận biết app đang chạy trong WebView của Capacitor (bản APK) hay trên trình duyệt. */
export const isCapacitor = () =>
  typeof window !== 'undefined' && (window.Capacitor?.isNativePlatform?.() || window.location.protocol === 'capacitor:');

export const platformName = () => {
  if (!isCapacitor()) return 'web';
  return window.Capacitor?.getPlatform?.() || 'native';
};
