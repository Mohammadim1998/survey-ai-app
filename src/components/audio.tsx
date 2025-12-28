import { useEffect, useMemo, useRef, useState } from "react";
import { FaPlay } from "react-icons/fa6";

type Props = {
  src: string;
};

export default function AudioPlayer({ src }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const waveRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const bars = 80;

  // 🎧 waveform heights (با micro-line ها)
  const barHeights = useMemo(() => {
    return Array.from({ length: bars }, (_, i) => {
      const center = Math.abs(i - bars / 2) / (bars / 2);
      const base = 5 + (1 - center) * 7; // 5 → 12
      const noise = Math.random() * 3;

      // 25٪ خط‌های خیلی کوتاه
      if (Math.random() < 0.25) {
        return Math.floor(Math.random() * 3) + 2; // 2–4px
      }

      return Math.floor(base + noise);
    });
  }, []);

  // 🎵 audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (!isDragging) {
        setCurrentTime(Math.floor(audio.currentTime));
      }
    };

    const onLoaded = () => {
      setDuration(Math.floor(audio.duration) || 0);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
    };
  }, [isDragging]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    isPlaying ? audio.pause() : audio.play();
    setIsPlaying(!isPlaying);
  };

  const toggleSpeed = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const next = speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1;
    audio.playbackRate = next;
    setSpeed(next);
  };

  // 🖱 drag logic
  const handleDrag = (clientX: number) => {
    if (!audioRef.current || !waveRef.current || !duration) return;

    const rect = waveRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = x / rect.width;
    const newTime = Math.floor(percent * duration);

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleDrag(e.clientX);

    const move = (ev: MouseEvent) => handleDrag(ev.clientX);
    const up = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleDrag(e.touches[0].clientX);

    const move = (ev: TouchEvent) => handleDrag(ev.touches[0].clientX);
    const up = () => {
      setIsDragging(false);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };

    window.addEventListener("touchmove", move);
    window.addEventListener("touchend", up);
  };

  const progress = duration ? currentTime / duration : 0;
  const activeBars = Math.floor(progress * bars);

  return (
    <div className="w-full flex flex-col gap-y-0 rounded-xl h-19.25 select-none ">
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex items-center gap-2">
        {/* ▶ Play */}
        <button
          onClick={togglePlay}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white"
        >
          <span className="w-6 h-6 flex justify-center items-center">
            {isPlaying ? "❚❚" : <FaPlay />}
          </span>
        </button>

        {/* 🌊 Waveform */}
        <div
          ref={waveRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className="w-40 flex flex-1 items-center h-7.5 cursor-pointer"
        >
          <div className="flex items-center w-full gap-[2px]">
            {barHeights.map((h, i) => (
              <span
                key={i}
                className={`rounded-full transition-colors ${i < activeBars ? "bg-orange-500" : "bg-gray-300"
                  }`}
                style={{
                  width: "2px",
                  height: `${h}px`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ⏱ Time & Speed */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-normal block ml-12 text-orange-500">
          {formatTime(currentTime)}
        </span>

        <div className="flex items-center gap-[10px]">
          <button
            onClick={toggleSpeed}
            className="rounded-md bg-white p-1 cursor-pointer flex justify-center items-center h-4 border-[1.25px] border-[#F4842F] text-[10px] font-bold text-orange-600"
          >
            {speed}X
          </button>

          <span className="text-xs font-normal block text-[#747474]">
            {duration ? formatTime(duration) : "--:--"}
          </span>
        </div>
      </div>
    </div>
  );
}

function formatTime(time: number) {
  if (!time || Number.isNaN(time)) return "0:00";
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
