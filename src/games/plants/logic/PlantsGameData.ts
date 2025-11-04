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
  ),
  new PlantsLevel(
    "Qual são as FOLHAS das plantas?",
    ["folhas", "flores", "caule", "fruta"],
    ["folhas.png", "flores.png", "caule.png", "fruta.png"],
    "folhas",
    "easy",
  ),
  new PlantsLevel(
    "Onde estão as FLORES das plantas?",
    ["flores", "caule", "folhas", "manga"],
    ["flores.png", "caule.png", "folhas.png", "manga.png"],
    "flores",
    "easy",
  ),
  new PlantsLevel(
    "Qual é a FRUTA da planta?",
    ["fruta", "flores", "folhas", "raizes"],
    ["fruta.png", "flores.png", "folhas.png", "raizes.png"],
    "fruta",
    "easy",
  ),
  new PlantsLevel(
    "Onde estão as RAIZES das plantas?",
    ["raizes", "folhas", "caule", "banana"],
    ["raizes.png", "folhas.png", "caule.png", "banana.png"],
    "raizes",
    "easy",
  ),

  // Nível 2 - Curiosidades dos planetas (respostas com imagem)
  new PlantsLevel(
    "Qual a fruta da MANGUEIRA?",
    ["manga", "banana", "maçã", "laranja"],
    ["manga.png", "banana.png", "fruta.png", "laranja.png"],
    "manga",
    "medium",
  ),
  new PlantsLevel(
    "Qual a fruta da LARANJEIRA?",
    ["laranja", "manga", "banana", "maçã"],
    ["laranja.png", "manga.png", "banana.png", "fruta.png"],
    "laranja",
    "medium",
  ),
  new PlantsLevel(
    "Qual a fruta da MACIEIRA?",
    ["laranja", "manga", "banana", "maçã"],
    ["laranja.png", "manga.png", "banana.png", "fruta.png"],
    "maçã",
    "medium",
  ),
  new PlantsLevel(
    "Qual a fruta da BANANEIRA?",
    ["laranja", "manga", "banana", "maçã"],
    ["laranja.png", "manga.png", "banana.png", "fruta.png"],
    "banana",
    "medium",
  ),
  new PlantsLevel(
    "Qual a parte da planta responsável por absorver água e nutrientes do solo?",
    ["caule", "folhas", "flores", "raizes"],
    ["caule.png", "folhas.png", "flores.png", "raizes.png"],
    "raizes",
    "medium",
  ),

  // Nível 3 - Nomes/curiosidades sem imagem
  new PlantsLevel(
    "Qual o nome da pessoa que trabalha com flores?",
    ["Floricultor", "Plantador", "Jardim", "Florador"],
    null,
    "Floricultor",
    "hard",
  ),
  new PlantsLevel(
    "Qual a parte da planta responsável pela fotossíntese?",
    ["Caule", "Folhas", "Flores", "Raízes"],
    null,
    "Folhas",
    "hard",
  ),
  new PlantsLevel(
    "Qual o nome do processo de alimentação das plantas?",
    ["Fotografia", "Queijo", "Fotossíntese", "Terragem"],
    null,
    "Fotossíntese",
    "hard",
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
  ),
  new PlantsLevel(
    "Qual parte da planta absorve os nutrientes do solo?",
    ["Folhas", "Caule", "Raízes", "Frutos"],
    null,
    "Raízes",
    "hard",
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
