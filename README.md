# Lingua — All-in-one Language Learning Hub

> **Đọc file này là đủ để hiểu dự án.** Tài liệu được viết cho AI/dev mới: kiến trúc, mọi file quan trọng, mô hình dữ liệu, quy ước, lệnh chạy và các "bẫy" đã từng gặp. Không cần đọc hết source để nắm dự án.
> Ngôn ngữ UI: **tiếng Việt**. Nội dung học: **tiếng Anh trình độ A1–C2 (trọng tâm B1)**.

## 0. TL;DR cho AI

- **Là gì**: PWA học tiếng Anh all-in-one — từ vựng SRS, ngữ pháp, 4 kỹ năng, luyện câu, thi thử B1, writing AI, planner, mindmap, tiến độ/gamification, gia sư AI.
- **Stack**: React 18 (StrictMode) + Vite + Tailwind 3 + Firebase (Auth + Firestore, offline cache) + react-router 7 + Capacitor (APK Android). Không backend riêng (trừ Cloud Function tuỳ chọn ở `functions/`).
- **Composition root**: `src/App.jsx` — giữ tab hiện tại, lazy-load module theo registry, đồng bộ dữ liệu khách → tài khoản, quản lý đăng nhập/streak/search/tutor.
- **"Nguồn sự thật" cần nhớ**: điều hướng `src/data/navigation.js` · dữ liệu `src/services/dataService.js` · lịch ôn `src/utils/srs.js` · state theo tài khoản `src/services/userDocService.js` (`user_state`) · design system `src/index.css`.
- **Chạy**: `npm install` → `npm run dev` (nếu thấy lỗi React lạ, chạy `npm run dev -- --force`) · build `npm run build` · test `npm test` (scripts trong `package.json`).
- **Không có test cho UI/component**; `npm test` chỉ test hàm thuần (SRS, gamification, chấm phát âm, từ điển).
- **Không tạo thêm hệ thống thông báo mới**: trước đây có tới 6 cách hiện thông báo chồng chéo, tất cả đã gom về `toast.*` trong `src/services/toast.js`.

---

## 1. Stack & phụ thuộc chính

| Nhóm | Dùng gì |
| --- | --- |
| UI | React, `react-router-dom` (routing theo path), Tailwind CSS, `lucide-react` (icon) |
| Hiệu ứng | `canvas-confetti` (chúc mừng), `react-player` (audio/video), `html-to-image` |
| Dữ liệu | Firebase Auth + Firestore (`initializeFirestore` + `persistentLocalCache` để dùng offline) |
| Nội dung nâng cao | `@xyflow/react` + `dagre` (mindmap), `jszip` (import Anki `.apkg`), `sql.js` (đọc DB Anki trong trình duyệt) |
| Di động | `@capacitor/core|app|browser`, `@capacitor/local-notifications` (nhắc học trên APK), `@codetrix-studio/capacitor-google-auth` (tuỳ chọn) |
| Build | Vite (`base` = `/lingua/` khi `GITHUB_PAGES=true`), PostCSS/Tailwind |

Node ≥ 20 (đã kiểm chứng với Node 24). Không có TypeScript; chất lượng dựa vào **ESLint (flat config)** + test hàm thuần.

## 2. Lệnh thường dùng

| Lệnh | Việc |
| --- | --- |
| `npm install` | Cài dependency |
| `npm run dev` | Dev server (thêm `-- --force` khi dependency cache lỗi thời) |
| `npm run build` | Build production ra `dist/` (dùng để **kiểm tra sau mỗi lần sửa**) |
| `npm run preview` | Xem thử bản build |
| `npm test` | `node --test "tests/*.test.js"` — 7 file test, 46 test. **Cần Node 22+** (Node cũ hơn không hỗ trợ glob cho `--test`, và `node --test tests` — thư mục trần — cũng lỗi) |
| `npm run lint` | `eslint .` — cấu hình ở `eslint.config.js` (0 error, warning không chặn CI) |
| `node scripts/check-vstep.mjs` | Kiểm tra **toàn bộ đề VSTEP** và in ra mọi lỗi (số câu, id trùng, đáp án không nằm trong options, transcript thiếu, bài mẫu quá ngắn…) |

CI (`deploy.yml`) chạy theo thứ tự: `npm ci` → `npm test` → `npm run lint` → `npm run build` → deploy GitHub Pages.

## 3. Kiến trúc & luồng

```mermaid
flowchart TD
  A[index.html / main.jsx] --> B[App.jsx<br/>composition root]
  B --> C[Sidebar / Topbar / MobileBottomNav]
  B --> D[modules/* — lazy theo tab]
  B --> E[SearchPalette · AiTutorPanel · ShortcutsHelpModal]
  D --> F[hooks/* — state + progress]
  D --> G[services/* — dữ liệu, AI, âm thanh, sync]
  G --> H[(Firestore: study_decks, vocabulary_cards, user_state, users)]
  G --> I[(localStorage: guest library, user_state cache, cấu hình)]
  G --> J[API ngoài: Gemini/Groq · dictionaryapi.dev · MyMemory]
```

**Cách App.jsx hoạt động**

1. `navigationItems` (`src/data/navigation.js`) khai báo tab: `id, label, shortLabel, description, icon`.
2. `modules` map tab → component lazy; `tabPaths` map tab → URL (`/vocabulary`, `/grammar`, …); path không hợp lệ bị điều hướng về `/vocabulary`.
3. Mỗi module nhận props chung: `onStudyActivity` (ghi streak + lịch sử), `streak`, `user`, `apiKey`, `setApiKey`, `onGoogleLogin`, `onSignOut`.
4. Tab `settings` render thêm các panel: `AccountPanel` → `AppearancePanel` → `InstallAppPanel` → `AccountDataPanel` → `ApiSettings`.
5. `onAuthStateChanged` → nạp streak + API key (ưu tiên key của tài khoản) + `syncGuestData()` (đẩy dữ liệu khách lên cloud, tăng `dataVersion` để remount module).

**Thêm một tab mới (đúng 4 bước)**: tạo `src/modules/<domain>/<Name>Hub.jsx` → thêm item vào `src/data/navigation.js` → thêm `lazy()` + entry trong `modules`/`tabPaths` ở `App.jsx` → (tuỳ chọn) thêm icon vào `iconById` của `src/components/MobileBottomNav.jsx`.

