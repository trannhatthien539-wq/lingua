import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  Check,
  Download,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  LoaderCircle,
  Maximize2,
  Minus,
  Pencil,
  Plus,
  Save,
  Sparkles,
  Trash2,
  Upload,
  X,
  ZoomIn,
} from "lucide-react";
import {
  addEdge,
  Background,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import { toPng } from "html-to-image";
import dagre from "dagre";
import "@xyflow/react/dist/style.css";
import { parseAiJson, requestAi } from "../../services/aiService";
import { useDebounce } from "../../hooks/useDebounce";

const STORAGE_KEY = "lingua-study-mindmap";
const PROVIDER_STORAGE = "lingua-ai-provider";
const NODE_WIDTH = 260;
const NODE_HEIGHT = 100;
const statuses = {
  pending: "Chưa học",
  progress: "Đang học",
  mastered: "Đã thuộc",
};
const statusClasses = {
  pending: "border-slate-300 bg-white dark:border-white/20 dark:bg-[#29332f]",
  progress:
    "border-amber-400 bg-amber-50 shadow-amber-100 dark:bg-amber-950/30",
  mastered: "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/30",
};
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
  {
    id: "root-vocabulary",
    source: "root",
    target: "vocabulary",
    type: "smoothstep",
    sourceHandle: "bottom-source",
    targetHandle: "top-target",
    style: { stroke: "#94a3b8", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: "root-grammar",
    source: "root",
    target: "grammar",
    type: "smoothstep",
    sourceHandle: "bottom-source",
    targetHandle: "top-target",
    style: { stroke: "#94a3b8", strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed },
  },
];
const makeId = (prefix) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
const readMap = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved?.nodes?.length
      ? {
          ...saved,
          edges: (saved.edges || []).map((edge) => ({
            ...edge,
            sourceHandle: edge.sourceHandle?.endsWith("-source")
              ? edge.sourceHandle
              : edge.sourceHandle
                ? `${edge.sourceHandle}-source`
                : edge.sourceHandle,
            targetHandle: edge.targetHandle?.endsWith("-target")
              ? edge.targetHandle
              : edge.targetHandle
                ? `${edge.targetHandle}-target`
                : edge.targetHandle,
          })),
        }
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

const edgeStyle = { stroke: "#94a3b8", strokeWidth: 2 };
const edgeHandles = (direction) => direction === "LR"
  ? { sourceHandle: "right-source", targetHandle: "left-target" }
  : { sourceHandle: "bottom-source", targetHandle: "top-target" };

export const getLayoutedElements = (nodes, edges, direction = "LR") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction, ranksep: 80, nodesep: 40 });
  nodes.forEach((node) => dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT }));
  edges.forEach((edge) => dagreGraph.setEdge(edge.source, edge.target));
  dagre.layout(dagreGraph);
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return { ...node, position: { x: nodeWithPosition.x - NODE_WIDTH / 2, y: nodeWithPosition.y - NODE_HEIGHT / 2 } };
  });
  const layoutedEdges = edges.map((edge) => ({
    ...edge,
    type: "smoothstep",
    ...edgeHandles(direction),
    pathOptions: { borderRadius: 16 },
    style: edgeStyle,
  }));
  return { nodes: layoutedNodes, edges: layoutedEdges };
};

