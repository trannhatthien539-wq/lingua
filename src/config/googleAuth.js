/**
 * Cấu hình Google cho app Android (APK).
 *
 * CÁCH MẶC ĐỊNH — MỞ CHROME ĐĂNG NHẬP RỒI QUAY VỀ APP:
 * App mở thẳng trang OAuth của Google trong Chrome với `GOOGLE_WEB_CLIENT_ID` bên dưới.
 * Google đăng nhập xong sẽ redirect về `GOOGLE_REDIRECT_URI`
 * (`https://trannhatthien539-wq.github.io/lingua/oauth-callback.html`) — trang này chuyển tiếp
 * sang deep link `com.lingua.studyhub://auth#id_token=…` để mở lại app.
 * KHÔNG cần SHA-1, KHÔNG cần Android OAuth client.
 *
 * ⚠️ CHỈ CẦN LÀM 1 LẦN: thêm `GOOGLE_REDIRECT_URI` vào danh sách **Authorized redirect URIs**
 * của OAuth client (Web) tương ứng trong Google Cloud Console, nếu không Google sẽ báo
 * "Error 400: redirect_uri_mismatch".
 *
 * `GOOGLE_LOGIN_MODE`:
 *   - 'direct' : (mặc định) luồng trên — token do chính Google gửi về, chắc chắn nhận được.
 *   - 'auto'   : dùng trang handler của Firebase (`/__/auth/handler`). Không cần đăng ký
 *                redirect URI, nhưng đã kiểm tra thực tế là **không chuyển tiếp kết quả về app**
 *                nên chỉ để làm phương án dự phòng.
 * Người dùng có thể đổi ngay trong app: Cài đặt → Tài khoản (lưu trên thiết bị,
 * áp dụng ngay, không cần build lại APK).
 *
 * `GOOGLE_WEB_CLIENT_ID` là Web client ID của **đúng project Firebase đang dùng**. Đây không
 * phải bí mật. Thứ tự ưu tiên: giá trị dán trong app → biến môi trường
 * `VITE_GOOGLE_WEB_CLIENT_ID` → hằng số dưới đây.
 */
export const GOOGLE_LOGIN_MODE = 'direct'

export const GOOGLE_WEB_CLIENT_ID = '138926081617-3i38i9udqpevpgh46rvemdsme982muas.apps.googleusercontent.com'
