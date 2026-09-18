import { useState } from "react";
import { ArrowRight, BookOpen, BrainCircuit, Check, Clock3, Mail } from "lucide-react";
import AppMark from "../AppMark";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "../../services/firebase";
import { signInWithGoogle } from "../../services/authService";

const features = [
  { icon: BookOpen, title: "SRS Flashcard", text: "Ôn đúng lúc, nhớ lâu hơn với nhịp học cá nhân." },
  { icon: BrainCircuit, title: "Mindmap tương tác", text: "Nhìn thấy cả hành trình học trong một không gian rõ ràng." },
  { icon: Clock3, title: "Zen Pomodoro", text: "Tập trung sâu trong những phiên học vừa đủ." },
];

export default function AuthPage({ onGuest }) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const runAuth = async (action) => {
    setError("");
    setNotice("");
    setLoading(true);
    try {
      const result = await action();
      // Bản APK mở Chrome để đăng nhập: phiên sẽ được tạo khi app được mở lại.
      if (result?.pending) setNotice("Đã mở Chrome. Chọn tài khoản Google rồi quay lại app — đăng nhập sẽ tự hoàn tất.");
    } catch (authError) {
      const messages = {
        "auth/invalid-credential": "Email hoặc mật khẩu chưa chính xác.",
        "auth/email-already-in-use": "Email này đã được đăng ký.",
        "auth/weak-password": "Mật khẩu cần có ít nhất 6 ký tự.",
        "auth/invalid-email": "Email chưa đúng định dạng.",
        "auth/popup-closed-by-user": "Cửa sổ Google đã được đóng.",
        "lingua/missing-client-id": "Bản cài này chưa có Google Web Client ID. Vào Cài đặt → Tài khoản để dán client ID.",
      };
      setError(messages[authError.code] || authError.message || "Không thể đăng nhập. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const submitEmail = (event) => {
    event.preventDefault();
    runAuth(() => mode === "signin"
      ? signInWithEmailAndPassword(auth, email, password)
      : createUserWithEmailAndPassword(auth, email, password));
  };

  return (
    <main className="min-h-screen bg-mist p-4 text-ink dark:bg-dark1 dark:text-white sm:p-6 lg:p-10">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-ink/[0.08] bg-slab shadow-soft dark:border-white/[0.08] dark:bg-dark2 lg:grid-cols-[1.05fr_0.95fr] lg:min-h-[calc(100vh-5rem)]">
        <section className="relative overflow-hidden bg-ink p-8 text-white sm:p-12 lg:p-16">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-lime/20 blur-3xl" />
          <div className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-[#8bc5a1]/20 blur-3xl" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-center gap-3"><AppMark className="h-11 w-11" /><span className="font-display text-lg font-bold">lingua.</span></div>
            <div className="my-auto max-w-lg py-16">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime/70">Không gian học tập</p>
              <h1 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-5xl">Học đều đặn. Tiến bộ có chủ đích.</h1>
              <p className="mt-6 max-w-md text-base leading-7 text-white/60">Một nơi yên tĩnh để xây thói quen, luyện từ vựng và nhìn thấy tiến bộ mỗi ngày.</p>
              <div className="mt-10 space-y-5">{features.map(({ icon: Icon, title, text }) => <div key={title} className="flex gap-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 text-lime"><Icon size={18} /></div><div><p className="font-bold">{title}</p><p className="mt-1 text-sm leading-5 text-white/50">{text}</p></div></div>)}</div>
            </div>
            <p className="text-xs text-white/35">Lingua Study Hub · học theo cách của bạn</p>
          </div>
        </section>

        <section className="flex items-center p-6 sm:p-12 lg:p-16">
          <div className="mx-auto w-full max-w-md">
            <p className="eyebrow">Chào mừng trở lại</p>
            <h2 className="mt-2 font-display text-3xl font-bold">Bắt đầu phiên học</h2>
            <p className="mt-3 text-sm leading-6 text-ink/50 dark:text-white/50">Đăng nhập để lưu streak, bộ thẻ và tiến độ trên mọi thiết bị.</p>
            <button disabled={loading} onClick={() => runAuth(signInWithGoogle)} className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-ink/10 bg-slab px-4 py-3.5 text-sm font-bold shadow-raised transition hover:border-ink/25 disabled:cursor-wait disabled:opacity-60 dark:border-white/10 dark:bg-white/5 dark:text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.35 12.23c0-.71-.06-1.4-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.22Z"/><path fill="#34A853" d="M12 21.6c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.74 9.74 0 0 0 12 21.6Z"/><path fill="#FBBC05" d="M6.54 13.69A5.86 5.86 0 0 1 6.23 12c0-.59.11-1.17.31-1.69V7.78H3.3A9.76 9.76 0 0 0 2.26 12c0 1.53.37 2.97 1.04 4.22l3.24-2.53Z"/><path fill="#EA4335" d="M12 6.28c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.34 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.7 5.38l3.24 2.53C7.31 8 9.46 6.28 12 6.28Z"/></svg>
              Đăng nhập nhanh bằng Google
            </button>
            <div className="my-7 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.08em] text-ink/60 dark:text-white/55"><span className="h-px flex-1 bg-ink/10 dark:bg-white/10" />Hoặc email<span className="h-px flex-1 bg-ink/10 dark:bg-white/10" /></div>
            <form onSubmit={submitEmail} className="space-y-4">
              <label className="block"><span className="mb-2 block text-xs font-bold text-ink/60 dark:text-white/60">Email</span><div className="flex items-center gap-2 rounded-xl border border-ink/10 px-3 dark:border-white/10"><Mail size={16} className="text-ink/35 dark:text-white/35" /><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none" placeholder="ban@example.com" /></div></label>
              <label className="block"><span className="mb-2 block text-xs font-bold text-ink/60 dark:text-white/60">Mật khẩu</span><input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-ink/10 bg-transparent px-3 py-3 text-sm outline-none dark:border-white/10" placeholder="Ít nhất 6 ký tự" /></label>
              <button disabled={loading} className="btn-primary w-full">{loading ? "Đang xử lý..." : mode === "signin" ? "Đăng nhập" : "Tạo tài khoản"}<ArrowRight size={16} /></button>
            </form>
            <div className="mt-5 flex items-center justify-between text-xs"><button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="font-bold text-sage hover:underline">{mode === "signin" ? "Tạo tài khoản mới" : "Đã có tài khoản? Đăng nhập"}</button><button onClick={onGuest} className="font-bold text-ink/45 hover:text-ink dark:text-white/45 dark:hover:text-white">Dùng thử với tư cách Khách</button></div>
            {error && <p className="mt-4 rounded-xl bg-red-500/10 px-3 py-2.5 text-xs leading-5 text-red-600 dark:text-red-300" role="alert">{error}</p>}
            {notice && <p className="mt-4 rounded-xl bg-amber-400/15 px-3 py-2.5 text-xs leading-5 text-amber-700 dark:text-amber-200" role="status">{notice}</p>}
            <p className="mt-8 flex items-center justify-center gap-1.5 text-xs text-ink/60 dark:text-white/55"><Check size={13} /> Dữ liệu được đồng bộ riêng theo tài khoản</p>
          </div>
        </section>
      </div>
    </main>
  );
}