## 4. Cây thư mục

```text
src/
├─ App.jsx                 # composition root: tab, auth, streak, search, tutor, shortcuts
├─ main.jsx                # createRoot + StrictMode + bootstrapAppearance()
├─ index.css               # design system (.panel/.btn-*/...), dark mode, print styles
├─ components/             # UI dùng chung
│  ├─ layout/              # Sidebar, Topbar
│  ├─ learning/            # FlashcardModal, QuizView, SpellerView, MatchingView, StudyHubModal, StudySummary, ImportExportModal
│  ├─ ui/                  # CollapsibleCard, ProgressBar, SafeImage, StatCard, StudyHistoryChart, SyncStatusBadge, Toaster
│  ├─ Auth/AuthPage.jsx    # đăng nhập/đăng ký (Email + Google) và chế độ khách
│  ├─ AiTutorPanel.jsx     # chat gia sư AI
│  ├─ SearchPalette.jsx    # tìm kiếm toàn cục (Ctrl/⌘+K)
│  ├─ ShortcutsHelpModal.jsx, AccountPanel, AccountDataPanel, AppMark, WordAvatar, StudyAnalyticsWidget, MobileHeader, MobileBottomNav
├─ modules/                # 1 folder = 1 tab
│  ├─ learning/VocabularyHub.jsx        # tab Từ vựng (file lớn nhất, ~1.4k dòng)
│  ├─ learning/GrammarAndVocabulary.jsx # WritingChecker (tab Writing)
│  ├─ grammar/                          # GrammarHub, GrammarLesson, GrammarQuiz (QuestionSet dùng lại cho nghe/đọc/thi thử)
│  ├─ skills/                           # SkillsHub + ListeningView, ReadingView, SpeakingView, WritingView, SentenceView, MockTestView
│  ├─ progress/ProgressHub.jsx          # mục tiêu, XP, huy hiệu, thống kê gộp, xuất báo cáo
│  ├─ vstep/                            # tab VSTEP: VstepHub, VstepExamRunner, VstepResult, sections/*, docs/*, useTranscriptAudio, useAudioRecorder
│  ├─ planner/StudyPlanner.jsx          # todo + lịch + pomodoro
│  ├─ mindmap/StudyMindmap.jsx          # sơ đồ cây React Flow (+ sinh bằng AI)
│  └─ settings/                         # ApiSettings, AppearancePanel, InstallAppPanel
├─ hooks/                  # useCloudDoc, useDailyGoal, useGrammarProgress, useSkillsProgress, useStudyReminder, useSectionState, useTheme, useAppearance, useInstallPrompt, useDebounce, useWidgetSummary
├─ services/               # xem bảng §7
├─ utils/                  # srs, speech, speechScore, ankiParser, sanitizeCard, studyFeedback
├─ data/                   # navigation + toàn bộ nội dung học (tĩnh, không cần mạng)
├─ config/googleAuth.js    # chế độ đăng nhập Google
└─ lib/formatters.js       # format ngày/giờ tiếng Việt

native/android-widget/     # mã native cho widget màn hình chính + shortcut (workflow chép vào project Android)
├─ java/com/lingua/studyhub/LinguaWidgetProvider.java   # AppWidgetProvider (RemoteViews)
├─ java/com/lingua/studyhub/LinguaWidgetPlugin.java     # plugin cục bộ `LinguaWidget` ghi SharedPreferences
└─ res/{layout,xml,drawable,values}/                    # layout widget, widget_info, shortcuts, màu, chuỗi
```

Thư mục gốc: `index.html` (đăng ký service worker), `public/` (`manifest.json`, `sw.js`, `oauth-callback.html`, `icons/`), `firestore.rules`, `firebase.json`, `capacitor.config.json`, `functions/` (Cloud Function proxy AI — **không** được Vite build), `scripts/` (script QA nội dung), `tests/`, `.github/workflows/` (deploy + build APK).

**File chết (đã bị thay thế, xoá được)**: `src/modules/{grammar/GrammarModule,mindmap/MindmapModule,planner/PlannerModule,settings/SettingsModule,vocabulary/VocabularyModule}.jsx`.

## 5. Điều hướng & các tab

| Tab id | URL | Module | Nội dung chính |
| --- | --- | --- | --- |
| `vocabulary` | `/vocabulary` | `VocabularyHub` | Bộ thẻ, SRS, 4 chế độ học, thùng rác, sửa hàng loạt, thêm từ (AI/từ điển miễn phí), import/export |
| `grammar` | `/grammar` | `GrammarHub` | 30 bài (12 thì + cấu trúc B1 + mở rộng + C1), sổ câu sai, thi tổng hợp, bảng tra nhanh, cặp dễ lẫn |
| `skills` | `/skills` | `SkillsHub` | 6 sub-tab: Nghe, Đọc, Nói (chấm phát âm), Viết, Luyện câu, Thi thử B1 |
| `vstep` | `/vstep` | `VstepHub` | **Kho đề VSTEP** (10 đề B1/B2/C1) + sổ tay, từ vựng, mẫu câu, lịch sử thi |
| `writing` | `/writing` | `WritingChecker` | Chấm chữa bài viết bằng AI |
| `progress` | `/progress` | `ProgressHub` | Mục tiêu ngày, XP/cấp, huy hiệu, 12 ô thống kê, biểu đồ, in báo cáo |
| `planner` | `/planner` | `StudyPlanner` | Todo, lịch học, pomodoro |
| `mindmap` | `/mindmap` | `StudyMindmap` | Sơ đồ tư duy (React Flow), sinh nhánh bằng AI, xuất ảnh |
| `settings` | `/settings` | `ApiSettings` + các panel | Tài khoản, giao diện, cài app, dữ liệu (backup/nhắc học/sync), API key |

Ngoài tab: `/login` (AuthPage cho khách), `/` → `/vocabulary`, path lạ → `/vocabulary`.

## 6. Mô hình dữ liệu

### 6.1 Thẻ từ vựng (`vocabulary_cards` / localStorage)

