import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  BrainCircuit,
  Check,
  ChevronDown,
  ChevronRight,
  Download,
  LoaderCircle,
  Pencil,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import ModuleHero from "../../components/ui/ModuleHero";
import { canUseAi, parseAiJson, requestAi } from "../../services/aiService";
import { useDebounce } from "../../hooks/useDebounce";
import { createDebouncedSync, loadUserDoc, userDocKeys } from "../../services/userDocService";
import { refreshRequestedEvent } from "../../services/syncStatus";
import { buildRoadmapTree, nextStatus, progressPercent } from "../../utils/roadmapTree";
import { edgePath, layoutRoadmap, pruneCollapsed } from "../../utils/roadmapLayout";

const STORAGE_KEY = "lingua-study-mindmap";
const PROVIDER_STORAGE = "lingua-ai-provider";
const statuses = {
  pending: "Chưa học",
  progress: "Đang học",
  mastered: "Đã thuộc",
};
// Nhãn ngắn + màu cho nút trạng thái kiểu roadmap.sh.
const statusMeta = {
  pending: {
    short: "Chưa học",
    action: "Bỏ qua",
    chip: "bg-ink/[0.06] text-ink/60 dark:bg-white/10 dark:text-white/60",
  },
  progress: {
    short: "Đang học",
    action: "Đang học",
    chip: "bg-warnbg text-warn dark:bg-amber-950/40 dark:text-amber-200",
  },
  mastered: {
    short: "Đã thuộc",
    action: "Hoàn thành",
    chip: "bg-okbg text-ok dark:bg-okdark dark:text-okfgdark",
  },
};
// Lưu ý: dữ liệu lưu của roadmap là `nodes` (id + data) và `edges` (id/source/target).
// Bản cũ từ lúc dùng React Flow còn `position`/`type`/handle trong payload; các trường đó
// vẫn được đọc được nhưng không còn dùng, và `mapSnapshot` sẽ loại bỏ khi lưu lại.

const initialNodes = [
  {
    id: "root",
    type: "topic",
    position: { x: 80, y: 250 },
    data: {
      label: "English Fluency",
      detail: "Mục tiêu chính",
      root: true,
      status: "progress",
      notes: "",
    },
  },
  {
    id: "vocabulary",
    type: "topic",
    position: { x: 390, y: 120 },
    data: {
      label: "Vocabulary",
      detail: "Từ vựng",
      status: "pending",
      notes: "",
    },
  },
  {
    id: "grammar",
    type: "topic",
    position: { x: 390, y: 360 },
    data: {
      label: "Grammar",
      detail: "Ngữ pháp",
      status: "pending",
      notes: "",
    },
  },
];
const initialEdges = [
  { id: "root-vocabulary", source: "root", target: "vocabulary" },
  { id: "root-grammar", source: "root", target: "grammar" },
];
const makeId = (prefix) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// Chỉ giữ `label/detail/status/notes` khi lưu: các trường callback của canvas cũ không
// lưu được, và `position`/`type` đã thành vô nghĩa nên bỏ đi cho payload gọn.
const mapSnapshot = (name, nodes, edges) => ({
  name,
  nodes: nodes.map((node) => ({
    id: node.id,
    data: {
      label: node.data?.label ?? "",
      detail: node.data?.detail ?? "",
      status: node.data?.status ?? "pending",
      notes: node.data?.notes ?? "",
    },
  })),
  // Edge chỉ cần quan hệ cha–con; source/target của bản cũ vẫn dùng được.
  edges: edges.map((edge) => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
  })),
});
const readMap = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved?.nodes?.length
      ? { ...saved, edges: saved.edges || [] }
      : {
          name: "English Fluency Roadmap",
          nodes: initialNodes,
          edges: initialEdges,
        };
  } catch {
    return {
      name: "English Fluency Roadmap",
      nodes: initialNodes,
      edges: initialEdges,
    };
  }
};
const roadmapPrompt = (topic) =>
  `Tạo sơ đồ lộ trình học theo dạng CÂY PHÂN NHÁNH (Hierarchical Tree) chuẩn cho chủ đề "${topic}".
- Chỉ tạo đúng 1 Node Gốc (Root) ở Level 0.
- Tạo 3-4 Node Nhóm lớn (Level 1) chia đều thành các nhánh trực tiếp từ Root.
- Tạo các Node Chi tiết (Level 2) gắn trực tiếp vào từng nhóm tương ứng, không nối tuần tự thành pipeline dọc.
- Mỗi node phải có parentId rõ ràng; Root có parentId là null.
Ví dụ với "12 Thì Tiếng Anh": Root "12 Thì Tiếng Anh" -> 3 nhóm "Hiện tại", "Quá khứ", "Tương lai" -> mỗi nhóm tỏa ra các thì cụ thể.
Chỉ trả về JSON hợp lệ, không markdown, schema: {"nodes":[{"id":"root-1","label":"...","parentId":null,"level":0,"detail":"..."},{"id":"group-1","label":"...","parentId":"root-1","level":1,"detail":"..."},{"id":"detail-1","label":"...","parentId":"group-1","level":2,"detail":"..."}],"edges":[{"id":"edge-1","source":"root-1","target":"group-1","parentId":"root-1"}]}.`;

