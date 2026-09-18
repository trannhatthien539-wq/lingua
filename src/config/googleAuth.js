/**
 * Cấu hình Google cho app Android (APK).
 *
 * CÁCH MẶC ĐỊNH — KHÔNG CẦN CẤU HÌNH GÌ:
 * Bản APK đăng nhập Google bằng cách mở Chrome với trang handler có sẵn của chính project
 * Firebase (`https://lingua-49fc1.firebaseapp.com/__/auth/handler`). Handler tự dùng Web client
 * ID của project (Firebase tạo sẵn) và `redirect_uri` của nó đã được Google đăng ký sẵn, nên
 * KHÔNG cần vào Google Cloud Console, KHÔNG cần SHA-1, KHÔNG cần dán client ID.
 * Xem `src/services/googleBrowserAuth.js`.
 *
 * `GOOGLE_LOGIN_MODE`:
 *   - 'auto'   : (khuyên dùng) dùng handler của Firebase như trên.
 *   - 'direct' : mở thẳng trang OAuth của Google bằng `GOOGLE_WEB_CLIENT_ID` bên dưới.
 *                Chỉ dùng khi bạn đã thêm redirect URI
 *                `https://trannhatthien539-wq.github.io/lingua/oauth-callback.html`
 *                vào Authorized redirect URIs của client đó.
 * Người dùng cũng có thể đổi ngay trong app: Cài đặt → Tài khoản (lưu trên thiết bị,
 * áp dụng ngay, không cần build lại APK).
 *
 * `GOOGLE_WEB_CLIENT_ID` là Web client ID của **đúng project Firebase đang dùng**. Đây không
 * phải bí mật và chỉ được dùng ở chế độ 'direct' (và cho Google Sign-In native nếu bật
 * `VITE_GOOGLE_USE_NATIVE_AUTH=1`). Thứ tự ưu tiên: giá trị dán trong app → biến môi trường
 * `VITE_GOOGLE_WEB_CLIENT_ID` → hằng số dưới đây.
 */
export const GOOGLE_LOGIN_MODE = 'auto'

export const GOOGLE_WEB_CLIENT_ID = '138926081617-3i38i9udqpevpgh46rvemdsme982muas.apps.googleusercontent.com'
