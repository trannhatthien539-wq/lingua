import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  Check,
  Circle,
  Clock3,
  Maximize2,
  Music2,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Settings2,
  Trash2,
  Upload,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import ProgressBar from "../../components/ui/ProgressBar";
import ReactPlayer from "react-player";

const STORAGE_KEY = "lingua-study-planner";
const AUDIO_STORAGE_KEY = "lingua-pomodoro-audio";
const FOCUS_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;
const defaultTasks = [
  { id: "default-vocab", title: "Ôn 20 từ vựng mới", completed: false },
  {
    id: "default-writing",
    title: "Viết journal bằng tiếng Anh",
    completed: false,
  },
  { id: "default-listening", title: "Nghe podcast 15 phút", completed: false },
];
const defaultTimer = {
  mode: "focus",
  secondsLeft: FOCUS_SECONDS,
  isRunning: false,
  endAt: null,
  sessions: 0,
};
const audioOptions = [
  { id: "rain", label: "🌧️ Tiếng mưa rơi" },
  { id: "coffee", label: "☕ Không gian quán cà phê" },
  { id: "lofi", label: "🎵 Lofi Chill Beat" },
  { id: "mute", label: "🔇 Tắt âm thanh" },
];
const alarmOptions = [
  { id: "chime", label: "🔔 Chuông ngân (Chime)" },
  { id: "beep", label: "📟 Kỹ thuật số (Beep)" },
  { id: "bell", label: "🕰️ Chuông đồng hồ (Bell)" },
];

const todayKey = () => new Date().toISOString().slice(0, 10);
const readPlanner = () => {
  try {
    return (
      JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
        days: {},
        timer: defaultTimer,
      }
    );
  } catch {
    return { days: {}, timer: defaultTimer };
  }
};
const formatTime = (seconds) =>
  `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

export async function fetchMediaTitle(url) {
  const cleanUrl = url.trim();
  const isYoutube = /youtube\.com|youtu\.be/i.test(cleanUrl);
  const shortUrl = cleanUrl.length > 42 ? `${cleanUrl.slice(0, 39)}...` : cleanUrl;
  if (isYoutube) {
    try {
      const response = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(cleanUrl)}`);
      if (!response.ok) throw new Error("Metadata unavailable");
      const data = await response.json();
      return { title: data.title || shortUrl, thumbnail: data.thumbnail_url || "", type: "youtube" };
    } catch {
      return { title: shortUrl, thumbnail: "", type: "youtube" };
    }
  }
  try {
    const filename = decodeURIComponent(new URL(cleanUrl).pathname.split("/").pop() || "").replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ").trim();
    return { title: filename || "Custom Audio Stream", thumbnail: "", type: "stream" };
  } catch {
    return { title: shortUrl || "Custom Audio Stream", thumbnail: "", type: "stream" };
  }
}

function playChime(alarm = "chime", customSource = "", volume = 35) {
  if (customSource) {
    const audio = new Audio(customSource);
    audio.volume = volume / 100;
    audio.play().catch(() => {});
    return;
  }
  try {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type =
      alarm === "beep" ? "square" : alarm === "bell" ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(
      alarm === "beep" ? 1000 : 660,
      context.currentTime,
    );
    oscillator.frequency.setValueAtTime(
      alarm === "bell" ? 520 : 880,
      context.currentTime + 0.18,
    );
    gain.gain.setValueAtTime(0.08, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.8);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.8);
  } catch {
    /* Audio can be unavailable in restricted browsers. */
  }
}