| Field | Ý nghĩa |
| --- | --- |
| `id`, `deckId`, `word`, `ipa`, `meaning`, `example` | Nội dung thẻ (`meaning` là tiếng Việt) |
| `level` | `A1…C2` (mặc định `B1`) |
| `status` | `new` \| `learning` \| `mastered` |
| `interval`, `nextReviewDate`, `reviewDate`, `repetition`, `lastStudiedDate` | SRS |
| `ease`, `lapses` | Hệ số giãn cách (mặc định 2.5) và số lần quên — nền tảng của "từ hay quên" |
| `imageUrl`, `audioUrl`, `needAiImage` | Ảnh/âm thanh (`imageUrl` **luôn** là `""`, không phải `undefined`) |
| `deletedAt` | Xoá mềm: có giá trị ⇒ nằm trong thùng rác |

Bộ thẻ (`study_decks`): `id, title, tags[], createdAt, deletedAt`.

### 6.2 Lịch ôn SRS (`src/utils/srs.js` — dùng chung, không hardcode nơi khác)

- `scheduleReview(card, rating)`: `again` → 1 ngày, reset `repetition`, `ease −0.2`, `lapses +1`; `soon` → thẻ mới 3 ngày, thẻ cũ `interval × ease × 0.9`; `mastered` → thẻ mới 5 ngày, thẻ cũ `interval × ease × 1.3`.
- Chặn: `ease ∈ [1.3, 3.2]`, `interval ≤ 365`. `lapses ≥ 4` ⇒ **leech (từ hay quên)**.
- `schedulePayload()` = bản đã bỏ cờ `leech` để ghi vào dữ liệu; `previewIntervals()` / `intervalLabel()` dùng để hiện khoảng nghỉ trên nút đánh giá; `isDue()` lọc "cần ôn hôm nay".

### 6.3 State theo tài khoản — collection `user_state`

Doc id `<uid>__<key>`, payload `{ userId, key, payload, updatedAt }`; có bản sao localStorage `lingua-user-state-<owner>__<key>` để dùng offline. Truy cập qua `useCloudDoc(key, …)` hoặc `createDebouncedSync(key)`.

| Key (`userDocKeys`) | Payload |
| --- | --- |
| `planner` | Todo + lịch học |
| `mindmap` | Node/edge của sơ đồ |
| `grammar` | `{ completed: { [lessonId]: { best, total, passed } }, lastLesson, mistakes: { [questionId]: { prompt, answer, explain, response, count, at } }, attempts: [{ source, correct, total }] (≤30) }` |
| `writing` | Bản nháp/bài đã chấm |
| `skills` | `{ listening: {id:{best,total}}, reading: {…}, mock: [{score,total,at}] (≤20), sentence: {attempted, correct} }` |
| `reminder` | `{ enabled, time }` |
| `history` | `{ days: { "YYYY-MM-DD": { reviewed, correct, sessions } } }` (≤ 400 ngày) |
| `goal` | `{ target }` — mục tiêu lượt ôn mỗi ngày (mặc định 20) |
| `vstep` | `{ attempts: [{ examId, level, at, scores{4 kỹ năng}, average, band, durationSeconds }] (≤30), drafts: { "<examId>:<taskId>": "bài viết" } }` |
| `mistakes` | **Sổ câu sai dùng chung** cho Nghe/Đọc/VSTEP: `{ items: { [key]: { key, source, label, refId, type, prompt, options, answer, answers, explain, response, count, at } } (≤150), attempts: [{ correct, total, percent }] (≤40) }` |

### 6.4 Firestore & rules

Collection: `study_decks`, `vocabulary_cards`, `user_state`, `users/{uid}` (streak). `firestore.rules` chỉ cho chủ sở hữu đọc/ghi (`userId == request.auth.uid`, doc `user_state` có tiền tố uid). Dữ liệu khách **chỉ** nằm trên thiết bị, được đẩy lên khi đăng nhập (`syncVocabulary`, `syncGuestUserDocs`).

### 6.5 localStorage (các key quan trọng)

| Key | Nội dung |
| --- | --- |
| `lingua-vocabulary-library` | `{ decks, cards }` của khách (`lingua-vocabulary` là bản cũ, tự migrate) |
| `lingua-user-state-<owner>__<key>` | Cache `user_state` (`owner` = uid hoặc `guest`) |
| `lingua-appearance` | Bảng màu, font, cỡ chữ |
| `lingua-settings-sections` | Trạng thái mở/đóng các khối Cài đặt |
| `lingua-ai-provider` | `gemini` \| `groq` \| `deepseek` |
| `lingua-word-cache` | Đệm kết quả tra từ nhanh (≤400 từ) cho popover bấm-vào-từ |
| `lingua_api_key_<uid>` / `lingua_api_key_guest` | API key AI (key khách tự chuyển cho tài khoản khi đăng nhập) |
| `lingua-tutor-chat-<uid|guest>` | 40 tin nhắn gần nhất của gia sư AI |
| `lingua-practice-topic`, `lingua-google-login-mode`, `lingua-google-auth-log` | Điều hướng nhanh vào phiên học; chế độ đăng nhập Google; log chẩn đoán |

## 7. Services (`src/services/`)

