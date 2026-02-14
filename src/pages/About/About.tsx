import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import lua from "@/assets/moon1.png";
import saturno from "@/assets/saturn.svg";
import estrela from "@/assets/star.svg";
import pipa from "@/assets/pipa.svg";
import nuvem from "@/assets/nuvem.svg";
import foguete from "@/assets/rocket.svg";
import alunosApae from "@/assets/alunos-apae.svg";
import aceleraI from "@/assets/acelera-i.svg";
import telescopio from "@/assets/telescopio.svg";

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

        <p className="font-2 mb-40 px-40 text-center text-lg leading-loose">
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

        <div className="relative w-full overflow-hidden py-10 px-4 sm:py-15 sm:px-8 md:py-20 md:px-16 lg:px-32 xl:px-40 2xl:px-52">
          
          {/* Card 1 */}
          <div className="relative mb-16 sm:mb-24 md:mb-32 xl:mb-40 flex flex-col items-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-20 lg:flex-row xl:justify-center">
            <div className="relative z-10 w-full sm:w-auto">
              <div className="relative rounded-[30px] sm:rounded-[40px] p-4 sm:p-5 md:p-7 xl:p-8 rotate-3 shadow-xl mx-auto xl:mx-0" style={{backgroundColor: '#6177A6', maxWidth: '500px'}}>
                <div className="bg-purplish-blue absolute -top-4 sm:-top-6 md:-top-8 xl:-top-10 right-2 sm:right-4 md:right-0 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 md:px-6 md:py-2 xl:px-8 xl:py-3 shadow-md">
                  <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-1 font-bold uppercase text-white whitespace-nowrap">Caso de Sucesso</span>
                </div>
                <img
                  src={alunosApae}
                  className="w-full h-auto sm:h-[250px] sm:w-[290px] md:h-[300px] md:w-[350px] xl:h-[350px] xl:w-[420px] 2xl:h-[400px] 2xl:w-[480px] rounded-[20px] sm:rounded-[30px] object-cover"
                  alt="Alunos APAE"
                />
              </div>
              <img src={foguete} className="hidden lg:block absolute -left-12 xl:-left-16 2xl:-left-20 -top-16 xl:-top-22 2xl:-top-28 h-32 w-32 xl:h-44 xl:w-44 2xl:h-52 2xl:w-52 -rotate-2" alt="Foguete" />
            </div>

            <div className="w-full max-w-md xl:max-w-lg 2xl:max-w-xl px-4 sm:px-0">
              <p className="font-2 text-center sm:text-justify text-sm sm:text-base md:text-lg xl:text-xl 2xl:text-2xl leading-relaxed sm:leading-relaxed md:leading-loose xl:leading-loose 2xl:leading-loose">
                Recentemente, implementamos o piloto do "Brincar de Aprender" com os alunos da
                Associação de Pais e Amigos do Excepcionais APAE. Os resultados foram emocionantes!
                Ficamos muito felizes com a recepção dos alunos ao ver a nossa equipe. Além disso,
                os alunos amaram os jogos! Foi um momento mágico que misturou aprendizado e diversão!
              </p>
            </div>
            
            <img src={estrela} className="hidden md:block absolute right-0 top-0 h-6 w-6 md:h-8 md:w-8 xl:h-10 xl:w-10 2xl:h-12 2xl:w-12" alt="Estrela" />
          </div>

          {/* Card 2 */}
          <div className="relative flex flex-col items-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-20 lg:flex-row-reverse xl:justify-center">
            <img src={saturno} className="hidden xl:block absolute -right-16 2xl:-right-32 top-40 xl:top-60 2xl:top-80 h-36 w-36 xl:h-48 xl:w-48 2xl:h-60 2xl:w-60 rotate-12 z-0 opacity-90" alt="Saturno" />
            
            <div className="relative z-10 w-full sm:w-auto">
              <div className="relative rounded-[30px] sm:rounded-[40px] p-4 sm:p-5 md:p-7 xl:p-8 -rotate-3 shadow-xl mx-auto xl:mx-0" style={{backgroundColor: '#6177A6', maxWidth: '500px'}}>
                <div className="bg-purplish-blue absolute -top-4 sm:-top-6 md:-top-8 xl:-top-10 left-2 sm:left-4 md:left-0 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 md:px-6 md:py-2 xl:px-8 xl:py-3 shadow-md">
                  <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-1 font-bold uppercase text-white whitespace-nowrap">Caso de Sucesso</span>
                </div>
                <img
                  src={aceleraI}
                  className="w-full h-auto sm:h-[250px] sm:w-[290px] md:h-[300px] md:w-[350px] xl:h-[350px] xl:w-[420px] 2xl:h-[400px] 2xl:w-[480px] rounded-[20px] sm:rounded-[30px] object-cover"
                  alt="Equipe Vencedora"
                />
              </div>
            </div>

            <div className="w-full max-w-md xl:max-w-lg 2xl:max-w-xl px-4 sm:px-0">
              <p className="font-2 text-center sm:text-justify text-sm sm:text-base md:text-lg xl:text-xl 2xl:text-2xl leading-relaxed sm:leading-relaxed md:leading-loose xl:leading-loose 2xl:leading-loose">
                Em 2023, tivemos a alegria de conquistar o 1º lugar no Acelera-i (programa de aceleração
                de ideias inovadoras), uma iniciativa para impulsionar ideias excepcionais e
                transformá-las em oportunidades reais. Essa vitória foi mais do que um reconhecimento:
                ela reforçou nossa missão de tornar a educação mais lúdica, criativa e acessível para as crianças.
              </p>
            </div>

            <img src={estrela} className="hidden md:block absolute -left-10 xl:-left-12 2xl:-left-16 bottom-0 h-8 w-8 md:h-10 md:w-10 xl:h-12 xl:w-12 2xl:h-14 2xl:w-14 rotate-45" alt="Estrela" />
            <img src={estrela} className="hidden md:block absolute right-10 md:right-20 xl:right-28 2xl:right-36 -bottom-10 xl:-bottom-12 2xl:-bottom-16 h-4 w-4 md:h-6 md:w-6 xl:h-8 xl:w-8 2xl:h-10 2xl:w-10" alt="Estrela" />
          </div>
        </div>

        {/* Seção de Missão */}
        <div className="relative w-full bg-am1 py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20 2xl:py-24 px-4 overflow-hidden">
          {/* Telescópio */}
          <div className="flex justify-center mb-4 sm:mb-5 md:mb-6 xl:mb-8">
            <img 
              src={telescopio} 
              alt="Telescópio" 
              className="h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 xl:h-28 xl:w-28 2xl:h-32 2xl:w-32 object-contain"
            />
          </div>

          {/* Frase */}
          <h2 className="font-1 text-white text-center text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-black uppercase px-4 sm:px-8 md:px-16 lg:px-32 xl:px-40 2xl:px-48 max-w-7xl mx-auto leading-tight sm:leading-snug md:leading-normal xl:leading-normal 2xl:leading-relaxed drop-shadow-lg mb-8 sm:mb-12 md:mb-16 lg:mb-20 xl:mb-24 2xl:mb-28">
            Incentivar o verdadeiro potencial de uma criança em um ambiente amoroso e seguro
          </h2>

          {/* Nuvem */}
          <div className="absolute bottom-0 left-0 right-0 w-full">
            <img 
              src={nuvem} 
              alt="Nuvens" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
