import { useState } from "react";
import { Copy, ShieldCheck, Smartphone } from "lucide-react";
import { toast } from "../services/toast";
import { getGoogleWebClientId, GOOGLE_REDIRECT_URI, isGoogleClientId } from "../services/googleAuthConfig";

const STEPS = [
  {
    title: "Bấm “Đăng nhập bằng Google”",
    detail:
      "App sẽ mở Chrome để bạn chọn tài khoản. Chọn đúng tài khoản muốn đồng bộ rồi chờ app tự quay về — không cần bấm gì thêm.",
  },
  {
    title: "Chrome không mở?",
    detail:
      "Vào Cài đặt Android → Ứng dụng → Trình duyệt mặc định → chọn Chrome. Nếu máy chưa có Chrome, hãy cài từ CH Play (một số máy Trung Quốc chặn Chrome).",
  },
  {
    title: "Quay về app nhưng vẫn là Khách?",
    detail:
      "Kiểm tra kết nối mạng rồi thử lại. Nếu vẫn lỗi, mở mục “Cách đăng nhập Google trên APK” bên dưới và chắc chắn redirect URI đã được thêm vào OAuth client.",
  },
  {
    title: "Đã cấu hình đúng mà vẫn lỗi?",
    detail:
      "Xoá dữ liệu của Chrome cho trang đăng nhập, hoặc thử chọn một tài khoản Google khác. Sau đó khởi động lại app và đăng nhập lại.",
  },
];

/**
 * Trợ giúp đăng nhập Google trên bản APK (Capacitor).
 * Chỉ hiển thị khi chưa đăng nhập và đang chạy trong app Android.
 * Phần cấu hình OAuth (client ID / redirect URI) nằm ở `GoogleSetup` để tránh trùng lặp.
 */
export default function GoogleSignInHelp() {
  // Đọc lại mỗi lần mở để phản ánh client ID vừa lưu ở mục cấu hình bên dưới.
  const [clientId, setClientId] = useState(() => getGoogleWebClientId());
  const hasClientId = Boolean(clientId);
  const clientIdLooksValid = isGoogleClientId(clientId);

  const syncClientId = () => setClientId(getGoogleWebClientId());

  const copyDiagnostics = async () => {
    const current = getGoogleWebClientId();
    const lines = [
      "Lingua · Chẩn đoán đăng nhập Google (APK)",
      `Nền tảng: ${navigator.userAgent}`,
      `Redirect URI: ${GOOGLE_REDIRECT_URI}`,
      `Web client ID: ${current || "(chưa cấu hình)"}`,
      `Client ID hợp lệ: ${isGoogleClientId(current) ? "có" : "không"}`,
      `Thời điểm: ${new Date().toISOString()}`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      toast.success("Đã sao chép thông tin chẩn đoán.");
    } catch {
      toast.info("Trình duyệt chặn sao chép. Hãy chụp màn hình phần này để được hỗ trợ.");
    }
  };

  return (
    <details
      onToggle={(event) => {
        if (event.currentTarget.open) syncClientId();
      }}
      className="mt-3 rounded-xl border border-ink/[0.08] bg-ink/[0.02] p-3 dark:border-white/[0.08] dark:bg-white/[0.03]"
    >
      <summary className="flex cursor-pointer items-center gap-2 text-xs font-bold text-ink dark:text-white">
        <Smartphone size={15} className="shrink-0 text-sage" aria-hidden="true" />
        Không đăng nhập được bằng Google?
      </summary>

      <div className="mt-3 space-y-3 text-xs leading-5 text-ink/70 dark:text-white/70">
        <ol className="space-y-2.5">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-2.5">
              <span
                aria-hidden="true"
                className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-sage/15 text-[11px] font-black text-sage"
              >
                {index + 1}
              </span>
              <span className="min-w-0">
                <span className="block font-bold text-ink dark:text-white">{step.title}</span>
                <span className="mt-0.5 block">{step.detail}</span>
              </span>
            </li>
          ))}
        </ol>

        <div className="rounded-xl bg-white/60 p-3 dark:bg-white/[0.05]">
          <p className="flex items-center gap-1.5 font-bold text-ink dark:text-white">
            <ShieldCheck size={14} className="text-sage" aria-hidden="true" />
            Kiểm tra nhanh
          </p>
          <ul className="mt-1.5 space-y-1">
            <li className="flex items-start gap-2">
              <span aria-hidden="true">•</span>
              <span>
                Web client ID:{" "}
                {hasClientId ? (
                  <span className={clientIdLooksValid ? "font-semibold text-ok dark:text-okfgdark" : "font-semibold text-warn"}>
                    {clientIdLooksValid ? "đã cấu hình" : "sai định dạng"}
                  </span>
                ) : (
                  <span className="font-semibold text-warn">chưa cấu hình</span>
                )}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span aria-hidden="true">•</span>
              <span>
                Redirect URI phải có trong <em>Authorized redirect URIs</em>:{" "}
                <code className="break-all font-mono text-[11px]">{GOOGLE_REDIRECT_URI}</code>
              </span>
            </li>
          </ul>
          <button
            type="button"
            onClick={copyDiagnostics}
            className="btn-ghost mt-2 min-h-[36px] px-2 text-[11px]"
          >
            <Copy size={13} aria-hidden="true" />
            Sao chép thông tin chẩn đoán
          </button>
        </div>

        <p className="text-ink/55 dark:text-white/55">
          Mẹo: sau khi thêm redirect URI trong Google Cloud Console, chờ khoảng 1–2 phút rồi mới thử đăng nhập lại.
        </p>
      </div>
    </details>
  );
}