| File | Trách nhiệm |
| --- | --- |
| `dataService.js` | **Lớp dữ liệu duy nhất** cho deck/thẻ: khách = localStorage, đăng nhập = Firestore. Có `addCards` (batch 400), `updateCards` (sửa hàng loạt), `trash*/restore*/getTrashed/purgeTrash` (xoá mềm), `deleteDeck/deleteCard` (xoá cứng, dùng nội bộ). Luôn lọc `undefined` trước khi ghi Firestore |
| `userDocService.js` | State theo tài khoản (`user_state`), `syncGuestUserDocs`, `createDebouncedSync` |
| `historyService.js` | Lịch sử học theo ngày + event `lingua:history-changed` |
| `streakService.js` | Chuỗi ngày học (`users/{uid}` hoặc localStorage cho khách) |
| `aiService.js` | `requestAi(provider, apiKey, prompt, {json})` — Gemini (fallback 3 model) & Groq; hỗ trợ proxy qua `VITE_AI_PROXY_URL`; các prompt mẫu (`generateSmartVocabularyPrompt`, …) |
| `dictionaryService.js` | Tra từ **miễn phí** (dictionaryapi.dev + MyMemory), không cần key |
| `wordLookup.js` | Đệm + tra từ cho popover bấm-vào-từ (`lookupWordCached`, `cardFromLookup`, `DEFAULT_LOOKUP_DECK`) |
| `searchIndex.js` | Index tìm kiếm toàn cục (nav, ngữ pháp, kỹ năng, theme deck, 1000 từ thông dụng nạp lười) |
| `deepLink.js` | Mở đúng bài sau khi tìm kiếm (`openItem` / `consumePendingItem(tab)`) |
| `appLinks.js` | Deep link nội bộ từ widget/shortcut: `com.lingua.studyhub://tab/<tab>` → `parseAppLink` + `subscribeAppLinks` (bỏ qua link `auth`) |
| `widgetBridge.js` | Cầu nối widget màn hình chính: `summarizeCards`, `publishCardStats`, `buildWidgetSummary`, `pushWidgetSummary`, `readWidgetSummary` (web chỉ ghi localStorage để xem trước) |
| `gamification.js` | `computeStats`, `computeXp`, `levelFor`, `achievementsFor` (hàm thuần, có test) |
| `vstepScoring.js` | Chấm điểm VSTEP thuần: `examQuestions`, `scoreObjectiveSection`, `selfAssessedScore10`, `summariseAttempt`, `examMinutes` (hàm thuần, có test) |
| `vstepService.js` | Nạp đề VSTEP (lazy qua `registry.js`) + re-export toàn bộ hàm chấm điểm |
| `vstepAi.js` | Chấm Writing/Nói VSTEP bằng AI theo tiêu chí (Gemini/Groq/DeepSeek) |
| `vstepDeck.js` | Biến một chủ đề từ vựng VSTEP thành bộ flashcard SRS |
| `syncStatus.js` | Online/offline, đếm write đang chờ, event `lingua:data-refresh` |
| `toast.js` | **Hệ thống thông báo duy nhất** (`toast.success/error/info/undo`) |
| `imageService.js` | Tìm ảnh an toàn cho thẻ (`findVocabularyImageSafely`), whitelist nguồn ảnh |
| `speech.js` (utils) | TTS tiếng Anh bằng Web Speech API |
| `firebase.js` | Khởi tạo app/auth/firestore (có offline cache) + re-export API Firebase |
| `authService.js`, `googleBrowserAuth.js`, `googleAuthConfig.js` | Đăng nhập Google: popup (web), browser flow + deep link (APK) |
| `backupService.js` | Xuất/nhập toàn bộ dữ liệu (file JSON) |
| `shareDeck.js` | Chia sẻ bộ thẻ qua URL `#deck=<base64url>` |
| `reminderService.js` | Nhắc học bằng Web Notification (chỉ khi app đang mở trên web) |
| `localNotifications.js` | Nhắc học trên **APK**: lên lịch thông báo hằng ngày của hệ điều hành (`@capacitor/local-notifications`), có `sendNativeTestNotification`; plugin nạp động nên bundle web không phình |
| `accountAuthService.js` | Email đặt lại mật khẩu (`sendResetPasswordEmail`) + hàm tạo/đổi mật khẩu cho tài khoản Google (`createPasswordForApp`, `changeAccountPassword`) — **hiện không có UI nào gọi** (đã bỏ phần hướng dẫn đăng nhập APK); có thể bật lại bằng 1 nút trong Cài đặt nếu cần |
| `appearanceService.js` | Bảng màu/font/cỡ chữ, đổi CSS variables |
| `vocabularySync.js` | Merge dữ liệu khách → tài khoản sau khi đăng nhập |
| `platform.js`, `apiClient.js`, `aiClient.js`, `apiKeyStorage.js` | Tiện ích nền tảng, client dự phòng, đọc/ghi API key |

## 8. Hooks (`src/hooks/`)

| Hook | Việc |
| --- | --- |
| `useCloudDoc(key, opts)` | Hydrate + debounce-save một `user_state` doc, tự reload theo `lingua:data-refresh` |
| `useDailyGoal()` | Mục tiêu ôn/ngày (key `goal`), `GOAL_PRESETS`, `setGoal` |
| `useVstepProgress()` | Lịch sử thi VSTEP + bản nháp Writing (key `vstep`), `recordAttempt`, `bestFor`, `clearHistory` |
| `useGrammarProgress()` / `useSkillsProgress()` | Tiến độ ngữ pháp / kỹ năng (record + đọc) |
| `useMistakeBank()` | **Sổ câu sai dùng chung** (key `mistakes`): `mistakes` (đã gộp + sắp theo số lần sai), `record(details, source, refId, label)`, `remove`, `clear`, `recordRetry`, `stats.bySource` |
| `useWidgetSummary({ streak })` | Đẩy nội dung ra widget màn hình chính (số liệu thẻ lấy từ đệm của `VocabularyHub`, bài ngữ pháp chưa đạt đầu tiên, chuỗi ngày); chống đẩy trùng bằng `summarySignature` |
| `useStudyReminder(streak)` | Cấu hình nhắc học; trên thiết bị tự gọi `syncNativeReminder` để lên lịch thông báo của hệ điều hành |
| `useSectionState(id, default)` | Trạng thái mở/đóng khối UI (localStorage) |
| `useTheme()`, `useAppearance()` | Dark mode + tuỳ biến giao diện |
| `useInstallPrompt()` | Nút "Cài app" (A2HS), nhận biết iOS |
| `useDebounce(value)` | Debounce tìm kiếm/nhập liệu |

## 9. Dữ liệu tĩnh (`src/data/`) — sửa nội dung học ở đây