function RoadmapNode({ id, data }) {
  const directions = [
    ["top", Position.Top],
    ["right", Position.Right],
    ["bottom", Position.Bottom],
    ["left", Position.Left],
  ];
  return (
    <div
      onContextMenu={(event) => {
        event.preventDefault();
        data.onCycleStatus(id);
      }}
      onDoubleClick={() => data.onEdit(id)}
      className={`group relative flex w-[260px] min-h-[90px] max-h-[140px] flex-col justify-center rounded-2xl border-2 bg-white p-3 shadow-sm transition ${statusClasses[data.status] || statusClasses.pending} ${data.status === "progress" ? "animate-pulse" : ""}`}
    >
      {data.selected && (
        <div className="nodrag nopan absolute -top-14 left-1/2 z-30 flex -translate-x-1/2 gap-1 rounded-2xl border border-zinc-200 bg-white/95 p-1 shadow-md backdrop-blur dark:border-white/10 dark:bg-[#202724]/95">
          <button
            onClick={(event) => {
              event.stopPropagation();
              data.onAddChild(id);
            }}
            className="grid h-9 w-9 place-items-center rounded-xl text-ink/70 hover:bg-zinc-100 dark:text-white/70 dark:hover:bg-white/10"
            aria-label="Thêm nhánh con"
            title="Thêm nhánh con"
          >
            <Plus size={17} />
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation();
              data.onEdit(id);
            }}
            className="grid h-9 w-9 place-items-center rounded-xl text-ink/70 hover:bg-zinc-100 dark:text-white/70 dark:hover:bg-white/10"
            aria-label="Đổi tên node"
            title="Đổi tên node"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation();
              data.onOpenDetails(id);
            }}
            className="grid h-9 w-9 place-items-center rounded-xl text-ink/70 hover:bg-zinc-100 dark:text-white/70 dark:hover:bg-white/10"
            aria-label="Mở ghi chú node"
            title="Mở ghi chú node"
          >
            <BookOpen size={16} />
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation();
              data.onDelete(id);
            }}
            className="grid h-9 w-9 place-items-center rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            aria-label="Xóa node"
            title="Xóa node"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
      {directions.map(([direction, position]) => (
        <span key={direction}>
          <Handle
            id={`${direction}-target`}
            type="target"
            position={position}
            isConnectable
            className="!h-2 !w-2 !border-0 !bg-sage opacity-30 transition-opacity group-hover:opacity-100"
          />
          <Handle
            id={`${direction}-source`}
            type="source"
            position={position}
            isConnectable
            className="!z-10 !h-2 !w-2 !border-0 !bg-sage opacity-30 transition-opacity group-hover:opacity-100"
          />
        </span>
      ))}
      <div className="flex items-start gap-2">
        <BrainCircuit size={16} className="mt-0.5 shrink-0 text-sage" />
        <div className="min-w-0">
          {data.editing ? (
            <input
              autoFocus
              defaultValue={data.label}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => {
                if (event.key === "Enter")
                  data.onCommitEdit(id, event.currentTarget.value);
              }}
              onBlur={(event) =>
                data.onCommitEdit(id, event.currentTarget.value)
              }
              className="w-32 rounded border border-ink/20 bg-transparent px-1 text-sm font-bold outline-none"
            />
          ) : (
            <p className="line-clamp-1 font-bold text-sm text-slate-800">{data.label}</p>
          )}
          <p className="mt-1 whitespace-normal break-words text-xs leading-relaxed text-slate-500 line-clamp-3 dark:text-white/45">
            {data.detail || statuses[data.status]}
          </p>
        </div>
        {data.status === "mastered" && (
          <Check size={16} className="ml-auto shrink-0 text-emerald-600" />
        )}
      </div>
      <button
        onClick={(event) => {
          event.stopPropagation();
          data.onCycleStatus(id);
        }}
        className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full border border-white bg-white text-xs shadow opacity-0 transition group-hover:opacity-100 dark:border-[#202a26] dark:bg-[#202a26]"
        title="Đổi trạng thái"
      >
        {data.status === "mastered"
          ? "🟢"
          : data.status === "progress"
            ? "🟡"
            : "⚪"}
      </button>
      {directions.map(([direction]) => (
        <button
          key={direction}
          onClick={(event) => {
            event.stopPropagation();
            data.onQuickAdd(id, direction);
          }}
          className={`absolute ${direction === "top" ? "-top-4 left-1/2 -translate-x-1/2" : direction === "right" ? "-right-4 top-1/2 -translate-y-1/2" : direction === "bottom" ? "-bottom-4 left-1/2 -translate-x-1/2" : "-left-4 top-1/2 -translate-y-1/2"} grid h-7 w-7 place-items-center rounded-full bg-ink text-white opacity-0 shadow transition group-hover:opacity-100 dark:bg-lime dark:text-ink`}
          aria-label={`Thêm nhánh ${direction}`}
        >
          <Plus size={14} />
        </button>
      ))}
    </div>
  );
}

