import { Card } from "../../../../components/utils/Card/Card";

import "./PopularGames.css";

interface PopularGamesProps {
  className?: string;
}

export function PopularGames({ className = "" }: PopularGamesProps) {
  return (
    <section>
      <h2 className={`${className} font-1 text-center font-bold text-4xl`}>
        DESTAQUES
      </h2>
      <div className="flex px-8 py-16">
        <Card gameIdUrl="1" title="Jogo da Velha" variant="game" />
        <Card gameIdUrl="2" title="Sudoku" variant="game" />
        <Card gameIdUrl="3" title="Tetris" variant="game" />
      </div>
    </section>
  );
}
