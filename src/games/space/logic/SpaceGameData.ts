import SpaceLevel from "./SpaceLevel";

export interface GameLevel {
  difficulty: string;
  questions: SpaceLevel[];
}

// Todas as questões do jogo organizadas por nível
export const GameQuestions = [
  // Nível 1 - Identificar planetas pelo nome (respostas com imagem)
  new SpaceLevel(
    "Onde está o planeta Terra?",
    ["terra", "lua", "sol", "saturno"],
    ["earth.png", "moon.png", "sun.png", "saturn.png"],
    "terra",
    "easy",
  ),
  new SpaceLevel(
    "Qual é o Sol?",
    ["planeta", "estrela", "lua", "cometa"],
    ["mars.png", "sun.png", "moon.png", "comet.png"],
    "estrela",
    "easy",
  ),
  new SpaceLevel(
    "Onde está a Lua?",
    ["sol", "marte", "lua", "jupiter"],
    ["sun.png", "mars.png", "moon.png", "jupiter.png"],
    "lua",
    "easy",
  ),
  new SpaceLevel(
    "Onde está Marte?",
    ["marte", "terra", "netuno", "jupiter"],
    ["mars.png", "earth.png", "neptune.png", "jupiter.png"],
    "marte",
    "easy",
  ),
  new SpaceLevel(
    "Onde está Saturno?",
    ["saturno", "jupiter", "urano", "netuno"],
    ["saturn.png", "jupiter.png", "uranus.png", "neptune.png"],
    "saturno",
    "easy",
  ),

  // Nível 2 - Curiosidades dos planetas (respostas com imagem)
  new SpaceLevel(
    "Qual o planeta mais próximo do Sol?",
    ["terra", "venus", "mercurio", "marte"],
    ["earth.png", "venus.png", "mercury.png", "mars.png"],
    "mercurio",
    "medium",
  ),
  new SpaceLevel(
    "Qual é o maior planeta do nosso sistema solar?",
    ["saturno", "jupiter", "urano", "netuno"],
    ["saturn.png", "jupiter.png", "uranus.png", "neptune.png"],
    "jupiter",
    "medium",
  ),
  new SpaceLevel(
    "Qual planeta é conhecido como o 'Planeta Vermelho'?",
    ["venus", "marte", "jupiter", "saturno"],
    ["venus.png", "mars.png", "jupiter.png", "saturn.png"],
    "marte",
    "medium",
  ),
  new SpaceLevel(
    "Qual planeta é o mais quente do sistema solar?",
    ["mercurio", "venus", "terra", "marte"],
    ["mercury.png", "venus.png", "earth.png", "mars.png"],
    "venus",
    "medium",
  ),
  new SpaceLevel(
    "Qual planeta está mais longe do Sol?",
    ["jupiter", "saturno", "urano", "netuno"],
    ["jupiter.png", "saturn.png", "uranus.png", "neptune.png"],
    "netuno",
    "medium",
  ),

  // Nível 3 - Nomes/curiosidades sem imagem
  new SpaceLevel(
    "Qual é o nome da galáxia em que vivemos?",
    ["Andromeda", "Via Lactea", "Triangulo", "Sombrero"],
    null,
    "Via Lactea",
    "hard",
  ),
  new SpaceLevel(
    "Quantos planetas existem no nosso sistema solar?",
    ["7", "8", "9", "10"],
    null,
    "8",
    "hard",
  ),
  new SpaceLevel(
    "Qual é o nome do satélite natural da Terra?",
    ["Europa", "Queijo", "Lua", "Terra"],
    null,
    "Lua",
    "hard",
  ),
  new SpaceLevel(
    "Qual planeta demora mais tempo para dar uma volta ao redor do Sol?",
    ["Jupiter", "Saturno", "Urano", "Netuno"],
    null,
    "Netuno",
    "hard",
  ),
  new SpaceLevel(
    "Como chamamos os cientistas que estudam o espaço?",
    ["Geologos", "Astronomos", "Biologos", "Fisicos"],
    null,
    "Astronomos",
    "hard",
  ),
];

/**
 * Função que agrupa as questões por dificuldade, criando níveis
 */
function groupQuestionsByDifficulty(): GameLevel[] {
  const levelMap = new Map<string, SpaceLevel[]>();

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
