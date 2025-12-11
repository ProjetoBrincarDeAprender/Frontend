import ComDatesLevel from "./ComDatesLevel";

export interface GameLevel {
  difficulty: string;
  questions: ComDatesLevel[];
}

// Todas as questões do jogo organizadas por nível
export const GameQuestions = [
  // Nível 1 - Qual DESTES feriados acontece em qual mês (respostas com imagem)
  new ComDatesLevel(
    "Qual DESTES feriados acontece em Dezembro?",
    ["Natal", "Carnaval", "Festa Junina", "Independência"],
    ["natal.png", "carnaval.png", "festaJunina.png", "independencia.png"],
    "Natal",
    "easy",
    68,
  ),
  new ComDatesLevel(
    "Qual DESTES feriados acontece em Setembro?",
    ["Independência", "Natal", "Dia das Crianças", "Tiradentes"],
    ["independencia.png", "natal.png", "diaDasCriancas.png", "tiradentes.png"],
    "Independência",
    "easy",
    69,
  ),
  new ComDatesLevel(
    "Qual DESTES feriados acontece em Outubro?",
    ["Dia das Crianças", "Natal", "Carnaval", "Festa Junina"],
    ["diaDasCriancas.png", "natal.png", "carnaval.png", "festaJunina.png"],
    "Dia das Crianças",
    "easy",
    70,
  ),
  new ComDatesLevel(
    "Qual DESTAS festas acontece em Junho?",
    ["Festa Junina", "Carnaval", "Natal", "Independência"],
    ["festaJunina.png", "carnaval.png", "natal.png", "independencia.png"],
    "Festa Junina",
    "easy",
    71,
  ),
  new ComDatesLevel(
    "Qual DESTAS festas acontece em Fevereiro ou Março?",
    ["Carnaval", "Festa Junina", "Natal", "Dia das Crianças"],
    ["carnaval.png", "festaJunina.png", "natal.png", "diaDasCriancas.png"],
    "Carnaval",
    "easy",
    72,
  ),

  // Nível 2 - Associações sobre as datas comemorativas (respostas com imagem)
  new ComDatesLevel(
    "Quando comemoramos a Festa Junina?",
    ["JUNHO", "FEVEREIRO", "DEZEMBRO", "SETEMBRO"],
    ["festaJunina.png", "carnaval.png", "natal.png", "independencia.png"],
    "JUNHO",
    "medium",
    73,
  ),
  new ComDatesLevel(
    "Que data celebramos a Proclamação da República?",
    ["15 de Novembro", "7 de Setembro", "21 de Abril", "19 de Abril"],
    [
      "proclamacao.png",
      "independencia.png",
      "tiradentes.png",
      "diaDoIndio.png",
    ],
    "15 de Novembro",
    "medium",
    74,
  ),
  new ComDatesLevel(
    "Quando é o Dia do Índio no Brasil?",
    ["19 de Abril", "21 de Abril", "7 de Setembro", "12 de Outubro"],
    [
      "diaDoIndio.png",
      "tiradentes.png",
      "independencia.png",
      "diaDasCriancas.png",
    ],
    "19 de Abril",
    "medium",
    75,
  ),
  new ComDatesLevel(
    "Qual data comemoramos o Dia das Mães?",
    [
      "Segundo domingo de Maio",
      "20 de Novembro",
      "12 de Outubro",
      "25 de Dezembro",
    ],
    ["diaDasMaes.png", "consciencia.png", "diaDasCriancas.png", "natal.png"],
    "Segundo domingo de Maio",
    "medium",
    76,
  ),
  new ComDatesLevel(
    "Quando comemoramos o Dia da Consciência Negra?",
    ["20 de Novembro", "7 de Setembro", "21 de Abril", "15 de Novembro"],
    [
      "consciencia.png",
      "independencia.png",
      "tiradentes.png",
      "proclamacao.png",
    ],
    "20 de Novembro",
    "medium",
    77,
  ),

  // Nível 3 - Perguntas sobre mês e conceitos simples (apenas texto)
  new ComDatesLevel(
    "Em que mês comemoramos o Natal?",
    ["Dezembro", "Novembro", "Janeiro", "Outubro"],
    null,
    "Dezembro",
    "hard",
    78,
  ),
  new ComDatesLevel(
    "Em que mês é o Dia do Soldado?",
    ["Agosto", "Setembro", "Julho", "Outubro"],
    null,
    "Agosto",
    "hard",
    79,
  ),
  new ComDatesLevel(
    "Que dia é o Dia do Trabalho?",
    ["1 de Maio", "1 de Abril", "1 de Junho", "1 de Março"],
    null,
    "1 de Maio",
    "hard",
    80,
  ),
  new ComDatesLevel(
    "Em que mês acontecem as Festas Juninas?",
    ["Junho", "Julho", "Maio", "Agosto"],
    null,
    "Junho",
    "hard",
    81,
  ),
  new ComDatesLevel(
    "Qual o dia e mês que o Brasil comemora sua Independência?",
    ["7 de Setembro", "15 de Novembro", "21 de Abril", "12 de Outubro"],
    null,
    "7 de Setembro",
    "hard",
    82,
  ),
]; /**
 * Função que agrupa as questões por dificuldade, criando níveis
 */
function groupQuestionsByDifficulty(): GameLevel[] {
  const levelMap = new Map<string, ComDatesLevel[]>();

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
