/**
 * Cấu hình Google cho app Android (APK).
 *
 * `GOOGLE_WEB_CLIENT_ID` là "Web client ID" của **đúng project Firebase đang dùng**
 * (dạng `xxxxxxxx-xxxx.apps.googleusercontent.com`). Đây **không phải bí mật** —
 * client ID vốn được công khai trong mọi app — nên có thể điền trực tiếp vào đây.
 *
 * Lấy nhanh: Firebase Console → Authentication → Sign-in method → Google →
 * Web SDK configuration → Web client ID.
 *
 * Bản APK đăng nhập Google theo luồng mở Chrome (xem `src/services/googleBrowserAuth.js`):
 * app mở trang đăng nhập Google trong trình duyệt hệ thống, rồi quay về app qua deep link
 * `com.lingua.studyhub://auth#id_token=…`. Vì vậy **KHÔNG cần SHA-1, KHÔNG cần Android
 * OAuth client, KHÔNG cần keystore cố định** — chỉ cần thêm redirect URI
 * `GOOGLE_REDIRECT_URI` (trong `src/services/googleAuthConfig.js`) vào danh sách
 * Authorized redirect URIs của Web client đó trên Google Cloud Console.
 *
 * Client ID cũng có thể dán ngay trong app: Cài đặt → Tài khoản (lưu trên thiết bị,
 * áp dụng ngay, không cần build lại). Thứ tự ưu tiên khi build:
 *   1. Giá trị đã dán trong app (localStorage `lingua-google-client-id`).
 *   2. Biến môi trường `VITE_GOOGLE_WEB_CLIENT_ID` (secret của GitHub Actions / file .env).
 *   3. Giá trị dưới đây.
 */
export const GOOGLE_WEB_CLIENT_ID = ''
