/**
 * Thuật toán cây cho tab Lộ trình.
 *
 * Vì sao tách riêng khỏi `StudyMindmap.jsx`: đây là phần thuần tuý không phụ thuộc
 * React/React Flow nên có thể kiểm thử bằng `node --test` giống các util khác
 * (xem `tests/roadmapTree.test.js`). Dữ liệu lưu của roadmap vẫn là node/edge phẳng
 * của React Flow — hàm ở đây chỉ dựng lại quan hệ cha–con để hiển thị dạng tài liệu dọc.
 */

/** Thứ tự đổi trạng thái: Chưa học → Đang học → Đã thuộc → Chưa học. */
export const STATUS_CYCLE = ["pending", "progress", "mastered"];

/** Trạng thái kế tiếp của `status` (giá trị lạ cũng quay về "pending"). */
export const nextStatus = (status) => {
  const index = STATUS_CYCLE.indexOf(status);
  return STATUS_CYCLE[(index + 1) % STATUS_CYCLE.length];
};

/**
 * Dựng cây từ danh sách node/edge phẳng của React Flow.
 * Node cha = `source` của edge; node không có cha thành gốc.
 *
 * - Bỏ qua self-loop và edge trỏ tới node không còn tồn tại.
 * - Giữ thứ tự node đã lưu nên lộ trình không bị đảo khi mở lại.
 * - `visited` chống đệ quy vô hạn nếu người dùng tạo vòng trong chế độ Sơ đồ.
 */
export const buildRoadmapTree = (nodes = [], edges = []) => {
  const childrenOf = new Map();
  const hasParent = new Set();
  edges.forEach((edge) => {
    if (edge.source === edge.target) return;
    if (!childrenOf.has(edge.source)) childrenOf.set(edge.source, []);
    childrenOf.get(edge.source).push(edge.target);
    hasParent.add(edge.target);
  });
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const order = new Map(nodes.map((node, index) => [node.id, index]));
  const sortIds = (ids) =>
    ids
      .filter((id) => byId.has(id))
      .sort((a, b) => (order.get(a) ?? 0) - (order.get(b) ?? 0));
  const visited = new Set();
  const walk = (id, depth) => {
    if (visited.has(id)) return null;
    visited.add(id);
    const node = byId.get(id);
    if (!node) return null;
    return {
      ...node,
      depth,
      // `.filter(Boolean)` bắt buộc: khi cắt vòng lặp, `walk` trả null cho node đã xem.
      children: sortIds(childrenOf.get(id) || [])
        .map((childId) => walk(childId, depth + 1))
        .filter(Boolean),
    };
  };
  const roots = nodes
    .filter((node) => !hasParent.has(node.id))
    .map((node) => walk(node.id, 0))
    .filter(Boolean);
  // Node mồ côi vì nằm trong vòng kín: vẫn phải hiện để không mất dữ liệu người dùng.
  nodes.forEach((node) => {
    if (!visited.has(node.id)) {
      const orphan = walk(node.id, 0);
      if (orphan) roots.push(orphan);
    }
  });
  return roots;
};

/** Đếm số node theo trạng thái (trạng thái lạ hoặc thiếu tính vào "pending"). */
export const countByStatus = (nodes = []) =>
  nodes.reduce(
    (acc, node) => {
      const key = STATUS_CYCLE.includes(node.data?.status) ? node.data.status : "pending";
      acc[key] += 1;
      return acc;
    },
    { pending: 0, progress: 0, mastered: 0 },
  );

/** Phần trăm đã hoàn thành (node "mastered" trên tổng số node, làm tròn). */
export const progressPercent = (nodes = []) => {
  const { mastered } = countByStatus(nodes);
  return Math.round((mastered / Math.max(nodes.length, 1)) * 100);
};