function MobileOutliner({ nodes, edges, onSelect, view, onViewChange }) {
  const [collapsed, setCollapsed] = useState(() => new Set());
  const children = useMemo(() => edges.reduce((map, edge) => ({ ...map, [edge.source]: [...(map[edge.source] || []), edge.target] }), {}), [edges]);
  const byId = useMemo(() => Object.fromEntries(nodes.map((node) => [node.id, node])), [nodes]);
  const roots = nodes.filter((node) => !edges.some((edge) => edge.target === node.id));
  const toggleAll = (close) => setCollapsed(close ? new Set(nodes.map((node) => node.id)) : new Set());
  const renderNode = (node, depth = 0) => {
    const childIds = children[node.id] || [];
    const isCollapsed = collapsed.has(node.id);
    return <div key={node.id} className="relative"><button onClick={() => onSelect(node.id)} className="flex min-h-12 w-full items-center gap-2 border-b border-zinc-200/70 py-3 text-left dark:border-white/10" style={{ paddingLeft: `${depth * 18 + 8}px` }}><span onClick={(event) => { event.stopPropagation(); setCollapsed((current) => { const next = new Set(current); isCollapsed ? next.delete(node.id) : next.add(node.id); return next; }); }} className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-zinc-100 text-zinc-500 dark:bg-white/10 dark:text-white/60">{childIds.length ? (isCollapsed ? <ChevronRight size={15} /> : <ChevronDown size={15} />) : <span className="h-1.5 w-1.5 rounded-full bg-teal-600" />}</span><span className="min-w-0 flex-1"><strong className="block truncate text-sm text-zinc-900 dark:text-white">{node.data.label}</strong><small className="block truncate text-xs text-zinc-500">{node.data.detail}</small></span></button>{!isCollapsed && childIds.map((id) => byId[id] && renderNode(byId[id], depth + 1))}</div>;
  };
  return <div className="md:hidden"><div className="mb-3 flex items-center justify-between gap-2"><div className="flex rounded-xl bg-zinc-100 p-1 dark:bg-white/10"><button onClick={() => onViewChange('tree')} className={`rounded-lg px-3 py-2 text-xs font-bold ${view === 'tree' ? 'bg-white shadow-sm dark:bg-[#29332f]' : 'text-zinc-500'}`}>Xem dạng cây</button><button onClick={() => onViewChange('canvas')} className={`rounded-lg px-3 py-2 text-xs font-bold ${view === 'canvas' ? 'bg-white shadow-sm dark:bg-[#29332f]' : 'text-zinc-500'}`}>Canvas</button></div><div className="flex gap-1"><button onClick={() => toggleAll(false)} className="rounded-lg border border-zinc-200 px-2 py-2 text-[10px] font-bold dark:border-white/10">Mở hết</button><button onClick={() => toggleAll(true)} className="rounded-lg border border-zinc-200 px-2 py-2 text-[10px] font-bold dark:border-white/10">Thu gọn</button></div></div>{view === 'tree' && <div className="rounded-xl border border-zinc-200/80 bg-white px-2 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:border-white/10 dark:bg-[#202724]">{roots.map((node) => renderNode(node))}</div>}</div>;
}
const nodeTypes = { topic: RoadmapNode };

function RoadmapCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onSelect,
  canvasRef,
  onViewportChange,
  onPaneClick,
  onEdgeClick,
  onEdgeDoubleClick,
  onFitViewReady,
  onAddRoot,
}) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const clickTimer = useRef(null);
  useEffect(() => onFitViewReady(fitView), [fitView, onFitViewReady]);
  return (
    <div
      ref={canvasRef}
      className="relative h-[600px] w-full overflow-hidden rounded-2xl border border-ink/[0.08] bg-[#f0f3ed] dark:border-white/[0.08] dark:bg-[#202a26]"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => {
          window.clearTimeout(clickTimer.current);
          clickTimer.current = window.setTimeout(() => onSelect(node.id), 220);
        }}
        onNodeDoubleClick={(_, node) => {
          window.clearTimeout(clickTimer.current);
          node.data.onEdit(node.id);
        }}
        onPaneClick={onPaneClick}
        onEdgeClick={(_, edge) => onEdgeClick(edge.id)}
        onEdgeDoubleClick={(_, edge) => onEdgeDoubleClick(edge.id)}
        onViewportChange={onViewportChange}
        panOnDrag={[0, 1]}
        panActivationKeyCode="Space"
        nodesDraggable
        selectNodesOnDrag={false}
        selectionOnDrag={false}
        zoomOnScroll
        connectionLineType="smoothstep"
        deleteKeyCode={["Backspace", "Delete"]}
        nodeExtent={[[-800, -800], [2300, 2500]]}
        translateExtent={[[-1000, -800], [2300, 2500]]}
        minZoom={0.4}
        maxZoom={1.5}
        defaultViewport={{ x: 100, y: 100, zoom: 0.9 }}
        defaultEdgeOptions={{ type: "smoothstep", animated: false, pathOptions: { borderRadius: 16 }, style: edgeStyle }}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#9aaa9c" gap={22} size={1} />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(node) =>
            node.data.status === "mastered"
              ? "#10b981"
              : node.data.status === "progress"
                ? "#f59e0b"
                : "#94a3b8"
          }
        />
      </ReactFlow>
      <div className="pointer-events-none absolute left-4 top-4 z-10 rounded-xl bg-white/90 px-3 py-2 shadow-sm dark:bg-[#1b211f]/90">
        <p className="text-[10px] font-bold uppercase tracking-wider text-ink/40 dark:text-white/40">
          % Hoàn thành lộ trình
        </p>
        <p className="mt-0.5 font-display text-lg font-bold text-emerald-600">
          {Math.round(
            (nodes.filter((node) => node.data.status === "mastered").length /
              Math.max(nodes.length, 1)) *
              100,
          )}
          %
        </p>
      </div>
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-xl bg-white/90 p-1.5 shadow-lg dark:bg-[#1b211f]/90">
        <button
          onClick={zoomOut}
          className="pointer-events-auto grid h-8 w-8 place-items-center rounded-lg hover:bg-ink/10 dark:hover:bg-white/10"
        >
          <Minus size={15} />
        </button>
        <button
          onClick={zoomIn}
          className="pointer-events-auto grid h-8 w-8 place-items-center rounded-lg hover:bg-ink/10 dark:hover:bg-white/10"
        >
          <ZoomIn size={15} />
        </button>
        <button
          onClick={fitView}
          className="pointer-events-auto grid h-8 w-8 place-items-center rounded-lg hover:bg-ink/10 dark:hover:bg-white/10"
        >
          <Maximize2 size={15} />
        </button>
      </div>
      <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 rounded-2xl border border-zinc-200 bg-white/95 p-1.5 shadow-md backdrop-blur md:hidden dark:border-white/10 dark:bg-[#1b211f]/95">
        <button onClick={zoomIn} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-ink/10 dark:hover:bg-white/10" aria-label="Phóng to">
          <Plus size={18} />
        </button>
        <button onClick={zoomOut} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-ink/10 dark:hover:bg-white/10" aria-label="Thu nhỏ">
          <Minus size={18} />
        </button>
        <button onClick={fitView} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-ink/10 dark:hover:bg-white/10" aria-label="Căn giữa sơ đồ">
          <Maximize2 size={17} />
        </button>
        <button onClick={onAddRoot} className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-white dark:bg-lime dark:text-ink" aria-label="Thêm chủ đề gốc">
          <Plus size={18} />
        </button>
      </div>
    </div>
  );
}

