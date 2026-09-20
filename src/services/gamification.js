import { isDue, isLeech } from "../utils/srs.js";

/**
 * XP / cấp độ / huy hiệu được tính hoàn toàn từ dữ liệu đã có
 * (lịch sử học theo ngày, chuỗi ngày, thẻ từ vựng, tiến độ ngữ pháp & kỹ năng)
 * nên không cần thêm bảng dữ liệu mới trên Firestore.
 */
export const XP_PER = {
  reviewed: 2,
  correct: 3,
  session: 8,
  masteredCard: 2,
  grammarPass: 30,
  listeningLesson: 15,
  readingLesson: 15,
  sentenceCorrect: 1,
  mockTest: 60,
  vstepAttempt: 25,
};

/** Ngưỡng XP của từng cấp (cấp = index + 1). */
export const LEVEL_STEPS = [0, 120, 320, 620, 1000, 1500, 2150, 2950, 3900, 5000, 6300];
const LEVEL_TITLES = [
  "Khởi động",
  "Tập sự",
  "Bền bỉ",
  "Tăng tốc",
  "Vững vàng",
  "Chinh phục",
  "Thông thạo",
  "Cao thủ",
  "Bậc thầy",
  "Huyền thoại",
  "Lingua",
];

const dayKeys = (count, from = new Date()) => {
  const result = [];
  for (let index = count - 1; index >= 0; index -= 1) {
    const date = new Date(from.getFullYear(), from.getMonth(), from.getDate() - index);
    result.push(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`);
  }
  return result;
};

const emptyDay = { reviewed: 0, correct: 0, sessions: 0 };

export function computeStats({ days = {}, streak = {}, cards = [], grammar = {}, skills = {}, goal = {}, vstep = {} } = {}) {
  const entries = Object.entries(days || {});
  const totals = entries.reduce(
    (accumulator, [, day]) => ({
      reviewed: accumulator.reviewed + (Number(day?.reviewed) || 0),
      correct: accumulator.correct + (Number(day?.correct) || 0),
      sessions: accumulator.sessions + (Number(day?.sessions) || 0),
    }),
    { reviewed: 0, correct: 0, sessions: 0 },
  );
  const activeDays = entries.filter(([, day]) => (day?.reviewed || 0) > 0 || (day?.sessions || 0) > 0).length;
  const bestDay = entries.reduce((best, [, day]) => Math.max(best, Number(day?.reviewed) || 0), 0);

  const last7Keys = dayKeys(7);
  const last7 = last7Keys.reduce(
    (accumulator, key) => {
      const day = days?.[key] || emptyDay;
      return {
        reviewed: accumulator.reviewed + (Number(day.reviewed) || 0),
        correct: accumulator.correct + (Number(day.correct) || 0),
        activeDays: accumulator.activeDays + ((day.reviewed || 0) > 0 || (day.sessions || 0) > 0 ? 1 : 0),
      };
    },
    { reviewed: 0, correct: 0, activeDays: 0 },
  );

  const completedGrammar = Object.values(grammar?.completed || {}).filter((item) => item?.passed);
  const listeningDone = Object.keys(skills?.listening || {}).length;
  const readingDone = Object.keys(skills?.reading || {}).length;
  const sentenceAttempted = Number(skills?.sentence?.attempted) || 0;
  const sentenceCorrect = Number(skills?.sentence?.correct) || 0;
  const mockBest = (skills?.mock || []).reduce((best, attempt) => Math.max(best, Number(attempt?.score) || 0), 0);

  const vstepAttempts = Array.isArray(vstep?.attempts) ? vstep.attempts.filter((item) => item && item.examId) : [];
  const vstepBest = vstepAttempts.reduce((best, item) => Math.max(best, Number(item?.average) || 0), 0);

  return {
    reviewed: totals.reviewed,
    correct: totals.correct,
    sessions: totals.sessions,
    accuracy: totals.reviewed ? Math.round((totals.correct / totals.reviewed) * 100) : 0,
    activeDays,
    bestDay,
    last7: { ...last7, accuracy: last7.reviewed ? Math.round((last7.correct / last7.reviewed) * 100) : 0 },
    cards: {
      total: cards.length,
      mastered: cards.filter((card) => card.status === "mastered").length,
      learning: cards.filter((card) => card.status === "learning").length,
      fresh: cards.filter((card) => !card.status || card.status === "new").length,
      due: cards.filter((card) => isDue(card)).length,
      leeches: cards.filter((card) => isLeech(card)).length,
    },
    grammar: { passed: completedGrammar.length, total: Number(grammar?.total) || 30 },
    skills: {
      listening: listeningDone,
      reading: readingDone,
      sentenceAttempted,
      sentenceCorrect,
      sentenceAccuracy: sentenceAttempted ? Math.round((sentenceCorrect / sentenceAttempted) * 100) : 0,
      mockBest,
      mockCount: (skills?.mock || []).length,
    },
    streak: {
      current: Number(streak?.currentStreak) || 0,
      totalSessions: Number(streak?.totalSessions) || 0,
    },
    vstep: {
      attempts: vstepAttempts.length,
      best: vstepBest,
      band: vstepBest >= 8.5 ? "C1" : vstepBest >= 6 ? "B2" : vstepBest >= 4 ? "B1" : "",
    },
    goal: {
      target: Number(goal?.target) || 0,
      today: Number(days?.[dayKeys(1)[0]]?.reviewed) || 0,
    },
  };
}

export function computeXp(stats) {
  const parts = [
    stats.reviewed * XP_PER.reviewed,
    stats.correct * XP_PER.correct,
    stats.sessions * XP_PER.session,
    stats.cards.mastered * XP_PER.masteredCard,
    stats.grammar.passed * XP_PER.grammarPass,
    stats.skills.listening * XP_PER.listeningLesson,
    stats.skills.reading * XP_PER.readingLesson,
    stats.skills.sentenceCorrect * XP_PER.sentenceCorrect,
    stats.skills.mockCount * XP_PER.mockTest,
    stats.vstep.attempts * XP_PER.vstepAttempt,
    Math.round(stats.vstep.best * 10),
  ];
  return parts.reduce((total, value) => total + (Number(value) || 0), 0);
}

export function levelFor(xp) {
  const safeXp = Math.max(0, Number(xp) || 0);
  let index = 0;
  for (let step = 0; step < LEVEL_STEPS.length; step += 1) {
    if (safeXp >= LEVEL_STEPS[step]) index = step;
  }
  const current = LEVEL_STEPS[index];
  const next = LEVEL_STEPS[index + 1];
  const span = next ? next - current : 0;
  const into = safeXp - current;
  return {
    level: index + 1,
    title: LEVEL_TITLES[index] || LEVEL_TITLES[LEVEL_TITLES.length - 1],
    xp: safeXp,
    current,
    nextAt: next || null,
    toNext: next ? Math.max(0, next - safeXp) : 0,
    percent: next ? Math.min(100, Math.round((into / span) * 100)) : 100,
  };
}

/** Huy hiệu: mỗi mục có điều kiện mở khoá dựa trên số liệu tổng hợp. */
export const ACHIEVEMENTS = [
  { id: "first-session", label: "Bước đầu tiên", detail: "Hoàn thành buổi học đầu tiên", icon: "sprout", test: (stats) => stats.sessions > 0 },
  { id: "review-100", label: "Trăm từ", detail: "Ôn tổng cộng 100 lượt", icon: "repeat", test: (stats) => stats.reviewed >= 100 },
  { id: "review-1000", label: "Nghìn lượt", detail: "Ôn tổng cộng 1.000 lượt", icon: "zap", test: (stats) => stats.reviewed >= 1000 },
  { id: "mastered-50", label: "50 từ đã thuộc", detail: "Đánh dấu thuộc 50 từ", icon: "check", test: (stats) => stats.cards.mastered >= 50 },
  { id: "mastered-300", label: "300 từ đã thuộc", detail: "Đánh dấu thuộc 300 từ", icon: "crown", test: (stats) => stats.cards.mastered >= 300 },
  { id: "streak-7", label: "Chuỗi 7 ngày", detail: "Học 7 ngày liên tiếp", icon: "flame", test: (stats) => stats.streak.current >= 7 },
  { id: "streak-30", label: "Chuỗi 30 ngày", detail: "Học 30 ngày liên tiếp", icon: "flame", test: (stats) => stats.streak.current >= 30 },
  { id: "grammar-5", label: "Ngữ pháp khá", detail: "Đạt 5 bài ngữ pháp", icon: "book", test: (stats) => stats.grammar.passed >= 5 },
  { id: "grammar-all", label: "Trọn bộ ngữ pháp", detail: "Đạt 20/20 bài ngữ pháp", icon: "graduation", test: (stats) => stats.grammar.passed >= 20 },
  { id: "skills-6", label: "Luyện kỹ năng", detail: "Hoàn thành 6 bài Nghe hoặc Đọc", icon: "headphones", test: (stats) => stats.skills.listening + stats.skills.reading >= 6 },
  { id: "mock-30", label: "Thi thử 30+", detail: "Đạt từ 30/28... điểm thi thử", icon: "target", test: (stats) => stats.skills.mockBest >= 30 },
  { id: "sentence-90", label: "Câu chuẩn 90%", detail: "Đúng 90% bài luyện câu", icon: "pen", test: (stats) => stats.skills.sentenceAttempted >= 20 && stats.skills.sentenceAccuracy >= 90 },
  { id: "accuracy-85", label: "Chính xác 85%", detail: "Tỷ lệ nhớ đúng từ 85%", icon: "sparkles", test: (stats) => stats.reviewed >= 200 && stats.accuracy >= 85 },
  { id: "leech-clean", label: "Dọn từ khó", detail: "Không còn từ nào quên quá 4 lần", icon: "shield", test: (stats) => stats.cards.total >= 25 && stats.cards.leeches === 0 },
  { id: "goal-7", label: "Đủ mục tiêu tuần", detail: "Đạt mục tiêu ngày 7 lần trong 7 ngày", icon: "calendar", test: (stats) => Boolean(stats.goal?.target) && stats.last7.reviewed >= stats.goal.target * 7 },
  { id: "card-500", label: "Thư viện 500 từ", detail: "Sở hữu 500 thẻ từ vựng", icon: "library", test: (stats) => stats.cards.total >= 500 },
  { id: "vstep-first", label: "Đề VSTEP đầu tiên", detail: "Hoàn thành 1 đề VSTEP đủ 4 kỹ năng", icon: "target", test: (stats) => stats.vstep.attempts >= 1 },
  { id: "vstep-5", label: "Năm đề VSTEP", detail: "Hoàn thành 5 đề VSTEP", icon: "repeat", test: (stats) => stats.vstep.attempts >= 5 },
  { id: "vstep-b2", label: "Chạm bậc B2", detail: "Đạt B2 (6.0/10) trong một đề VSTEP", icon: "graduation", test: (stats) => stats.vstep.best >= 6 },
  { id: "vstep-c1", label: "Chạm bậc C1", detail: "Đạt C1 (8.5/10) trong một đề VSTEP", icon: "crown", test: (stats) => stats.vstep.best >= 8.5 },
];

export const achievementsFor = (stats) =>
  ACHIEVEMENTS.map((achievement) => ({ ...achievement, earned: Boolean(achievement.test(stats)) }));

export const summarize = ({ days, streak, cards, grammar, skills, goal, vstep }) => {
  const stats = computeStats({ days, streak, cards, grammar, skills, goal, vstep });
  const xp = computeXp(stats);
  return { stats, xp, level: levelFor(xp), achievements: achievementsFor(stats) };
};
