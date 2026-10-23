import { useEffect, useMemo, useRef, useState } from "react";

const YOUTUBE_API = "https://www.youtube.com/iframe_api";
let youtubeApiPromise = null;

/** Nạp IFrame API đúng một lần, chỉ khi người dùng thực sự chọn nhạc YouTube. */
const loadYouTubeApi = () => {
  if (typeof window === "undefined") return Promise.reject(new Error("YouTube chỉ chạy trong trình duyệt."));
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!youtubeApiPromise) {
    youtubeApiPromise = new Promise((resolve, reject) => {
      const previousReady = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        try {
          previousReady?.();
        } finally {
          resolve(window.YT);
        }
      };
      if (!document.querySelector('script[data-lingua-youtube-api="true"]')) {
        const script = document.createElement("script");
        script.src = YOUTUBE_API;
        script.async = true;
        script.dataset.linguaYoutubeApi = "true";
        script.onerror = () => {
          youtubeApiPromise = null;
          reject(new Error("Không thể tải YouTube IFrame API."));
        };
        document.head.appendChild(script);
      }
    });
  }
  return youtubeApiPromise;
};

/** Lấy id video từ các dạng link YouTube thường gặp. */
export const youtubeVideoId = (url = "") => {
  const value = String(url).trim();
  if (/^[\w-]{11}$/.test(value)) return value;
  const patterns = [
    /[?&]v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /\/embed\/([\w-]{11})/,
    /\/shorts\/([\w-]{11})/,
    /\/live\/([\w-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = value.match(pattern);
    if (match) return match[1];
  }
  return "";
};

/**
 * Trình phát nhạc nền YouTube tối giản.
 *
 * Chỉ tải `iframe_api` khi component được mount (người dùng chọn nguồn YouTube)
 * và không kéo theo dash.js/hls.js như `react-player` bản đầy đủ.
 */
export default function YouTubeAudio({ url, playing = false, volume = 35 }) {
  const mountRef = useRef(null);
  const playerRef = useRef(null);
  const playingRef = useRef(playing);
  const volumeRef = useRef(volume);
  const [ready, setReady] = useState(false);
  const videoId = useMemo(() => youtubeVideoId(url), [url]);

  playingRef.current = playing;
  volumeRef.current = volume;

  useEffect(() => {
    if (!videoId || !mountRef.current) return undefined;
    let active = true;
    let player = null;

    loadYouTubeApi()
      .then((YT) => {
        if (!active || !mountRef.current) return;
        player = new YT.Player(mountRef.current, {
          videoId,
          host: "https://www.youtube-nocookie.com",
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            loop: 1,
            playlist: videoId,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => {
              if (!active) return;
              playerRef.current = event.target;
              event.target.setVolume(volumeRef.current);
              if (playingRef.current && volumeRef.current > 0) event.target.playVideo();
              setReady(true);
            },
            onStateChange: (event) => {
              if (active && event.data === YT.PlayerState.ENDED && playingRef.current) {
                event.target.playVideo();
              }
            },
          },
        });
      })
      .catch(() => {
        /* Không có mạng hoặc bị chặn: giữ im lặng, đồng hồ vẫn chạy bình thường. */
      });

    return () => {
      active = false;
      setReady(false);
      playerRef.current = null;
      try {
        player?.destroy();
      } catch {
        /* player có thể chưa kịp khởi tạo */
      }
    };
  }, [videoId]);

  useEffect(() => {
    if (!ready) return;
    const player = playerRef.current;
    if (!player) return;
    player.setVolume(Math.max(0, Math.min(100, Number(volume) || 0)));
    if (playing && volume > 0) player.playVideo();
    else player.pauseVideo();
  }, [playing, ready, volume]);

  return (
    <div className="pointer-events-none fixed left-[-9999px] top-0 h-px w-px overflow-hidden" aria-hidden="true">
      <div ref={mountRef} />
    </div>
  );
}