/** Nút trạng thái kiểu roadmap.sh: bấm để đổi Chưa học → Đang học → Đã thuộc. */
function StatusPill({ status, onCycle }) {
  const meta = statusMeta[status] || statusMeta.pending;
  const dot =
    status === "mastered"
      ? "bg-ok"
      : status === "progress"
        ? "bg-warn"
        : "bg-ink/30 dark:bg-white/40";
  return (
    <button
      onClick={onCycle}
      title={`Đổi trạng thái (đang: ${meta.action})`}
      aria-label={`Trạng thái: ${statuses[status]}. Bấm để đổi.`}
      className={`chip shrink-0 gap-1.5 transition hover:brightness-95 ${meta.chip}`}
    >
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      {meta.short}
    </button>
  );
}

/** Màu ô theo trạng thái, bám theo tông của roadmap.sh (xanh lá/vàng/be). */
const nodeTone = {
  pending: "border-[#e6dcc4] bg-[#fdf6e4] dark:border-white/15 dark:bg-[#2a2822]",
  progress: "border-[#d9c53a] bg-[#ffe14d] dark:border-[#d9c53a]/60 dark:bg-[#4a4416]",
  mastered: "border-[#9ad3a4] bg-[#e7f7ec] dark:border-[#9ad3a4]/45 dark:bg-[#1f3327]",
};

/**
 * Lộ trình dạng đồ kiểu roadmap.sh: mỗi cấp là một **cột dọc**, các node xếp chồng
 * dọc trong cột và nối sang nhau bằng đường nét đứt.
 *
 * Vẫn nằm thẳng trong trang (không canvas, không zoom): chiều cao coi theo độ sâu cây
 * nên trang chỉ cuộn dọc như một tài liệu thường.
 */
