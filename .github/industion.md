# Lingua Study Hub - Project Handoff

Tài liệu này giúp AI/agent khác tiếp nhận và tiếp tục phát triển dự án mà không cần quét lại toàn bộ codebase.

## 1. Tổng quan

Lingua Study Hub là ứng dụng học ngoại ngữ all-in-one, xây dựng bằng React + Vite + Tailwind CSS. Giao diện hỗ trợ dark/light mode, copy tiếng Việt và lưu dữ liệu theo hướng local-first.

Các workflow chính:

- Vocabulary Decks/Cards và Practice Modes.
- Grammar Checker dùng AI.
- Study Planner với checklist và Pomodoro.
- Interactive Study Mindmap/Roadmap.
- Cài đặt provider/API key.

## 2. Tech Stack

- React + React DOM.
- Vite.
- Tailwind CSS 3.
- `lucide-react` cho icon.
- `@xyflow/react` cho mindmap.
- `dagre` cho auto-layout mindmap.
- `html-to-image` cho xuất PNG mindmap.
- `canvas-confetti` cho Quiz vocabulary.
- `react-player` cho nguồn audio đa dạng trong Pomodoro.
- Web Audio API và Speech Synthesis API cho âm thanh/phát âm.
- LocalStorage cho persistence.

Lệnh chính:

```bash
npm install
npm run dev
npm run build
npm run preview
```

Build hiện có thể hiển thị cảnh báo bundle lớn do React Flow, Dagre và ReactPlayer; đây không phải lỗi compile.

## 3. Cấu trúc thư mục

```text
src/
  App.jsx
  main.jsx
  index.css
  components/
    layout/
      Sidebar.jsx
      Topbar.jsx
    ui/
      ProgressBar.jsx
      StatCard.jsx
  data/
    navigation.js
  hooks/
    useTheme.js
  lib/
    formatters.js
  services/
    aiClient.js
  modules/
    learning/
      VocabularyHub.jsx
      GrammarAndVocabulary.jsx
    mindmap/
      StudyMindmap.jsx
    planner/
      StudyPlanner.jsx
    settings/
      ApiSettings.jsx
      SettingsModule.jsx
```

## 4. Luồng App và navigation

`src/App.jsx` là composition root duy nhất của layout:

- State `activeTab` quyết định module đang hiển thị.
- Sidebar điều khiển `activeTab`.
- Registry module hiện tại:
  - `vocabulary` -> `VocabularyHub`.
  - `grammar` -> `GrammarChecker` từ `GrammarAndVocabulary.jsx`.
  - `planner` -> `StudyPlanner`.
  - `mindmap` -> `StudyMindmap`.
  - `settings` -> `ApiSettings`.
- Không đưa nghiệp vụ mới vào `App.jsx`; tạo module/component riêng rồi đăng ký trong registry.
- `App.jsx` lắng nghe event `lingua:open-practice` để chuyển về tab vocabulary.

## 5. AI và API key

File trung tâm: `src/services/aiClient.js`.

Provider hiện hỗ trợ:

- Gemini REST API.
- Groq OpenAI-compatible REST API.

LocalStorage keys:

- `lingua-ai-api-key`.
- `lingua-ai-provider`.

Gemini hiện dùng model `gemini-3.6-flash` và endpoint `v1beta/models/...:generateContent`. `requestAi()` nhận `{ json: true }` khi prompt yêu cầu JSON. `parseAiJson()` làm sạch markdown fence và parse JSON.

Lưu ý quan trọng: fallback nhiều Gemini model và AbortController timeout đã từng được thử nghiệm nhưng đã được hoàn tác theo yêu cầu trước đó. Không giả định fallback đang tồn tại nếu chưa kiểm tra lại `aiClient.js`.

API key đang được gọi trực tiếp từ frontend. Đây phù hợp cho prototype/local app; production nên chuyển request qua backend proxy để bảo vệ key.

## 6. Vocabulary

File chính: `src/modules/learning/VocabularyHub.jsx`.

Data model:

```js
{
  decks: [
    {
      id,
      title,
      tags,
      createdAt
    }
  ],
  cards: [
    {
      id,
      deckId,
      word,
      ipa,
      meaning,
      example,
      level,
      status,
      reviewDate
    }
  ]
}
```

LocalStorage:

- Library mới: `lingua-vocabulary-library`.
- Migration cũ: `lingua-vocabulary`.
- Streak luyện tập: `lingua-study-streak`.

