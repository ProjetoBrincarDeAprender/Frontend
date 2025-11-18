import HygieneLevel from "./HygieneLevel";

export interface GameLevel {
  difficulty: string;
  questions: HygieneLevel[];
}

// Todas as questões do jogo organizadas por nível
export const GameQuestions = [
  // Nível 1 - Identificar itens de higiene baseado na ação da Duda (com actionImage e 2 opções)
  new HygieneLevel(
    "A Duda está lavando as mãos. Qual item ela precisa usar?",
    ["sabão", "toalha"],
    ["sabao.png", "toalha.png"],
    "sabão",
    "easy",
    "lavandoMao.png",
  ),
  new HygieneLevel(
    "A Duda está tomando banho. Qual item ela precisa para secar o corpo?",
    ["toalha", "shampoo"],
    ["toalha.png", "shampoo.png"],
    "toalha",
    "easy",
    "tomandoBanho.png",
  ),
  new HygieneLevel(
    "A Duda está escovando os dentes. Qual item ela está usando?",
    ["pastaEscova", "pente"],
    ["pastaEscova.png", "pente.png"],
    "pastaEscova",
    "easy",
    "escovandoDente.png",
  ),
  new HygieneLevel(
    "A Duda vai cortar as unhas. Qual item ela precisa usar?",
    ["cortaUnha", "escovaCabelo"],
    ["cortaUnha.png", "escovaCabelo.png"],
    "cortaUnha",
    "easy",
    "cortandoUnha.png",
  ),
  new HygieneLevel(
    "A Duda está escovando o cabelo. Qual item ela está usando?",
    ["escovaCabelo", "sabão"],
    ["escovaCabelo.png", "sabao.png"],
    "escovaCabelo",
    "easy",
    "penteandoCabelo.png",
  ),

  // Nível 2 - Ações de higiene (respostas com imagem, sem nomes)
  new HygieneLevel(
    "Qual item usado para LAVAR AS MÃOS?",
    ["sabao", "toalha", "pastaEscova", "escovaCabelo"],
    ["sabao.png", "toalha.png", "pastaEscova.png", "escovaCabelo.png"],
    "sabao",
    "medium",
  ),
  new HygieneLevel(
    "Qual item usado para se ENXUGAR depois do BANHO?",
    ["toalha", "sabão", "shampoo", "escovaCabelo"],
    ["toalha.png", "sabao.png", "shampoo.png", "escovaCabelo.png"],
    "toalha",
    "medium",
  ),
  new HygieneLevel(
    "Qual item devemos usar para ESCOVAR os DENTES?",
    ["pastaEscova", "pente", "sabão", "mascara"],
    ["pastaEscova.png", "pente.png", "sabao.png", "mascara.png"],
    "pastaEscova",
    "medium",
  ),
  new HygieneLevel(
    "Qual item usamos para PENTEAR o CABELO?",
    ["pente", "cortaUnha", "pastaEscova", "escovaCabelo"],
    ["pente.png", "cortaUnha.png", "pastaEscova.png", "escovaCabelo.png"],
    "pente",
    "medium",
  ),
  new HygieneLevel(
    "O que devemos usar para PREVENIR o COVID?",
    ["cortaUnha", "sabão", "pente", "máscara"],
    ["cortaUnha.png", "sabao.png", "pente.png", "mascara.png"],
    "máscara",
    "medium",
  ),

  // Nível 3 - Conhecimento sobre higiene (respostas só com texto)
  new HygieneLevel(
    "Para que utilizamos a ESCOVA DE DENTES?",
    ["Escovar os dentes", "Pentear o cabelo", "Lavar a mão", "Não usamos"],
    null,
    "Escovar os dentes",
    "hard",
  ),
  new HygieneLevel(
    "Para que utilizamos o SABÃO?",
    [
      "Lavar as mãos",
      "Escovar os dentes",
      "Enxugar o corpo",
      "Pentear o cabelo",
    ],
    null,
    "Lavar as mãos",
    "hard",
  ),
  new HygieneLevel(
    "Para que utilizamos o BANHO?",
    [
      "Manter o corpo limpo",
      "Sujar o corpo",
      "Lavar a roupa",
      "Cortar as unhas",
    ],
    null,
    "Manter o corpo limpo",
    "hard",
  ),
  new HygieneLevel(
    "O que devemos fazer após USAR O BANHEIRO?",
    [
      "Lavar as mãos",
      "Pentear o cabelo",
      "Escovar os dentes",
      "Cortar as unhas",
    ],
    null,
    "Lavar as mãos",
    "hard",
  ),
  new HygieneLevel(
    "Para que é importante CORTAR as UNHAS?",
    [
      "Evitar acúmulo de sujeira",
      "Arrumar o cabelo",
      "Economizar tempo",
      "Usar mascara melhor",
    ],
    null,
    "Evitar acúmulo de sujeira",
    "hard",
  ),
];

/**
 * Função que agrupa as questões por dificuldade, criando níveis
 */
function groupQuestionsByDifficulty(): GameLevel[] {
  const levelMap = new Map<string, HygieneLevel[]>();

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
