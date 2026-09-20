/**
 * Metadata các đề VSTEP (không chứa nội dung, không dùng API của Vite nên test được bằng Node).
 *
 * - Trang chủ VSTEP và tìm kiếm toàn cục chỉ đọc file này.
 * - Nội dung đề nằm ở `exams/<id>.js`; `registry.js` lo việc nạp lười.
 * - `tests/vstepExams.test.js` kiểm tra metadata khớp với nội dung thật.
 */
export const VSTEP_LEVELS = ['B1', 'B2', 'C1'];

export const registry = [
  { id: 'b1-01', level: 'B1', title: 'Đề B1 số 1 · Đời sống & học tập', tags: ['đời sống', 'học tập'], counts: { listening: 35, reading: 40 } },
  { id: 'b1-02', level: 'B1', title: 'Đề B1 số 2 · Công việc & giao tiếp', tags: ['công việc', 'giao tiếp'], counts: { listening: 35, reading: 40 } },
  { id: 'b1-03', level: 'B1', title: 'Đề B1 số 3 · Du lịch & sức khoẻ', tags: ['du lịch', 'sức khoẻ'], counts: { listening: 35, reading: 40 } },
  { id: 'b2-01', level: 'B2', title: 'Đề B2 số 1 · Giáo dục & công nghệ', tags: ['giáo dục', 'công nghệ'], counts: { listening: 35, reading: 40 } },
  { id: 'b2-02', level: 'B2', title: 'Đề B2 số 2 · Môi trường & đô thị', tags: ['môi trường'], counts: { listening: 35, reading: 40 } },
  { id: 'b2-03', level: 'B2', title: 'Đề B2 số 3 · Kinh tế & tiêu dùng', tags: ['kinh tế'], counts: { listening: 35, reading: 40 } },
  { id: 'b2-04', level: 'B2', title: 'Đề B2 số 4 · Truyền thông & xã hội', tags: ['truyền thông'], counts: { listening: 35, reading: 40 } },
  { id: 'c1-01', level: 'C1', title: 'Đề C1 số 1 · Khoa học & đổi mới', tags: ['khoa học'], counts: { listening: 35, reading: 40 } },
  { id: 'c1-02', level: 'C1', title: 'Đề C1 số 2 · Văn hoá & toàn cầu hoá', tags: ['văn hoá'], counts: { listening: 35, reading: 40 } },
  { id: 'c1-03', level: 'C1', title: 'Đề C1 số 3 · Chính sách & môi trường', tags: ['chính sách'], counts: { listening: 35, reading: 40 } },
];

export const examMeta = (id) => registry.find((item) => item.id === id) || null;

export const examsByLevel = (level) => (level === 'all' ? registry : registry.filter((item) => item.level === level));
