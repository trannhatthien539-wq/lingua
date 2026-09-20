import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Loader2, Plus, Volume2, X } from "lucide-react";
import { speakText } from "../../utils/speech";
import { cardFromLookup, DEFAULT_LOOKUP_DECK, lookupWordCached } from "../../services/wordLookup";
import { dataService } from "../../services/dataService";
import { toast } from "../../services/toast";

const TOKEN_PATTERN = /([A-Za-z][A-Za-z'’-]*)/g;
const IS_WORD = /^[A-Za-z][A-Za-z'’-]*$/;
const MIN_LOOKUP_LENGTH = 2;
const POPOVER_WIDTH = 300;

/** Một từ trong câu, bấm vào để tra nghĩa. */
function WordButton({ word, active, onPick }) {
  return (
    <button
      type="button"
      onClick={(event) => onPick(word, event.currentTarget)}
      className={`-mx-[1px] rounded px-[1px] text-left underline decoration-dotted decoration-ink/25 underline-offset-4 transition hover:bg-lime/25 hover:decoration-ink/60 dark:decoration-white/30 dark:hover:bg-lime/20 ${
        active ? "bg-lime/40 font-semibold dark:bg-lime/30" : ""
      }`}
      title={`Tra nghĩa: ${word}`}
    >
      {word}
    </button>
  );
}

/** Tính vị trí popover sao cho không tràn ra ngoài màn hình. */
const positionFor = (rect) => {
  const viewportWidth = window.innerWidth || POPOVER_WIDTH;
  const viewportHeight = window.innerHeight || 600;
  const left = Math.min(Math.max(8, rect.left + rect.width / 2 - POPOVER_WIDTH / 2), viewportWidth - POPOVER_WIDTH - 8);
  const spaceBelow = viewportHeight - rect.bottom;
  const openUp = spaceBelow < 260 && rect.top > 280;
  return {
    left,
    top: openUp ? undefined : rect.bottom + 8,
    bottom: openUp ? Math.max(8, viewportHeight - rect.top + 8) : undefined,
  };
};

/**
 * Văn bản tiếng Anh có thể bấm vào từng từ để tra nghĩa nhanh và thêm vào bộ thẻ.
 *
 * Dùng cho bài đọc (Skills, VSTEP), transcript nghe và bảng từ khoá.
 */
export default function TappableText({ text = "", className = "", enableLookup = true, onCardAdded }) {
  const [active, setActive] = useState(null);
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [decks, setDecks] = useState(null);
  const [saving, setSaving] = useState(false);
  const [added, setAdded] = useState(false);
  const popoverRef = useRef(null);

  const lines = useMemo(
    () =>
      String(text || "")
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean),
    [text],
  );

  const close = useCallback(() => {
    setActive(null);
    setEntry(null);
    setLoading(false);
    setAdded(false);
  }, []);

  useEffect(() => {
    if (!active) return undefined;
    const handlePointerDown = (event) => {
      if (popoverRef.current?.contains(event.target)) return;
      close();
    };
    const handleKey = (event) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKey);
    window.addEventListener("scroll", close, true);
    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("scroll", close, true);
    };
  }, [active, close]);

  const loadDecks = async () => {
    if (decks) return decks;
    try {
      const list = await dataService.getDecks();
      const own = list.filter((deck) => deck.title === DEFAULT_LOOKUP_DECK);
      setDecks(own.length ? own : list);
      return own.length ? own : list;
    } catch {
      return [];
    }
  };

  const handlePick = async (word, element) => {
    if (!enableLookup) return;
    if (word.length < MIN_LOOKUP_LENGTH) return;
    setActive({ word, ...positionFor(element.getBoundingClientRect()) });
    setEntry(null);
    setAdded(false);
    setLoading(true);
    const result = await lookupWordCached(word);
    setLoading(false);
    setEntry(result);
    loadDecks();
  };

  const handleAddToDeck = async (deckId) => {
    if (!entry || saving) return;
    setSaving(true);
    try {
      let targetId = deckId;
      if (!targetId) {
        const list = await loadDecks();
        const existing = list.find((deck) => deck.title === DEFAULT_LOOKUP_DECK);
        const deck = existing || (await dataService.createDeck(DEFAULT_LOOKUP_DECK));
        targetId = deck.id;
      }
      await dataService.addCard(cardFromLookup(entry, targetId));
      setAdded(true);
      setDecks(null);
      toast.success(`Đã thêm “${entry.word}” vào bộ thẻ.`);
      onCardAdded?.(entry);
    } catch (error) {
      toast.error(error?.message || "Không thêm được thẻ. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  const popover =
    active &&
    createPortal(
      <div
        ref={popoverRef}
        style={{ position: "fixed", left: active.left, top: active.top, bottom: active.bottom, width: POPOVER_WIDTH, zIndex: 90 }}
        className="panel p-3 shadow-xl"
      >
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-display text-base font-bold">{active.word}</p>
            {entry?.ipa && <p className="text-xs text-ink/60 dark:text-white/60">/{String(entry.ipa).replace(/^\/|\/$/g, "")}/</p>}
          </div>
          <button type="button" onClick={close} className="grid h-8 w-8 place-items-center rounded-lg text-ink/50 transition hover:bg-ink/[0.06] dark:text-white/50 dark:hover:bg-white/10" aria-label="Đóng">
            <X size={14} />
          </button>
        </div>

        {loading && (
          <p className="mt-3 flex items-center gap-2 text-sm text-ink/60 dark:text-white/60">
            <Loader2 size={14} className="animate-spin" /> Đang tra từ…
          </p>
        )}

        {!loading && entry?.error && (
          <p className="mt-3 text-sm text-ink/60 dark:text-white/60">
            Không tra được từ này (kiểm tra mạng rồi thử lại). Bấm “Nghe” vẫn dùng được.
          </p>
        )}

        {!loading && entry && !entry.error && (
          <>
            <p className="mt-2 text-sm font-bold text-sage dark:text-lime">{entry.meaning || entry.definition || "Chưa có nghĩa tiếng Việt."}</p>
            {entry.meaning && entry.definition && (
              <p className="mt-1 text-xs italic text-ink/60 dark:text-white/60">{entry.definition}</p>
            )}
            {entry.example && <p className="mt-2 rounded-lg bg-ink/[0.04] p-2 text-xs leading-5 dark:bg-white/[0.06]">{entry.example}</p>}
            {entry.synonyms?.length > 0 && (
              <p className="mt-2 text-xs text-ink/60 dark:text-white/60">Đồng nghĩa: {entry.synonyms.join(", ")}</p>
            )}
          </>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => speakText(active.word)} className="btn-secondary min-h-[36px] px-3 text-xs">
            <Volume2 size={14} /> Nghe
          </button>
          <button type="button" onClick={() => handleAddToDeck()} disabled={!entry || Boolean(entry.error) || saving || added} className="btn-primary min-h-[36px] px-3 text-xs">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            {added ? "Đã thêm" : "Thêm vào bộ thẻ"}
          </button>
        </div>

        {decks?.length > 1 && !added && entry && !entry.error && (
          <select
            onChange={(event) => handleAddToDeck(event.target.value)}
            defaultValue=""
            className="field mt-2 py-2 text-xs"
            aria-label="Chọn bộ thẻ để lưu"
          >
            <option value="">＋ Lưu vào bộ thẻ khác…</option>
            {decks.map((deck) => (
              <option key={deck.id} value={deck.id}>
                {deck.title}
              </option>
            ))}
          </select>
        )}
      </div>,
      document.body,
    );

  return (
    <>
      {lines.map((line, index) => (
        <p key={`${index}-${line.slice(0, 16)}`} className={className}>
          {enableLookup
            ? line.split(TOKEN_PATTERN).map((token, tokenIndex) =>
                IS_WORD.test(token) ? (
                  <WordButton key={`${token}-${tokenIndex}`} word={token} active={active?.word === token} onPick={handlePick} />
                ) : (
                  <span key={`t-${tokenIndex}`}>{token}</span>
                ),
              )
            : line}
        </p>
      ))}
      {popover}
    </>
  );
}

/** Bảng từ khoá của bài đọc: nghe, tra nghĩa và lưu thẻ cho từng từ. */
export function GlossaryList({ items = [], showMeaning = true, emptyHint = "" }) {
  const [busy, setBusy] = useState("");

  const addWord = async (item) => {
    setBusy(item.word);
    try {
      const entry = await lookupWordCached(item.word);
      const list = await dataService.getDecks();
      const existing = list.find((deck) => deck.title === DEFAULT_LOOKUP_DECK);
      const deck = existing || (await dataService.createDeck(DEFAULT_LOOKUP_DECK));
      await dataService.addCard(
        cardFromLookup(
          {
            ...entry,
            word: item.word,
            meaning: item.meaning || entry.meaning,
            ipa: item.ipa || entry.ipa,
          },
          deck.id,
        ),
      );
      toast.success(`Đã thêm “${item.word}” vào bộ thẻ.`);
    } catch (error) {
      toast.error(error?.message || "Không thêm được thẻ. Vui lòng thử lại.");
    } finally {
      setBusy("");
    }
  };

  if (!items.length) return emptyHint ? <p className="text-sm text-ink/60 dark:text-white/60">{emptyHint}</p> : null;

  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item.word} className="flex items-start gap-2 rounded-xl border border-ink/[0.08] p-3 dark:border-white/[0.08]">
          <button
            type="button"
            onClick={() => speakText(item.word)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink/60 transition hover:bg-ink/[0.06] hover:text-ink dark:text-white/60 dark:hover:bg-white/10"
            aria-label={`Nghe ${item.word}`}
          >
            <Volume2 size={14} />
          </button>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold">{item.word}</span>
            {showMeaning && <span className="block text-xs text-ink/60 dark:text-white/60">{item.meaning}</span>}
            {item.ipa && <span className="block text-xs text-ink/50 dark:text-white/50">/{String(item.ipa).replace(/^\/|\/$/g, "")}/</span>}
          </span>
          <button
            type="button"
            onClick={() => addWord(item)}
            disabled={busy === item.word}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sage transition hover:bg-sage/15 disabled:opacity-40"
            aria-label={`Thêm ${item.word} vào bộ thẻ`}
            title="Thêm vào bộ thẻ"
          >
            {busy === item.word ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          </button>
        </li>
      ))}
    </ul>
  );
}
