import SensorialLevel from "./SensorialLevel";

export interface GameLevel {
  difficulty: string;
  questions: SensorialLevel[];
}

// Todas as questões do jogo organizadas por nível
export const GameQuestions = [
  // Nível 1 - Audio to Image (5 questões)
  new SensorialLevel(
    "Que som você está ouvindo?",
    ["chuva", "tempestade", "chuva forte"],
    ["rain.png", "storm.png", "heavy_rain.png"],
    null,
    "sounds/rain.m4a",
    null,
    "chuva",
    "easy",
    "audio-to-image",
    83,
  ),
  new SensorialLevel(
    "Qual instrumento está tocando?",
    ["bateria", "violão", "flauta"],
    ["drums.png", "guitar.png", "flute.png"],
    null,
    "sounds/drums.m4a",
    null,
    "bateria",
    "easy",
    "audio-to-image",
    84,
  ),
  new SensorialLevel(
    "Que som de casa você está ouvindo?",
    ["campainha", "microondas", "telefone"],
    ["doorbell.png", "microwave.png", "telephone.png"],
    null,
    "sounds/doorbell.m4a",
    null,
    "campainha",
    "easy",
    "audio-to-image",
    85,
  ),
  new SensorialLevel(
    "Que som você está ouvindo?",
    ["tempestade", "chuva", "chuva forte"],
    ["storm.png", "rain.png", "heavy_rain.png"],
    null,
    "sounds/storm.m4a",
    null,
    "tempestade",
    "easy",
    "audio-to-image",
    86,
  ),
  new SensorialLevel(
    "Que aparelho está fazendo este som?",
    ["campainha", "microondas", "telefone"],
    ["doorbell.png", "microwave.png", "telephone.png"],
    null,
    "sounds/telephone.m4a",
    null,
    "telefone",
    "easy",
    "audio-to-image",
    87,
  ),

  // Nível 2 - Image to Audio (5 questões)
  new SensorialLevel(
    "Qual som corresponde a esta imagem?",
    ["violão", "bateria", "flauta"],
    null,
    ["sounds/guitar.m4a", "sounds/drums.m4a", "sounds/flute.m4a"],
    null,
    "guitar.png",
    "violão",
    "medium",
    "image-to-audio",
    88,
  ),
  new SensorialLevel(
    "Qual som corresponde a esta imagem?",
    ["chuva forte", "chuva", "tempestade"],
    null,
    ["sounds/heavy_rain.m4a", "sounds/rain.m4a", "sounds/storm.m4a"],
    null,
    "heavy_rain.png",
    "chuva forte",
    "medium",
    "image-to-audio",
    89,
  ),
  new SensorialLevel(
    "Qual som corresponde a esta imagem?",
    ["telefone", "campainha", "microondas"],
    null,
    ["sounds/telephone.m4a", "sounds/doorbell.m4a", "sounds/microwave.m4a"],
    null,
    "telephone.png",
    "telefone",
    "medium",
    "image-to-audio",
    90,
  ),
  new SensorialLevel(
    "Qual som corresponde a esta imagem?",
    ["flauta", "violão", "bateria"],
    null,
    ["sounds/flute.m4a", "sounds/guitar.m4a", "sounds/drums.m4a"],
    null,
    "flute.png",
    "flauta",
    "medium",
    "image-to-audio",
    91,
  ),
  new SensorialLevel(
    "Qual som corresponde a esta imagem?",
    ["microondas", "liquidificador", "campainha"],
    null,
    ["sounds/microwave.m4a", "sounds/blender.m4a", "sounds/doorbell.m4a"],
    null,
    "microwave.png",
    "microondas",
    "medium",
    "image-to-audio",
    92,
  ),
];

/**
 * Função que agrupa as questões por dificuldade, criando níveis
 */
function groupQuestionsByDifficulty(): GameLevel[] {
  const levelMap = new Map<string, SensorialLevel[]>();

  // Agrupar questões por dificuldade
  GameQuestions.forEach((question) => {
    const difficulty = question.getDifficulty();
    if (!levelMap.has(difficulty)) {
      levelMap.set(difficulty, []);
    }
    levelMap.get(difficulty)!.push(question);
  });

  return Array.from(levelMap.entries()).map(([difficulty, questions]) => ({
    difficulty,
    questions,
  }));
}

export const GameLevels = groupQuestionsByDifficulty();