function StudyDrawer({ node, onClose, onSaveNotes, onPractice }) {
  const [notes, setNotes] = useState(node?.data.notes || "");
  useEffect(
    () => setNotes(node?.data.notes || ""),
    [node?.id, node?.data.notes],
  );
  if (!node) return null;
  return (
    <aside className="fixed bottom-0 left-0 right-0 z-50 max-h-[75vh] w-full overflow-y-auto rounded-t-2xl border-t border-ink/[0.08] bg-white p-5 shadow-2xl md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-full md:max-w-sm md:rounded-none md:rounded-l-2xl md:border-l md:border-t-0 md:p-6 dark:border-white/[0.08] dark:bg-[#1b211f]">
      <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-ink/15 md:hidden dark:bg-white/20" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Study drawer</p>
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
  const [nodes, setNodes, onNodesChange] = useNodesState(saved.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(saved.edges);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const debouncedTopic = useDebounce(topic);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [layoutDirection, setLayoutDirection] = useState("TB");
  const [mobileView, setMobileView] = useState("tree");
  const [viewport, setViewport] = useState({ x: 100, y: 100, zoom: 0.9 });
  const canvasRef = useRef(null);
  const fitViewRef = useRef(null);
  const selectedNode = nodes.find((node) => node.id === selectedId);
  const progress = Math.round(
    (nodes.filter((node) => node.data.status === "mastered").length /
      Math.max(nodes.length, 1)) *
      100,
  );
  const updateStatus = useCallback(
    (id) =>
      setNodes((current) =>
        current.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  status:
                    node.data.status === "pending"
                      ? "progress"
                      : node.data.status === "progress"
                        ? "mastered"
                        : "pending",
                },
              }
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
  const createNode = useCallback(
    (label, position, parentId = null) => {
      const node = {
        id: makeId("node"),
        type: "topic",
        position,
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
          {
            id: `${parentId}-${node.id}`,
            source: parentId,
            target: node.id,
            type: "smoothstep",
            animated: false,
            ...edgeHandles(layoutDirection),
            pathOptions: { borderRadius: 16 },
            style: edgeStyle,
            markerEnd: { type: MarkerType.ArrowClosed },
          },
        ]);
      setSelectedId(node.id);
      setStatus("Đã thêm node mới.");
    },
    [layoutDirection, setEdges, setNodes],
  );
  const quickAdd = useCallback(
    (parentId, direction) => {
      const parent = nodes.find((node) => node.id === parentId);
      if (!parent) return;
      const offsets = {
        right: { x: 260, y: 0 },
        left: { x: -260, y: 0 },
        top: { x: 0, y: -150 },
        bottom: { x: 0, y: 150 },
      };
      createNode(
        "Chủ điểm mới",
        {
          x: parent.position.x + offsets[direction].x,
          y: parent.position.y + offsets[direction].y,
        },
        parentId,
      );
    },
    [createNode, nodes],
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
          onCycleStatus: updateStatus,
          editing: editingId === node.id,
          onEdit: setEditingId,
          onCommitEdit: commitEdit,
          onQuickAdd: quickAdd,
          onAddChild: (id) => quickAdd(id, "right"),
          onOpenDetails: openNodeDetails,
          onDelete: removeNode,
          selected: selectedId === node.id,
        },
      })),
    [commitEdit, editingId, nodes, openNodeDetails, quickAdd, removeNode, selectedId, updateStatus],
  );
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        name: mapName,
        nodes: nodes.map(({ data, ...node }) => ({
          ...node,
          data: {
            ...data,
            onCycleStatus: undefined,
            onEdit: undefined,
            onQuickAdd: undefined,
          },
        })),
        edges,
      }),
    );
  }, [edges, mapName, nodes]);
  const onConnect = useCallback(
    (connection) =>
      setEdges((current) =>
        addEdge(
          {
            ...connection,
            type: "smoothstep",
            animated: false,
            pathOptions: { borderRadius: 16 },
            style: { stroke: "#94a3b8", strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          current,
        ),
      ),
    [setEdges],
  );
  const selectEdge = useCallback((id) => {
    setSelectedEdgeId(id);
    setEdges((current) => current.map((edge) => ({
      ...edge,
      selected: edge.id === id,
      style: { stroke: edge.id === id ? "#e11d48" : "#94a3b8", strokeWidth: edge.id === id ? 3 : 2 },
    })));
  }, [setEdges]);
  const removeEdge = useCallback((id) => {
    setEdges((current) => current.filter((edge) => edge.id !== id));
    setSelectedEdgeId(null);
  }, [setEdges]);
  useEffect(() => {
    const handleShortcut = (event) => {
      if ((!selectedId && !selectedEdgeId) || ["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        if (selectedEdgeId) removeEdge(selectedEdgeId);
        else removeNode();
      }
      if (event.key === "Tab" && selectedId && !selectedEdgeId) {
        event.preventDefault();
        quickAdd(selectedId, "right");
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [quickAdd, removeEdge, removeNode, selectedEdgeId, selectedId]);
  const autoLayout = (direction = layoutDirection) => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, direction);
    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);
    setLayoutDirection(direction);
    setStatus(`Đã sắp xếp roadmap theo hướng ${direction === "TB" ? "trên xuống" : "trái sang phải"}.`);
    window.requestAnimationFrame(() => fitViewRef.current?.({ padding: 0.2, duration: 400 }));
  };
  const saveMap = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ name: mapName, nodes, edges }),
    );
    setStatus("Đã lưu sơ đồ.");
  };
  const loadMap = () => {
    const next = readMap();
    setMapName(next.name);
    setNodes(next.nodes);
    setEdges(next.edges);
    setSelectedId(null);
    setStatus("Đã tải sơ đồ.");
  };
  const exportPng = async () => {
    const viewportElement = document.querySelector(".react-flow__viewport");
    if (!viewportElement) return;
    const imageWidth = Math.max(viewportElement.scrollWidth, canvasRef.current?.clientWidth || 1200);
    const imageHeight = Math.max(viewportElement.scrollHeight, canvasRef.current?.clientHeight || 800);
    const dataUrl = await toPng(viewportElement, {
      backgroundColor: "#f8fafc",
      width: imageWidth,
      height: imageHeight,
      style: {
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
      filter: (node) => !node?.classList?.contains("react-flow__minimap") && !node?.classList?.contains("react-flow__controls"),
    });
    const link = document.createElement("a");
    link.download = `${mapName.replace(/\s+/g, "-").toLowerCase()}.png`;
    link.href = dataUrl;
    link.click();
  };
  const generateRoadmap = async () => {
    if (!debouncedTopic.trim()) return setError("Hãy nhập chủ đề roadmap.");
    if (!apiKey)
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
          position: { x: 80, y: index * 130 },
          data: {
            label: item.label,
            detail: item.detail || "AI roadmap",
            status: "pending",
            notes: "",
          },
        })),
      );
      setEdges(
        (result.edges || []).map((edge) => ({
          ...edge,
          type: "smoothstep",
          animated: false,
          ...edgeHandles(layoutDirection),
          pathOptions: { borderRadius: 16 },
          style: edgeStyle,
          markerEnd: { type: MarkerType.ArrowClosed },
        })),
      );
      setStatus(`Đã tạo roadmap bằng AI.`);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };
  const handleNodeClick = (id) => {
    setSelectedId(id);
    setSelectedEdgeId(null);
  };
  const handlePaneClick = () => {
    setDrawerOpen(false);
    setSelectedId(null);
    setSelectedEdgeId(null);
    setEdges((current) => current.map((edge) => ({ ...edge, selected: false, style: { stroke: "#94a3b8", strokeWidth: 2 } })));
  };
  const addRootNode = () => {
    createNode("Chủ đề gốc mới", { x: 80, y: 80 });
  };
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Interactive study roadmap</p>
          <div className="mt-1 flex items-center gap-2">
            <input
              value={mapName}
              onChange={(event) => setMapName(event.target.value)}
              className="max-w-xs bg-transparent font-display text-2xl font-bold tracking-tight outline-none"
            />
            <Pencil size={15} className="text-ink/30 dark:text-white/30" />
          </div>
          <p className="mt-1 hidden text-sm text-ink/45 dark:text-white/45 md:block">
            Double-click sửa · Tab thêm nhánh · Delete xóa · Space +
            kéo để pan
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => autoLayout("TB")}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold dark:border-white/[0.1] ${layoutDirection === "TB" ? "border-ink bg-ink text-white dark:bg-lime dark:text-ink" : "border-ink/[0.1]"}`}
          >
            <LayoutGrid size={15} />
            Sắp xếp Dọc
          </button>
          <button
            onClick={() => autoLayout("LR")}
            className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold dark:border-white/[0.1] ${layoutDirection === "LR" ? "border-ink bg-ink text-white dark:bg-lime dark:text-ink" : "border-ink/[0.1]"}`}
          >
            <ArrowRight size={15} />
            Sắp xếp Ngang
          </button>
          <button
            onClick={exportPng}
            className="flex items-center gap-2 rounded-xl border border-ink/[0.1] px-3 py-2.5 text-xs font-bold dark:border-white/[0.1]"
          >
            <Download size={15} />
            Xuất PNG
          </button>
          <button
            onClick={saveMap}
            className="flex items-center gap-2 rounded-xl bg-ink px-3 py-2.5 text-xs font-bold text-white dark:bg-lime dark:text-ink"
          >
            <Save size={15} />
            Lưu
          </button>
          <button
            onClick={loadMap}
            className="grid h-10 w-10 place-items-center rounded-xl border border-ink/[0.1] dark:border-white/[0.1]"
            aria-label="Tải sơ đồ"
          >
            <Upload size={15} />
          </button>
        </div>
      </div>
      <section className="panel flex flex-wrap items-end gap-3 p-4">
        <div className="min-w-56 flex-1">
          <label className="eyebrow">AI Roadmap Generator</label>
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
        <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-200">
          {error}
        </p>
      )}
      <MobileOutliner nodes={nodes} edges={edges} onSelect={handleNodeClick} view={mobileView} onViewChange={setMobileView} />
      {mobileView === "canvas" && <div className="panel h-[62vh] overflow-hidden p-1 md:hidden"><ReactFlowProvider><RoadmapCanvas nodes={decoratedNodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onSelect={handleNodeClick} onPaneClick={handlePaneClick} onEdgeClick={selectEdge} onEdgeDoubleClick={removeEdge} canvasRef={canvasRef} onViewportChange={setViewport} onFitViewReady={(fitView) => { fitViewRef.current = fitView; }} onAddRoot={addRootNode} /></ReactFlowProvider></div>}
      <div className="panel hidden overflow-hidden p-3 md:block">
        <ReactFlowProvider>
          <RoadmapCanvas
            nodes={decoratedNodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onSelect={handleNodeClick}
            onPaneClick={handlePaneClick}
            onEdgeClick={selectEdge}
            onEdgeDoubleClick={removeEdge}
            canvasRef={canvasRef}
            onViewportChange={setViewport}
            onFitViewReady={(fitView) => { fitViewRef.current = fitView; }}
            onAddRoot={addRootNode}
          />
        </ReactFlowProvider>
      </div>
      <div className="flex items-center justify-between text-xs text-ink/45 dark:text-white/45">
        <span className="flex items-center gap-2">
          <span className="font-bold text-emerald-600">
            {progress}% hoàn thành
          </span>
          <span>·</span>
          <span>{nodes.length} chủ điểm</span>
          <span>·</span>
          <span>{edges.length} liên kết</span>
        </span>
        <span>Chuột phải node để đổi trạng thái</span>
      </div>
      {status && (
        <p className="rounded-xl bg-[#e6f3e8] p-3 text-sm text-[#568460] dark:bg-[#293f31] dark:text-[#a9d5af]">
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
