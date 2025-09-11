import { useState } from "react";
import { Play, Pause, Volume2, Clock, Heart } from "lucide-react";

interface MusicTrack {
  id: number;
  title: string;
  artist: string;
  duration: string;
  image: string;
  description: string;
  category: string;
}

export function MusicCatalog() {
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const musicTracks: MusicTrack[] = [
    {
      id: 1,
      title: "Paz Interior",
      artist: "Sons da Natureza",
      duration: "15:30",
      image: "/api/placeholder/200/200",
      description:
        "Uma jornada sonora através de sons naturais que acalmam a mente",
      category: "Natureza",
    },
    {
      id: 2,
      title: "Meditação Profunda",
      artist: "Zen Sounds",
      duration: "22:45",
      image: "/api/placeholder/200/200",
      description: "Frequências binaurais para estados meditativos profundos",
      category: "Meditação",
    },
    {
      id: 3,
      title: "Oceano da Serenidade",
      artist: "Aqua Harmony",
      duration: "18:20",
      image: "/api/placeholder/200/200",
      description: "Ondas do oceano combinadas com instrumentos suaves",
      category: "Aquático",
    },
    {
      id: 4,
      title: "Floresta Encantada",
      artist: "Woodland Whispers",
      duration: "25:10",
      image: "/api/placeholder/200/200",
      description: "Sons da floresta com pássaros e vento nas árvores",
      category: "Natureza",
    },
    {
      id: 5,
      title: "Cristais de Luz",
      artist: "Crystal Resonance",
      duration: "12:35",
      image: "/api/placeholder/200/200",
      description: "Vibrações cristalinas para limpeza energética",
      category: "Cristais",
    },
    {
      id: 6,
      title: "Respiração Lunar",
      artist: "Moon Phase",
      duration: "20:00",
      image: "/api/placeholder/200/200",
      description: "Ritmos lunares para relaxamento noturno",
      category: "Lunar",
    },
  ];

  const handlePlayPause = (trackId: number) => {
    if (selectedTrack === trackId) {
      setIsPlaying(!isPlaying);
    } else {
      setSelectedTrack(trackId);
      setIsPlaying(true);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      {/* Header Section */}
      <div className="mb-12 text-center">
        <h2
          className="mb-4 text-4xl font-light tracking-wide text-white"
          style={{ fontFamily: "var(--font-1)" }}
        >
          Músicas para Relaxar
        </h2>
        <p className="text-az1 mx-auto max-w-2xl text-lg leading-relaxed">
          Explore nossa coleção curada de sons relaxantes e meditativos
        </p>
      </div>

      {/* Music Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {musicTracks.map((track) => (
          <div
            key={track.id}
            className="group border-az2/30 from-az3/80 to-az4/80 hover:border-az1/50 hover:shadow-az4/25 relative overflow-hidden rounded-3xl border bg-gradient-to-br backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 h-32 w-32 -translate-x-16 -translate-y-16 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
              <div className="absolute right-0 bottom-0 h-24 w-24 translate-x-12 translate-y-12 rounded-full bg-gradient-to-tl from-white/20 to-transparent"></div>
            </div>

            {/* Track Image */}
            <div className="relative h-48 overflow-hidden">
              <div className="from-az1 to-az2 absolute inset-0 bg-gradient-to-br opacity-80"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                  <Volume2 className="h-8 w-8 text-white" />
                </div>
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <button
                  onClick={() => handlePlayPause(track.id)}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-colors duration-200 hover:bg-white"
                >
                  {selectedTrack === track.id && isPlaying ? (
                    <Pause className="text-az4 h-6 w-6" />
                  ) : (
                    <Play className="text-az4 ml-1 h-6 w-6" />
                  )}
                </button>
              </div>

              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                  {track.category}
                </span>
              </div>

              {/* Duration */}
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-1 rounded-full bg-black/20 px-2 py-1 text-xs text-white backdrop-blur-sm">
                  <Clock className="h-3 w-3" />
                  {track.duration}
                </div>
              </div>
            </div>

            {/* Track Info */}
            <div className="p-6">
              <h3
                className="group-hover:text-az1 mb-2 text-xl font-semibold text-white transition-colors"
                style={{ fontFamily: "var(--font-1)" }}
              >
                {track.title}
              </h3>
              <p className="text-az1 mb-3 text-sm font-medium">
                {track.artist}
              </p>
              <p className="text-az1/80 mb-4 text-sm leading-relaxed">
                {track.description}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handlePlayPause(track.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 font-medium transition-all duration-200 ${
                    selectedTrack === track.id && isPlaying
                      ? "bg-az1 hover:bg-az2 text-white"
                      : "bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                  }`}
                >
                  {selectedTrack === track.id && isPlaying ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Pausar
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Reproduzir
                    </>
                  )}
                </button>

                <button className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/20">
                  <Heart className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Progress Bar (when playing) */}
            {selectedTrack === track.id && isPlaying && (
              <div className="bg-az4/50 absolute right-0 bottom-0 left-0 h-1">
                <div className="from-az1 to-az2 h-full w-1/3 animate-pulse bg-gradient-to-r"></div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Wave Decoration */}
      <div className="relative mt-16">
        <svg
          className="text-az4/20 h-16 w-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C300,120 600,0 900,60 C1050,90 1200,30 1200,60 L1200,120 L0,120 Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </div>
  );
}