function FocusAudio({ sound, volume, active, customSource }) {
  const contextRef = useRef(null);
  const nodesRef = useRef([]);
  useEffect(() => {
    if (!active || sound === "mute") return undefined;
    if (customSource) return undefined;
    const context = new AudioContext();
    const gain = context.createGain();
    gain.gain.value = (volume / 100) * 0.12;
    gain.connect(context.destination);
    const nodes = [];
    if (sound === "rain") {
      const buffer = context.createBuffer(
        1,
        context.sampleRate * 2,
        context.sampleRate,
      );
      const data = buffer.getChannelData(0);
      for (let index = 0; index < data.length; index += 1)
        data[index] = (Math.random() * 2 - 1) * 0.3;
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(gain);
      source.start();
      nodes.push(source);
    } else {
      const oscillator = context.createOscillator();
      oscillator.type = sound === "lofi" ? "sine" : "triangle";
      oscillator.frequency.value = sound === "lofi" ? 174 : 96;
      oscillator.connect(gain);
      oscillator.start();
      nodes.push(oscillator);
    }
    contextRef.current = context;
    nodesRef.current = nodes;
    return () => {
      nodes.forEach((node) => node.stop?.());
      context.close();
      contextRef.current = null;
      nodesRef.current = [];
    };
  }, [active, sound, customSource]);
  useEffect(() => {
    const gain = contextRef.current?.destination;
    if (gain) gain.gain.value = (volume / 100) * 0.12;
  }, [volume]);
  return null;
}

function CustomBackgroundAudio({ source, active, volume }) {
  return (
    <ReactPlayer
      src={source || undefined}
      playing={active && Boolean(source)}
      loop
      volume={volume / 100}
      muted={volume === 0}
      width="0"
      height="0"
      style={{ display: "none" }}
      config={{ file: { attributes: { preload: "auto" } } }}
    />
  );
}