PracticeSession có 3 mode:

- Flashcard.
- Quiz 4 đáp án kiểu Duolingo.
- Spelling/Nghe gõ.

Quiz phải luôn tạo options theo thứ tự logic:

1. Đưa từ đúng vào options.
2. Chọn 3 distractors khác nhau.
3. Shuffle một lần theo `card.id`, không shuffle lại khi click đáp án.

Đã có confetti, Web Audio ding/buzz, phím `1-4` và `Enter`.

## 7. Grammar Checker

File: `src/modules/learning/GrammarAndVocabulary.jsx`.

Exports:

- `GrammarChecker` là màn hình độc lập cho tab Ngữ pháp.
- Không thêm lại tab con Từ vựng/Ngữ pháp vào component này.
- API key/provider phải lấy từ LocalStorage hoặc tab Cài đặt API.

Kết quả grammar được yêu cầu JSON gồm score, summary, corrections và rewritten.

## 8. Study Planner và Pomodoro

File: `src/modules/planner/StudyPlanner.jsx`.

Tính năng:

- Daily checklist theo ngày.
- Pomodoro 25 phút focus / 5 phút break.
- Timer lưu trong `lingua-study-planner`.
- Zen Focus dùng Fullscreen API và lắng nghe `fullscreenchange`.
- Background audio preset bằng Web Audio.
- Custom audio và online source qua `react-player`.
- Audio settings lưu trong `lingua-pomodoro-audio`.
- Custom background/alarm có thể lưu metadata và Base64 data URL.
- Modal audio có tab nhạc nền và chuông báo.
- Hỗ trợ metadata URL qua `fetchMediaTitle()` và noembed cho YouTube.

Khi sửa Pomodoro, phải giữ:

- Pause dừng background audio.
- Timer hết phiên phát alarm một lần.
- Fullscreen thoát được bằng nút hoặc phím Esc.
- Không lưu Blob URL hỏng vào LocalStorage; nếu dùng Object URL mới phải revoke khi đổi nguồn/unmount.

## 9. Study Mindmap

File: `src/modules/mindmap/StudyMindmap.jsx`.

Stack:

- React Flow.
- Dagre.
- html-to-image.

Tính năng:

- Node custom có handles top/right/bottom/left.
- Node hỗ trợ status pending/progress/mastered.
- Click node mở Study Drawer.
- Double-click node inline edit.
- Quick add 4 hướng.
- Tab thêm node con.
- Delete/Backspace xóa node hoặc edge đang chọn.
- Click/double-click edge để chọn/xóa.
- Pan canvas bằng chuột trái/giữa và Space + drag.
- Giới hạn pan/zoom bằng `nodeExtent`, `translateExtent`, `minZoom`, `maxZoom`.
- Auto-layout Dagre hỗ trợ TB và LR.
- `getLayoutedElements(nodes, edges, direction)` phải luôn trả lại cả nodes và edges.
- Layout dùng node size khoảng 260x100, ranksep 80, nodesep 40.
- Edge phải giữ `smoothstep`, arrow, sourceHandle/targetHandle và stroke rõ ràng.
- Export PNG cần chụp `.react-flow__viewport` để không mất SVG edges.
- AI roadmap phải sinh tree phân nhánh với root, group và detail nodes có parentId.

LocalStorage mindmap:

- `lingua-study-mindmap`.

## 10. Settings

File chính: `src/modules/settings/ApiSettings.jsx`.

Nơi duy nhất để nhập provider và API key. Không đưa khối API key trở lại đầu màn hình Vocabulary hoặc Grammar.

## 11. Quy tắc phát triển

- Dùng JavaScript/JSX, không chuyển sang TypeScript nếu chưa có yêu cầu.
- Giữ feature code trong `src/modules` và shared UI trong `src/components`.
- API call chỉ đặt trong `src/services` hoặc gọi qua service chung.
- Không hard-code lại API key.
- Giữ dark/light mode và copy tiếng Việt.
- Không sửa dist trực tiếp; sửa source rồi chạy `npm run build`.
- Sau mỗi thay đổi quan trọng chạy diagnostics và `npm run build`.
- Không commit hoặc reset thay đổi của người dùng nếu chưa được yêu cầu.
- Trước khi sửa file đã có thay đổi ngoài ý muốn, đọc kỹ và làm việc cùng thay đổi hiện tại.
