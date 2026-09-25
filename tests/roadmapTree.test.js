import test from "node:test";
import assert from "node:assert/strict";
import {
  STATUS_CYCLE,
  buildRoadmapTree,
  countByStatus,
  nextStatus,
  progressPercent,
} from "../src/utils/roadmapTree.js";

const node = (id, status = "pending") => ({ id, data: { label: id, status } });
const edge = (source, target) => ({ source, target });

test("nextStatus đi theo vòng Chưa học → Đang học → Đã thuộc", () => {
  assert.equal(nextStatus("pending"), "progress");
  assert.equal(nextStatus("progress"), "mastered");
  assert.equal(nextStatus("mastered"), "pending");
});

test("nextStatus quay về pending khi trạng thái không hợp lệ", () => {
  // indexOf trả -1 nên (-1 + 1) % 3 = 0 → "pending".
  assert.equal(nextStatus(undefined), "pending");
  assert.equal(nextStatus("không-có"), "pending");
});

test("STATUS_CYCLE giữ đúng thứ tự 3 trạng thái", () => {
  assert.deepEqual(STATUS_CYCLE, ["pending", "progress", "mastered"]);
});

test("buildRoadmapTree dựng cây cha–con và gắn depth từ gốc", () => {
  const nodes = [node("root"), node("a"), node("b"), node("a1")];
  const edges = [edge("root", "a"), edge("root", "b"), edge("a", "a1")];
  const tree = buildRoadmapTree(nodes, edges);
  assert.equal(tree.length, 1);
  assert.equal(tree[0].id, "root");
  assert.equal(tree[0].depth, 0);
  assert.deepEqual(tree[0].children.map((child) => child.id), ["a", "b"]);
  assert.equal(tree[0].children[0].depth, 1);
  assert.equal(tree[0].children[0].children[0].id, "a1");
  assert.equal(tree[0].children[0].children[0].depth, 2);
  assert.deepEqual(tree[0].children[1].children, []);
});

test("buildRoadmapTree giữ thứ tự node đã lưu, không theo thứ tự edge", () => {
  const nodes = [node("root"), node("first"), node("second"), node("third")];
  const edges = [edge("root", "third"), edge("root", "first"), edge("root", "second")];
  const tree = buildRoadmapTree(nodes, edges);
  assert.deepEqual(tree[0].children.map((child) => child.id), ["first", "second", "third"]);
});

test("buildRoadmapTree bỏ qua self-loop và edge tới node không tồn tại", () => {
  const nodes = [node("root"), node("child")];
  const edges = [edge("root", "root"), edge("root", "khong-ton-tai"), edge("root", "child")];
  const tree = buildRoadmapTree(nodes, edges);
  assert.equal(tree[0].children.length, 1);
  assert.equal(tree[0].children[0].id, "child");
});

test("buildRoadmapTree không treo khi dữ liệu có vòng kín", () => {
  const nodes = [node("a"), node("b"), node("c")];
  const edges = [edge("a", "b"), edge("b", "c"), edge("c", "a")];
  const tree = buildRoadmapTree(nodes, edges);
  // Mọi node đều có cha nên không tồn tại gốc; node đầu tiên được gom làm gốc
  // và `visited` cắt vòng lặp — phải giữ đủ cả 3 node, không mất và không treo.
  const flatten = (list) => list.flatMap((item) => [item.id, ...flatten(item.children)]);
  assert.deepEqual(flatten(tree).sort(), ["a", "b", "c"]);
  // Quan trọng: children không được chứa null, nếu không render sẽ vỡ.
  const assertNoNull = (list) =>
    list.forEach((item) => {
      assert.ok(item.children.every(Boolean), "children không được chứa null");
      assertNoNull(item.children);
    });
  assertNoNull(tree);
});

test("buildRoadmapTree chịu được nhiều nhánh gốc độc lập", () => {
  const nodes = [node("r1"), node("r2"), node("c1")];
  const edges = [edge("r1", "c1")];
  const tree = buildRoadmapTree(nodes, edges);
  assert.deepEqual(tree.map((root) => root.id), ["r1", "r2"]);
  assert.equal(tree[0].children[0].id, "c1");
  assert.deepEqual(tree[1].children, []);
});

test("buildRoadmapTree trả về mảng rỗng khi chưa có node nào", () => {
  assert.deepEqual(buildRoadmapTree([], []), []);
  assert.deepEqual(buildRoadmapTree(), []);
});

test("buildRoadmapTree giữ nguyên dữ liệu node (label, status, ghi chú)", () => {
  const nodes = [
    { id: "root", data: { label: "Android", detail: "Mục tiêu", status: "progress", notes: "note" } },
  ];
  const tree = buildRoadmapTree(nodes, []);
  assert.equal(tree[0].data.label, "Android");
  assert.equal(tree[0].data.status, "progress");
  assert.equal(tree[0].data.notes, "note");
});

test("countByStatus đếm theo trạng thái, trạng thái lạ tính vào pending", () => {
  const nodes = [node("a", "mastered"), node("b", "progress"), node("c", "pending"), node("d", "lạ")];
  assert.deepEqual(countByStatus(nodes), { pending: 2, progress: 1, mastered: 1 });
  assert.deepEqual(countByStatus([]), { pending: 0, progress: 0, mastered: 0 });
});

test("progressPercent tính theo node đã thuộc và không chia cho 0", () => {
  const nodes = [node("a", "mastered"), node("b", "mastered"), node("c"), node("d")];
  assert.equal(progressPercent(nodes), 50);
  assert.equal(progressPercent([]), 0);
});
