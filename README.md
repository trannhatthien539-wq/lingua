# Lingua — All-in-one Language Learning Hub

Ứng dụng React + Vite + Tailwind CSS giúp gom các workflow học ngoại ngữ vào một workspace: SRS flashcard, chấm chữa ngữ pháp, kế hoạch học, mindmap và tích hợp API.

## Chạy local

```bash
npm install
npm run dev
```

Build production:

```bash
npm run build
```

## Cấu trúc chính

- `src/components`: layout dùng chung và UI primitives.
- `src/modules`: từng tính năng độc lập theo domain.
- `src/hooks`: stateful hooks như theme.
- `src/services`: lớp giao tiếp API, có thể thay implementation mà không đổi UI.
- `src/data`: navigation và dữ liệu cấu hình.
- `src/lib`: helper thuần, không phụ thuộc component.

`src/App.jsx` là composition root: giữ state tab hiện tại và render module tương ứng từ registry `modules`. Khi thêm tính năng, tạo một folder mới trong `src/modules`, thêm route item vào `src/data/navigation.js`, rồi đăng ký component trong `App.jsx`.