function RoadmapGraph({
  nodes,
  edges,
  selectedId,
  onSelect,
  onCycleStatus,
  onAddChild,
  onEdit,
  onCommitEdit,
  onDelete,
  onOpenDetails,
}) {
  const [collapsed, setCollapsed] = useState(() => new Set());
  // Ô hẹp lại trên màn hình nhỏ để cây vẫn đọc được thay vì tràn ngang.
  const [compact, setCompact] = useState(false);
  const tree = useMemo(() => buildRoadmapTree(nodes, edges), [nodes, edges]);
  const visible = useMemo(() => pruneCollapsed(tree, collapsed), [collapsed, tree]);
  const options = useMemo(
    () => (compact ? { nodeWidth: 156, nodeHeight: 58, gapX: 44 } : undefined),
    [compact],
  );
  const layout = useMemo(() => layoutRoadmap(visible, options), [options, visible]);
  const positionOf = useMemo(
    () => new Map(layout.nodes.map((item) => [item.id, item])),
    [layout.nodes],
  );

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setCompact(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const toggle = (id) =>
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const toggleAll = (close) =>
    setCollapsed(close ? new Set(nodes.map((node) => node.id)) : new Set());

  if (!layout.nodes.length)
    return (
      <div className="rounded-2xl border border-dashed border-ink/15 p-10 text-center dark:border-white/15">
        <p className="text-sm text-ink/50 dark:text-white/50">
          Lộ trình đang trống. Bấm “Chủ đề gốc” để bắt đầu.
        </p>
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-xl bg-ink/[0.06] p-1 dark:bg-white/10">
          <button
            onClick={() => toggleAll(false)}
            className="btn-ghost !min-h-[40px] !rounded-lg px-3.5 !text-xs"
          >
            Mở hết
          </button>
          <button
            onClick={() => toggleAll(true)}
            className="btn-ghost !min-h-[40px] !rounded-lg px-3.5 !text-xs"
          >
            Thu gọn
          </button>
        </div>
        <p className="text-xs text-ink/45 dark:text-white/45">
          Bấm nhãn trạng thái để đổi · Bấm tên để mở ghi chú · Bấm đúp để đổi tên
        </p>
      </div>
      {/* Đồ vẽ: SVG nét đứt nằm dưới, node đặt tuyệt đối theo toạ độ đã tính sẵn.
          Cây sâu hơn bề ngang trang thì cuộn ngang thay vì bị cắt mất node. */}
      <div className="-mx-1 overflow-x-auto px-1 pb-2">
        <div
          className="relative"
          style={{ height: layout.height, width: layout.width, minWidth: "100%" }}
        >
        <svg
          className="pointer-events-none absolute left-0 top-0 overflow-visible"
          width={layout.width}
          height={layout.height}
          aria-hidden="true"
        >
          {layout.edges.map((edge) => {
            const source = positionOf.get(edge.source);
            const target = positionOf.get(edge.target);
            if (!source || !target) return null;
            return (
              <path
                key={edge.id}
                d={edgePath(source, target, options)}
                fill="none"
                className="stroke-sage"
                strokeWidth={2}
                strokeDasharray="2 6"
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        {layout.nodes.map((item) => (
          <RoadmapCard
            key={item.id}
            item={item}
            hasChildren={item.children.length > 0}
            isCollapsed={collapsed.has(item.id)}
            isSelected={selectedId === item.id}
            onToggle={toggle}
            onSelect={onSelect}
            onCycleStatus={onCycleStatus}
            onAddChild={onAddChild}
            onEdit={onEdit}
            onCommitEdit={onCommitEdit}
            onDelete={onDelete}
            onOpenDetails={onOpenDetails}
          />
        ))}
        </div>
      </div>
    </div>
  );
}

/** Một ô trong đồ: trạng thái, tên, mô tả và các nút thao tác. */
function RoadmapCard({
  item,
  hasChildren,
  isCollapsed,
  isSelected,
  onToggle,
  onSelect,
  onCycleStatus,
  onAddChild,
  onEdit,
  onCommitEdit,
  onDelete,
  onOpenDetails,
}) {
  const { id, data, x, y, width, height, depth } = item;
  const tone = nodeTone[data.status] || nodeTone.pending;
  return (
    <div
      className={`group absolute flex flex-col justify-center gap-0.5 rounded-xl border-2 px-2.5 shadow-sm transition ${tone} ${
        isSelected ? "ring-2 ring-sage ring-offset-2 dark:ring-offset-mist" : ""
      }`}
      style={{ left: x, top: y, width, height }}
    >
      <div className="flex items-center gap-1">
        {hasChildren ? (
          <button
            onClick={() => onToggle(id)}
            aria-expanded={!isCollapsed}
            aria-label={`${isCollapsed ? "Mở" : "Thu gọn"} nhánh ${data.label}`}
            className="-ml-1 grid h-6 w-6 shrink-0 place-items-center rounded-md text-ink/50 transition hover:bg-ink/10 dark:text-white/50 dark:hover:bg-white/15"
          >
            {isCollapsed ? <ChevronRight size={15} /> : <ChevronDown size={15} />}
          </button>
        ) : (
          <span aria-hidden="true" className="w-1.5 shrink-0" />
        )}
        <button
          onClick={() => onSelect(id)}
          onDoubleClick={() => onEdit(id)}
          className="min-w-0 flex-1 text-left"
        >
          {data.editing ? (
            <input
              autoFocus
              defaultValue={data.label}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => {
                if (event.key === "Enter")
                  onCommitEdit(id, event.currentTarget.value);
                if (event.key === "Escape") onEdit(null);
              }}
              onBlur={(event) => onCommitEdit(id, event.currentTarget.value)}
              className="w-full rounded border-2 border-sage bg-transparent px-1 text-sm font-bold outline-none"
            />
          ) : (
            <>
              <span
                className={`block truncate font-bold text-ink dark:text-white ${
                  depth === 0 ? "text-base" : "text-sm"
                }`}
              >
                {data.label}
              </span>
              {data.detail && (
                <span className="mt-0.5 block truncate text-[11px] leading-tight text-ink/60 dark:text-white/60">
                  {data.detail}
                </span>
              )}
            </>
          )}
        </button>
        {data.status === "mastered" && (
          <Check size={14} className="shrink-0 text-ok dark:text-okfgdark" />
        )}
        <StatusPill status={data.status} onCycle={() => onCycleStatus(id)} />
      </div>
      <div className="flex items-center gap-0.5 pl-0.5 opacity-0 transition focus-within:opacity-100 group-hover:opacity-100">
        <button
          onClick={() => onAddChild(id)}
          className="icon-btn !h-7 !w-7"
          aria-label={`Thêm nhánh con cho ${data.label}`}
          title="Thêm nhánh con"
        >
          <Plus size={13} />
        </button>
        <button
          onClick={() => onEdit(id)}
          className="icon-btn !h-7 !w-7"
          aria-label={`Đổi tên ${data.label}`}
          title="Đổi tên"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => onOpenDetails(id)}
          className="icon-btn !h-7 !w-7"
          aria-label={`Ghi chú cho ${data.label}`}
          title="Ghi chú"
        >
          <BookOpen size={13} />
        </button>
        <button
          onClick={() => onDelete(id)}
          className="icon-btn !h-7 !w-7 text-danger hover:bg-dangerbg dark:text-dangerfgdark dark:hover:bg-dangerdark"
          aria-label={`Xoá ${data.label}`}
          title="Xoá"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

function StudyDrawer({ node, onClose, onSaveNotes, onPractice }) {
  const [notes, setNotes] = useState(node?.data.notes || "");
  const [dragOffset, setDragOffset] = useState(0);
  const dragStart = useRef(null);
  useEffect(
    () => setNotes(node?.data.notes || ""),
    [node?.id, node?.data.notes],
  );
  if (!node) return null;
  const handleTouchStart = (event) => {
    dragStart.current = event.touches[0].clientY;
  };
  const handleTouchMove = (event) => {
    if (dragStart.current === null) return;
    setDragOffset(Math.max(0, event.touches[0].clientY - dragStart.current));
  };
  const handleTouchEnd = () => {
    if (dragOffset > 80) onClose();
    setDragOffset(0);
    dragStart.current = null;
  };
  return (
    <aside
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ transform: `translateY(${dragOffset}px)` }}
      className="fixed bottom-0 left-0 right-0 z-[70] max-h-[75vh] w-full overflow-y-auto rounded-t-2xl border-t border-ink/[0.08] bg-white p-5 shadow-2xl transition-transform md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-full md:max-w-sm md:rounded-none md:rounded-l-2xl md:border-l md:border-t-0 md:p-6 md:!transform-none dark:border-white/[0.08] dark:bg-[#1b211f]"
    >
      <div className="mx-auto mb-4 h-1.5 w-12 touch-none rounded-full bg-ink/15 md:hidden dark:bg-white/20" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Chi tiết chủ điểm</p>
          <h2 className="mt-1 font-display text-xl font-bold">
            {node.data.label}
          </h2>
          <p className="mt-1 text-xs text-ink/40 dark:text-white/40">
            {statuses[node.data.status]}
          </p>
        </div>
        <button onClick={onClose} aria-label="Đóng panel">
          <X size={18} />
        </button>
      </div>
      <label className="mt-8 block">
        <span className="mb-2 block text-xs font-bold text-ink/60 dark:text-white/60">
          Ghi chú Markdown / công thức
        </span>
        <textarea
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Ghi công thức, ví dụ hoặc danh sách từ..."
          className="min-h-64 w-full resize-y rounded-xl border border-ink/[0.1] bg-transparent p-3 text-sm leading-6 outline-none focus:border-ink/30 dark:border-white/[0.1]"
        />
      </label>
      <button
        onClick={() => onSaveNotes(node.id, notes)}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-bold text-white dark:bg-lime dark:text-ink"
      >
        <Save size={15} />
        Lưu ghi chú
      </button>
      <button
        onClick={() => {
          onPractice(node.data.label);
          onClose();
        }}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-b-4 border-sage py-3 text-sm font-bold text-sage active:translate-y-[2px]"
      >
        <Sparkles size={15} />
        Luyện tập chủ điểm này
      </button>
    </aside>
  );
}

export default function StudyMindmap({ apiKey }) {
  const saved = readMap();
  const [mapName, setMapName] = useState(
    saved.name || "English Fluency Roadmap",
  );
  const [nodes, setNodes] = useState(saved.nodes);
  const [edges, setEdges] = useState(saved.edges);
  const [selectedId, setSelectedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const debouncedTopic = useDebounce(topic);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const mindmapSync = useMemo(() => createDebouncedSync(userDocKeys.mindmap), []);
  const [cloudReady, setCloudReady] = useState(false);
  const cloudVersionRef = useRef(0);
  const lastCloudRef = useRef(null);
  const hydrateFromCloud = useCallback(async () => {
    try {
      const doc = await loadUserDoc(userDocKeys.mindmap);
      if (doc?.payload?.nodes?.length && Number(doc.updatedAt) > cloudVersionRef.current) {
        cloudVersionRef.current = Number(doc.updatedAt);
        lastCloudRef.current = JSON.stringify(doc.payload);
        setMapName(doc.payload.name || "English Fluency Roadmap");
        setNodes(doc.payload.nodes);
        setEdges(doc.payload.edges || []);
      }
    } catch {
      // Không tải được thì giữ nguyên bản trên thiết bị.
    } finally {
      setCloudReady(true);
    }
  }, [setEdges, setNodes]);
  useEffect(() => {
    hydrateFromCloud();
  }, [hydrateFromCloud]);
  useEffect(() => {
    mindmapSync.attach();
    return () => mindmapSync.dispose();
  }, [mindmapSync]);
  useEffect(() => {
    const handleRefresh = () => hydrateFromCloud();
    window.addEventListener(refreshRequestedEvent, handleRefresh);
    return () => window.removeEventListener(refreshRequestedEvent, handleRefresh);
  }, [hydrateFromCloud]);
  const selectedNode = nodes.find((node) => node.id === selectedId);
  const progress = useMemo(() => progressPercent(nodes), [nodes]);
  const updateStatus = useCallback(
    (id) =>
      setNodes((current) =>
        current.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, status: nextStatus(node.data.status) } }
            : node,
        ),
      ),
    [setNodes],
  );
  const removeNode = useCallback(
    (id = selectedId) => {
      if (!id) return;
      const hasChildren = edges.some((edge) => edge.source === id);
      if (hasChildren && !window.confirm("Node này có nhánh con. Xóa node và các liên kết của nó?")) return;
      setNodes((current) => current.filter((node) => node.id !== id));
      setEdges((current) =>
        current.filter((edge) => edge.source !== id && edge.target !== id),
      );
      if (selectedId === id) {
        setSelectedId(null);
        setDrawerOpen(false);
      }
    },
    [edges, selectedId, setEdges, setNodes],
  );
  const createNode = useCallback((label, parentId = null) => {
    const node = {
      id: makeId("node"),
      // `position`/`type` cũ từ lúc dùng React Flow: giữ lại cho tương thích dữ liệu đã lưu.
      type: "topic",
      position: { x: 0, y: 0 },
      data: {
        label,
        detail: "Chủ điểm mới",
        status: "pending",
        notes: "",
      },
    };
    setNodes((current) => [...current, node]);
    if (parentId)
      setEdges((current) => [
        ...current,
        { id: `${parentId}-${node.id}`, source: parentId, target: node.id },
      ]);
    setSelectedId(node.id);
    return node.id;
  }, []);
  // Thêm nhánh con rồi vào thẳng chế độ sửa tên để người dùng gõ ngay.
  const addChild = useCallback(
    (parentId) => {
      const newId = createNode("Chủ điểm mới", parentId);
      setEditingId(newId);
    },
    [createNode],
  );
  const commitEdit = useCallback(
    (id, label) => {
      if (label.trim()) setNodes((current) => current.map((node) => node.id === id ? { ...node, data: { ...node.data, label: label.trim() } } : node));
      setEditingId(null);
    },
    [setNodes],
  );
  const openNodeDetails = useCallback((id) => {
    setSelectedId(id);
    setDrawerOpen(true);
  }, []);
  const decoratedNodes = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          editing: editingId === node.id,
          selected: selectedId === node.id,
        },
      })),
    [editingId, nodes, selectedId],
  );
  useEffect(() => {
    const payload = mapSnapshot(mapName, nodes, edges);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Bỏ qua khi localStorage đầy.
    }
    if (!cloudReady) return;
    const serialized = JSON.stringify(payload);
    if (serialized === lastCloudRef.current) return;
    lastCloudRef.current = serialized;
    cloudVersionRef.current = Date.now();
    mindmapSync.schedule(payload);
  }, [cloudReady, edges, mapName, mindmapSync, nodes]);
  useEffect(() => {
    const handleShortcut = (event) => {
      if (!selectedId || ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        removeNode();
      }
      if (event.key === "Tab") {
        event.preventDefault();
        addChild(selectedId);
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [addChild, removeNode, selectedId]);
  const saveMap = () => {
    const payload = mapSnapshot(mapName, nodes, edges);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Bỏ qua khi localStorage đầy.
    }
    lastCloudRef.current = JSON.stringify(payload);
    cloudVersionRef.current = Date.now();
    mindmapSync.schedule(payload);
    setStatus("Đang lưu sơ đồ lên tài khoản...");
    mindmapSync
      .flush()
      .then(() => setStatus("Đã lưu sơ đồ lên tài khoản."))
      .catch((error) => setStatus(error?.message || "Không thể lưu sơ đồ lên tài khoản."));
  };
  const loadMap = () => {
    const next = readMap();
    setMapName(next.name);
    setNodes(next.nodes);
    setEdges(next.edges);
    setSelectedId(null);
    setStatus("Đã tải sơ đồ.");
  };
  // Xuất lộ trình ra file Markdown — không cần canvas nên nhẹ hơn xuất ảnh.
  const exportMarkdown = () => {
    const lines = [`# ${mapName || "Lộ trình"}`, ""];
    const walk = (list) => {
      list.forEach((item, index) => {
        const box = item.data.status === "mastered" ? "x" : " ";
        const detail = item.data.detail ? ` — ${item.data.detail}` : "";
        lines.push(`${"  ".repeat(item.depth)}- [${box}] **${item.data.label}**${detail}`);
        walk(item.children);
        if (index === list.length - 1) lines.push("");
      });
    };
    walk(buildRoadmapTree(nodes, edges));
    const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(mapName || "lo-trinh").replace(/\s+/g, "-").toLowerCase()}.md`;
    link.click();
    URL.revokeObjectURL(url);
    setStatus("Đã xuất lộ trình ra file Markdown.");
  };
  const generateRoadmap = async () => {
    if (!debouncedTopic.trim()) return setError("Hãy nhập chủ đề roadmap.");
    if (!canUseAi(apiKey, localStorage.getItem(PROVIDER_STORAGE) || "gemini"))
      return setError("Hãy lưu API key trong Cài đặt API trước.");
    setLoading(true);
    setError("");
    try {
      const raw = await requestAi(
        localStorage.getItem(PROVIDER_STORAGE) || "gemini",
        apiKey,
        roadmapPrompt(debouncedTopic),
        { json: true },
      );
      const result = parseAiJson(raw);
      setNodes(
        result.nodes.map((item, index) => ({
          id: item.id || `ai-${index}`,
          type: "topic",
          position: { x: 0, y: 0 },
          data: {
            label: item.label,
            detail: item.detail || "AI roadmap",
            status: "pending",
            notes: "",
          },
        })),
      );
      // Chỉ giữ id/source/target: phần trình bày (type, marker, handle) là của canvas cũ.
      setEdges(
        (result.edges || []).map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
        })),
      );
      setStatus("Đã tạo roadmap bằng AI.");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };
  const addRootNode = () => {
    const newId = createNode("Chủ đề gốc mới");
    setEditingId(newId);
  };
  return (
    <div className="space-y-5">
      <ModuleHero
        icon={BrainCircuit}
        eyebrow="Lộ trình học tập"
        title={mapName || "Roadmap học tập"}
        description="Biến mục tiêu thành các nhánh nhỏ, cập nhật tiến độ và mở rộng lộ trình theo cách của bạn."
        accent="#2b70c9"
        deep="#174b8a"
        illustration="mindmap"
        progress={progress}
        progressLabel="Chủ điểm đã hoàn thành"
        stats={[{ label: 'Chủ điểm', value: nodes.length }, { label: 'Mục con', value: edges.length }, { label: 'Đã hoàn thành', value: `${progress}%` }]}
        action="Lưu lộ trình"
        onAction={saveMap}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <input
            value={mapName}
            onChange={(event) => setMapName(event.target.value)}
            aria-label="Tên lộ trình"
            className="w-full min-w-0 max-w-full border-b-2 border-transparent bg-transparent font-display text-2xl font-bold tracking-tight outline-none transition focus:border-sage sm:text-3xl"
          />
          <p className="mt-1 text-sm text-ink/45 dark:text-white/45">
            Bấm nhãn trạng thái để đổi · Bấm tên để mở ghi chú · Bấm đúp để đổi tên
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={addRootNode}
            className="flex items-center gap-2 rounded-xl border border-ink/[0.1] px-3 py-2.5 text-xs font-bold dark:border-white/[0.1]"
          >
            <Plus size={15} />
            Chủ đề gốc
          </button>
          <button
            onClick={exportMarkdown}
            className="flex items-center gap-2 rounded-xl border border-ink/[0.1] px-3 py-2.5 text-xs font-bold dark:border-white/[0.1]"
          >
            <Download size={15} />
            Xuất Markdown
          </button>
          <button
            onClick={loadMap}
            className="grid h-10 w-10 place-items-center rounded-xl border border-ink/[0.1] dark:border-white/[0.1]"
            aria-label="Tải lại bản đã lưu"
            title="Tải lại bản đã lưu"
          >
            <Upload size={15} />
          </button>
          <button
            onClick={saveMap}
            className="flex items-center gap-2 rounded-xl bg-ink px-3 py-2.5 text-xs font-bold text-white dark:bg-lime dark:text-ink"
          >
            <Save size={15} />
            Lưu
          </button>
        </div>
      </div>
      <section className="panel flex flex-wrap items-end gap-3 p-4">
        <div className="min-w-56 flex-1">
          <label className="eyebrow">Tạo lộ trình bằng AI</label>
          <input
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            placeholder="Nhập chủ đề lộ trình muốn tạo..."
            className="mt-2 w-full rounded-xl border border-ink/[0.1] bg-transparent px-3 py-2.5 text-sm outline-none dark:border-white/[0.1]"
          />
        </div>
        <button
          onClick={generateRoadmap}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-lime px-4 py-3 text-sm font-bold text-ink disabled:opacity-60"
        >
          {loading ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <Sparkles size={16} />
          )}
          {loading ? "Đang tạo..." : "Tạo lộ trình bằng AI"}
        </button>
      </section>
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-200">
          {error}
        </p>
      )}
      <RoadmapGraph
        nodes={decoratedNodes}
        edges={edges}
        selectedId={selectedId}
        onSelect={openNodeDetails}
        onCycleStatus={updateStatus}
        onAddChild={addChild}
        onEdit={setEditingId}
        onCommitEdit={commitEdit}
        onDelete={removeNode}
        onOpenDetails={openNodeDetails}
      />
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink/45 dark:text-white/45">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-emerald-600">{progress}% hoàn thành</span>
          <span>·</span>
          <span>{nodes.length} chủ điểm</span>
          <span>·</span>
          <span>{edges.length} mục con</span>
        </span>
        <span>Tab thêm nhánh con · Delete xoá mục đang chọn</span>
      </div>
      {status && (
        <p role="status" aria-live="polite" className="rounded-xl bg-[#e6f3e8] p-3 text-sm text-[#568460] dark:bg-[#293f31] dark:text-[#a9d5af]">
          {status}
        </p>
      )}
      {drawerOpen && (
        <StudyDrawer
          node={selectedNode}
          onClose={() => setDrawerOpen(false)}
          onSaveNotes={(id, notes) => {
            setNodes((current) =>
              current.map((node) =>
                node.id === id
                  ? { ...node, data: { ...node.data, notes } }
                  : node,
              ),
            );
            setStatus("Đã lưu ghi chú.");
          }}
          onPractice={(label) =>
            setStatus(`Mở luyện tập chủ điểm: ${label}`)
          }
        />
      )}
    </div>
  );
}
