import { Card } from "../../../../components/utils/Card/Card";

import complexImage from "../../../../assets/homePage/populargames/complex.png";
import formImage from "../../../../assets/homePage/populargames/forms.png";
import sumImage from "../../../../assets/homePage/populargames/sum.png";
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
      <div className="flex flex-wrap items-stretch justify-center gap-4 px-4 py-10 max-[380px]:flex-col max-[380px]:items-center sm:gap-6 sm:px-8 sm:py-16">
        <Card
          image={formImage}
          href="/about-games#Jogo das Formas"
          title="Jogo das Formas"
          variant="game"
        />
        <Card
          image={complexImage}
          href="/about-games#Sílabas Complexas"
          title="Sílabas Complexas"
          variant="game"
        />
        <Card
          image={sumImage}
          href="/about-games#Jogo da Soma"
          title="Jogo da Soma"
          variant="game"
        />
      </div>
    </section>
  );
}
