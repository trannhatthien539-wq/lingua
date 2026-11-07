import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  Clock3,
  Maximize2,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Settings2,
  Target,
  Trash2,
  Volume2,
} from "lucide-react";
import ProgressBar from "../../components/ui/ProgressBar";
import useCloudDoc from "../../hooks/useCloudDoc";
import { toast as notify } from "../../services/toast";
import { userDocKeys } from "../../services/userDocService";
import { dayKeyOf } from "../../utils/day";
import {
  AudioSettingsModal,
  FocusAudio,
  ZenFocus,
  audioOptions,
  fetchMediaTitle,
  formatTime,
  playChime,
} from "./PlannerAudio";
import YouTubeAudio from "./YouTubeAudio";

export { fetchMediaTitle };

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
  focusTaskId: null,
};
const defaultAudio = {
  sound: "mute",
  volume: 35,
  alarm: "chime",
  customBackground: null,
  customAlarm: null,
};

const todayKey = () => dayKeyOf();
const plannerStorageKey = (user) =>
  user ? `${STORAGE_KEY}-${user.uid}` : `${STORAGE_KEY}-guest`;
const readPlanner = (user) => {
  try {
    const stored = JSON.parse(localStorage.getItem(plannerStorageKey(user)));
    return {
      days: stored?.days && typeof stored.days === "object" ? stored.days : {},
      timer: { ...defaultTimer, ...(stored?.timer || {}) },
    };
  } catch {
    return { days: {}, timer: defaultTimer };
  }
};
const readAudio = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(AUDIO_STORAGE_KEY));
    const volume = Number(stored?.volume);
    return {
      ...defaultAudio,
      ...stored,
      volume: Number.isFinite(volume)
        ? Math.max(0, Math.min(100, volume))
        : defaultAudio.volume,
    };
  } catch {
    return defaultAudio;
  }
};

const normalizePlanner = (payload) => ({
  days: payload?.days && typeof payload.days === "object" ? payload.days : {},
  timer: { ...defaultTimer, ...(payload?.timer || {}) },
});

// Timer đang chạy là trạng thái của riêng từng thiết bị, chỉ đồng bộ lịch sử ngày học
// và tổng số phiên để tránh ghi đám mây mỗi giây.
const selectPlannerForCloud = (value) => ({
  days: value.days || {},
  timerSessions: Number(value.timer?.sessions) || 0,
});

const mergePlanner = (payload, current) => {
  const local = current || { days: {}, timer: defaultTimer };
  if (!payload) return local;
  return {
    days:
      payload.days && typeof payload.days === "object"
        ? payload.days
        : local.days,
    timer: {
      ...normalizePlanner(local).timer,
      sessions: Math.max(
        Number(local.timer?.sessions) || 0,
        Number(payload.timerSessions) || 0,
      ),
    },
  };
};

