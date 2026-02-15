import { Button } from "@/components/utils/Button/Button";
import girl from "../../../../assets/girlmainpage.svg";
import aventura from "../../../../assets/homePage/aventura.svg";

import "./Introduction.css";
import { Joystick } from "lucide-react";

interface IntroductionProps {
  className?: string;
}

export function Introduction({ className = "" }: IntroductionProps) {
  return (
    <section
      className={`${className} font-1 container flex justify-around self-center pt-32`}
    >
      <div className="flex flex-col gap-8 self-center">
        <h1 className="text-5xl leading-tight font-bold">
          Transforme o aprendizado em
          <br />
          <span className="inline-flex items-center gap-3">
            uma <img src={aventura} alt="Aventura" className="h-[2em] w-auto" />{" "}
            divertida!
          </span>
        </h1>
        <p>
          No Brincar de Aprender, cada fase é uma nova descoberta.
          <br /> Jogos feitos para ensinar, incluir e evoluir junto com você.
        </p>
        <div className="mt-8">
          <Button className="!shadow-3xl h-16 w-48 items-center self-start rounded-xl border-4 border-transparent text-center text-xl font-bold hover:border-yellow-400 hover:!bg-blue-900">
            <Joystick className="mr-2 h-16 w-16" />{" "}
            <span className="block text-4xl font-bold tracking-wider">
              Jogar
            </span>
          </Button>
        </div>
      </div>
      <div className="self-center">
        <img src={girl} alt="" className="block max-h-[31.25rem]" />
      </div>
    </section>
  );
}
