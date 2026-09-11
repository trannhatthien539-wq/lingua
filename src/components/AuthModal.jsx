import { useState } from "react";
import { X } from "lucide-react";
import { auth, googleProvider, signInWithPopup } from "../services/firebase";

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onAuthSuccess?.();
    } catch (signInError) {
      setError(signInError.code === "auth/popup-closed-by-user"
        ? "Cửa sổ đăng nhập đã được đóng."
        : `Đăng nhập thất bại: ${signInError.message || "Vui lòng thử lại."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="panel w-full max-w-sm p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
        <div className="flex items-start justify-between gap-4">
          <div><p className="eyebrow">Lingua account</p><h2 id="auth-modal-title" className="mt-1 font-display text-xl font-bold">Đăng nhập để đồng bộ</h2></div>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-ink/45 hover:bg-ink/5 hover:text-ink dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white" aria-label="Đóng"><X size={17} /></button>
        </div>
        <p className="mt-3 text-sm leading-6 text-ink/55 dark:text-white/55">Lưu bộ từ vựng trên mọi thiết bị bằng tài khoản Google của bạn.</p>
        <button onClick={handleGoogleSignIn} disabled={loading} className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm font-bold text-ink shadow-sm transition hover:border-ink/25 hover:shadow-md disabled:cursor-wait disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.35 12.23c0-.71-.06-1.4-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.22Z"/><path fill="#34A853" d="M12 21.6c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.6Z"/><path fill="#FBBC05" d="M6.54 13.69A5.86 5.86 0 0 1 6.23 12c0-.59.11-1.17.31-1.69V7.78H3.3A9.76 9.76 0 0 0 2.26 12c0 1.53.37 2.97 1.04 4.22l3.24-2.53Z"/><path fill="#EA4335" d="M12 6.28c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.34 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.7 5.38l3.24 2.53C7.31 8 9.46 6.28 12 6.28Z"/></svg>
          {loading ? "Đang đăng nhập..." : "Tiếp tục với Google"}
        </button>
        {error && <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-xs leading-5 text-red-600 dark:text-red-300" role="alert">{error}</p>}
      </div>
    </div>
  );
}
