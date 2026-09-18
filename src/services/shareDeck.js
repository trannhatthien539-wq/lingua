/**
 * Chia sẻ bộ thẻ qua liên kết: dữ liệu được nén vào chính URL (không cần server, không hết hạn).
 * Chỉ chia sẻ nội dung thẻ, không kèm tiến độ học của bạn.
 */
const VERSION = 1;
const HASH_PREFIX = "#deck=";
const MAX_TOKEN_LENGTH = 6000;

const toBase64Url = (text) => {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const fromBase64Url = (value) => {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

export const shareDeck = (deck, cards) => {
  const payload = {
    v: VERSION,
    t: deck?.title || "Bộ thẻ được chia sẻ",
    g: deck?.tags || [],
    c: (cards || []).map((card) => [card.word, card.ipa || "", card.meaning || "", card.example || "", card.level || "B1"]),
  };
  const token = toBase64Url(JSON.stringify(payload));
  if (token.length > MAX_TOKEN_LENGTH) {
    throw new Error(`Bộ thẻ có ${payload.c.length} từ nên liên kết quá dài. Hãy dùng "Xuất dữ liệu" thành file .json rồi gửi file đó.`);
  }
  const url = `${window.location.origin}${import.meta.env.BASE_URL}${HASH_PREFIX}${token}`;
  return { url, count: payload.c.length };
};

export const readSharedDeckFromUrl = () => {
  const raw = `${window.location.hash || ""}${window.location.search || ""}`;
  const match = raw.match(/[#&?]?deck=([A-Za-z0-9\-_]+)/);
  if (!match) return null;
  try {
    const payload = JSON.parse(fromBase64Url(match[1]));
    if (!payload?.c?.length) return null;
    return {
      title: String(payload.t || "Bộ thẻ được chia sẻ"),
      tags: Array.isArray(payload.g) ? payload.g : [],
      cards: payload.c
        .filter((row) => Array.isArray(row) && row[0])
        .map(([word, ipa, meaning, example, level]) => ({
          word,
          ipa: ipa || "",
          meaning: meaning || "",
          example: example || "",
          level: level || "B1",
          status: "new",
        })),
    };
  } catch {
    return null;
  }
};

export const clearSharedDeckFromUrl = () => {
  const url = new URL(window.location.href);
  url.searchParams.delete("deck");
  url.hash = "";
  window.history.replaceState(null, "", `${url.pathname}${url.search}`);
};

export const copyShareLink = async (url) => {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
};