| File | Nội dung |
| --- | --- |
| `commonWords.js` + `commonWords/part1-4.js` | 1.000 từ thông dụng (dòng `word\|meaning`), được **lazy import** để không phình bundle chính |
| `grammarCurriculum.js` | 12 thì × 8 câu hỏi + cheat sheet (`PASS_RATIO = 0.8`) |
| `grammarTopics.js`, `grammarTopicsB1a.js`, `grammarTopicsB1b.js` | 14 chủ điểm B1/mở rộng (điều kiện, bị động, mệnh đề quan hệ, tường thuật, modal, so sánh, gerund, mạo từ, **giới từ, liên từ & mệnh đề trạng ngữ, used to, câu hỏi đuôi, cấu tạo từ, wish/causative**), mỗi bài 8 câu |
| `grammarTopicsC1.js` | 4 cấu trúc C1: câu chẻ, đảo ngữ, mệnh đề phân từ, danh hoá & hedging |
| `grammarConfusingPairs.js` | 16 cặp cấu trúc dễ lẫn kèm cách phân biệt + ví dụ |
| `grammarIndex.js` | Gộp 30 bài + gắn id câu hỏi (`<lessonId>-q<n>`), 4 nhóm bài, `grammarAllQuestions`, bảng tra nhanh chủ điểm |
| `skills/listening.js` | 6 bài nghe (transcript từng câu, câu hỏi) |
| `skills/reading.js` | 6 bài đọc + glossary + câu hỏi |
| `skills/speaking.js` | 6 chủ đề (warm-up, cue card + bài mẫu, discussion, phrases) |
| `skills/writing.js` | 6 đề viết (email/đoạn văn) + checklist |
| `skills/sentencePractice.js` | 45 bài: 15 điền khuyết (cl), 15 sắp xếp (or), 15 viết lại (rw) |
| `themeDecks.js` | 7 bộ cụm từ theo chủ đề (`createThemeDeck(id)`) |
| `starterDeck.js` | Bộ "IELTS Speaking Part 1" 10 từ (bộ mẫu cũ, tự thay bằng bộ 1000 từ) |
| `vstep/metadata.js` | Metadata 10 đề VSTEP (id, bậc, tiêu đề, tags) — dùng cho danh sách + tìm kiếm (không có API Vite nên test được) |
| `vstep/registry.js` | Nạp lười nội dung đề (`import.meta.glob`) + `loadExam(id)` |
| `vstep/bands.js` | Ngưỡng quy đổi điểm → bậc (C1 ≥ 8.5, B2 ≥ 6, B1 ≥ 4) |
| `vstep/exams/<id>.js` | **10 đề VSTEP** (B1×3, B2×4, C1×3): mỗi đề 35 câu Nghe + 40 câu Đọc + 2 task Viết + 3 phần Nói |
| `vstep/handbook.js` | Sổ tay: cấu trúc đề, cách tính điểm, mẹo 4 kỹ năng, lộ trình 9 tuần, checklist ngày thi |
| `vstep/vocabulary/topics.js` | 10 chủ đề × 20 từ (200 từ) dạng `word\|ipa\|nghĩa\|ví dụ` |
| `vstep/phrases.js` | Mẫu câu Writing (6 nhóm) & Speaking (5 nhóm) + 21 lỗi thường gặp |
| `navigation.js` | Danh sách tab |

## 10. Quy ước UI & design system

- Class dùng chung trong `src/index.css`: `.panel`, `.panel-flat`, `.eyebrow`, `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.icon-btn`, `.chip`, `.menu-item`, `.field`, `.metric` — **dùng lại, đừng viết lại**.
- Token Tailwind (`tailwind.config.js`): `ink`, `mist`, `sage`, `lime`, `slab`, `slab2`, `dark1-3`, `ok/warn/danger`. `lime`/`sage` trỏ vào CSS variable `--accent`/`--accent-2` (đổi theme = ghi 2 biến này).
- Dark mode bằng class `dark` trên `<html>`; `useTheme` đồng bộ `<meta name="theme-color">` để tránh nháy trắng.
- **Vùng chạm tối thiểu 44px**, chữ phụ tối thiểu `text-xs`, có `aria-label`/`aria-pressed`/`role` cho phần tử tương tác.
- Mọi thông báo dùng `toast.*`; xoá mềm thì kèm `toast.undo`.
- In báo cáo: `.no-print` (ẩn khi in) và `.print-report` (khung in) + `window.print()`.
- Nội dung dài nhiều dòng: dùng `whitespace-pre-wrap`; JSX dài một dòng là phong cách hiện có ở một số panel (giữ nguyên khi sửa nhỏ).

## 11. Tính năng theo module (hành vi cụ thể)

- **Từ vựng (`VocabularyHub`)**: phiên học tối đa `SESSION_LIMIT = 50` thẻ, danh sách hiện `RENDER_LIMIT = 60` rồi "Xem thêm". Bộ lọc: tất cả/chưa thuộc/đã thuộc + menu SRS (cần ôn hôm nay, interval 1/3/5, **từ hay quên**). 4 chế độ: flashcard 3D, trắc nghiệm, chính tả (TTS), nối từ. Tự tra ảnh khi thư viện ≤ 200 thẻ (tối đa 8 ảnh/lần tải).
- **FlashcardModal**: lật thẻ 3D, phím `Space` để lật, `1/2/3` để đánh giá, `←/Z` về thẻ trước; thẻ "chưa nhớ" quay lại cuối hàng đợi; nút đánh giá hiện khoảng nghỉ thật.
- **Ngữ pháp**: **30 bài** — 12 thì, 14 chủ điểm B1/mở rộng, 4 cấu trúc C1; mỗi bài có cấu trúc/cách dùng/dấu hiệu/ví dụ/lỗi thường gặp, 8 câu hỏi gồm 4 dạng (`choice`, `fill` điền từ, `error` sửa lỗi, `transform` viết lại câu), luyện nhanh (đáp án ngay, **ưu tiên câu từng sai**) và kiểm tra cuối bài (đạt ≥ 80%).
  - **Sổ câu sai**: câu làm sai được lưu tự động vào `user_state` key `grammar` (kèm số lần sai); có nút luyện lại, xoá từng câu, và **chuyển thành bộ flashcard** (`Ngữ pháp · câu hay sai`) để ôn bằng SRS.
  - **Thi tổng hợp**: 30 câu trộn mọi chủ điểm, 20 phút, đạt ≥ 70%, lưu lịch sử thi.
  - **Tra cứu nhanh**: bảng 12 thì, bảng 18 chủ điểm, và bảng 16 **cặp cấu trúc dễ lẫn**; nút **“Giải thích bằng AI”** cho từng câu sai (cần API key hoặc proxy).
