import { createPortal } from "react-dom";
import {
  ArchiveRestore,
  BookOpen,
  Check,
  LoaderCircle,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import Dialog from "../ui/Dialog";
import { themeDecks } from "../../data/themeDecks";
import { DECK_COVERS } from "../../data/lessonCovers";

export function ThemePickerModal({
  themeSearch,
  onSearchChange,
  loading,
  onSelectDeck,
  onClose,
}) {
  return (
    <Dialog
      onClose={onClose}
      ariaLabelledBy="theme-picker-title"
      overlayClassName="fixed inset-0 z-[120] flex min-w-0 items-center justify-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm"
      className="panel max-h-[calc(100dvh-2rem)] w-full min-w-0 max-w-lg overflow-y-auto p-5 outline-none"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Bộ từ theo chủ đề</p>
          <h2 id="theme-picker-title" className="mt-1 font-display text-xl font-bold">
            Chọn bộ từ vựng
          </h2>
        </div>
        <button onClick={onClose} className="icon-btn -mr-2" aria-label="Đóng">
          <X size={18} />
        </button>
      </div>
      <p className="mt-2.5 text-xs leading-5 text-ink/60 dark:text-white/60">
        Ba phần 4.000 từ, sắp xếp từ nền tảng đến nâng cao; các bộ chủ đề và cụm từ hiện có vẫn được giữ lại.
      </p>
      <input
        value={themeSearch}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Tìm theo tên bộ, chủ đề hoặc cấp độ..."
        className="mt-3.5 w-full rounded-xl border border-ink/10 bg-transparent px-3.5 py-2.5 text-xs outline-none focus:border-indigo-500 dark:border-white/10"
      />
      <ul className="mt-3 max-h-[55vh] space-y-2 overflow-y-auto">
        {themeDecks
          .filter((deck) => {
            const query = themeSearch.trim().toLowerCase();
            if (!query) return true;
            return (
              deck.title.toLowerCase().includes(query) ||
              deck.description.toLowerCase().includes(query) ||
              (deck.tags && deck.tags.some((tag) => tag.toLowerCase().includes(query)))
            );
          })
          .map((deck) => (
            <li key={deck.id}>
              <button
                onClick={() => onSelectDeck(deck.id)}
                disabled={loading === `theme-${deck.id}`}
                className="flex w-full items-start gap-3 rounded-xl border border-ink/[0.08] p-3 text-left transition hover:bg-ink/[0.03] disabled:opacity-60 dark:border-white/[0.08] dark:hover:bg-white/[0.05]"
              >
                {DECK_COVERS[deck.id] ? (
                  <img
                    src={DECK_COVERS[deck.id]}
                    alt={deck.title}
                    className="h-11 w-11 shrink-0 rounded-xl object-cover shadow-sm"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-indigo-500/20 bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                    <BookOpen size={17} />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block break-words text-sm font-bold">{deck.title}</span>
                  <span className="mt-0.5 block break-words text-xs text-ink/60 dark:text-white/60">
                    {deck.description}
                  </span>
                </span>
                <span className="chip shrink-0 bg-ink/[0.06] text-ink/70 dark:bg-white/10 dark:text-white/70">
                  {loading === `theme-${deck.id}` ? "Đang thêm…" : deck.level}
                </span>
              </button>
            </li>
          ))}
      </ul>
    </Dialog>
  );
}

export function TrashModal({
  trashItems,
  trashBusy,
  trashCardLimit,
  pageSize,
  onShowMore,
  onRestoreDeck,
  onRestoreCard,
  onEmptyTrash,
  onClose,
}) {
  return (
    <Dialog
      onClose={onClose}
      ariaLabelledBy="trash-modal-title"
      overlayClassName="fixed inset-0 z-[120] flex min-w-0 items-center justify-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm"
      className="panel max-h-[calc(100dvh-2rem)] w-full min-w-0 max-w-lg overflow-y-auto p-5 outline-none"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Thùng rác</p>
          <h2 id="trash-modal-title" className="mt-1 font-display text-xl font-bold">
            Bộ thẻ &amp; từ đã xoá
          </h2>
        </div>
        <button onClick={onClose} className="icon-btn -mr-2" aria-label="Đóng">
          <X size={18} />
        </button>
      </div>
      <p className="mt-3 text-xs leading-5 text-ink/60 dark:text-white/60">
        Mọi thứ bạn xoá được giữ ở đây để khôi phục. “Dọn thùng rác” sẽ xoá vĩnh viễn.
      </p>
      {trashBusy && (
        <p className="mt-4 flex items-center gap-2 text-xs text-ink/60 dark:text-white/60">
          <LoaderCircle size={14} className="animate-spin" />
          Đang xử lý…
        </p>
      )}
      <div className="mt-4 space-y-2">
        {trashItems.decks.map((deck) => (
          <div
            key={deck.id}
            className="flex items-center gap-3 rounded-xl border border-ink/[0.08] p-3 dark:border-white/[0.08]"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink/[0.06] dark:bg-white/10">
              <BookOpen size={16} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold">{deck.title}</span>
              <span className="text-xs text-ink/50 dark:text-white/50">
                {deck.cardCount} từ · Bộ thẻ
              </span>
            </span>
            <button
              disabled={trashBusy}
              onClick={() => onRestoreDeck(deck)}
              className="btn-secondary shrink-0 px-3 text-xs"
            >
              <ArchiveRestore size={14} />
              Khôi phục
            </button>
          </div>
        ))}
        {trashItems.cards.slice(0, trashCardLimit).map((card) => (
          <div
            key={card.id}
            className="flex items-center gap-3 rounded-xl border border-ink/[0.08] p-3 dark:border-white/[0.08]"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink/[0.06] dark:bg-white/10">
              <RotateCcw size={16} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold">{card.word}</span>
              <span className="block truncate text-xs text-ink/50 dark:text-white/50">
                {card.meaning}
              </span>
            </span>
            <button
              disabled={trashBusy}
              onClick={() => onRestoreCard(card)}
              className="btn-secondary shrink-0 px-3 text-xs"
            >
              <ArchiveRestore size={14} />
              Khôi phục
            </button>
          </div>
        ))}
        {trashItems.cards.length > trashCardLimit && (
          <button
            type="button"
            onClick={onShowMore}
            className="btn-secondary mt-3 w-full"
          >
            Xem thêm {Math.min(pageSize, trashItems.cards.length - trashCardLimit)} từ · còn{" "}
            {trashItems.cards.length - trashCardLimit}
          </button>
        )}
        {!trashBusy && !trashItems.decks.length && !trashItems.cards.length && (
          <p className="rounded-xl bg-ink/[0.04] p-4 text-center text-sm text-ink/50 dark:bg-white/[0.06] dark:text-white/50">
            Thùng rác đang trống.
          </p>
        )}
      </div>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onClose} className="btn-secondary px-4">
          Đóng
        </button>
        <button
          disabled={trashBusy || (!trashItems.decks.length && !trashItems.cards.length)}
          onClick={onEmptyTrash}
          className="btn-ghost px-4 text-danger dark:text-dangerfgdark"
        >
          <Trash2 size={16} />
          Dọn thùng rác
        </button>
      </div>
    </Dialog>
  );
}

export function SharedDeckModal({ sharedDeck, onDismiss, onImport }) {
  return (
    <Dialog
      onClose={onDismiss}
      ariaLabelledBy="shared-deck-title"
      overlayClassName="fixed inset-0 z-[110] flex min-w-0 items-center justify-center overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm"
      className="panel max-h-[calc(100dvh-2rem)] w-full min-w-0 max-w-md overflow-y-auto p-6 outline-none"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Chia sẻ</p>
          <h2 id="shared-deck-title" className="mt-1 font-display text-xl font-bold">
            Bộ thẻ được chia sẻ
          </h2>
        </div>
        <button onClick={onDismiss} className="icon-btn -mr-2" aria-label="Đóng">
          <X size={18} />
        </button>
      </div>
      <p className="mt-4 text-sm font-bold">{sharedDeck.title}</p>
      <p className="mt-1 text-xs text-ink/50 dark:text-white/50">
        {sharedDeck.cards.length} từ vựng · tiến độ học của bạn sẽ bắt đầu từ đầu
      </p>
      <ul className="mt-4 max-h-40 overflow-y-auto rounded-xl bg-ink/[0.04] p-3 text-xs leading-6 dark:bg-white/[0.06]">
        {sharedDeck.cards.slice(0, 8).map((card) => (
          <li key={card.word} className="break-words">
            • {card.word} — {card.meaning}
          </li>
        ))}
        {sharedDeck.cards.length > 8 && (
          <li className="text-ink/45 dark:text-white/45">
            ...và {sharedDeck.cards.length - 8} từ khác
          </li>
        )}
      </ul>
      <div className="mt-5 flex justify-end gap-2">
        <button onClick={onDismiss} className="btn-secondary px-4">
          Bỏ qua
        </button>
        <button onClick={onImport} className="btn-primary px-5 py-3 text-sm">
          Thêm vào thư viện
        </button>
      </div>
    </Dialog>
  );
}

export function ImportProgressModal({ importProgress }) {
  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md"
    >
      <section className="relative w-full max-w-md rounded-3xl border border-white/15 bg-white/95 p-6 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95">
        <div className="flex items-center gap-4">
          <div
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${
              importProgress.done
                ? "bg-emerald-500/15 text-emerald-500"
                : "bg-indigo-500/15 text-indigo-500"
            } transition-colors`}
          >
            {importProgress.done ? (
              <Check size={24} className="stroke-[2.5]" />
            ) : (
              <LoaderCircle size={24} className="animate-spin" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {importProgress.done ? "Hoàn tất nạp từ" : "Đang đồng bộ bộ thẻ"}
            </p>
            <h3 className="truncate font-display text-base font-bold text-slate-900 dark:text-white">
              {importProgress.title}
            </h3>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-slate-600 dark:text-slate-400">Tiến trình đồng bộ</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {importProgress.completed.toLocaleString("vi-VN")} /{" "}
              {importProgress.total.toLocaleString("vi-VN")} từ ({importProgress.percent}%)
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 transition-all duration-300 ease-out"
              style={{ width: `${Math.max(5, importProgress.percent)}%` }}
            />
          </div>
        </div>

        <p className="mt-4 rounded-xl bg-slate-100/70 p-3 text-xs leading-5 text-slate-600 dark:bg-slate-800/60 dark:text-slate-400">
          🔒 <strong>Vui lòng giữ trang mở:</strong> Hệ thống đang chia thành các batch an toàn để lưu dữ liệu. Đừng đóng hoặc tải lại trang trong giây lát này.
        </p>
      </section>
    </div>,
    document.body,
  );
}
