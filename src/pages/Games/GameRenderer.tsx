import { useParams } from "react-router";
import { GameWrapper } from "@/components/features/games/GameWrapper";
import { GameFactory } from "@/components/features/games/GameFactory";
import { NotFound } from "@/pages/Errors/NotFound/NotFound";
import Phaser from "phaser";

// Mapeamento de slugs para as funções de criação dos jogos
const gamesMap: Record<string, () => Phaser.Types.Core.GameConfig> = {
  // Jogos de endereço e localização
  address: GameFactory.createAddressGame,
  locations: GameFactory.createLocationsGame,

  // Jogos de matemática
  "armed-sum": GameFactory.createArmedSumGame,
  sum: GameFactory.createSumGame,
  subtraction: GameFactory.createSubtractionGame,
  numbers: GameFactory.createNumbersGame,

  // Jogos de datas e história
  "com-dates": GameFactory.createComDatesGame,

  // Jogos de sílabas e linguagem
  "complex-syllable": GameFactory.createComplexSyllableGame,
  "simple-syllable": GameFactory.createSimpleSyllableGame,
  syllable: GameFactory.createSyllableGame,
  "syllable-division": GameFactory.createSyllableDivisionGame,
  "use-syllable": GameFactory.createUseSyllableGame,
  stresssyllable: GameFactory.createStressSyllableGame,
  vowels: GameFactory.createVowelsGame,
  punctuation: GameFactory.createPunctuationGame,

  // Jogos de coordenação e memória
  forms: GameFactory.createCoordinationGame,
  memory: GameFactory.createMemoryGame,
  maze: GameFactory.createMazeGame,

  // Jogos temáticos
  housing: GameFactory.createHousingGame,
  hygiene: GameFactory.createHygieneGame,
  plants: GameFactory.createPlantsGame,
  professions: GameFactory.createProfessionsGame,
  sensorial: GameFactory.createSensorialGame,
  space: GameFactory.createSpaceGame,
};

export default function GameRenderer() {
  const { slug } = useParams<{ slug: string }>();

  if (!slug || !gamesMap[slug]) {
    return <NotFound />;
  }

  const gameConfigCreator = gamesMap[slug];
  const gameConfig = gameConfigCreator();

  return <GameWrapper gameConfig={gameConfig} />;
}
