import aceleraI from "@/assets/acelera-i.svg";
import lua from "@/assets/moon1.png";
import nuvem from "@/assets/nuvem.svg";
import pipa from "@/assets/pipa.svg";
import saturno from "@/assets/saturn.svg";
import estrela from "@/assets/star.svg";
import telescopio from "@/assets/telescopio.svg";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";

export function AceleraI() {
  return (
    <>
      <Header />
      <div className="bg-purple-primary relative mt-80 w-full justify-items-center pb-0 text-center">
        <img
          src={lua}
          className="absolute h-0 sm:-top-6 sm:left-20 sm:h-10 md:-top-8 md:left-20 lg:-top-10 lg:left-60 xl:-top-10 xl:left-60 2xl:-top-10 2xl:left-80"
        />
        <img
          src={saturno}
          className="absolute h-0 sm:-top-20 sm:right-20 sm:h-15 md:-top-35 md:right-30 md:h-20 lg:-top-20 lg:right-60 xl:-top-30 xl:right-90 xl:h-20 2xl:-top-40 2xl:right-120 2xl:h-30"
        />
        <img
          src={estrela}
          className="absolute h-0 sm:right-60 sm:bottom-25 sm:h-10 md:right-70 md:bottom-40 lg:right-100 lg:bottom-40 xl:right-100 xl:bottom-40 2xl:right-160 2xl:bottom-60"
        />
        <img
          src={pipa}
          className="absolute h-0 rotate-310 sm:right-8 sm:bottom-45 sm:h-30 md:right-10 md:bottom-60 lg:right-30 lg:bottom-40 xl:right-20 xl:bottom-50 2xl:right-40 2xl:bottom-100"
        />
        <h1 className="font-1 text-4xl font-black uppercase">
          Casos de Sucesso
        </h1>
        <h1 className="font-1 text-6xl font-black uppercase">APAE</h1>

        <img src={nuvem} className="mt-40 block w-full" />
      </div>

      <div className="bg-cloud-white -mt-1 grid justify-items-center">
        <div className="grid max-w-[1800px] grid-cols-2 items-center justify-items-center gap-y-5 px-20 py-20 text-gray-900 xl:my-20">
          <img
            src={aceleraI}
            className="h-auto w-full rounded-md object-cover sm:h-[250px] sm:w-[290px] md:h-[300px] md:w-[350px] xl:h-[350px] xl:w-[420px] 2xl:h-[400px] 2xl:w-[480px]"
            alt="Acelera I"
          />

          <div className="w-full sm:px-0">
            <p className="font-2 text-md leading-loose sm:text-justify md:text-lg xl:text-xl 2xl:text-2xl">
              Em 2023, tivemos a alegria de conquistar o 1º lugar no Acelera-i
              (programa de aceleração de ideias inovadoras), uma iniciativa para
              impulsionar ideias excepcionais e transformá-las em oportunidades
              reais. Em meio a tantas grandiosas ideias, tivemos a honra de ser
              reconhecidos pelo nosso potencial de impacto na sociedade. Essa
              vitória foi mais do que um reconhecimento: ela reforçou  nossa
              missão de tornar a educação mais lúdica, criativa e acessível para
              as crianças. O programa Acelera-i nos proporcionou não apenas
              visibilidade, mas também networking com outros participantes que
              proporcionaram conhecimentos essenciais para expandir nosso
              projeto. Durante os meses de aceleração, tivemos a oportunidade de
              refinar nossa proposta de valor, aprimorar nossos processos
              pedagógicos e desenvolver estratégias para alcançar ainda mais
              alunos.
            </p>
          </div>
          <div className="col-span-2 w-full sm:px-0">
            <p className="font-2 text-md leading-loose sm:text-justify md:text-lg xl:text-xl 2xl:text-2xl">
              A jornada foi intensa e desafiadora, mas cada etapa nos preparou
              melhor para enfrentar os desafios do setor educacional. A
              conquista do primeiro lugar validou nossa abordagem inovadora e
              nos motivou a continuar investindo em soluções que transformam o
              aprendizado em uma experiência verdadeiramente envolvente e
              significativa para todos os alunos.
            </p>
          </div>
        </div>

        <div className="bg-am1 relative w-full overflow-hidden pt-8 sm:pt-10 md:pt-12 lg:pt-16 xl:pt-20 2xl:pt-24">
          <div className="mb-4 flex justify-center sm:mb-5 md:mb-6 xl:mb-8">
            <img
              src={telescopio}
              alt="Telescópio"
              className="h-12 w-12 object-contain sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 xl:h-28 xl:w-28 2xl:h-32 2xl:w-32"
            />
          </div>

          <h2 className="font-1 mx-auto mb-8 max-w-7xl px-4 text-center text-lg leading-tight font-black text-white uppercase drop-shadow-lg sm:mb-12 sm:px-8 sm:text-xl sm:leading-snug md:mb-16 md:px-16 md:text-2xl md:leading-normal lg:mb-4 lg:px-32 lg:text-3xl xl:mb-4 xl:px-40 xl:text-4xl xl:leading-normal 2xl:mb-4 2xl:px-48 2xl:text-5xl 2xl:leading-relaxed">
            Incentivar o verdadeiro potencial de uma criança em um ambiente
            amoroso e seguro
          </h2>

          <div className="w-full">
            <img
              src={nuvem}
              alt="Nuvens"
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
