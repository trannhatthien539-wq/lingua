import { useEffect, useRef, useState } from "react";
import {
  Music2,
  Pause,
  Play,
  Trash2,
  Upload,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import Dialog from "../../components/ui/Dialog";

export const audioOptions = [
  { id: "rain", label: "🌧️ Tiếng mưa rơi" },
  { id: "coffee", label: "☕ Không gian quán cà phê" },
  { id: "lofi", label: "🎵 Lofi Chill Beat" },
  { id: "mute", label: "🔇 Tắt âm thanh" },
];

export const alarmOptions = [
  { id: "chime", label: "🔔 Chuông ngân (Chime)" },
  { id: "beep", label: "📟 Kỹ thuật số (Beep)" },
  { id: "bell", label: "🕰️ Chuông đồng hồ (Bell)" },
];

export const formatTime = (seconds) =>
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
    const filename = decodeURIComponent(new URL(cleanUrl).pathname.split("/").pop() || "")
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]+/g, " ")
      .trim();
    return { title: filename || "Custom Audio Stream", thumbnail: "", type: "stream" };
  } catch {
    return { title: shortUrl || "Custom Audio Stream", thumbnail: "", type: "stream" };
  }
}

export function playChime(
  audioElement,
  alarm = "chime",
  customSource = "",
  volume = 35,
  backgroundSource = "",
  resumeBackground = false,
) {
  if (!audioElement) return;
  if (customSource) {
    audioElement.pause();
    audioElement.currentTime = 0;
    audioElement.src = customSource;
    audioElement.loop = false;
    audioElement.volume = volume / 100;
    audioElement.onended = () => {
      if (!resumeBackground || !backgroundSource) return;
      audioElement.src = backgroundSource;
      audioElement.loop = true;
      audioElement.play().catch(() => {});
    };
    audioElement.play().catch(() => {});
    return;
  }
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return undefined;
    const context = new AudioContextClass();
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

export function FocusAudio({ sound, volume, active, customSource }) {
  const contextRef = useRef(null);
  const gainRef = useRef(null);
  const nodesRef = useRef([]);
  // Âm lượng đọc qua ref: effect khởi tạo AudioContext không phụ thuộc `volume`,
  // nên kéo thanh âm lượng không làm audio bị tạo lại (giật tiếng).
  const volumeRef = useRef(volume);
  useEffect(() => {
    if (!active || sound === "mute") return undefined;
    if (customSource) return undefined;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return undefined;
    let context;
    try {
      context = new AudioContextClass();
    } catch {
      return undefined;
    }
    const gain = context.createGain();
    gain.gain.value = (volumeRef.current / 100) * 0.12;
    gain.connect(context.destination);
    gainRef.current = gain;
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
      gainRef.current = null;
      nodesRef.current = [];
    };
  }, [active, sound, customSource]);
  useEffect(() => {
    volumeRef.current = volume;
    if (gainRef.current) gainRef.current.gain.value = (volume / 100) * 0.12;
  }, [volume]);
  return null;
}

