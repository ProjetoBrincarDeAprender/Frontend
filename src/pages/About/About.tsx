import aceleraI from "@/assets/acelera-i.svg";
import alunosApae from "@/assets/alunos-apae.svg";
import meteoros from "@/assets/meteoros.svg";
import lua from "@/assets/moon1.png";
import nuvem from "@/assets/nuvem.svg";
import pipa from "@/assets/pipa.svg";
import foguete from "@/assets/rocket.svg";
import saturno from "@/assets/saturn.svg";
import estrela from "@/assets/star.svg";
import telescopio from "@/assets/telescopio.svg";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";

export function About() {
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
        <h1 className="font-1 text-6xl font-black uppercase">Quem somos</h1>
        <img src={nuvem} className="mt-40 block w-full" />
      </div>

      <div className="bg-cloud-white -mt-1 justify-items-center text-center text-gray-900">
        <h2 className="font-1 text-purplish-blue mt-20 mb-20 text-2xl lg:text-4xl 2xl:text-5xl">
          Conheça um pouco do nosso
          <span className="text-purplish-blue-dark font-bold"> trabalho!</span>
        </h2>

        <p className="font-2 text-center text-lg leading-loose sm:mb-20 sm:px-10 lg:mb-40 lg:px-40 lg:text-2xl 2xl:text-2xl">
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

        <div className="grid w-full justify-center gap-30 sm:mb-20 sm:px-10 lg:mb-40 lg:px-60 xl:grid-cols-1 2xl:grid-cols-2">
          <div className="">
            <h3 className="text-purplish-blue mb-4 text-center text-xl lg:text-4xl 2xl:text-5xl">
              Abordagem
            </h3>
            <p className="ch-10 text-center text-lg leading-loose text-gray-900 lg:text-2xl 2xl:text-2xl">
              Transforme o aprendizado em uma aventura com o Brincar de
              Aprender! Nosso espaço educacional oferece jogos e atividades
              interativas em diversas áreas de conhecimento, adaptados para
              alunos com Síndrome de Down. Com uma abordagem única, tornamos o
              aprendizado divertida e acessível, preenchendo a lacuna de
              recursos educacionais personalizados e promovendo uma educação
              inclusiva para todos. Descubra como Brincar de Aprender está
              revolucionando a educação!
            </p>
          </div>
          <div className="border-purplish-blue relative rounded-3xl border-10 bg-white p-8 text-center shadow-xl">
            <img
              src={meteoros}
              className="absolute -top-20 -right-10 w-0 sm:w-35"
            />
            <div className="mb-6">
              <h3 className="text-purplish-blue-dark mb-3 text-xl font-bold lg:text-3xl 2xl:text-4xl">
                O Problema
              </h3>
              <p className="text-base leading-relaxed text-gray-900 lg:text-2xl 2xl:text-2xl">
                Falta de recursos educacionais personalizados, levando pais e
                escolas a improvisar com ferramentas genéricas que geram
                frustração.
              </p>
            </div>
            <hr className="border-purplish-blue my-4 border-t-2" />
            <div>
              <h3 className="text-purplish-blue-dark mb-3 text-xl font-bold lg:text-3xl 2xl:text-4xl">
                Nossa solução
              </h3>
              <p className="text-base leading-relaxed text-gray-900 lg:text-2xl 2xl:text-2xl">
                Ambiente lúdico com design simples, feedback imediato e ritmo
                adaptável.
              </p>
            </div>
          </div>
        </div>

        <div className="relative w-full overflow-hidden px-4 py-10 sm:px-8 sm:py-15 md:px-16 md:py-20 lg:px-32 xl:px-40 2xl:px-52">
          {/* Card 1 */}
          <div className="relative mb-16 flex flex-col items-center gap-6 sm:mb-24 sm:gap-8 md:mb-32 md:gap-12 lg:flex-row lg:gap-16 xl:mb-40 xl:justify-center xl:gap-20">
            <div className="relative z-10 w-full sm:w-auto">
              <div
                className="relative mx-auto rotate-3 rounded-[30px] p-4 shadow-xl sm:rounded-[40px] sm:p-5 md:p-7 xl:mx-0 xl:p-8"
                style={{ backgroundColor: "#6177A6", maxWidth: "500px" }}
              >
                <div className="bg-purplish-blue absolute -top-4 right-2 rounded-full px-3 py-1 shadow-md sm:-top-6 sm:right-4 sm:px-4 sm:py-1.5 md:-top-8 md:right-0 md:px-6 md:py-2 xl:-top-10 xl:px-8 xl:py-3">
                  <span className="font-1 text-xs font-bold whitespace-nowrap text-white uppercase sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl">
                    Caso de Sucesso
                  </span>
                </div>
                <img
                  src={alunosApae}
                  className="h-auto w-full rounded-[20px] object-cover sm:h-[250px] sm:w-[290px] sm:rounded-[30px] md:h-[300px] md:w-[350px] xl:h-[350px] xl:w-[420px] 2xl:h-[400px] 2xl:w-[480px]"
                  alt="Alunos APAE"
                />
              </div>
              <img
                src={foguete}
                className="absolute -top-16 -left-12 hidden h-32 w-32 -rotate-2 lg:block xl:-top-22 xl:-left-16 xl:h-44 xl:w-44 2xl:-top-28 2xl:-left-20 2xl:h-52 2xl:w-52"
                alt="Foguete"
              />
            </div>

            <div className="w-full max-w-md px-4 sm:px-0 xl:max-w-lg 2xl:max-w-xl">
              <p className="font-2 text-center text-sm leading-relaxed sm:text-justify sm:text-base sm:leading-relaxed md:text-lg md:leading-loose xl:text-xl xl:leading-loose 2xl:text-2xl 2xl:leading-loose">
                Recentemente, implementamos o piloto do "Brincar de Aprender"
                com os alunos da Associação de Pais e Amigos do Excepcionais
                APAE. Os resultados foram emocionantes! Ficamos muito felizes
                com a recepção dos alunos ao ver a nossa equipe. Além disso, os
                alunos amaram os jogos! Foi um momento mágico que misturou
                aprendizado e diversão!
              </p>
            </div>

            <img
              src={estrela}
              className="absolute top-0 right-0 hidden h-6 w-6 md:block md:h-8 md:w-8 xl:h-10 xl:w-10 2xl:h-12 2xl:w-12"
              alt="Estrela"
            />
          </div>

          {/* Card 2 */}
          <div className="relative flex flex-col items-center gap-6 sm:gap-8 md:gap-12 lg:flex-row-reverse lg:gap-16 xl:justify-center xl:gap-20">
            <img
              src={saturno}
              className="absolute top-40 -right-16 z-0 hidden h-36 w-36 rotate-12 opacity-90 xl:top-60 xl:block xl:h-48 xl:w-48 2xl:top-80 2xl:-right-32 2xl:h-60 2xl:w-60"
              alt="Saturno"
            />

            <div className="relative z-10 w-full sm:w-auto">
              <div
                className="relative mx-auto -rotate-3 rounded-[30px] p-4 shadow-xl sm:rounded-[40px] sm:p-5 md:p-7 xl:mx-0 xl:p-8"
                style={{ backgroundColor: "#6177A6", maxWidth: "500px" }}
              >
                <div className="bg-purplish-blue absolute -top-4 left-2 rounded-full px-3 py-1 shadow-md sm:-top-6 sm:left-4 sm:px-4 sm:py-1.5 md:-top-8 md:left-0 md:px-6 md:py-2 xl:-top-10 xl:px-8 xl:py-3">
                  <span className="font-1 text-xs font-bold whitespace-nowrap text-white uppercase sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl">
                    Caso de Sucesso
                  </span>
                </div>
                <img
                  src={aceleraI}
                  className="h-auto w-full rounded-[20px] object-cover sm:h-[250px] sm:w-[290px] sm:rounded-[30px] md:h-[300px] md:w-[350px] xl:h-[350px] xl:w-[420px] 2xl:h-[400px] 2xl:w-[480px]"
                  alt="Equipe Vencedora"
                />
              </div>
            </div>

            <div className="w-full max-w-md px-4 sm:px-0 xl:max-w-lg 2xl:max-w-xl">
              <p className="font-2 text-center text-sm leading-relaxed sm:text-justify sm:text-base sm:leading-relaxed md:text-lg md:leading-loose xl:text-xl xl:leading-loose 2xl:text-2xl 2xl:leading-loose">
                Em 2023, tivemos a alegria de conquistar o 1º lugar no Acelera-i
                (programa de aceleração de ideias inovadoras), uma iniciativa
                para impulsionar ideias excepcionais e transformá-las em
                oportunidades reais. Essa vitória foi mais do que um
                reconhecimento: ela reforçou nossa missão de tornar a educação
                mais lúdica, criativa e acessível para as crianças.
              </p>
            </div>

            <img
              src={estrela}
              className="absolute bottom-0 -left-10 hidden h-8 w-8 rotate-45 md:block md:h-10 md:w-10 xl:-left-12 xl:h-12 xl:w-12 2xl:-left-16 2xl:h-14 2xl:w-14"
              alt="Estrela"
            />
            <img
              src={estrela}
              className="absolute right-10 -bottom-10 hidden h-4 w-4 md:right-20 md:block md:h-6 md:w-6 xl:right-28 xl:-bottom-12 xl:h-8 xl:w-8 2xl:right-36 2xl:-bottom-16 2xl:h-10 2xl:w-10"
              alt="Estrela"
            />
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
