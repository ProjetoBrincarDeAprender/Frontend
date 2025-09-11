import { Play, Pause, Timer, Heart } from "lucide-react";

interface CalmItemProps {
  title: string;
  description?: string;
  duration?: string;
  variant: "music" | "breathing";
  isPlaying?: boolean;
  onClick?: () => void;
  onPlayPause?: () => void;
}

export function CalmItem({
  title,
  description,
  duration,
  variant,
  isPlaying = false,
  onClick: _onClick,
  onPlayPause,
}: CalmItemProps) {
  const isMusic = variant === "music";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] hover:border-white/20 hover:shadow-xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 h-16 w-16 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-bl from-white/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 h-12 w-12 -translate-x-6 translate-y-6 rounded-full bg-gradient-to-tr from-white/30 to-transparent"></div>
      </div>

      <div className="relative flex items-center gap-4 p-4">
        {/* Icon/Thumbnail */}
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${
            isMusic
              ? "from-az1 to-az2 bg-gradient-to-br"
              : "from-am0 to-am1 bg-gradient-to-br"
          }`}
        >
          {isMusic ? (
            <div className="text-lg text-white">♪</div>
          ) : (
            <div className="text-lg text-white">∞</div>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <h3
            className="mb-1 truncate text-sm font-medium text-white"
            style={{ fontFamily: "var(--font-1)" }}
          >
            {title}
          </h3>
          {description && (
            <p className="line-clamp-2 text-xs leading-relaxed text-white/60">
              {description}
            </p>
          )}
          {duration && (
            <div className="mt-2 flex items-center gap-1 text-xs text-white/50">
              <Timer className="h-3 w-3" />
              <span>{duration}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onPlayPause && (
            <button
              onClick={onPlayPause}
              className={`rounded-lg p-2 transition-colors duration-200 ${
                isPlaying
                  ? "bg-white/20 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white"
              }`}
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </button>
          )}

          <button className="rounded-lg bg-white/10 p-2 text-white/70 transition-colors duration-200 hover:bg-white/15 hover:text-white">
            <Heart className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar (when playing) */}
      {isPlaying && (
        <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-white/20">
          <div className="from-az1 to-am0 h-full w-1/3 animate-pulse bg-gradient-to-r"></div>
        </div>
      )}
    </div>
  );
}
