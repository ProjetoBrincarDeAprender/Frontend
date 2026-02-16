import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";

export type GameCardPreviewProps = {
  className?: string;
  previewContent: string;
  previewType: "image" | "video";
};

export default function GameCardPreview({
  className,
  previewContent,
  previewType,
}: GameCardPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // Reset to beginning
      setIsPlaying(false);
    }
  };

  const handleClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div
      className={twMerge(
        "relative aspect-video w-full place-content-center content-center overflow-hidden rounded-sm bg-blue-300 md:w-full md:place-self-center md:rounded-sm",
        className,
      )}
    >
      <div
        className="peer absolute top-0 left-0 z-10 aspect-video size-full inset-shadow-xs data-[type=video]:hidden"
        data-type={previewType}
      />
      {previewType == "image" ? (
        <img
          className="aspect-video object-cover text-center transition-transform duration-300 ease-in-out peer-hover:scale-110"
          src={previewContent}
          alt="Preview"
        />
      ) : (
        <video
          ref={videoRef}
          src={previewContent}
          muted
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          className="aspect-video cursor-pointer object-cover"
        />
      )}
    </div>
  );
}
