import { LoaderCircle, Search, Sparkles, X } from "lucide-react";
import Dialog from "../ui/Dialog";

function FieldLabel({ children }) {
  return (
    <span className="mb-2 block text-xs font-bold text-ink/60 dark:text-white/60">
      {children}
    </span>
  );
}

export default function AddWordsSheet({
  tab,
  onTabChange,
  draft,
  levels,
  busy,
  onChange,
  onSuggest,
  onSave,
  topic,
  onTopicChange,
  level,
  onLevelChange,
  amount,
  onAmountChange,
  onGenerate,
  lookupResult,
  onLookupWord,
  onSaveLookup,
  manualWord,
  onManualWordChange,
  lookupLoading,
  onClose,
}) {
  return (
    <Dialog
      onClose={onClose}
      ariaLabelledBy="add-words-title"
      overlayClassName="fixed inset-0 z-[100] flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      className="panel max-h-[90dvh] w-full max-w-xl overflow-y-auto rounded-b-none p-5 outline-none sm:rounded-2xl sm:p-6"
    >
      <div className="mx-auto mb-2 h-1 w-12 rounded-full bg-slate-300 dark:bg-white/20 sm:hidden" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">Thêm từ</p>
          <h2 id="add-words-title" className="mt-1 font-display text-xl font-bold">
            Thêm từ mới
          </h2>
        </div>
        <button
          onClick={onClose}
          className="icon-btn border border-ink/10 dark:border-white/15"
          aria-label="Đóng"
        >
          <X size={18} />
        </button>
      </div>
      <div className="mt-5 flex rounded-xl bg-ink/[0.06] p-1 dark:bg-white/[0.08]">
        <button
          type="button"
          onClick={() => onTabChange("manual")}
          className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-bold ${
            tab === "manual"
              ? "bg-slab shadow-raised dark:bg-dark3"
              : "text-ink/60 dark:text-white/60"
          }`}
        >
          Thủ công
        </button>
        <button
          type="button"
          onClick={() => onTabChange("ai")}
          className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-bold ${
            tab === "ai"
              ? "bg-slab shadow-raised dark:bg-dark3"
              : "text-ink/60 dark:text-white/60"
          }`}
        >
          <Sparkles size={14} className="mr-1 inline" />
          Sinh bằng AI
        </button>
      </div>
      {tab === "manual" ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSave();
          }}
          className="mt-5 grid gap-4 sm:grid-cols-2"
        >
          <label className="sm:col-span-2">
            <FieldLabel>Từ vựng *</FieldLabel>
            <input
              autoFocus
              value={draft.word}
              onChange={(event) => onChange("word", event.target.value)}
              placeholder="accommodation"
              className="w-full rounded-xl border border-ink/10 bg-transparent px-3 py-3 text-sm outline-none dark:border-white/10"
            />
          </label>
          <label>
            <FieldLabel>Phiên âm IPA</FieldLabel>
            <input
              value={draft.ipa}
              onChange={(event) => onChange("ipa", event.target.value)}
              placeholder="/əˌkɒməˈdeɪʃən/"
              className="w-full rounded-xl border border-ink/10 bg-transparent px-3 py-3 text-sm outline-none dark:border-white/10"
            />
          </label>
          <div className="flex items-end">
            <button
              type="button"
              onClick={onSuggest}
              disabled={busy || !draft.word.trim()}
              className="btn-primary min-h-12 w-full justify-center text-xs disabled:opacity-50"
            >
              <Sparkles size={15} />
              AI gợi ý
            </button>
          </div>
          <label className="sm:col-span-2">
            <FieldLabel>Định nghĩa tiếng Việt *</FieldLabel>
            <textarea
              value={draft.meaning}
              onChange={(event) => onChange("meaning", event.target.value)}
              rows={2}
              placeholder="Nơi ở, chỗ ở"
              className="w-full resize-none rounded-xl border border-ink/10 bg-transparent px-3 py-3 text-sm outline-none dark:border-white/10"
            />
          </label>
          <label>
            <FieldLabel>Ví dụ tiếng Anh</FieldLabel>
            <textarea
              value={draft.example}
              onChange={(event) => onChange("example", event.target.value)}
              rows={3}
              placeholder="We booked accommodation near the station."
              className="w-full resize-none rounded-xl border border-ink/10 bg-transparent px-3 py-3 text-sm outline-none dark:border-white/10"
            />
          </label>
          <label>
            <FieldLabel>Dịch nghĩa ví dụ</FieldLabel>
            <textarea
              value={draft.exampleTranslation}
              onChange={(event) => onChange("exampleTranslation", event.target.value)}
              rows={3}
              placeholder="Chúng tôi đặt chỗ ở gần nhà ga."
              className="w-full resize-none rounded-xl border border-ink/10 bg-transparent px-3 py-3 text-sm outline-none dark:border-white/10"
            />
          </label>
          <label className="sm:col-span-2">
            <FieldLabel>Cấp độ</FieldLabel>
            <select
              value={draft.level}
              onChange={(event) => onChange("level", event.target.value)}
              className="w-full rounded-xl border border-ink/10 bg-transparent px-3 py-3 text-sm outline-none dark:border-white/10"
            >
              {levels.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <div className="sticky bottom-0 -mx-5 -mb-5 flex justify-end gap-2 border-t border-ink/[0.08] bg-white/95 px-5 py-3 backdrop-blur-md dark:border-white/[0.08] dark:bg-slate-900/95 sm:static sm:col-span-2 sm:mx-0 sm:mb-0 sm:border-0 sm:bg-transparent sm:p-0">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-ink/10 px-4 py-2.5 text-sm font-bold dark:border-white/10"
            >
              Hủy
            </button>
            <button disabled={busy} className="btn-primary px-5 py-2.5 text-sm disabled:opacity-50">
              {busy ? "Đang lưu..." : "Lưu thẻ"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-5 space-y-4">
          <p className="text-xs leading-5 text-ink/60 dark:text-white/60">
            Tra từ bằng AI nếu bạn đã lưu API key, hoặc bằng từ điển miễn phí — không cần key.
          </p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onLookupWord();
            }}
            className="flex gap-2"
          >
            <input
              autoFocus
              value={manualWord}
              onChange={(event) => onManualWordChange(event.target.value)}
              placeholder="Nhập từ cần tra..."
              className="min-w-0 flex-1 rounded-xl border border-ink/10 bg-transparent px-3 py-3 text-sm outline-none dark:border-white/10"
            />
            <button
              disabled={lookupLoading}
              className="btn-primary grid h-12 w-12 shrink-0 place-items-center rounded-xl p-0"
              aria-label="Tra từ"
            >
              {lookupLoading ? <LoaderCircle size={16} className="animate-spin" /> : <Search size={16} />}
            </button>
          </form>
          {lookupResult && (
            <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-4 text-sm">
              <p className="font-display font-bold">
                {lookupResult.word}{" "}
                <span className="ml-1 text-xs font-normal text-indigo-600 dark:text-indigo-400">
                  {lookupResult.ipa}
                </span>
              </p>
              <p className="mt-1 font-semibold">{lookupResult.meaning}</p>
              <p className="mt-1 text-xs text-ink/55 dark:text-white/55">{lookupResult.example}</p>
              <button
                type="button"
                onClick={onSaveLookup}
                disabled={lookupLoading}
                className="btn-primary mt-3 w-full justify-center text-xs disabled:opacity-50"
              >
                Thêm vào bộ này
              </button>
            </div>
          )}
          <div className="border-t border-ink/[0.08] pt-4 dark:border-white/[0.08]">
            <p className="text-sm font-bold">Sinh theo chủ đề</p>
            <input
              value={topic}
              onChange={(event) => onTopicChange(event.target.value)}
              placeholder="Ví dụ: du lịch, công việc..."
              className="mt-3 w-full rounded-xl border border-ink/10 bg-transparent px-3 py-3 text-sm outline-none dark:border-white/10"
            />
            <div className="mt-2 grid grid-cols-3 gap-2">
              <select
                value={level}
                onChange={(event) => onLevelChange(event.target.value)}
                aria-label="Cấp độ CEFR"
                className="rounded-xl border border-ink/10 bg-transparent px-2 py-3 text-xs outline-none dark:border-white/10"
              >
                {levels.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <select
                value={amount}
                onChange={(event) => onAmountChange(event.target.value)}
                aria-label="Số lượng từ"
                className="rounded-xl border border-ink/10 bg-transparent px-2 py-3 text-xs outline-none dark:border-white/10"
              >
                <option value="5">5 từ</option>
                <option value="10">10 từ</option>
              </select>
              <button
                type="button"
                onClick={onGenerate}
                disabled={busy}
                className="btn-primary px-3 text-xs disabled:opacity-60"
              >
                <Sparkles size={14} />
                Sinh
              </button>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}
