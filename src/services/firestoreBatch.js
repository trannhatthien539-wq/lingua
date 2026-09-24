// Firestore chỉ cho tối đa 500 thao tác mỗi batch. Giữ biên an toàn cho payload thẻ lớn.
export const FIRESTORE_BATCH_SIZE = 400;

/** Chia danh sách thao tác thành batch mà không mutate input. */
export function chunkForFirestore(items, batchSize = FIRESTORE_BATCH_SIZE) {
  const values = Array.from(items || []);
  if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > 500) {
    throw new RangeError("Kích thước batch Firestore phải là số nguyên từ 1 đến 500.");
  }
  const chunks = [];
  for (let index = 0; index < values.length; index += batchSize) {
    chunks.push(values.slice(index, index + batchSize));
  }
  return chunks;
}

/** Chạy ghi theo batch và rollback các phần đã commit nếu một batch sau lỗi. */
export async function runInBatches(items, { batchSize = FIRESTORE_BATCH_SIZE, commit, rollback } = {}) {
  if (typeof commit !== "function") throw new TypeError("Thiếu hàm commit batch.");
  const committed = [];
  const attempted = [];
  try {
    for (const chunk of chunkForFirestore(items, batchSize)) {
      attempted.push(...chunk);
      await commit(chunk);
      committed.push(...chunk);
    }
    return committed;
  } catch (error) {
    // Batch đang commit có thể đã đến server dù response bị mất; xoá cả batch đó để tránh sót dữ liệu.
    if (rollback && attempted.length) {
      try {
        await rollback(attempted);
      } catch {
        // Giữ lỗi gốc để UI báo đúng nguyên nhân batch thất bại.
      }
    }
    throw error;
  }
}
