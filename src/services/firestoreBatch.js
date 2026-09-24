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
