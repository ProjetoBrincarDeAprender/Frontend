import { Card } from "../../../../components/utils/Card/Card";

import "./PopularGames.css";
import formImage from "../../../../assets/homePage/populargames/forms.png";
import complexImage from "../../../../assets/homePage/populargames/complex.png";
import sumImage from "../../../../assets/homePage/populargames/sum.png";

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
        <Card image={formImage} title="Jogo das Formas" variant="game" />
        <Card image={complexImage} title="Sílabas Complexas" variant="game" />
        <Card image={sumImage} title="Jogo da Soma" variant="game" />
      </div>
    </section>
  );
}
