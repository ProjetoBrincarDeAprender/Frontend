import alunosApae from "@/assets/alunos-apae.svg";
import lua from "@/assets/moon1.png";
import nuvem from "@/assets/nuvem.svg";
import pipa from "@/assets/pipa.svg";
import saturno from "@/assets/saturn.svg";
import estrela from "@/assets/star.svg";
import telescopio from "@/assets/telescopio.svg";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";

export function APAE() {
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
            src={alunosApae}
            className="h-auto w-full rounded-md object-cover sm:h-[250px] sm:w-[290px] md:h-[300px] md:w-[350px] xl:h-[350px] xl:w-[420px] 2xl:h-[400px] 2xl:w-[480px]"
            alt="Alunos APAE"
          />

          <div className="w-full sm:px-0">
            <p className="font-2 text-md leading-loose sm:text-justify md:text-lg xl:text-xl 2xl:text-2xl">
              Recentemente, implementamos o piloto do "Brincar de Aprender" com
              os alunos da Associação de Pais e Amigos do Excepcionais (APAE).
              Os participantes acessaram a versão inicial dos nossos jogos de
              matemática, português e cognição. Os jogos apresentados foram:
              "Sequência dos Números", "Jogo da Soma", "Jogo das Vogais", e
              "Jogo da Memória". Com esses jogos em mente, foi criada uma breve
              explicação de uso geral da plataforma enquanto a tela de um
              computador era projetada para os alunos. Em seguida, foi resolvida
              a primeira atividade de cada um dos jogos para que ficasse claro
              qual era o objetivo dos alunos. A partir disso, todos os alunos
              tiveram acesso aos jogos, e a equipe de desenvolvimento ficou
              disponível para tirar dúvidas e auxiliar os alunos durante a
              experiência.
            </p>
          </div>
          <div className="col-span-2 w-full sm:px-0">
            <p className="font-2 text-md leading-loose sm:text-justify md:text-lg xl:text-xl 2xl:text-2xl">
              Os resultados foram emocionantes! Ficamos muito felizes com a
              recepção dos alunos ao ver a nossa equipe. Além disso, os alunos
              amaram os jogos! Foi um momento mágico que misturou aprendizado e
              diversão! Eles relataram ficar muito animados com os jogos e se
              divertirem no meio do processo de aprendizado. Ver o entusiasmo
              dos alunos foi a prova de que estamos no caminho certo para criar
              uma experiência de aprendizado imersiva e envolvente.
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
