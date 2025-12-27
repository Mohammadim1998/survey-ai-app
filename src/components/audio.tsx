import { useEffect, useRef, useState } from "react";
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

  const bars = 45;
  const heights = [6, 10, 14, 8, 12];

  // ⬇️ Event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (!isDragging) setCurrentTime(Math.floor(audio.currentTime));
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

    if (isPlaying) audio.pause();
    else audio.play();

    setIsPlaying(!isPlaying);
  };

  const toggleSpeed = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const next = speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1;
    audio.playbackRate = next;
    setSpeed(next);
  };

  // ⬇️ Handle drag
  const handleDrag = (clientX: number) => {
    if (!audioRef.current || !waveRef.current || !duration) return;
    const rect = waveRef.current.getBoundingClientRect();
    let clickX = clientX - rect.left;
    if (clickX < 0) clickX = 0;
    if (clickX > rect.width) clickX = rect.width;
    const percent = clickX / rect.width;
    const newTime = Math.floor(percent * duration);

    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime; // ⬅️ این باعث می‌شود جای نوار برنگردد
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleDrag(e.clientX);

    const handleMouseMove = (eMove: MouseEvent) => handleDrag(eMove.clientX);
    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleDrag(e.touches[0].clientX);

    const handleTouchMove = (eMove: TouchEvent) => handleDrag(eMove.touches[0].clientX);
    const handleTouchEnd = () => {
      setIsDragging(false);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
  };

  const progress = duration > 0 ? currentTime / duration : 0;
  const activeBars = Math.floor(progress * bars);

  return (
    <div className="w-full flex flex-col gap-y-1 rounded-xl px-3 py-2 select-none">
      <audio ref={audioRef} src={src} preload="metadata" />

      <div className="flex items-center gap-3">
        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          className="flex shrink-0 text-white h-9 w-9 items-center justify-center rounded-full bg-orange-500"
        >
          {isPlaying ? "❚❚" : <FaPlay />}
        </button>

        {/* Waveform */}
        <div
          ref={waveRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          className="relative flex flex-1 items-center h-7 cursor-pointer"
        >
          {/* Baseline */}
          <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-gray-300 rounded-full" />

          {/* Bars */}
          <div className="relative flex items-center gap-[3px] w-full">
            {Array.from({ length: bars }).map((_, i) => (
              <span
                key={i}
                className={`w-[3px] rounded-full transition-colors ${
                  i < activeBars ? "bg-orange-500" : "bg-gray-300"
                }`}
                style={{ height: `${heights[i % heights.length]}px` }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="w-full flex items-center justify-between">
        {/* Current Time */}
        <span className="text-xs ml-12 text-orange-500 whitespace-nowrap">
          {formatTime(currentTime)}
        </span>

        {/* Speed & Duration */}
        <div className="flex items-center gap-x-[10px]">
          <button
            onClick={toggleSpeed}
            className="rounded-md bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-600"
          >
            {speed}X
          </button>

          <span className="text-xs text-gray-600 whitespace-nowrap">
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
