import { NewsCard } from "./components/NewsCard";
import "./SkillGroup.css";

import apaeImage from "../../../../assets/alunos-apae.svg";
import aceleraiImage from "../../../../assets/acelera-i.svg";

interface SkillGroupProps {
  className?: string;
}

export function SkillGroup({ className = "" }: SkillGroupProps) {
  return (
    <section className={`${className} bg-[#D9D9D9] py-20`}>
      <div className="mb-12 text-center">
        <h2 className="title-skillgroup font-1 text-4xl font-bold text-gray-800">
          NOTÍCIAS
        </h2>
      </div>
      <div className="mx-auto flex max-w-[1100px] flex-wrap justify-center gap-12 px-8 max-sm:flex-col max-sm:items-center max-sm:gap-8">
        <NewsCard
          imageUrl={apaeImage}
          title="PARCERIA COM A APAE"
          description="Parceria com a Associação de Pais e Amigos dos Excepcionais (APAE). Nossa primeira visita foi emocionante!"
          href="apae"
        />
        <NewsCard
          imageUrl={aceleraiImage}
          title="1º LUGAR NO ACELERA-I"
          description="Premiado como aquele de maior potencial de impacto!"
          href="acelera-i"
        />
      </div>
    </section>
  );
}
