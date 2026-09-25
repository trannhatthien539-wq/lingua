/**
 * Sắp xếp cây lộ trình theo kiểu roadmap.sh: các nhánh thành **cột dọc song song**
 * nằm cạnh nhau theo bề ngang, nối với nhau bằng đường nét đứt.
 *
 * Vì sao cần thuật toán này: muốn giống roadmap.sh thì phải biết trước toạ độ từng node
 * (vì vậy mới vẽ được đường nối), nhưng vẫn muốn hiển thị thẳng trong trang chứ không
 * bỏ vào canvas. Vì vậy phần tính toạ độ tách riêng ở đây (thuần tuý, có test), còn phần
 * vẽ chỉ cần đặt `absolute` theo kết quả trả về.
 *
 * Thuật toán: tidy tree (Reingold–Tilford rút gọn).
 * - Mỗi node một ô cố định `nodeWidth` x `nodeHeight`, cách nhau `gapX` theo chiều ngang.
 * - Lá được xếp chồng dọc, không chồng lấn; node cha nằm giữa theo trục dọc của các con.
 * - Khoảng cách giữa hai lá liền kề là `gapY`.
 */

/** Kích thước ô mặc định. Có thể ghi đè khi render để vừa màn hình hẹp.
 *  - `nodeWidth` rộng hơn vì tiêu đề tiếng Việt dài; cho 2 dòng trước khi cắt.
 *  - `nodeHeight` phải đủ cho tên (2 dòng) + mô tả (2 dòng). Nút thao tác nằm
 *    chồng lên viền dưới nên không tính vào chiều cao này. */
export const LAYOUT_DEFAULTS = {
  nodeWidth: 260,
  nodeHeight: 96,
  gapX: 76,
  gapY: 22,
  padding: 10,
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/**
 * Tính toạ độ cho cây đã dàn sẵn (mỗi node có `children`).
 *
 * @param {Array} roots mảng node gốc (dựng từ `buildRoadmapTree`)
 * @param {object} options ghi đè `LAYOUT_DEFAULTS`
 * @returns {{nodes: Array, edges: Array, width: number, height: number}}
 *   `nodes` giữ nguyên field gốc, thêm `x`, `y`, `depth`, `parentId`.
 */
export const layoutRoadmap = (roots = [], options = {}) => {
  const config = { ...LAYOUT_DEFAULTS, ...options };
  const nodes = [];
  const edges = [];
  const columnStride = config.nodeWidth + config.gapX;
  let cursor = config.padding;

  const visit = (node, depth, parentId) => {
    const x = config.padding + depth * columnStride;
    let top;
    let bottom;

    if (node.children?.length) {
      const spans = node.children.map((child) => visit(child, depth + 1, node.id));
      top = spans[0].top;
      bottom = spans[spans.length - 1].bottom;
    } else {
      // Lá: xếp chồng dọc theo con trỏ đang chạy.
      top = cursor;
      bottom = cursor + config.nodeHeight;
      cursor = bottom + config.gapY;
    }

    // Node cha nằm giữa theo trục dọc của các con, nhưng bị kẹp trong khoảng con để
    // không lấn sang subtree kế bên ở cùng cột.
    const middle = (top + bottom) / 2 - config.nodeHeight / 2;
    const y = clamp(middle, top, bottom - config.nodeHeight);

    nodes.push({
      ...node,
      parentId,
      depth,
      x,
      y,
      width: config.nodeWidth,
      height: config.nodeHeight,
    });
    if (parentId) edges.push({ id: `${parentId}->${node.id}`, source: parentId, target: node.id });

    return { top: Math.min(top, y), bottom: Math.max(bottom, y + config.nodeHeight) };
  };

  (roots || []).forEach((root) => visit(root, 0, null));

  if (!nodes.length) {
    return { nodes, edges, width: 0, height: 0 };
  }

  const right = Math.max(...nodes.map((node) => node.x + node.width));
  const bottom = Math.max(...nodes.map((node) => node.y + node.height));
  return {
    nodes,
    edges,
    width: right + config.padding,
    height: bottom + config.padding,
  };
};

/**
 * Đường nối cha–con: khối bezier cong mềm, mỗi cạnh có `d` để đưa thẳng vào SVG.
 * `d` được sinh sẵn ở đây nên phần render không phải tính lại hình học.
 */
export const edgePath = (source, target, options = {}) => {
  const config = { ...LAYOUT_DEFAULTS, ...options };
  const x1 = source.x + source.width;
  const y1 = source.y + source.height / 2;
  const x2 = target.x;
  const y2 = target.y + target.height / 2;
  const distance = Math.max(x2 - x1, 24);
  // Độ cong phụ thuộc khoảng cách ngang: cột càng xa thì càng bung ra, giống roadmap.sh.
  const curve = Math.min(distance * 0.55, config.gapX * 1.1);
  return `M ${x1} ${y1} C ${x1 + curve} ${y1}, ${x2 - curve} ${y2}, ${x2} ${y2}`;
};

/**
 * Bỏ nhánh con của các node đang thu gọn, giữ nguyên phần còn lại của cây.
 *
 * Quan trọng: phải giữ `childCount` và cờ `collapsed` **trước khi** cắt bỏ `children`.
 * Nếu không, node đã thu gọn sẽ có `children = []` nên giao diện tưởng là lá, mất nút
 * mũi tên và người dùng không mở lại được nhánh đó nữa.
 */
export const pruneCollapsed = (tree, collapsed) =>
  (tree || []).map((node) => {
    const childCount = node.children?.length || 0;
    if (collapsed.has(node.id)) {
      return { ...node, childCount, collapsed: true, children: [] };
    }
    return {
      ...node,
      childCount,
      collapsed: false,
      children: pruneCollapsed(node.children, collapsed),
    };
  });
