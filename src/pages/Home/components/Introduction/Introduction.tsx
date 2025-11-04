import girl from "../../../../assets/girlmainpage.svg";

import "./Introduction.css";

interface IntroductionProps {
  className?: string;
}

export function Introduction({ className = "" }: IntroductionProps) {
  return (
    <section
      className={`${className} font-1 container flex justify-around self-center pt-32`}
    >
      <div className="flex flex-col gap-8 self-center">
        <h1 className="text-5xl font-bold">
          Plataforma de Jogos
          <br />
          Educacionais
        </h1>
        <p>Porque o amor não conta cromossomos!</p>
      </div>
      <div className="self-center">
        <img src={girl} alt="" className="block max-h-[31.25rem]" />
      </div>
    </section>
  );
}