export default function StudyPlanner({ onStudyActivity, user }) {
  const { value: planner, setValue: setPlanner } = useCloudDoc(
    userDocKeys.planner,
    {
      initial: readPlanner(user),
      select: selectPlannerForCloud,
      normalize: mergePlanner,
    },
  );
  const [taskInput, setTaskInput] = useState("");
  const audioRef = useRef(null);
  const [audio, setAudio] = useState(readAudio);
  const [isZen, setIsZen] = useState(false);
  const [audioSettingsOpen, setAudioSettingsOpen] = useState(false);
  // Thông báo dùng hệ thống toast chung; giữ tên hàm để không phải sửa các chỗ gọi.
  const setToast = (message) => {
    if (message) notify.info(message);
  };
  const date = todayKey();
  const tasks = Array.isArray(planner.days[date])
    ? planner.days[date]
    : defaultTasks;
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

  useEffect(() => {
    const persistedAudio = {
      ...audio,
      sound:
        audio.sound === "custom" &&
        audio.customBackground?.sourceType === "file"
          ? "mute"
          : audio.sound,
      customBackground:
        audio.customBackground?.sourceType === "file"
          ? null
          : audio.customBackground,
      customAlarm:
        audio.customAlarm?.sourceType === "file" ? null : audio.customAlarm,
    };
    localStorage.setItem(AUDIO_STORAGE_KEY, JSON.stringify(persistedAudio));
  }, [audio]);

  useEffect(() => {
    const objectUrls = [
      audio.customBackground?.dataUrl,
      audio.customAlarm?.dataUrl,
    ];
    return () => {
      objectUrls.forEach((url) => {
        if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    };
  }, [audio.customBackground?.dataUrl, audio.customAlarm?.dataUrl]);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return undefined;
    const customBackground = audio.customBackground;
    const source =
      audio.sound === "custom" && customBackground?.type !== "youtube"
        ? customBackground?.dataUrl
        : "";
    audioElement.pause();
    audioElement.currentTime = 0;
    audioElement.src = source || "";
    audioElement.loop = true;
    audioElement.volume = audio.volume / 100;
    if (timer.isRunning && source && audio.volume > 0) {
      // Trình duyệt chặn autoplay khi chưa có tương tác — bỏ qua lặng lẽ, người dùng bấm Play là phát.
      audioElement.play().catch(() => {});
    }
    return () => audioElement.pause();
  }, [
    audio.sound,
    audio.customBackground,
    audio.volume,
    timer.isRunning,
    timer.mode,
  ]);

  useEffect(
    () =>
      localStorage.setItem(plannerStorageKey(user), JSON.stringify(planner)),
    [planner, user],
  );
  useEffect(() => {
    const handler = () => setIsZen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);
  /**
   * Đồng hồ 1 giây: thân tick đọc state MỚI NHẤT qua ref.
   * Cách cũ để effect phụ thuộc 7 giá trị (thiếu 7 giá trị khác) nên tick có thể dùng
   * dữ liệu cũ: task mục tiêu sai, chuông phát bằng âm lượng cũ, streak không được ghi.
   */
  const timerTickRef = useRef(() => {});
  timerTickRef.current = () => {
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
      days:
        timer.mode === "focus" && timer.focusTaskId
          ? {
              ...current.days,
              [date]: (current.days[date] || defaultTasks).map((task) =>
                task.id === timer.focusTaskId
                  ? { ...task, completed: true }
                  : task,
              ),
            }
          : current.days,
      timer: {
        ...defaultTimer,
        mode: nextMode,
        focusTaskId: timer.focusTaskId,
        sessions:
          timer.mode === "focus" ? timer.sessions + 1 : timer.sessions,
      },
    }));
    if (timer.mode === "focus") {
      onStudyActivity?.();
      setToast(
        timer.focusTaskId
          ? "Hết 25 phút học. Đã tick task mục tiêu, nghỉ 5 phút nhé!"
          : "Hết 25 phút học. Nghỉ 5 phút nhé!",
      );
    } else {
      setToast("Hết giờ nghỉ. Sẵn sàng học tiếp chưa?");
    }
    playChime(
      audioRef.current,
      audio.alarm,
      audio.customAlarm?.dataUrl,
      audio.volume,
      audio.sound === "custom" && audio.customBackground?.type !== "youtube"
        ? audio.customBackground?.dataUrl
        : "",
      timer.isRunning,
    );
  };
  useEffect(() => {
    if (!timer.isRunning || !timer.endAt) return undefined;
    timerTickRef.current();
    const id = window.setInterval(() => timerTickRef.current(), 1000);
    return () => window.clearInterval(id);
  }, [timer.endAt, timer.isRunning]);

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
  const focusTask = (id) => {
    setTimer({ ...timer, mode: "focus", focusTaskId: id });
    const task = tasks.find((item) => item.id === id);
    setToast(
      task
        ? `Đã chọn mục tiêu: ${task.title}`
        : "Đã chọn mục tiêu phiên học.",
    );
  };
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
    const audioElement = audioRef.current;
    if (!audioElement) return;
    audioElement.pause();
    audioElement.currentTime = 0;
    audioElement.src = source;
    audioElement.loop = false;
    audioElement.volume = audio.volume / 100;
    audioElement.onended = null;
    audioElement.play().catch(() => {});
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
      <audio ref={audioRef} preload="auto" aria-hidden="true" />
      {audio.sound === "custom" &&
        audio.customBackground?.type === "youtube" && (
          <YouTubeAudio
            url={audio.customBackground.dataUrl}
            playing={timer.isRunning}
            volume={audio.volume}
          />
        )}
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="panel relative isolate overflow-hidden p-5">
            {audio.sound === "custom" &&
              audio.customBackground?.mediaType === "video" &&
              audio.customBackground.dataUrl && (
                <video
                  src={audio.customBackground.dataUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 -z-10 h-full w-full object-cover"
                />
              )}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                  Danh sách việc cần làm
                </h2>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                  {completedCount}/{tasks.length} đã hoàn thành
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {taskProgress}%
                </p>
              </div>
            </div>
            <div className="mt-5">
              <ProgressBar value={taskProgress} />
            </div>
            <form onSubmit={addTask} className="mt-6 flex gap-2">
              <input
                value={taskInput}
                onChange={(event) => setTaskInput(event.target.value)}
                placeholder="Thêm task học tập..."
                className="min-w-0 flex-1 rounded-xl border border-ink/[0.1] bg-transparent px-3 py-3 text-sm outline-none dark:border-white/[0.1]"
              />
              <button
                className="btn-primary grid h-11 w-11 shrink-0 place-items-center rounded-xl p-0"
                aria-label="Thêm task"
              >
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
                    aria-pressed={task.completed}
                    aria-label={`${task.completed ? "Bỏ đánh dấu" : "Đánh dấu hoàn thành"}: ${task.title}`}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-ink/70 transition hover:bg-ink/[0.06] dark:text-white/70 dark:hover:bg-white/10"
                  >
                    <span
                      className={`grid h-6 w-6 place-items-center rounded-md border ${
                        task.completed
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-ink/25 dark:border-white/30"
                      }`}
                    >
                      {task.completed && <Check size={14} />}
                    </span>
                  </button>
                  <span
                    className={`flex-1 text-sm font-semibold ${
                      task.completed
                        ? "text-ink/60 line-through dark:text-white/45"
                        : ""
                    }`}
                  >
                    {task.title}
                  </span>
                  <button
                    onClick={() => focusTask(task.id)}
                    className={`grid h-11 w-11 place-items-center rounded-xl transition ${
                      timer.focusTaskId === task.id
                        ? "border border-indigo-500/30 bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"
                        : "text-ink/60 hover:bg-ink/[0.06] hover:text-ink dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
                    }`}
                    aria-label={`Đặt ${task.title} làm mục tiêu phiên tập trung`}
                    title="Đặt làm mục tiêu Pomodoro"
                  >
                    <Target size={17} />
                  </button>
                  <button
                    onClick={() => removeTask(task.id)}
                    aria-label={`Xoá task: ${task.title}`}
                    className="icon-btn text-danger hover:bg-dangerbg dark:text-dangerfgdark dark:hover:bg-dangerdark"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>
          <section className="panel p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Phiên tập trung</p>
                <h2 className="mt-1 font-display text-lg font-bold">
                  Pomodoro
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAudioSettingsOpen(true)}
                  className="icon-btn border border-ink/10 dark:border-white/15"
                  aria-label="Cài đặt âm thanh"
                >
                  <Settings2 size={16} />
                </button>
                <button
                  onClick={enterZen}
                  className="icon-btn border border-ink/10 dark:border-white/15"
                  aria-label="Phóng to toàn màn hình"
                >
                  <Maximize2 size={16} />
                </button>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="mb-4 min-h-5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                {timer.focusTaskId
                  ? `Mục tiêu: ${tasks.find((task) => task.id === timer.focusTaskId)?.title || "Phiên học hiện tại"}`
                  : "Chưa chọn mục tiêu phiên"}
              </p>
              <div
                className="mx-auto grid h-52 w-52 place-items-center rounded-full"
                style={{
                  background: `conic-gradient(rgb(var(--accent)) ${timerProgress}%, rgba(148,163,184,0.15) ${timerProgress}%)`,
                }}
              >
                <div className="grid h-44 w-44 place-items-center rounded-full bg-white dark:bg-[#111827]">
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
                  aria-pressed={timer.mode === "focus"}
                  className={`min-h-[44px] rounded-xl px-4 text-sm font-bold transition ${
                    timer.mode === "focus"
                      ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                  }`}
                >
                  Học 25 phút
                </button>
                <button
                  onClick={() => switchTimerMode("break")}
                  aria-pressed={timer.mode === "break"}
                  className={`min-h-[44px] rounded-xl px-4 text-sm font-bold transition ${
                    timer.mode === "break"
                      ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
                  }`}
                >
                  Nghỉ 5 phút
                </button>
              </div>
              <div className="mx-auto mt-4 flex max-w-xs flex-col gap-2 sm:flex-row sm:items-center">
                <select
                  value={audio.sound}
                  onChange={(event) =>
                    setAudio({ ...audio, sound: event.target.value })
                  }
                  aria-label="Chọn âm thanh nền"
                  className="w-full min-w-0 rounded-xl border border-ink/10 bg-transparent px-2.5 py-2.5 text-sm dark:border-white/15 sm:flex-1"
                >
                  {audioOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                  {audio.customBackground && (
                    <option value="custom">
                      🎵{" "}
                      {audio.customBackground.title ||
                        audio.customBackground.name}
                    </option>
                  )}
                </select>
                <div className="flex items-center gap-2">
                  <Volume2 size={14} className="shrink-0 text-ink/40" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={audio.volume}
                    onChange={(event) =>
                      setAudio({ ...audio, volume: Number(event.target.value) })
                    }
                    className="h-11 w-full accent-indigo-500 sm:w-20"
                    aria-label="Âm lượng"
                  />
                </div>
              </div>
              <div className="mt-5 flex justify-center gap-2">
                <button
                  onClick={toggleTimer}
                  className="btn-primary flex min-w-32 items-center justify-center gap-2 px-5 py-3 text-sm"
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