function AudioSettingsModal({ audio, setAudio, onClose, onReset, onPreview }) {
  const [tab, setTab] = useState("background");
  const [metadataLoading, setMetadataLoading] = useState(false);
  const [backgroundUrl, setBackgroundUrl] = useState(
    audio.customBackground?.sourceType === "url"
      ? audio.customBackground.dataUrl
      : "",
  );
  const readFile = (event, key) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setAudio((current) => ({
        ...current,
        [key]: { name: file.name, title: file.name, thumbnail: "", type: "file", dataUrl: reader.result, sourceType: "file" },
        ...(key === "customBackground" ? { sound: "custom" } : {}),
      }));
    reader.readAsDataURL(file);
    event.target.value = "";
  };
  const applyUrl = async () => {
    if (backgroundUrl.trim()) {
      setMetadataLoading(true);
      const metadata = await fetchMediaTitle(backgroundUrl);
      setAudio((current) => ({
        ...current,
        sound: "custom",
        customBackground: {
          name: metadata.title,
          title: metadata.title,
          thumbnail: metadata.thumbnail,
          type: metadata.type,
          dataUrl: backgroundUrl.trim(),
          sourceType: "url",
        },
      }));
      setMetadataLoading(false);
    }
  };
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section className="panel w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#1b211f]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Music2 className="text-sage" size={20} />
            <div>
              <p className="eyebrow">Audio settings</p>
              <h2 className="mt-1 font-display text-xl font-bold">
                Cài đặt âm thanh
              </h2>
            </div>
          </div>
          <button onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </div>
        <div className="mt-6 flex gap-1 rounded-xl bg-ink/[0.06] p-1 dark:bg-white/[0.08]">
          <button onClick={() => setTab("background")} className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold ${tab === "background" ? "bg-white shadow-sm dark:bg-[#29332f]" : "text-ink/45 dark:text-white/45"}`}>Nhạc nền tập trung</button>
          <button onClick={() => setTab("alarm")} className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold ${tab === "alarm" ? "bg-white shadow-sm dark:bg-[#29332f]" : "text-ink/45 dark:text-white/45"}`}>Chuông báo hết giờ</button>
        </div>
        <div className="mt-5">
          {tab === "background" && <div>
            <p className="text-sm font-bold">Nhạc nền tập trung</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {audioOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() =>
                    setAudio((current) => ({ ...current, sound: option.id }))
                  }
                  className={`rounded-xl border px-3 py-2.5 text-left text-xs font-semibold ${audio.sound === option.id ? "border-sage bg-[#e6f3e8] dark:bg-[#293f31]" : "border-ink/[0.1] dark:border-white/[0.1]"}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <label className="mt-3 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-ink/20 px-3 py-3 text-sm font-semibold dark:border-white/20">
              <Upload size={15} />
              Tải file từ máy
              <input
                type="file"
                accept=".mp3,.wav,.aac,.mp4,audio/*,video/mp4"
                className="hidden"
                onChange={(event) => readFile(event, "customBackground")}
              />
            </label>
            <div className="mt-3 flex gap-2">
              <input
                value={backgroundUrl}
                onChange={(event) => setBackgroundUrl(event.target.value)}
                placeholder="Dán link YouTube / MP3 trực tuyến"
                className="min-w-0 flex-1 rounded-lg border border-ink/[0.1] bg-transparent px-3 py-2 text-xs dark:border-white/[0.1]"
              />
              <button
                onClick={applyUrl}
                disabled={metadataLoading}
                className="rounded-lg bg-ink px-3 text-xs font-bold text-white disabled:opacity-50 dark:bg-lime dark:text-ink"
              >
                {metadataLoading ? "Đang lấy thông tin..." : "Áp dụng"}
              </button>
            </div>
            {audio.customBackground && (
              <div className="flex items-center gap-3 rounded-xl bg-mist px-3 py-2.5 dark:bg-[#29332f]">
                {audio.customBackground.thumbnail ? <img src={audio.customBackground.thumbnail} alt="" className="h-10 w-14 rounded-md object-cover" /> : <Music2 className="shrink-0 animate-pulse text-sage" size={20} />}
                <div className="min-w-0 flex-1"><p className="line-clamp-1 text-sm font-medium text-slate-800 dark:text-white">{audio.customBackground.title || audio.customBackground.name}</p><p className="text-[10px] text-slate-500">{audio.customBackground.type === "youtube" ? "YouTube Audio" : "Online Audio"}</p></div>
                <button onClick={() => setAudio((current) => ({ ...current, sound: "custom" }))} className="text-sage" aria-label="Chọn làm nhạc nền">◉</button>
                <button
                  onClick={() =>
                    setAudio((current) => ({
                      ...current,
                      customBackground: null,
                      sound: "mute",
                    }))
                  }
                  className="text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </div>}
          {tab === "alarm" && <div>
            <p className="text-sm font-bold">Chuông báo hết giờ</p>
            <div className="mt-3 grid gap-2">
              {alarmOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() =>
                    setAudio((current) => ({ ...current, alarm: option.id }))
                  }
                  className={`rounded-xl border px-3 py-2.5 text-left text-xs font-semibold ${audio.alarm === option.id ? "border-sage bg-[#e6f3e8] dark:bg-[#293f31]" : "border-ink/[0.1] dark:border-white/[0.1]"}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <label className="mt-3 flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-ink/20 px-3 py-3 text-sm font-semibold dark:border-white/20">
              <Upload size={15} />
              Tải chuông riêng
              <input
                type="file"
                accept=".mp3,.wav,.aac,audio/*"
                className="hidden"
                onChange={(event) => readFile(event, "customAlarm")}
              />
            </label>
            {audio.customAlarm && (
              <div className="flex items-center justify-between rounded-lg bg-mist px-3 py-2 text-xs dark:bg-[#29332f]">
                <span className="max-w-[180px] truncate">
                  {audio.customAlarm.name}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onPreview(audio.customAlarm.dataUrl)}
                    className="font-bold text-sage"
                  >
                    ▶ Nghe thử
                  </button>
                  <button
                    onClick={() =>
                      setAudio((current) => ({ ...current, customAlarm: null }))
                    }
                    className="text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>}
        </div>
        <div className="mt-6 flex justify-between border-t border-ink/[0.08] pt-4 dark:border-white/[0.08]">
          <button onClick={onReset} className="text-xs font-bold text-red-500">
            Khôi phục mặc định
          </button>
          <button
            onClick={onClose}
            className="rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-white dark:bg-lime dark:text-ink"
          >
            Xong
          </button>
        </div>
      </section>
    </div>
  );
}

function ZenFocus({
  timer,
  progress,
  audio,
  volume,
  onToggle,
  onMute,
  onExit,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#070b0a] text-white">
      <div className="w-full max-w-2xl px-8 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">
          {timer.mode === "focus"
            ? `Phiên học tập #${timer.sessions + 1}`
            : "Nghỉ giải lao"}
        </p>
        <p className="mt-5 font-mono text-8xl font-bold tracking-tight text-lime sm:text-[10rem]">
          {formatTime(timer.secondsLeft)}
        </p>
        <div className="mx-auto mt-10 max-w-md">
          <div className="h-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-lime transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            onClick={onToggle}
            className="grid h-12 w-12 place-items-center rounded-full bg-lime text-ink"
            aria-label={timer.isRunning ? "Tạm dừng" : "Bắt đầu"}
          >
            {timer.isRunning ? <Pause size={19} /> : <Play size={19} />}
          </button>
          <button
            onClick={onMute}
            className="grid h-12 w-12 place-items-center rounded-full border border-white/20 text-white/70"
            aria-label="Bật tắt âm thanh"
          >
            {audio.sound === "mute" || audio.volume === 0 ? (
              <VolumeX size={18} />
            ) : (
              <Volume2 size={18} />
            )}
          </button>
          <button
            onClick={onExit}
            className="grid h-12 w-12 place-items-center rounded-full border border-white/20 text-white/70"
            aria-label="Thoát Zen Focus"
          >
            <X size={18} />
          </button>
        </div>
        <p className="mt-8 text-xs text-white/35">
          Âm thanh:{" "}
          {audioOptions.find((item) => item.id === audio.sound)?.label}
        </p>
      </div>
    </div>
  );
}

export default function StudyPlanner({ onStudyActivity }) {
  const [planner, setPlanner] = useState(readPlanner);
  const [taskInput, setTaskInput] = useState("");
  const [audio, setAudio] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem(AUDIO_STORAGE_KEY)) || {
          sound: "mute",
          volume: 35,
          alarm: "chime",
          customBackground: null,
          customAlarm: null,
        }
      );
    } catch {
      return {
        sound: "mute",
        volume: 35,
        alarm: "chime",
        customBackground: null,
        customAlarm: null,
      };
    }
  });
  const [isZen, setIsZen] = useState(false);
  const [audioSettingsOpen, setAudioSettingsOpen] = useState(false);
  const date = todayKey();
  const tasks = planner.days[date] || defaultTasks;
  const timer = planner.timer || defaultTimer;
  const completedCount = tasks.filter((task) => task.completed).length;
  const taskProgress = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;
  const timerProgress = useMemo(() => {
    const total = timer.mode === "focus" ? FOCUS_SECONDS : BREAK_SECONDS;
    return Math.max(
      0,
      Math.min(100, ((total - timer.secondsLeft) / total) * 100),
    );
  }, [timer.mode, timer.secondsLeft]);

  useEffect(
    () => localStorage.setItem(STORAGE_KEY, JSON.stringify(planner)),
    [planner],
  );
  useEffect(
    () => localStorage.setItem(AUDIO_STORAGE_KEY, JSON.stringify(audio)),
    [audio],
  );
  useEffect(() => {
    const handler = () => setIsZen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);
  useEffect(() => {
    if (!timer.isRunning || !timer.endAt) return undefined;
    const tick = () => {
      const secondsLeft = Math.max(
        0,
        Math.ceil((timer.endAt - Date.now()) / 1000),
      );
      if (secondsLeft > 0) {
        setPlanner((current) => ({
          ...current,
          timer: { ...current.timer, secondsLeft },
        }));
        return;
      }
      const nextMode = timer.mode === "focus" ? "break" : "focus";
      setPlanner((current) => ({
        ...current,
        timer: {
          ...defaultTimer,
          mode: nextMode,
          sessions:
            timer.mode === "focus" ? timer.sessions + 1 : timer.sessions,
        },
      }));
        if (timer.mode === "focus") onStudyActivity?.();
      playChime(audio.alarm, audio.customAlarm?.dataUrl, audio.volume);
      window.alert(
        timer.mode === "focus"
          ? "Hết 25 phút học. Nghỉ 5 phút nhé!"
          : "Hết giờ nghỉ. Sẵn sàng học tiếp chưa?",
      );
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [
    audio.alarm,
    audio.customAlarm,
    audio.volume,
    timer.endAt,
    timer.isRunning,
    timer.mode,
    timer.sessions,
  ]);

  const setTimer = (nextTimer) =>
    setPlanner((current) => ({ ...current, timer: nextTimer }));
  const toggleTimer = () => {
    if (timer.isRunning) {
      setTimer({
        ...timer,
        secondsLeft: Math.max(0, Math.ceil((timer.endAt - Date.now()) / 1000)),
        endAt: null,
        isRunning: false,
      });
      return;
    }
    setTimer({
      ...timer,
      endAt: Date.now() + timer.secondsLeft * 1000,
      isRunning: true,
    });
  };
  const enterZen = async () => {
    try {
      await document.documentElement.requestFullscreen?.();
    } finally {
      setIsZen(true);
    }
  };
  const exitZen = async () => {
    if (document.fullscreenElement) await document.exitFullscreen?.();
    setIsZen(false);
  };
  const updateTasks = (nextTasks) =>
    setPlanner((current) => ({
      ...current,
      days: { ...current.days, [date]: nextTasks },
    }));
  const addTask = (event) => {
    event.preventDefault();
    const title = taskInput.trim();
    if (!title) return;
    updateTasks([
      { id: `${Date.now()}-${title}`, title, completed: false },
      ...tasks,
    ]);
    setTaskInput("");
  };
  const toggleTask = (id) =>
    updateTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  const removeTask = (id) =>
    updateTasks(tasks.filter((task) => task.id !== id));
  const resetTimer = () =>
    setTimer({ ...defaultTimer, mode: timer.mode, sessions: timer.sessions });
  const switchTimerMode = (mode) =>
    setTimer({
      ...defaultTimer,
      mode,
      secondsLeft: mode === "focus" ? FOCUS_SECONDS : BREAK_SECONDS,
      sessions: timer.sessions,
    });
  const toggleMute = () =>
    setAudio((current) => ({
      ...current,
      sound:
        current.sound === "mute"
          ? current.customBackground
            ? "custom"
            : "rain"
          : "mute",
    }));
  const previewAlarm = (source) => {
    const audioPreview = new Audio(source);
    audioPreview.volume = audio.volume / 100;
    audioPreview.play().catch(() => {});
  };
  const resetAudio = () => {
    setAudio({
      sound: "mute",
      volume: 35,
      alarm: "chime",
      customBackground: null,
      customAlarm: null,
    });
    setAudioSettingsOpen(false);
  };

  return (
    <>
      <FocusAudio
        sound={audio.sound}
        customSource={audio.customBackground?.dataUrl}
        volume={audio.volume}
        active={timer.isRunning}
      />
      <CustomBackgroundAudio
        source={audio.customBackground?.dataUrl}
        active={timer.isRunning && audio.sound === "custom"}
        volume={audio.volume}
      />
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="panel p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow">Daily checklist</p>
                <h2 className="mt-1 font-display text-lg font-bold">
                  Việc học hôm nay
                </h2>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl font-bold">
                  {taskProgress}%
                </p>
                <p className="text-xs text-ink/40 dark:text-white/40">
                  {completedCount}/{tasks.length} hoàn thành
                </p>
              </div>
            </div>
            <div className="mt-5">
              <ProgressBar value={taskProgress} color="bg-sage" />
            </div>
            <form onSubmit={addTask} className="mt-6 flex gap-2">
              <input
                value={taskInput}
                onChange={(event) => setTaskInput(event.target.value)}
                placeholder="Thêm task học tập..."
                className="min-w-0 flex-1 rounded-xl border border-ink/[0.1] bg-transparent px-3 py-3 text-sm outline-none dark:border-white/[0.1]"
              />
              <button className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink text-white dark:bg-lime dark:text-ink">
                <Plus size={17} />
              </button>
            </form>
            <div className="mt-5 space-y-2">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="group flex items-center gap-3 rounded-xl border border-ink/[0.07] px-3 py-3 dark:border-white/[0.07]"
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border ${task.completed ? "border-sage bg-sage text-white" : "border-ink/20 dark:border-white/20"}`}
                  >
                    {task.completed && <Check size={13} />}
                  </button>
                  <span
                    className={`flex-1 text-sm font-semibold ${task.completed ? "text-ink/35 line-through dark:text-white/35" : ""}`}
                  >
                    {task.title}
                  </span>
                  <button
                    onClick={() => removeTask(task.id)}
                    className="text-ink/20 opacity-0 group-hover:opacity-100 dark:text-white/20"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </section>
          <section className="panel p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Focus session</p>
                <h2 className="mt-1 font-display text-lg font-bold">
                  Pomodoro
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAudioSettingsOpen(true)}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-ink/[0.1] dark:border-white/[0.1]"
                  aria-label="Cài đặt âm thanh"
                >
                  <Settings2 size={16} />
                </button>
                <button
                  onClick={enterZen}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-ink/[0.1] dark:border-white/[0.1]"
                  aria-label="Phóng to toàn màn hình"
                >
                  <Maximize2 size={16} />
                </button>
              </div>
            </div>
            <div className="mt-6 text-center">
              <div
                className="mx-auto grid h-52 w-52 place-items-center rounded-full"
                style={{
                  background: `conic-gradient(rgb(134 169 143) ${timerProgress}%, rgba(24,32,29,.08) ${timerProgress}%)`,
                }}
              >
                <div className="grid h-44 w-44 place-items-center rounded-full bg-white dark:bg-[#202724]">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink/40 dark:text-white/40">
                      {timer.mode === "focus" ? "Đang tập trung" : "Đang nghỉ"}
                    </p>
                    <p className="mt-2 font-mono text-4xl font-bold">
                      {formatTime(timer.secondsLeft)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex justify-center gap-2">
                <button
                  onClick={() => switchTimerMode("focus")}
                  className={`rounded-lg px-3 py-2 text-xs font-bold ${timer.mode === "focus" ? "bg-ink text-white dark:bg-lime dark:text-ink" : "text-ink/45"}`}
                >
                  Học 25 phút
                </button>
                <button
                  onClick={() => switchTimerMode("break")}
                  className={`rounded-lg px-3 py-2 text-xs font-bold ${timer.mode === "break" ? "bg-ink text-white dark:bg-lime dark:text-ink" : "text-ink/45"}`}
                >
                  Nghỉ 5 phút
                </button>
              </div>
              <div className="mx-auto mt-4 flex max-w-xs items-center gap-2">
                <select
                  value={audio.sound}
                  onChange={(event) =>
                    setAudio({ ...audio, sound: event.target.value })
                  }
                  className="min-w-0 flex-1 rounded-lg border border-ink/[0.1] bg-transparent px-2 py-2 text-xs dark:border-white/[0.1]"
                >
                  {audioOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                  {audio.customBackground && (
                    <option value="custom">
                      🎵 {audio.customBackground.title || audio.customBackground.name}
                    </option>
                  )}
                </select>
                <Volume2 size={14} className="text-ink/40" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={audio.volume}
                  onChange={(event) =>
                    setAudio({ ...audio, volume: Number(event.target.value) })
                  }
                  className="w-20 accent-sage"
                  aria-label="Âm lượng"
                />
              </div>
              <div className="mt-5 flex justify-center gap-2">
                <button
                  onClick={toggleTimer}
                  className="flex min-w-32 items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-bold text-white dark:bg-lime dark:text-ink"
                >
                  {timer.isRunning ? <Pause size={16} /> : <Play size={16} />}
                  {timer.isRunning ? "Tạm dừng" : "Bắt đầu học"}
                </button>
                <button
                  onClick={resetTimer}
                  className="grid h-11 w-11 place-items-center rounded-xl border border-ink/[0.1] text-ink/50 dark:border-white/[0.1]"
                  aria-label="Đặt lại"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
              <p className="mt-5 flex items-center justify-center gap-2 text-xs text-ink/40">
                <Clock3 size={14} />
                Đã hoàn thành {timer.sessions} phiên
              </p>
            </div>
          </section>
        </div>
      </div>
      {isZen && (
        <ZenFocus
          timer={timer}
          progress={timerProgress}
          audio={audio}
          volume={audio.volume}
          onToggle={toggleTimer}
          onMute={toggleMute}
          onExit={exitZen}
        />
      )}
      {audioSettingsOpen && (
        <AudioSettingsModal
          audio={audio}
          setAudio={setAudio}
          onClose={() => setAudioSettingsOpen(false)}
          onReset={resetAudio}
          onPreview={previewAlarm}
        />
      )}
    </>
  );
}
