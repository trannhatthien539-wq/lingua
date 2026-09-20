import { Download, Share, Smartphone } from "lucide-react";
import CollapsibleCard from "../../components/ui/CollapsibleCard";
import useSectionState from "../../hooks/useSectionState";
import useInstallPrompt from "../../hooks/useInstallPrompt";
import { toast } from "../../services/toast";

/** Cài app vào màn hình chính (PWA). Chrome/Edge dùng beforeinstallprompt, iOS cần hướng dẫn thủ công. */
export default function InstallAppPanel() {
  const [open, toggleSection] = useSectionState("install", false);
  const { canInstall, installed, isIos, promptInstall } = useInstallPrompt();

  const install = async () => {
    const accepted = await promptInstall();
    toast[accepted ? "success" : "info"](
      accepted ? "Đang cài Lingua vào thiết bị…" : "Bạn đã huỷ cài đặt. Có thể thử lại bất cứ lúc nào.",
    );
  };

  return (
    <CollapsibleCard id="install" title="Cài app lên thiết bị" description="Dùng offline, mở nhanh như app thật" open={open} onToggle={toggleSection}>
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-lime text-ink"><Smartphone size={19} /></span>
        <div className="min-w-0 flex-1">
          {installed ? (
            <p className="text-sm font-semibold text-sage">Lingua đang chạy ở chế độ ứng dụng đã cài đặt.</p>
          ) : canInstall ? (
            <p className="text-sm text-ink/70 dark:text-white/70">Thiết bị hỗ trợ cài đặt — thêm Lingua vào màn hình chính để mở nhanh và dùng khi mạng yếu.</p>
          ) : isIos ? (
            <p className="text-sm text-ink/70 dark:text-white/70">
              Trên iPhone/iPad: mở Safari → nút <strong>Chia sẻ</strong> <Share size={13} className="inline" /> → <strong>Thêm vào màn hình chính</strong>.
            </p>
          ) : (
            <p className="text-sm text-ink/70 dark:text-white/70">
              Trình duyệt này chưa cung cấp nút cài đặt. Nếu đang dùng Chrome/Edge, hãy mở menu trình duyệt → <strong>Cài đặt ứng dụng</strong>.
            </p>
          )}
        </div>
        {canInstall && !installed && (
          <button onClick={install} className="btn-primary px-4">
            <Download size={16} />Cài app
          </button>
        )}
      </div>
    </CollapsibleCard>
  );
}