export function AudioSettingsModal({ audio, setAudio, onClose, onReset, onPreview }) {
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
    const dataUrl = URL.createObjectURL(file);
    setAudio((current) => ({
      ...current,
      [key]: {
        name: file.name,
        title: file.name,
        thumbnail: "",
        type: file.type,
        mediaType: file.type.startsWith("video/") ? "video" : "audio",
        dataUrl,
        sourceType: "file",
      },
      ...(key === "customBackground" ? { sound: "custom" } : {}),
    }));
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
    <Dialog
      onClose={onClose}
      ariaLabelledBy="audio-settings-title"
      overlayClassName="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      className="panel w-full max-w-md rounded-3xl p-6 shadow-soft outline-none"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Music2 className="text-indigo-600 dark:text-indigo-400" size={20} />
          <div>
            <p className="eyebrow">Âm thanh</p>
            <h2 id="audio-settings-title" className="mt-1 font-display text-xl font-bold">
              Cài đặt âm thanh
            </h2>
          </div>
        </div>
        <button onClick={onClose} className="icon-btn" aria-label="Đóng">
          <X size={18} />
        </button>
      </div>
      <div className="mt-6 flex gap-1 rounded-xl bg-ink/[0.06] p-1 dark:bg-white/[0.08]">
        <button
          onClick={() => setTab("background")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold ${
            tab === "background"
              ? "bg-slab shadow-raised dark:bg-dark3"
              : "text-ink/60 dark:text-white/60"
          }`}
        >
          Nhạc nền tập trung
        </button>
        <button
          onClick={() => setTab("alarm")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-bold ${
            tab === "alarm"
              ? "bg-slab shadow-raised dark:bg-dark3"
              : "text-ink/60 dark:text-white/60"
          }`}
        >
          Chuông báo hết giờ
        </button>
      </div>
      <div className="mt-5">
        {tab === "background" && (
          <div>
            <p className="text-sm font-bold">Nhạc nền tập trung</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {audioOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() =>
                    setAudio((current) => ({ ...current, sound: option.id }))
                  }
                  className={`rounded-xl border px-3 py-2.5 text-left text-xs font-semibold ${
                    audio.sound === option.id
                      ? "border-indigo-500 bg-indigo-500/15 text-indigo-700 dark:text-indigo-300"
                      : "border-ink/10 dark:border-white/15"
                  }`}
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
                className="btn-primary rounded-lg px-3 text-xs disabled:opacity-50"
              >
                {metadataLoading ? "Đang lấy thông tin..." : "Áp dụng"}
              </button>
            </div>
            {audio.customBackground && (
              <div className="mt-3 flex items-center gap-3 rounded-xl bg-slab2 px-3 py-2.5 dark:bg-dark3">
                {audio.customBackground.thumbnail ? (
                  <img
                    src={audio.customBackground.thumbnail}
                    alt=""
                    className="h-10 w-14 rounded-md object-cover"
                  />
                ) : (
                  <Music2 className="shrink-0 animate-pulse text-indigo-500" size={20} />
                )}
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-medium text-ink dark:text-white">
                    {audio.customBackground.title || audio.customBackground.name}
                  </p>
                  <p className="text-xs text-ink/60 dark:text-white/55">
                    {audio.customBackground.type === "youtube"
                      ? "Âm thanh YouTube"
                      : "Âm thanh trực tuyến"}
                  </p>
                </div>
                <button
                  onClick={() => setAudio((current) => ({ ...current, sound: "custom" }))}
                  className="text-indigo-600 dark:text-indigo-400"
                  aria-label="Chọn làm nhạc nền"
                >
                  ◉
                </button>
                <button
                  onClick={() =>
                    setAudio((current) => ({
                      ...current,
                      customBackground: null,
                      sound: "mute",
                    }))
                  }
                  className="text-red-500"
                  aria-label="Xoá nhạc nền tùy chỉnh"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
            {audio.customBackground?.mediaType === "video" && (
              <button
                onClick={() =>
                  setAudio((current) => ({ ...current, customBackground: null, sound: "mute" }))
                }
                className="mt-2 text-xs font-bold text-red-500"
              >
                Xóa video nền
              </button>
            )}
          </div>
        )}
        {tab === "alarm" && (
          <div>
            <p className="text-sm font-bold">Chuông báo hết giờ</p>
            <div className="mt-3 grid gap-2">
              {alarmOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() =>
                    setAudio((current) => ({ ...current, alarm: option.id }))
                  }
                  className={`rounded-xl border px-3 py-2.5 text-left text-xs font-semibold ${
                    audio.alarm === option.id
                      ? "border-indigo-500 bg-indigo-500/15 text-indigo-700 dark:text-indigo-300"
                      : "border-ink/[0.1] dark:border-white/[0.1]"
                  }`}
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
              <div className="mt-3 flex items-center justify-between rounded-lg bg-mist px-3 py-2 text-xs dark:bg-dark3">
                <span className="max-w-[180px] truncate">
                  {audio.customAlarm.name}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onPreview(audio.customAlarm.dataUrl)}
                    className="font-bold text-indigo-600 dark:text-indigo-400"
                  >
                    ▶ Nghe thử
                  </button>
                  <button
                    onClick={() =>
                      setAudio((current) => ({ ...current, customAlarm: null }))
                    }
                    className="text-red-500"
                    aria-label="Xoá chuông báo riêng"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-between border-t border-ink/[0.08] pt-4 dark:border-white/[0.08]">
        <button onClick={onReset} className="btn-ghost text-danger dark:text-dangerfgdark">
          Khôi phục mặc định
        </button>
        <button onClick={onClose} className="btn-primary px-5">
          Xong
        </button>
      </div>
    </Dialog>
  );
}

export function ZenFocus({
  timer,
  progress,
  audio,
  onToggle,
  onMute,
  onExit,
}) {
  return (
    <Dialog
      onClose={onExit}
      ariaLabel="Chế độ tập trung toàn màn hình"
      closeOnBackdrop={false}
      overlayClassName="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B0F17] text-white"
      className="w-full max-w-2xl px-8 text-center outline-none"
    >
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/40">
        {timer.mode === "focus"
          ? `Phiên học tập #${timer.sessions + 1}`
          : "Nghỉ giải lao"}
      </p>
      <p className="mt-5 font-mono text-8xl font-bold tracking-tight text-indigo-400 sm:text-[10rem]">
        {formatTime(timer.secondsLeft)}
      </p>
      <div className="mx-auto mt-10 max-w-md">
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent-2)))",
            }}
          />
        </div>
      </div>
      <div className="mt-10 flex items-center justify-center gap-3">
        <button
          onClick={onToggle}
          className="btn-primary grid h-12 w-12 place-items-center rounded-full p-0 text-white"
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
          aria-label="Thoát chế độ tập trung"
        >
          <X size={18} />
        </button>
      </div>
      <p className="mt-8 text-xs text-white/35">
        Âm thanh:{" "}
        {audioOptions.find((item) => item.id === audio.sound)?.label}
      </p>
    </Dialog>
  );
}
