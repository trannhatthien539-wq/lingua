import { useState } from "react";
import { Check, Copy, KeyRound, Mail, RefreshCw, ShieldCheck, TriangleAlert } from "lucide-react";
import CollapsibleCard from "./ui/CollapsibleCard";
import useSectionState from "../hooks/useSectionState";
import {
  accountEmail,
  changeAccountPassword,
  createPasswordForApp,
  hasPasswordProvider,
  loginMethods,
  sendResetPasswordEmail,
} from "../services/accountAuthService";
import { toast } from "../services/toast";

const Field = ({ label, value, onChange, placeholder }) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-bold text-ink/60 dark:text-white/60">{label}</span>
    <input
      type="password"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      autoComplete="new-password"
      className="field"
    />
  </label>
);

/**
 * "Đăng nhập trên app APK bằng mật khẩu": tạo/đổi mật khẩu cho tài khoản đang đăng nhập
 * (thường là tài khoản Google) để có thể đăng nhập trong app APK bằng Email + mật khẩu.
 */
export default function AppLoginPanel({ user }) {
  const [open, toggleSection] = useSectionState("app-login", false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [current, setCurrent] = useState("");
  const [busy, setBusy] = useState("");
  const [shownEmail, setShownEmail] = useState("");

  if (!user) {
    return (
      <CollapsibleCard
        id="app-login"
        icon={KeyRound}
        eyebrow="Bản APK"
        title="Đăng nhập trên app bằng mật khẩu"
        description="Cần đăng nhập tài khoản trước"
        open={open}
        onToggle={toggleSection}
      >
        <p className="text-sm text-ink/70 dark:text-white/70">
          Hãy đăng nhập (Google hoặc Email) rồi quay lại đây để tạo mật khẩu dùng cho app APK.
        </p>
      </CollapsibleCard>
    );
  }

  const email = accountEmail(user);
  const hasPassword = hasPasswordProvider(user);
  const methods = loginMethods(user);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      toast.success("Đã sao chép email đăng nhập.");
    } catch {
      toast.info(`Email của bạn: ${email}`);
    }
  };

  const submit = async () => {
    setBusy("save");
    try {
      const value = hasPassword
        ? await changeAccountPassword(user, current, password, confirm)
        : await createPasswordForApp(user, password, confirm);
      setShownEmail(value);
      setPassword("");
      setConfirm("");
      setCurrent("");
      toast.success(hasPassword ? "Đã đổi mật khẩu. Dùng mật khẩu mới để đăng nhập trên app." : "Đã tạo mật khẩu. Giờ bạn có thể đăng nhập trên app APK.");
    } catch (error) {
      toast.error(error.message, { duration: 7000 });
    } finally {
      setBusy("");
    }
  };

  const resetPassword = async () => {
    setBusy("reset");
    try {
      await sendResetPasswordEmail(email);
      toast.success(`Đã gửi email đặt lại mật khẩu tới ${email}.`);
    } catch (error) {
      toast.error(error.message, { duration: 7000 });
    } finally {
      setBusy("");
    }
  };

  const disabled = busy !== "" || !password || password.length < 6 || password !== confirm || (hasPassword && !current);

  return (
    <CollapsibleCard
      id="app-login"
      icon={KeyRound}
      eyebrow="Bản APK"
      title="Đăng nhập trên app bằng mật khẩu"
      description="Tạo mật khẩu ở bản web, sau đó dùng Email + mật khẩu trong app"
      badge={
        <span className={`chip ${hasPassword ? "bg-okbg text-ok dark:bg-okdark dark:text-okfgdark" : "bg-warnbg text-warn"}`}>
          {hasPassword ? "Đã có mật khẩu" : "Chưa có mật khẩu"}
        </span>
      }
      open={open}
      onToggle={toggleSection}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-ink/[0.08] p-3 dark:border-white/[0.08]">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lime text-ink"><Mail size={17} /></span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-ink/60 dark:text-white/60">Email đăng nhập trong app</p>
            <p className="truncate font-mono text-sm">{email || "(tài khoản không có email)"}</p>
          </div>
          {email && (
            <button type="button" onClick={copyEmail} className="btn-secondary px-3 text-xs"><Copy size={14} />Sao chép</button>
          )}
        </div>

        <p className="text-xs leading-5 text-ink/70 dark:text-white/70">
          App APK đôi khi không mở lại được sau khi đăng nhập Google. Cách chắc chắn nhất: tạo mật khẩu ngay tại đây,
          rồi trong app chọn <strong>Đăng nhập bằng Email</strong> và nhập đúng email + mật khẩu này.
          {methods.includes("password") ? "" : " Tài khoản của bạn hiện chỉ đăng nhập bằng Google nên chưa có mật khẩu."}
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {hasPassword && <Field label="Mật khẩu hiện tại" value={current} onChange={setCurrent} placeholder="••••••" />}
          <Field label={hasPassword ? "Mật khẩu mới" : "Mật khẩu cho app"} value={password} onChange={setPassword} placeholder="Ít nhất 6 ký tự" />
          <Field label="Nhập lại mật khẩu" value={confirm} onChange={setConfirm} placeholder="Nhập lại để chắc chắn" />
        </div>

        {password && password.length < 6 && (
          <p className="flex items-center gap-2 text-xs text-warn"><TriangleAlert size={13} />Mật khẩu cần ít nhất 6 ký tự.</p>
        )}
        {confirm && password !== confirm && (
          <p className="flex items-center gap-2 text-xs text-danger dark:text-dangerfgdark"><TriangleAlert size={13} />Hai mật khẩu chưa giống nhau.</p>
        )}

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={submit} disabled={disabled} className="btn-primary px-4">
            {busy === "save" ? <RefreshCw size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
            {hasPassword ? "Đổi mật khẩu" : "Tạo mật khẩu cho app"}
          </button>
          <button type="button" onClick={resetPassword} disabled={busy !== ""} className="btn-secondary px-4">
            <Mail size={16} />Gửi email đặt lại mật khẩu
          </button>
        </div>

        <div className="rounded-xl bg-ink/[0.04] p-3 text-xs leading-5 dark:bg-white/[0.06]">
          <p className="font-bold">Các bước trên app APK</p>
          <ol className="mt-1 list-decimal space-y-1 pl-4">
            <li>Mở app → ở màn hình đăng nhập chọn <strong>Đăng nhập bằng Email</strong>.</li>
            <li>Nhập email <span className="font-mono">{email || "…"}</span> và mật khẩu vừa tạo.</li>
            <li>Nếu quên mật khẩu: bấm <strong>Quên mật khẩu?</strong> trong app để nhận email đặt lại.</li>
          </ol>
          <p className="mt-2 text-ink/60 dark:text-white/60">
            Lưu ý: mật khẩu chỉ lưu ở Firebase (mã hoá), không hiển thị lại trong app. Nếu đổi mật khẩu Google thì mật khẩu này vẫn dùng được.
          </p>
        </div>

        {shownEmail && (
          <p className="flex items-center gap-2 rounded-xl border border-ok/40 bg-okbg/40 p-3 text-xs dark:bg-okdark/30">
            <Check size={14} />Xong! Giờ mở app APK và đăng nhập bằng <span className="font-mono">{shownEmail}</span>.
          </p>
        )}
      </div>
    </CollapsibleCard>
  );
}
