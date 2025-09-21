import { Card } from "../../../../components/utils/Card/Card";

import "./PopularGames.css";

interface PopularGamesProps {
  className?: string;
}

export function PopularGames({ className = "" }: PopularGamesProps) {
  return (
    <section>
      <h2 className={`${className} font-1 text-center text-4xl font-bold`}>
        DESTAQUES
      </h2>
      <div className="flex gap-8 px-8 py-16">
        <Card gameIdUrl="sum" title="Jogo da Soma" variant="game" />
        <Card gameIdUrl="numbers" title="Sequência de Números" variant="game" />
        <Card gameIdUrl="vowels" title="Jogo das Vogais" variant="game" />
        <Card gameIdUrl="memory" title="Jogo da Memória" variant="game" />
      </div>
    </section>
  );
}
