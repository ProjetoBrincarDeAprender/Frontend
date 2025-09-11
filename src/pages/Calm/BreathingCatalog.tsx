import { useState } from "react";
import { Play, Pause, Timer, Wind, Heart, Brain, Moon } from "lucide-react";

interface BreathingExercise {
  id: number;
  title: string;
  description: string;
  duration: string;
  difficulty: "Iniciante" | "Intermediário" | "Avançado";
  icon: React.ReactNode;
  benefits: string[];
  instructions: string;
}

export function BreathingCatalog() {
  const [selectedExercise, setSelectedExercise] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);

  const breathingExercises: BreathingExercise[] = [
    {
      id: 1,
      title: "Respiração Profunda",
      description:
        "Técnica fundamental para acalmar a mente e reduzir o estresse",
      duration: "5-10 min",
      difficulty: "Iniciante",
      icon: <Wind className="h-6 w-6" />,
      benefits: ["Reduz ansiedade", "Melhora foco", "Relaxa músculos"],
      instructions:
        "Inspire profundamente pelo nariz por 4 segundos, segure por 4 segundos, expire pela boca por 6 segundos",
    },
    {
      id: 2,
      title: "Respiração Quadrada",
      description:
        "Padrão equilibrado que promove clareza mental e estabilidade",
      duration: "10-15 min",
      difficulty: "Intermediário",
      icon: <Timer className="h-6 w-6" />,
      benefits: ["Equilibra energia", "Aumenta concentração", "Melhora sono"],
      instructions:
        "Inspire por 4 segundos, segure por 4 segundos, expire por 4 segundos, pause por 4 segundos",
    },
    {
      id: 3,
      title: "Respiração Alternada",
      description: "Técnica antiga que harmoniza os hemisférios cerebrais",
      duration: "15-20 min",
      difficulty: "Intermediário",
      icon: <Brain className="h-6 w-6" />,
      benefits: ["Balanceia mente", "Reduz tensão", "Aumenta energia"],
      instructions:
        "Feche a narina direita, inspire pela esquerda, feche a esquerda, expire pela direita. Repita alternando",
    },
    {
      id: 4,
      title: "Respiração 4-7-8",
      description: "Técnica poderosa para induzir relaxamento profundo",
      duration: "5-15 min",
      difficulty: "Iniciante",
      icon: <Heart className="h-6 w-6" />,
      benefits: ["Induz sono", "Reduz estresse", "Acalma nervos"],
      instructions:
        "Inspire pelo nariz por 4 segundos, segure por 7 segundos, expire pela boca por 8 segundos",
    },
    {
      id: 5,
      title: "Respiração Lunar",
      description: "Prática noturna para preparar o corpo para o descanso",
      duration: "10-20 min",
      difficulty: "Avançado",
      icon: <Moon className="h-6 w-6" />,
      benefits: ["Prepara para sono", "Relaxa profundamente", "Regula ritmos"],
      instructions:
        "Foque na expiração prolongada, inspire naturalmente, expire lenta e profundamente",
    },
    {
      id: 6,
      title: "Respiração do Oceano",
      description: "Som suave como ondas do mar para relaxamento profundo",
      duration: "15-30 min",
      difficulty: "Intermediário",
      icon: <Wind className="h-6 w-6" />,
      benefits: ["Relaxa completamente", "Reduz dores", "Melhora humor"],
      instructions:
        "Crie um som suave na garganta ao respirar, como o som das ondas do oceano",
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Iniciante":
        return "bg-am0/20 text-am1 border-am0/30";
      case "Intermediário":
        return "bg-am2/20 text-am1 border-am2/30";
      case "Avançado":
        return "bg-am3/20 text-am1 border-am3/30";
      default:
        return "bg-az2/20 text-az1 border-az2/30";
    }
  };

  const handleStartExercise = (exerciseId: number) => {
    if (selectedExercise === exerciseId) {
      setIsActive(!isActive);
    } else {
      setSelectedExercise(exerciseId);
      setIsActive(true);
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
          Exercícios de Respiração
        </h2>
        <p className="text-az1 mx-auto max-w-2xl text-lg leading-relaxed">
          Descubra técnicas ancestrais de respiração para transformar sua mente
          e corpo
        </p>
      </div>

      {/* Breathing Exercises Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {breathingExercises.map((exercise) => (
          <div
            key={exercise.id}
            className="group border-az2/30 from-az3/80 to-az4/80 hover:border-az1/50 hover:shadow-az4/25 relative overflow-hidden rounded-3xl border bg-gradient-to-br backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 h-28 w-28 translate-x-14 -translate-y-14 rounded-full bg-gradient-to-bl from-white/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 h-20 w-20 -translate-x-10 translate-y-10 rounded-full bg-gradient-to-tr from-white/20 to-transparent"></div>
            </div>

            {/* Exercise Header */}
            <div className="relative p-6 pb-4">
              <div className="mb-4 flex items-start justify-between">
                <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
                  <div className="text-white">{exercise.icon}</div>
                </div>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}
                >
                  {exercise.difficulty}
                </span>
              </div>

              <h3
                className="group-hover:text-az1 mb-2 text-xl font-semibold text-white transition-colors"
                style={{ fontFamily: "var(--font-1)" }}
              >
                {exercise.title}
              </h3>
              <p className="text-az1/80 mb-4 text-sm leading-relaxed">
                {exercise.description}
              </p>

              <div className="text-az1 flex items-center gap-2 text-sm">
                <Timer className="h-4 w-4" />
                <span className="font-medium">{exercise.duration}</span>
              </div>
            </div>

            {/* Benefits */}
            <div className="px-6 pb-4">
              <div className="flex flex-wrap gap-2">
                {exercise.benefits.map((benefit, index) => (
                  <span
                    key={index}
                    className="text-az1/80 rounded-lg bg-white/5 px-2 py-1 text-xs"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>

            {/* Instructions Preview */}
            <div className="px-6 pb-4">
              <p className="text-az1/60 text-xs leading-relaxed">
                {exercise.instructions}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="px-6 pb-6">
              <button
                onClick={() => handleStartExercise(exercise.id)}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-medium transition-all duration-200 ${
                  selectedExercise === exercise.id && isActive
                    ? "bg-az1 hover:bg-az2 text-white"
                    : "bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                }`}
              >
                {selectedExercise === exercise.id && isActive ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Pausar Exercício
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Iniciar Exercício
                  </>
                )}
              </button>
            </div>

            {/* Active Indicator */}
            {selectedExercise === exercise.id && isActive && (
              <div className="bg-az4/50 absolute right-0 bottom-0 left-0 h-1">
                <div className="from-az1 to-az2 h-full w-2/3 animate-pulse bg-gradient-to-r"></div>
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
