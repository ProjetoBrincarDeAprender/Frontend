import PlantsLevel from "./PlantsLevel";

export interface GameLevel {
  difficulty: string;
  questions: PlantsLevel[];
}

// Todas as questões do jogo organizadas por nível
export const GameQuestions = [
  // Nível 1 - Identificar planetas pelo nome (respostas com imagem)
  new PlantsLevel(
    "Qual é o CAULE das plantas?",
    ["caule", "folhas", "flores", "raiz"],
    ["caule.png", "folhas.png", "flores.png", "raizes.png"],
    "caule",
    "easy",
    3,
  ),
  new PlantsLevel(
    "Qual são as FOLHAS das plantas?",
    ["folhas", "flores", "caule", "fruta"],
    ["folhas.png", "flores.png", "caule.png", "fruta.png"],
    "folhas",
    "easy",
    4,
  ),
  new PlantsLevel(
    "Onde estão as FLORES das plantas?",
    ["flores", "caule", "folhas", "manga"],
    ["flores.png", "caule.png", "folhas.png", "manga.png"],
    "flores",
    "easy",
    5,
  ),
  new PlantsLevel(
    "Qual é a FRUTA da planta?",
    ["fruta", "flores", "folhas", "raizes"],
    ["fruta.png", "flores.png", "folhas.png", "raizes.png"],
    "fruta",
    "easy",
    6,
  ),
  new PlantsLevel(
    "Onde estão as RAIZES das plantas?",
    ["raizes", "folhas", "caule", "banana"],
    ["raizes.png", "folhas.png", "caule.png", "banana.png"],
    "raizes",
    "easy",
    7,
  ),

  // Nível 2 - Curiosidades dos planetas (respostas com imagem)
  new PlantsLevel(
    "Qual a fruta da MANGUEIRA?",
    ["manga", "banana", "maçã", "laranja"],
    ["manga.png", "banana.png", "fruta.png", "laranja.png"],
    "manga",
    "medium",
    8,
  ),
  new PlantsLevel(
    "Qual a fruta da LARANJEIRA?",
    ["laranja", "manga", "banana", "maçã"],
    ["laranja.png", "manga.png", "banana.png", "fruta.png"],
    "laranja",
    "medium",
    9,
  ),
  new PlantsLevel(
    "Qual a fruta da MACIEIRA?",
    ["laranja", "manga", "banana", "maçã"],
    ["laranja.png", "manga.png", "banana.png", "fruta.png"],
    "maçã",
    "medium",
    10,
  ),
  new PlantsLevel(
    "Qual a fruta da BANANEIRA?",
    ["laranja", "manga", "banana", "maçã"],
    ["laranja.png", "manga.png", "banana.png", "fruta.png"],
    "banana",
    "medium",
    11,
  ),
  new PlantsLevel(
    "Qual a parte da planta responsável por absorver água e nutrientes do solo?",
    ["caule", "folhas", "flores", "raizes"],
    ["caule.png", "folhas.png", "flores.png", "raizes.png"],
    "raizes",
    "medium",
    12,
  ),

  // Nível 3 - Nomes/curiosidades sem imagem
  new PlantsLevel(
    "Qual o nome da pessoa que trabalha com flores?",
    ["Floricultor", "Plantador", "Jardim", "Florador"],
    null,
    "Floricultor",
    "hard",
    13,
  ),
  new PlantsLevel(
    "Qual a parte da planta responsável pela fotossíntese?",
    ["Caule", "Folhas", "Flores", "Raízes"],
    null,
    "Folhas",
    "hard",
    14,
  ),
  new PlantsLevel(
    "Qual o nome do processo de alimentação das plantas?",
    ["Fotografia", "Queijo", "Fotossíntese", "Terragem"],
    null,
    "Fotossíntese",
    "hard",
    15,
  ),
  new PlantsLevel(
    "Qual é a função das flores nas plantas?",
    [
      "Produzir sementes",
      "Fazer fotossíntese",
      "Absorver água",
      "Armazenar nutrientes",
    ],
    null,
    "Produzir sementes",
    "hard",
    16,
  ),
  new PlantsLevel(
    "Qual parte da planta absorve os nutrientes do solo?",
    ["Folhas", "Caule", "Raízes", "Frutos"],
    null,
    "Raízes",
    "hard",
    17,
  ),
];

/**
 * Função que agrupa as questões por dificuldade, criando níveis
 */
function groupQuestionsByDifficulty(): GameLevel[] {
  const levelMap = new Map<string, PlantsLevel[]>();

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
