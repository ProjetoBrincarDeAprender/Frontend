import { useState } from "react";
import { MusicCatalog } from "./MusicCatalog";
import { BreathingCatalog } from "./BreathingCatalog";
import { Music, Wind, Heart, Brain } from "lucide-react";

const categories = [
  {
    id: "music",
    label: "Músicas",
    icon: <Music className="h-6 w-6" />,
    description: "Sons relaxantes e meditativos",
    gradient: "from-teal-500 to-emerald-600",
  },
  {
    id: "breathing",
    label: "Respiração",
    icon: <Wind className="h-6 w-6" />,
    description: "Técnicas de respiração guiada",
    gradient: "from-emerald-500 to-teal-600",
  },
];

export function Calm() {
  const [selected, setSelected] = useState("music");

  return (
    <div className="from-purplish-blue via-purplish-blue-dark to-purplish-blue min-h-screen bg-gradient-to-br">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="from-az1/20 to-am0/20 absolute top-20 left-10 h-72 w-72 rounded-full bg-gradient-to-br blur-3xl"></div>
          <div className="from-am0/20 to-az1/20 absolute top-40 right-20 h-96 w-96 rounded-full bg-gradient-to-bl blur-3xl"></div>
          <div className="from-az1/20 to-am0/20 absolute bottom-20 left-1/3 h-80 w-80 rounded-full bg-gradient-to-tr blur-3xl"></div>
        </div>

        {/* Wave Decoration */}
        <div className="absolute top-0 left-0 h-32 w-full">
          <svg
            className="text-purplish-blue-dark/30 h-full w-full"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,120 C300,60 600,120 900,60 C1050,30 1200,90 1200,60 L1200,120 L0,120 Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>

        <div className="relative z-10 flex flex-col items-center px-4 py-20">
          <div className="mb-16 max-w-4xl text-center">
            <h1
              className="mb-6 text-6xl font-light tracking-wide text-white md:text-7xl"
              style={{ fontFamily: "var(--font-1)" }}
            >
              <span className="from-az1 via-am1 to-az1 bg-gradient-to-r bg-clip-text text-transparent">
                Relaxamento
              </span>
              <br />
              <span className="text-white/90">& Meditação</span>
            </h1>
            <p className="mx-auto max-w-2xl text-xl leading-relaxed text-white/70">
              Encontre sua paz interior através de músicas relaxantes e técnicas
              de respiração guiadas
            </p>
          </div>

          {/* Category Selection */}
          <div className="mb-20 flex flex-col gap-6 sm:flex-row">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelected(cat.id)}
                className={`group relative min-w-[280px] overflow-hidden rounded-3xl p-8 transition-all duration-500 ${
                  selected === cat.id
                    ? "shadow-az4/50 scale-105 shadow-2xl"
                    : "hover:shadow-az4/25 hover:scale-102 hover:shadow-xl"
                }`}
                style={{
                  background:
                    selected === cat.id
                      ? `linear-gradient(135deg, rgba(31, 67, 95, 0.9), rgba(97, 119, 166, 0.9))`
                      : "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(20px)",
                  border:
                    selected === cat.id
                      ? "1px solid rgba(31, 67, 95, 0.5)"
                      : "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 h-24 w-24 translate-x-12 -translate-y-12 rounded-full bg-gradient-to-bl from-white/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 h-20 w-20 -translate-x-10 translate-y-10 rounded-full bg-gradient-to-tr from-white/30 to-transparent"></div>
                </div>

                <div className="relative z-10 text-center">
                  <div
                    className={`mb-4 inline-flex rounded-2xl p-4 ${
                      selected === cat.id
                        ? "bg-white/20"
                        : "bg-white/10 group-hover:bg-white/15"
                    } transition-colors duration-300`}
                  >
                    <div className="text-white">{cat.icon}</div>
                  </div>

                  <h3
                    className={`mb-2 text-2xl font-semibold transition-colors duration-300 ${
                      selected === cat.id
                        ? "text-white"
                        : "text-white/90 group-hover:text-white"
                    }`}
                    style={{ fontFamily: "var(--font-1)" }}
                  >
                    {cat.label}
                  </h3>

                  <p
                    className={`text-sm transition-colors duration-300 ${
                      selected === cat.id
                        ? "text-white/80"
                        : "text-white/60 group-hover:text-white/80"
                    }`}
                  >
                    {cat.description}
                  </p>
                </div>

                {/* Selection Indicator */}
                {selected === cat.id && (
                  <div className="absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-white/50 to-white/30"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative z-10">
        {selected === "music" && <MusicCatalog />}
        {selected === "breathing" && <BreathingCatalog />}
      </div>

      {/* Bottom Wave */}
      <div className="relative -mt-20">
        <svg
          className="text-purplish-blue-dark/30 h-32 w-full"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C300,60 600,0 900,60 C1050,90 1200,30 1200,60 L1200,120 L0,120 Z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </div>
  );
}
