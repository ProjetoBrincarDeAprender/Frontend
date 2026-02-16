import { Button } from "@/components/utils/Button/Button";
import girl from "../../../../assets/girlmainpage.svg";
import aventura from "../../../../assets/homePage/aventura.svg";
import bg from "../../../../assets/homePage/backgroundMain.png";

import "./Introduction.css";
import { Joystick } from "lucide-react";
import { useNavigate } from "react-router";

interface IntroductionProps {
  className?: string;
}

export function Introduction({ className = "" }: IntroductionProps) {
  const navigate = useNavigate();

  return (
    <div className="blend-container">
      <div className="intro-box">
        <section
          className={`${className} font-1 home-introduction relative mx-auto flex max-w-[1400px] items-center justify-between px-12 py-20`}
        >
          <div className="intro-text relative z-20 flex flex-col gap-8 self-center">
            <h1 className="text-5xl leading-tight font-bold">
              Transforme o aprendizado em
              <br />
              <span className="inline-flex items-center gap-3">
                uma{" "}
                <img src={aventura} alt="Aventura" className="h-[2em] w-auto" />{" "}
                divertida!
              </span>
            </h1>
            <p>
              No Brincar de Aprender, cada fase é uma nova descoberta.
              <br /> Jogos feitos para ensinar, incluir e evoluir junto com
              você.
            </p>
            <div className="intro-btn mt-8">
              <Button
                onClick={() => navigate("/games")}
                className="!shadow-3xl h-16 w-48 cursor-pointer items-center self-start rounded-xl border-4 border-transparent text-center text-xl font-bold hover:border-yellow-400 hover:!bg-blue-900"
              >
                <Joystick className="mr-2 h-16 w-16" />{" "}
                <span className="block text-4xl font-bold tracking-wider">
                  Jogar
                </span>
              </Button>
            </div>
          </div>
          <div className="relative z-20 flex items-end justify-end">
            <img
              src={girl}
              alt="duda"
              className="intro-girl block max-h-[31.25rem]"
            />
          </div>
        </section>
      </div>
      <div className="intro-bg relative h-full w-full">
        <img
          src={bg}
          alt="Background"
          className="block h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
