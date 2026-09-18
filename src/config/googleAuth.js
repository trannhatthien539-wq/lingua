/**
 * Cấu hình Google cho app Android (APK).
 *
 * `GOOGLE_WEB_CLIENT_ID` là "Web client ID" của Google Cloud project (dạng
 * `xxxxxxxx.apps.googleusercontent.com`). Đây **không phải bí mật** — client ID
 * vốn được công khai trong mọi app — nên có thể điền trực tiếp vào đây.
 *
 * Thứ tự ưu tiên khi build:
 *   1. Biến môi trường `VITE_GOOGLE_WEB_CLIENT_ID` (secret của GitHub Actions / file .env).
 *   2. Giá trị dưới đây.
 *
 * Điền vào đây nếu repo chưa có secret `VITE_GOOGLE_WEB_CLIENT_ID`, khi đó APK vẫn
 * đăng nhập Google được.
 */
export const GOOGLE_WEB_CLIENT_ID = ''
