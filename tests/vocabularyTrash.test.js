import test from "node:test";
import assert from "node:assert/strict";
import { runInBatches, chunkForFirestore, FIRESTORE_BATCH_SIZE } from "../src/services/firestoreBatch.js";
import { buildTrashView } from "../src/services/vocabularyTrash.js";

test("chia 1.000 thẻ thành 3 batch Firestore an toàn", () => {
  const ids = Array.from({ length: 1000 }, (_, index) => `card-${index + 1}`);
  const chunks = chunkForFirestore(ids);

  assert.deepEqual(chunks.map((chunk) => chunk.length), [400, 400, 200]);
  assert.equal(chunks.flat().length, 1000);
  assert.deepEqual(chunks[0][0], "card-1");
  assert.deepEqual(chunks[2].at(-1), "card-1000");
  assert.equal(ids.length, 1000, "không mutate danh sách đầu vào");
  assert.ok(chunks.every((chunk) => chunk.length <= 500));
  assert.equal(FIRESTORE_BATCH_SIZE, 400);
});
test("batch lỗi thì rollback đúng các thẻ đã commit trước đó", async () => {
  const cards = Array.from({ length: 1000 }, (_, index) => ({ id: `card-${index + 1}` }));
  const committed = [];
  let commitCalls = 0;
  let rolledBack = [];

  await assert.rejects(
    runInBatches(cards, {
      commit: async (chunk) => {
        commitCalls += 1;
        if (commitCalls === 3) throw new Error("batch lỗi");
        committed.push(...chunk);
      },
      rollback: async (created) => { rolledBack = created; },
    }),
    /batch lỗi/,
  );

  assert.equal(commitCalls, 3);
  assert.equal(committed.length, 800);
  assert.equal(rolledBack.length, 1000);
  assert.equal(rolledBack[0].id, "card-1");
  assert.equal(rolledBack.at(-1).id, "card-1000");
});


test("buildTrashView gom card con vào deck và chỉ giữ card lẻ đã xoá", () => {
  const deckCards = Array.from({ length: 1000 }, (_, index) => ({ id: `card-${index}`, deckId: "deck-1" }));
  const view = buildTrashView(
    [{ id: "deck-1", title: "1000 từ", deletedAt: "2026-09-24T00:00:00.000Z" }],
    [...deckCards, { id: "single", deckId: "deck-2", deletedAt: "2026-09-24T00:00:00.000Z" }],
  );

  assert.equal(view.decks.length, 1);
  assert.equal(view.decks[0].cardCount, 1000);
  assert.deepEqual(view.cards.map((card) => card.id), ["single"]);
});

test("buildTrashView chịu dữ liệu rỗng hoặc sai kiểu", () => {
  assert.deepEqual(buildTrashView(null, null), { decks: [], cards: [] });
  assert.deepEqual(buildTrashView([null, {}], [null, {}]), { decks: [], cards: [] });
});
