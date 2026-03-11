import { Skeleton } from "@/components/ui/skeleton";
import { Play } from "lucide-react";
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
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  const handleImageError = () => {
    setIsImageLoaded(true); // Hide skeleton even on error
  };

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  const handleVideoError = () => {
    setIsVideoLoaded(true); // Hide skeleton even on error
  };

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

      <Skeleton
        className="absolute inset-0 z-20 aspect-video h-full w-full data-[loaded=true]:hidden"
        data-loaded={previewType === "image" ? isImageLoaded : isVideoLoaded}
      />

      <span
        className="peer absolute inset-0 z-20 flex h-full w-full items-center justify-center opacity-100 data-[shown=true]:opacity-0"
        data-shown={previewType === "video" && isPlaying}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <Play className="h-20 w-20" fill="white" stroke="white" />
      </span>

      {previewType == "image" ? (
        <img
          className="aspect-video object-cover text-center transition-transform duration-300 ease-in-out peer-hover:scale-110 data-[loaded=false]:opacity-0 data-[loaded=true]:opacity-100"
          src={previewContent}
          alt="Preview"
          onLoad={handleImageLoad}
          onError={handleImageError}
          data-loaded={isImageLoaded}
        />
      ) : (
        <video
          ref={videoRef}
          src={previewContent}
          muted
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
          className="aspect-video cursor-pointer object-cover data-[loaded=false]:opacity-0 data-[loaded=true]:opacity-100"
          data-loaded={isVideoLoaded}
        />
      )}
    </div>
  );
}
