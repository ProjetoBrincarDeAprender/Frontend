import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import lua from "@/assets/moon1.png";
import saturno from "@/assets/saturn.svg";
import estrela from "@/assets/star.svg";
import pipa from "@/assets/pipa.svg";
import nuvem from "@/assets/nuvem.svg";

export function About() {
  return (
    <>
      <Header />
      <div className="bg-purple-primary relative mt-80 justify-items-center pb-0">
        <img src={lua} className="absolute bottom-115 left-80" />
        <img src={saturno} className="absolute right-120 bottom-120 h-30" />
        <img src={estrela} className="absolute top-20 right-160" />
        <img src={pipa} className="absolute top-20 right-40 rotate-310" />
        <h1 className="font-1 text-6xl font-black uppercase">Quem somos</h1>
        <img src={nuvem} className="mt-40 block" />
      </div>

      <div className="bg-cloud-white -mt-1 justify-items-center text-gray-900">
        <h2 className="font-1 text-purplish-blue mt-20 mb-20 text-2xl">
          Conheça um pouco do nosso
          <span className="text-purplish-blue-dark font-bold"> trabalho!</span>
        </h2>

        <p className="font-2 mb-40 px-40 text-center text-lg">
          O 'Brincar de Aprender' é um espaço educacional feito especialmente
          para pessoas com Síndrome de Down. É uma plataforma onde elas podem
          aprender de forma divertida com vários joguinhos para que aprendam de
          forma lúdica. Não somente, nosso sistema é completamente
          individualizado e adaptadado às necessidades de nossos usuários,
          usando nosso incrível Motor de Aprendizagem Adaptativa (MAA). Dessa
          forma, o MAA recomenda apenas jogos que estimulem o desenvolvimento
          intelectual de nossos alunos enquanto os mantém estimulados a tentar.
          É assim que ajudamos no desenvolvimento escolar, social e emocional
          dos inscritos no nosso sistema. No 'Brincar de Aprender', cada criança
          recebe um plano de estudos único, feito sob medida para elas. Estamos
          aqui para acompanhar seu progresso e garantir que recebam o apoio
          necessário em sua jornada educacional.
        </p>
      </div>
      <Footer />
    </>
  );
}