- **VSTEP (`/vstep`)**: tab riêng gồm 4 phần xem: **Bộ đề** (10 đề, lọc theo bậc), **Sổ tay VSTEP**, **Từ vựng** (10 chủ đề, tạo bộ flashcard bằng 1 nút), **Mẫu câu**, **Lịch sử thi**.
  - *Thi thật*: đi một chiều như thi thật (Nghe 40′ → Đọc 60′ → Viết 60′ → Nói 12′), mỗi kỹ năng có đồng hồ riêng, hết giờ tự chuyển phần, không xem đáp án trước khi nộp; băng nghe là TTS đọc transcript và **giới hạn 2 lần nghe** mỗi phần.
  - *Luyện*: không đồng hồ, được xem đáp án từng kỹ năng (nút "Xem đáp án phần này").
  - Kết quả: điểm 0–10 từng kỹ năng (Nghe/Đọc tự chấm; Viết/Nói chấm bằng AI hoặc tự chấm checklist), điểm trung bình → bậc B1/B2/C1, xem lại từng câu kèm giải thích và transcript, lưu vào lịch sử thi.
  - Nút chấm AI dùng provider đang chọn trong Cài đặt (Gemini/Groq/**DeepSeek**) và cần API key (hoặc proxy).
- **Kỹ năng**: Nghe (TTS 0.8x/1x/1.2x + chép chính tả), Đọc (glossary + câu hỏi), Nói (ghi âm + **chấm điểm phát âm** bằng Web Speech API: % khớp, từ chưa rõ, tốc độ nói), Viết, Luyện câu (3 dạng), Thi thử B1 (28 câu: 12 ngữ pháp + 8 từ vựng + 4 đọc + 4 nghe, 30 phút, ước lượng band).
- **Bấm-vào-từ để tra nghĩa (`TappableText`)**: mọi từ tiếng Anh trong bài đọc Skills, bài đọc VSTEP và bảng từ khoá đều bấm được → popover hiện IPA, nghĩa tiếng Việt, định nghĩa, ví dụ, từ đồng nghĩa + nút **Nghe** và **Thêm vào bộ thẻ** (tự tạo bộ `Từ vựng tra nhanh`, hoặc chọn bộ khác trong danh sách). Kết quả tra được đệm ở `lingua-word-cache` nên bấm lại là hiện ngay; mất mạng thì báo lỗi thân thiện và không cho lưu thẻ rỗng. `GlossaryList` (bảng từ khoá) có nút nghe + nút lưu thẻ cho từng từ.
- **Sổ câu sai dùng chung + “Hôm nay học gì?”** (tab Tiến độ): `MistakeBankCard` gộp câu sai **Ngữ pháp + Nghe + Đọc + VSTEP** (ưu tiên câu sai nhiều lần), cho **luyện lại tối đa 20 câu** ngay tại chỗ (đáp án hiện sau mỗi câu, ghi tiếp vào đúng sổ) và **tạo bộ flashcard** `Sổ câu sai · Nghe/Đọc/VSTEP` để ôn bằng SRS. `TodayPlanCard` gợi ý việc cần làm hôm nay (thẻ đến hạn, thẻ mới, từ hay quên, câu sai, kỹ năng VSTEP yếu nhất, mục tiêu, chuỗi ngày) — mỗi dòng có nút nhảy thẳng tới đúng khu vực qua prop `onNavigate` (App truyền `selectTab` vào module).
- **Tiến độ**: XP = lượt ôn ×2 + đúng ×3 + phiên ×8 + thẻ đã thuộc ×2 + bài ngữ pháp ×30 + bài nghe/đọc ×15 + câu đúng ×1 + thi thử ×60; 11 cấp (`LEVEL_STEPS`); 16 huy hiệu. `ProgressHub` đọc toàn bộ thẻ của người dùng (như `VocabularyHub`).
- **Bố cục mobile (đã rà lại)**: bottom nav 5 tab + “Thêm”; `main` có `pb-28` để không bị nav che; dải tab của Kỹ năng **xuống dòng** trên điện thoại (trước đây “Luyện câu”/“Thi thử B1” bị khuất); Topbar trên điện thoại ẩn badge đồng bộ + nút phím tắt (đã có ở `MobileHeader`); chip từ khoá bài nghe cao ≥36px; bảng tra cứu ngữ pháp có dòng “Vuốt ngang trong bảng để xem đủ cột”; danh sách bài ngữ pháp tự cuộn tới bài đang học.
- **Gia sư AI**: chat có prompt hệ thống (trả lời tiếng Việt, ví dụ tiếng Anh kèm nghĩa, tối đa 200 từ), gửi 6 tin nhắn gần nhất làm ngữ cảnh, lưu hội thoại cục bộ.
- **Chia sẻ/sao lưu**: `shareDeck` tạo link `#deck=…` (khách mở link thấy hộp thoại nhập bộ); `backupService` xuất/nhập JSON toàn bộ dữ liệu.
- **Tìm kiếm toàn cục**: `Ctrl/⌘+K` → tìm theo `searchIndex` (bỏ dấu tiếng Việt) → chọn kết quả thì `openItem()` điều hướng + ghi "mục đang chờ"; module đích gọi `consumePendingItem('<tab>')` khi mount (vì module lazy nên có thể mount sau sự kiện).

## 12. AI: provider, key, proxy

- Provider: `gemini` (thử lần lượt `gemini-3.6-flash` → `gemini-2.0-flash` → `gemini-1.5-flash`), `groq` (`llama-3.3-70b-versatile`) hoặc `deepseek` (`deepseek-chat`, API tương thích OpenAI: `https://api.deepseek.com/chat/completions`, key dạng `sk-...`). Chọn ở Cài đặt → API (localStorage `lingua-ai-provider`).
- Không có key: **tra từ vẫn dùng được** (từ điển miễn phí); các tính năng khác báo lỗi thân thiện và nhắc mở Cài đặt.
- Proxy tuỳ chọn (người dùng không cần key): deploy `functions/index.js` (Cloud Function v2, rate-limit theo IP) rồi build với `VITE_AI_PROXY_URL=https://<region>-<project>.cloudfunctions.net/aiProxy npm run build`. Khi có biến này, `requestAi` gọi proxy và bỏ qua key client.
- Prompt trả JSON (Gemini `responseMimeType`, Groq `response_format`) và parse bằng `parseAiJson` — luôn bọc `try/catch` và hiển thị lỗi qua `toast`.

## 13. Biến môi trường & cấu hình

| Biến / file | Ý nghĩa |
| --- | --- |
| `GITHUB_PAGES` | Build cho GitHub Pages → `base = /lingua/` |
| `VITE_AI_PROXY_URL` | Bật proxy AI (không cần API key client) |
| `VITE_GOOGLE_USE_NATIVE_AUTH=1` | Dùng plugin Google Auth native cho APK (mặc định tắt) |
| `src/config/googleAuth.js` | Hằng số `GOOGLE_LOGIN_MODE`, override theo thiết bị qua localStorage `lingua-google-login-mode` (Cài đặt → Tài khoản) |
| `public/sw.js`, `index.html` | Service worker: chỉ đăng ký ngoài `localhost`/`.local` và khi không chạy trong Capacitor; ở localhost sẽ **unregister + xoá cache** |
| `capacitor.config.json`, `.github/workflows/build-apk.yml` | Đóng gói APK; workflow tự vá `AndroidManifest.xml` thêm deep link `com.lingua.studyhub://auth` |

## 14. Test

- `tests/srs.test.js` — lịch ôn, leech, clamp, đến hạn.
- `tests/gamification.test.js` — stats, XP, cấp, huy hiệu.
- `tests/speechScore.test.js` — so khớp câu, điểm, tốc độ nói.
- `tests/dictionaryService.test.js` — tra từ miễn phí với `fetch` được mock.
- `tests/vstepScoring.test.js` — quy đổi điểm/bậc, chấm Nghe–Đọc, tự chấm Viết.
- `tests/vstepExams.test.js` — QA cả 10 đề VSTEP: metadata khớp nội dung, đúng 8/12/15 và 10/10/10/10 câu, id không trùng, đáp án nằm trong options, transcript/bài mẫu đầy đủ (đây là "hàng rào" chặn đề lỗi trước khi lên web).
- `tests/grammarData.test.js` — QA 30 bài ngữ pháp: id/order duy nhất, 8 câu/bài, đáp án nằm trong options, đáp án viết tay viết thường, dạng `error`/`transform` có `hint`, bảng cặp dễ lẫn và bảng tra nhanh đầy đủ.
- Viết test mới: tạo `tests/<ten>.test.js` dùng `node:test` + `node:assert/strict`, **import kèm đuôi `.js`** (Node ESM yêu cầu), và chỉ test module không phụ thuộc DOM/Firebase. `npm test` chạy `node --test "tests/*.test.js"`. Muốn test module mới thì module đó (và các import của nó) phải dùng đuôi `.js` hoặc không import gì.

## 15. Deploy

- Repo: `https://github.com/trannhatthien539-wq/lingua` (branch `main`). Push lên `main` → `.github/workflows/deploy.yml` deploy GitHub Pages (`base=/lingua/`) và `build-apk.yml` build artifact APK.
- Web: `https://trannhatthien539-wq.github.io/lingua/` (~30 giây/lần deploy; `dist/` bị gitignore, build trong CI).
- Mọi thay đổi nên chạy `npm run build` (và `npm test` nếu sửa logic thuần) trước khi push.

## 16. Bẫy đã từng gặp (đọc trước khi sửa)

1. **StrictMode bật** (`main.jsx`): effect chạy 2 lần → không sinh id bằng `Date.now()` đơn thuần (dùng `makeId(prefix)`), và seeding phải single-flight (`starterSeedPromise`).
2. **Firestore từ chối `undefined`**: mọi payload ghi phải qua `omitUndefined`; `imageUrl` mặc định `""`.
3. **Service worker cũ gây "Invalid hook call / multiple React copies"** khi dev: chạy `npm run dev -- --force` và xoá cache/SW nếu thấy lỗi lạ.
4. **Thẻ lật 3D**: không được đổi `index` cùng lúc với `setFlipped(false)` — mặt sau của thẻ mới sẽ lộ ra khi xoay; phải đổi nội dung sau khi thẻ xoay xong (`advanceAfterFlip`, `FLIP_MS` khớp `duration-500`).
5. **Module lazy + sự kiện**: không dispatch sự kiện rồi hy vọng module chưa mount nhận được — dùng cơ chế "pending item" trong `deepLink.js`.
6. **React Flow**: `nodeTypes`/`defaultEdgeOptions` phải là hằng ngoài component; ẩn handle thì phải `pointer-events-none`.
7. **Tailwind + font scale**: cỡ chữ đổi `html{font-size}` nên tránh phần tử có min-width theo `rem` trong hàng ngang (từng gây tràn ở planner).
8. **Bottom nav mobile**: **5 tab chính + nút “Thêm”** (bảng trượt lên chứa Writing/Todo/Sơ đồ/Cài đặt). Trước đây hiện cả 9 tab nên 3 tab cuối bị khuất, phải vuốt ngang mới thấy (không ai thấy). Nếu thêm tab mới: thêm vào `navigationItems` + `iconById`; tab nào không nằm trong `PRIMARY_TABS` sẽ tự vào bảng “Thêm”. Nhớ `main` phải giữ `pb-28` (nav cao ~76px).
9. **In báo cáo**: nhớ class `.no-print` cho chrome (Sidebar/Topbar/MobileHeader/BottomNav đã gắn sẵn).
10. **`node --test tests` (thư mục trần) không chạy được** — phải dùng glob `"tests/*.test.js"`, và Node phải **≥ 22** để tự mở rộng glob (CI dùng `node-version: 24`).
11. **ESLint 10 (flat config) bật rule mới khá gắt**: `preserve-caught-error` (throw trong `catch` phải kèm `{ cause: error }`) và `no-useless-assignment`; ngoài ra `react-hooks/rules-of-hooks` coi **mọi hàm bắt đầu bằng `use`** là hook — đừng đặt tên helper kiểu `useNativeGoogle()` (đã đổi thành `nativeGoogleRequested()`). Sửa lỗi thật thay vì tắt rule; warning thì để lại (CI chỉ fail khi có error).
12. **Tailwind không sinh class động**: không viết `` `bg-${tone}/15` `` — phải dùng class tĩnh truyền qua prop (xem `TodayPlanCard`).
13. **`useCloudDoc` ghi có debounce** (mặc định ~900ms): sau khi lưu xong, dữ liệu vào localStorage/Firestore trễ 1–3 giây — đừng kết luận "không lưu được" khi kiểm tra ngay lập tức.
14. **Thông báo khác nhau theo nền tảng**: web = `Notification` (chỉ khi app mở), APK = `@capacitor/local-notifications` (lịch của hệ điều hành, chỉ chạy sau `npx cap sync android`).

## 17. Chưa làm (roadmap)

- Tài khoản: xác thực email, xoá tài khoản, đăng nhập Facebook/Apple. (Đã có: quên mật khẩu qua email.)
- Xã hội: thư viện bộ từ cộng đồng, xếp hạng bạn bè, chế độ lớp học/giáo viên (cần backend + rules mới).
- Push notification từ server (FCM) khi app đóng. (Đã có: thông báo theo lịch của hệ điều hành trên APK.)
- Đa ngôn ngữ giao diện (i18n) và học ngôn ngữ khác ngoài tiếng Anh.
- Sửa hàng loạt nâng cao (gắn tag, đổi bộ), tìm ảnh thủ công cho thư viện lớn.
- Bấm-vào-từ cho phần Nghe (transcript) và Writing.

## 17.1 Đăng nhập trên APK (đã dọn hết hướng dẫn)

- **Mọi nút đăng nhập trong app đều mở `/login`** (Sidebar, MobileHeader, Cài đặt → Tài khoản “Đăng nhập / Tạo tài khoản”) — **không** nhảy thẳng sang Google. Chỉ ở trang `/login`, bấm “Đăng nhập nhanh bằng Google” mới gọi Google thật (`signInWithGoogle`). App không còn `handleGoogleLogin` riêng.
- **Trang đăng nhập (AuthPage)**: cột giới thiệu chỉ hiện từ `lg` trở lên (`hidden lg:block`); trên điện thoại/webview (kể cả APK) chỉ hiện form **Email + mật khẩu** kèm logo + nút Google → trước đây form nằm dưới khối hero cao gần 1 màn hình nên tưởng là app không có đăng nhập email.
- Đã xoá: `AppLoginPanel` (“Bản APK → Đăng nhập trên app bằng mật khẩu”), `GoogleSignInHelp` (mở lại Chrome / dán id_token / nhật ký), khối `GoogleSetup` trong `AccountPanel` (chọn chế độ + dán client ID + hướng dẫn Google Cloud Console), và phần “Sao chép mã đăng nhập” trong `public/oauth-callback.html`.
- Luồng thật vẫn giữ: Google trên web (popup) và trên APK (mở Chrome rồi quay về app qua deep link `com.lingua.studyhub://auth`); tài khoản Email + mật khẩu hoạt động như tài khoản Firebase bình thường.
- Nếu sau này cần vào app bằng tài khoản Google (không có mật khẩu): `src/services/accountAuthService.js` vẫn giữ `createPasswordForApp` (thêm provider `password` vào tài khoản Google bằng `linkWithCredential`) — chỉ cần thêm một nút trong Cài đặt là dùng được ngay. Không thể “copy key” phiên từ web sang APK vì Firebase không xuất session/refresh token ở client (muốn thế phải có Cloud Function + Admin SDK `createCustomToken`).

## 17.2 Widget màn hình chính (Android) + shortcut giữ icon

- **Widget 4×2** hiển thị: `Ôn 50 thẻ hôm nay` · `Ngữ pháp: <bài chưa đạt đầu tiên>` · `Chuỗi N ngày · 1000 thẻ đến hạn` · `Cập nhật HH:MM DD/MM`, kèm 2 nút **Ôn từ vựng** / **Học ngữ pháp** mở thẳng tab.
- **Shortcut khi giữ icon app** (Android 7.1+): Ôn từ vựng · Học ngữ pháp · Thi thử VSTEP · Tiến độ hôm nay.
- **Vì sao có thư mục `native/android-widget/`**: Capacitor không hỗ trợ widget, mà repo **không chứa project `android/`** (CI tự `cap add android`). Vì vậy mã native nằm trong repo và bước **“Inject the home-screen widget and app shortcuts”** của `build-apk.yml` sẽ:
  1. chép `java/**` → `android/app/src/main/java/com/lingua/studyhub/`, chép `res/**` → `android/app/src/main/res/`;
  2. vá `AndroidManifest.xml`: thêm `<receiver .LinguaWidgetProvider>` + `<meta-data android.app.shortcuts>` trong `<activity .MainActivity>`;
  3. vá `MainActivity.java`: chèn `registerPlugin(LinguaWidgetPlugin.class);` trước `super.onCreate(…)` (plugin cục bộ, không phải npm plugin);
  4. kiểm tra file tài nguyên đã có, thiếu thì **fail build** để không xuất APK thiếu widget.
- **Luồng dữ liệu**: `VocabHub` gọi `publishCardStats(cards)` → localStorage + event `lingua:widget-stats` → `useWidgetSummary` (trong `App`) ghép với tiến độ ngữ pháp + `streak` → `pushWidgetSummary` → plugin `LinguaWidget.save()` ghi SharedPreferences `lingua_widget` → provider vẽ lại **ngay** (không cần chờ 30 phút). Web: plugin không có → chỉ ghi localStorage để Cài đặt → Dữ liệu hiện **xem trước** đúng nội dung widget.
- **Giới hạn cần biết**: chỉ Android; Android giới hạn widget tự cập nhật ≥ 30 phút (`updatePeriodMillis`) — số liệu chỉ mới ngay khi app ghi; widget chỉ hiển thị + mở app, không học trực tiếp trên widget; muốn thấy widget phải **cài APK mới** rồi thêm widget vào màn hình (giữ chỗ trống → Widgets → Lingua).

## 18. Checklist khi thêm tính năng

1. Xác định tab/module liên quan; nếu là tab mới → làm đủ 4 bước ở §3.
2. Dữ liệu mới: ưu tiên thêm field vào card/deck hoặc một key `user_state` mới (đặt tên trong `userDocKeys`) thay vì tạo collection mới (nhớ cập nhật `firestore.rules` và bổ sung key vào danh sách `syncGuestUserDocs` ở `App.jsx`).
3. Ghi/đọc dữ liệu **chỉ** qua `dataService`/`userDocService` — không gọi Firestore trực tiếp từ component.
4. Trạng thái UI dùng hook có sẵn (`useSectionState`, `useDebounce`, `useDailyGoal`…).
5. Thông báo qua `toast`; thao tác xoá phải là xoá mềm + `toast.undo`.
6. Thêm nội dung học thì đặt trong `src/data/…` và (nếu cần tìm kiếm) bổ sung vào `searchIndex.js`. Riêng đề VSTEP: xem `src/data/vstep/exams/b1-01.js` làm mẫu, thêm metadata vào `registry.js`/`metadata.js`, rồi chạy `node scripts/check-vstep.mjs` trước khi build.
7. Cập nhật icon bottom nav nếu là tab mới; thêm mục vào `SearchPalette`/`ShortcutsHelpModal` nếu có phím tắt hoặc lệnh mới.
8. Chạy `npm test` (nếu sửa logic thuần) và `npm run build`; smoke-test nhanh trên `npm run dev`.
