/**
 * Nạp nội dung đề VSTEP theo yêu cầu (mỗi đề là một chunk riêng).
 * Metadata nằm ở `metadata.js` để trang chủ/tìm kiếm không phải tải nội dung.
 */
export { VSTEP_LEVELS, registry, examMeta, examsByLevel } from './metadata';

const examModules = import.meta.glob('./exams/*.js');

const loaderById = Object.fromEntries(
  Object.entries(examModules).map(([path, loader]) => [path.replace('./exams/', '').replace('.js', ''), loader]),
);

export const hasExamContent = (id) => Boolean(loaderById[id]);

export const examIds = Object.keys(loaderById);

/** Nạp nội dung đầy đủ của một đề. */
export const loadExam = async (id) => {
  const loader = loaderById[id];
  if (!loader) throw new Error(`Không tìm thấy đề “${id}”.`);
  const module = await loader();
  return module.default || module.exam;
};
