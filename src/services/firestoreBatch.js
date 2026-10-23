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
export async function runInBatches(items, {
  batchSize = FIRESTORE_BATCH_SIZE,
  concurrency = 1,
  commit,
  rollback,
} = {}) {
  if (typeof commit !== "function") throw new TypeError("Thiếu hàm commit batch.");
  if (!Number.isInteger(concurrency) || concurrency < 1) {
    throw new RangeError("Số batch chạy đồng thời phải là số nguyên dương.");
  }
  const chunks = chunkForFirestore(items, batchSize);
  const committed = new Array(chunks.length);
  const attempted = [];
  let nextChunkIndex = 0;
  let failed = false;
  let failure;

  const worker = async () => {
    while (!failed && nextChunkIndex < chunks.length) {
      const chunkIndex = nextChunkIndex++;
      const chunk = chunks[chunkIndex];
      attempted.push(...chunk);
      try {
        await commit(chunk);
        committed[chunkIndex] = chunk;
      } catch (error) {
        if (!failed) failure = error;
        failed = true;
      }
    }
  };

  await Promise.all(Array.from({ length: Math.min(concurrency, chunks.length) }, worker));
  if (!failed) return committed.flat();

  // Wait for all in-flight commits before rolling them back.
  if (rollback && attempted.length) {
    try {
      await rollback(attempted);
    } catch {
      // Keep the original commit error so the UI reports the cause of the failed write.
    }
  }
  throw failure;
}
