import {
  EmailAuthProvider,
  auth,
  linkWithCredential,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  updatePassword,
} from "./firebase";

/**
 * "Cầu nối đăng nhập" giữa bản web và app APK.
 *
 * Bản APK không đăng nhập được Google (deep link/Chrome trên một số máy không quay về app).
 * Cách không cần backend: trên web (đã đăng nhập Google), người dùng **tạo mật khẩu** cho
 * chính tài khoản đó; sau đó ở APK đăng nhập bằng Email + mật khẩu.
 *
 * Lưu ý: không thể "copy phiên đăng nhập" từ web sang APK vì Firebase không cho xuất
 * refresh token ra ngoài SDK — muốn chuyển phiên bằng một mã dùng một lần thì cần
 * Cloud Function cấp custom token (xem `functions/index.js`).
 */

const errorMessages = {
  "auth/provider-already-linked": "Tài khoản này đã có mật khẩu. Hãy dùng mục “Đổi mật khẩu”.",
  "auth/email-already-in-use": "Email này đang thuộc một tài khoản khác.",
  "auth/credential-already-in-use": "Mật khẩu này đang gắn với một tài khoản khác.",
  "auth/weak-password": "Mật khẩu cần ít nhất 6 ký tự.",
  "auth/wrong-password": "Mật khẩu hiện tại chưa đúng.",
  "auth/invalid-credential": "Mật khẩu hiện tại chưa đúng.",
  "auth/requires-recent-login": "Vì lý do bảo mật, hãy đăng nhập lại rồi thử lại.",
  "auth/too-many-requests": "Bạn đã thử quá nhiều lần. Vui lòng đợi vài phút.",
  "auth/network-request-failed": "Mạng không ổn định, vui lòng thử lại.",
  "auth/user-mismatch": "Tài khoản không khớp. Hãy đăng nhập lại.",
};

const friendly = (error) => new Error(errorMessages[error?.code] || error?.message || "Không thực hiện được. Vui lòng thử lại.");

export const accountEmail = (user) => user?.email || "";

export const hasPasswordProvider = (user) =>
  Boolean(user?.providerData?.some((provider) => provider.providerId === "password"));

export const loginMethods = (user) => (user?.providerData || []).map((provider) => provider.providerId);

const assertPassword = (password, confirm) => {
  if (!password || password.length < 6) throw new Error("Mật khẩu cần ít nhất 6 ký tự.");
  if (confirm !== undefined && password !== confirm) throw new Error("Hai mật khẩu chưa giống nhau.");
};

/** Tạo mật khẩu cho tài khoản đang đăng nhập bằng Google (để APK đăng nhập được). */
export const createPasswordForApp = async (user, password, confirm) => {
  if (!user?.email) throw new Error("Tài khoản này không có email nên không tạo được mật khẩu.");
  assertPassword(password, confirm);
  try {
    await linkWithCredential(user, EmailAuthProvider.credential(user.email, password));
    return user.email;
  } catch (error) {
    throw friendly(error);
  }
};

/** Đổi mật khẩu hiện có (cần nhập mật khẩu cũ để xác thực lại). */
export const changeAccountPassword = async (user, currentPassword, nextPassword, confirm) => {
  if (!user?.email) throw new Error("Tài khoản này không có email nên không đổi được mật khẩu.");
  assertPassword(nextPassword, confirm);
  try {
    await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, currentPassword));
    await updatePassword(user, nextPassword);
    return user.email;
  } catch (error) {
    throw friendly(error);
  }
};

/** Gửi email đặt lại mật khẩu (dùng khi quên mật khẩu trên APK). */
export const sendResetPasswordEmail = async (email) => {
  const value = String(email || "").trim();
  if (!value) throw new Error("Hãy nhập email tài khoản.");
  try {
    await sendPasswordResetEmail(auth, value);
    return value;
  } catch (error) {
    if (error?.code === "auth/user-not-found") {
      throw new Error("Không tìm thấy tài khoản với email này.", { cause: error });
    }
    throw friendly(error);
  }
};
