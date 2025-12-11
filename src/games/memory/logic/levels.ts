import { MemoryGameLevel } from "../utils/memoryGameLevel";

export interface GameLevel {
  difficulty: string;
  questions: MemoryGameLevel[];
}

export const GameQuestions = [
  new MemoryGameLevel(
    "Easy",
    [
      { value: "random1", useFullRandom: true },
      { value: "random2", useFullRandom: true },
    ],
    2,
  ),
  new MemoryGameLevel(
    "Easy",
    [
      { value: "random3", useFullRandom: true },
      { value: "random4", useFullRandom: true },
    ],
    33,
  ),
  new MemoryGameLevel(
    "Easy",
    [
      { value: "random5", useFullRandom: true },
      { value: "random6", useFullRandom: true },
    ],
    34,
  ),
  new MemoryGameLevel(
    "Easy",
    [
      { value: "random7", useFullRandom: true },
      { value: "random8", useFullRandom: true },
    ],
    35,
  ),
  new MemoryGameLevel(
    "Easy",
    [
      { value: "random9", useFullRandom: true },
      { value: "random10", useFullRandom: true },
    ],
    36,
  ),

  new MemoryGameLevel(
    "Medium",
    [
      { value: "random11", useFullRandom: true },
      { value: "random12", useFullRandom: true },
      { value: "random13", useFullRandom: true },
    ],
    37,
  ),
  new MemoryGameLevel(
    "Medium",
    [
      { value: "random14", useFullRandom: true },
      { value: "random15", useFullRandom: true },
      { value: "random16", useFullRandom: true },
    ],
    38,
  ),
  new MemoryGameLevel(
    "Medium",
    [
      { value: "random17", useFullRandom: true },
      { value: "random18", useFullRandom: true },
      { value: "random19", useFullRandom: true },
    ],
    39,
  ),
  new MemoryGameLevel(
    "Medium",
    [
      { value: "random20", useFullRandom: true },
      { value: "random21", useFullRandom: true },
      { value: "random22", useFullRandom: true },
    ],
    40,
  ),
  new MemoryGameLevel(
    "Medium",
    [
      { value: "random23", useFullRandom: true },
      { value: "random24", useFullRandom: true },
      { value: "random25", useFullRandom: true },
    ],
    41,
  ),

  new MemoryGameLevel(
    "Hard",
    [
      { value: "random26", useFullRandom: true },
      { value: "random27", useFullRandom: true },
      { value: "random28", useFullRandom: true },
      { value: "random29", useFullRandom: true },
    ],
    42,
  ),
  new MemoryGameLevel(
    "Hard",
    [
      { value: "random30", useFullRandom: true },
      { value: "random31", useFullRandom: true },
      { value: "random32", useFullRandom: true },
      { value: "random33", useFullRandom: true },
    ],
    43,
  ),
  new MemoryGameLevel(
    "Hard",
    [
      { value: "random34", useFullRandom: true },
      { value: "random35", useFullRandom: true },
      { value: "random36", useFullRandom: true },
      { value: "random37", useFullRandom: true },
    ],
    44,
  ),
  new MemoryGameLevel(
    "Hard",
    [
      { value: "random38", useFullRandom: true },
      { value: "random39", useFullRandom: true },
      { value: "random40", useFullRandom: true },
      { value: "random41", useFullRandom: true },
    ],
    45,
  ),
  new MemoryGameLevel(
    "Hard",
    [
      { value: "random42", useFullRandom: true },
      { value: "random43", useFullRandom: true },
      { value: "random44", useFullRandom: true },
      { value: "random45", useFullRandom: true },
    ],
    46,
  ),

  new MemoryGameLevel(
    "Very Hard",
    [
      { value: "random46", useFullRandom: true },
      { value: "random47", useFullRandom: true },
      { value: "random48", useFullRandom: true },
      { value: "random49", useFullRandom: true },
      { value: "random50", useFullRandom: true },
    ],
    47,
  ),
  new MemoryGameLevel(
    "Very Hard",
    [
      { value: "random51", useFullRandom: true },
      { value: "random52", useFullRandom: true },
      { value: "random53", useFullRandom: true },
      { value: "random54", useFullRandom: true },
      { value: "random55", useFullRandom: true },
    ],
    48,
  ),
  new MemoryGameLevel(
    "Very Hard",
    [
      { value: "random56", useFullRandom: true },
      { value: "random57", useFullRandom: true },
      { value: "random58", useFullRandom: true },
      { value: "random59", useFullRandom: true },
      { value: "random60", useFullRandom: true },
    ],
    49,
  ),
  new MemoryGameLevel(
    "Very Hard",
    [
      { value: "random61", useFullRandom: true },
      { value: "random62", useFullRandom: true },
      { value: "random63", useFullRandom: true },
      { value: "random64", useFullRandom: true },
      { value: "random65", useFullRandom: true },
    ],
    51,
  ),
  new MemoryGameLevel(
    "Very Hard",
    [
      { value: "random66", useFullRandom: true },
      { value: "random67", useFullRandom: true },
      { value: "random68", useFullRandom: true },
      { value: "random69", useFullRandom: true },
      { value: "random70", useFullRandom: true },
    ],
    52,
  ),
];

function groupQuestionsByDifficulty(): GameLevel[] {
  const levelMap = new Map<string, MemoryGameLevel[]>();

  GameQuestions.forEach((question) => {
    const difficulty = question.getName();
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
