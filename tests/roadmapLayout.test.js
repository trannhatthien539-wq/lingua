import test from "node:test";
import assert from "node:assert/strict";
import {
  LAYOUT_DEFAULTS,
  edgePath,
  layoutRoadmap,
  pruneCollapsed,
} from "../src/utils/roadmapLayout.js";

const node = (id, children = []) => ({ id, children, data: { label: id } });
const byId = (result) => new Map(result.nodes.map((n) => [n.id, n]));

test("layoutRoadmap đặt node theo cột ngang tăng dần theo depth", () => {
  const tree = [node("root", [node("a", [node("a1")]), node("b")])];
  const { nodes } = layoutRoadmap(tree);
  const map = byId({ nodes });
  assert.ok(map.get("a").x > map.get("root").x, "con nằm bên phải cha");
  assert.ok(map.get("b").x > map.get("root").x);
  assert.ok(map.get("a1").x > map.get("a").x, "cháu nằm bên phải cha");
});

test("layoutRoadmap không cho hai node cùng cột chồng lấn theo chiều dọc", () => {
  const tree = [node("root", [node("a"), node("b"), node("c")])];
  const { nodes } = layoutRoadmap(tree);
  const map = byId({ nodes });
  const a = map.get("a");
  const b = map.get("b");
  const c = map.get("c");
  assert.ok(a.y + a.height <= b.y, "a nằm trên b");
  assert.ok(b.y + b.height <= c.y, "b nằm trên c");
});

test("layoutRoadmap canh node cha theo giữa các con", () => {
  const tree = [node("root", [node("a"), node("b")])];
  const { nodes } = layoutRoadmap(tree);
  const map = byId({ nodes });
  const root = map.get("root");
  const a = map.get("a");
  const b = map.get("b");
  const childrenMid = (a.y + a.height / 2 + (b.y + b.height / 2)) / 2;
  assert.ok(
    Math.abs(root.y + root.height / 2 - childrenMid) < 1,
    "tâm cha trùng tâm trung bình của hai con",
  );
});

test("layoutRoadmap trả về kích thước đủ chứa mọi node", () => {
  const tree = [node("root", [node("a", [node("a1")]), node("b")])];
  const { nodes, width, height } = layoutRoadmap(tree);
  const maxRight = Math.max(...nodes.map((n) => n.x + n.width));
  const maxBottom = Math.max(...nodes.map((n) => n.y + n.height));
  assert.equal(width, maxRight + LAYOUT_DEFAULTS.padding);
  assert.equal(height, maxBottom + LAYOUT_DEFAULTS.padding);
});

test("layoutRoadmap tôn trọng khoảng cách gapY giữa hai lá", () => {
  const tree = [node("root", [node("a"), node("b")])];
  const { nodes } = layoutRoadmap(tree);
  const map = byId({ nodes });
  const gap = map.get("b").y - (map.get("a").y + map.get("a").height);
  assert.equal(gap, LAYOUT_DEFAULTS.gapY);
});

test("layoutRoadmap sinh edge cho mỗi cặp cha–con, trừ node gốc", () => {
  const tree = [node("root", [node("a", [node("a1")]), node("b")])];
  const { edges } = layoutRoadmap(tree);
  assert.equal(edges.length, 3, "3 cạnh cho 4 node");
  assert.ok(!edges.some((edge) => edge.source === "root" && edge.target === undefined));
  const pairs = edges.map((edge) => `${edge.source}->${edge.target}`).sort();
  assert.deepEqual(pairs, ["a->a1", "root->a", "root->b"]);
});

test("layoutRoadmap chịu được nhiều nhánh gốc", () => {
  const { nodes, width } = layoutRoadmap([node("r1", [node("c1")]), node("r2")]);
  assert.equal(nodes.length, 3);
  assert.ok(width > 0);
});

test("layoutRoadmap trả về kích thước 0 khi cây rỗng", () => {
  assert.deepEqual(layoutRoadmap([]), { nodes: [], edges: [], width: 0, height: 0 });
  assert.deepEqual(layoutRoadmap(), { nodes: [], edges: [], width: 0, height: 0 });
});

test("layoutRoadmap nhận kích thước ô ghi đè", () => {
  const { nodes } = layoutRoadmap([node("root", [node("a")])], {
    nodeWidth: 120,
    nodeHeight: 40,
  });
  const map = byId({ nodes });
  assert.equal(map.get("root").width, 120);
  assert.equal(map.get("root").height, 40);
});

test("edgePath vẽ đường bezier nối từ mép phải cha sang mép trái con", () => {
  const source = { x: 0, y: 0, width: 100, height: 40 };
  const target = { x: 200, y: 100, width: 100, height: 40 };
  const d = edgePath(source, target);
  assert.match(d, /^M 100 20 /, "bắt đầu từ giữa mép phải node cha");
  assert.match(d, /200 120$/, "kết thúc ở giữa mép trái node con");
  assert.match(d, /C /, "dùng đường cong bezier");
});

test("edgePath không sinh đường cong khổng lồ khi hai node sát nhau", () => {
  const d = edgePath({ x: 0, y: 0, width: 10, height: 10 }, { x: 12, y: 0, width: 10, height: 10 });
  assert.ok(!d.includes("NaN"), "không tạo toạ độ NaN");
});

test("pruneCollapsed bỏ hết nhánh con của node đang thu gọn", () => {
  const tree = [node("root", [node("a", [node("a1")]), node("b", [node("b1")])])];
  const pruned = pruneCollapsed(tree, new Set(["a"]));
  assert.deepEqual(pruned[0].children[0].children, [], "node a không còn con");
  assert.equal(pruned[0].children[1].children[0].id, "b1", "nhánh khác giữ nguyên");
});

test("pruneCollapsed giữ nguyên cây khi không thu gọn gì", () => {
  const tree = [node("root", [node("a", [node("a1")])])];
  assert.equal(pruneCollapsed(tree, new Set())[0].children[0].children[0].id, "a1");
});
