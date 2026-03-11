import moon from "@/assets/moon.png";
import cloudsBanner from "@/assets/nuvem.svg";
import constelation from "@/assets/pipa.svg";
import rocket from "@/assets/rocket.svg";
import saturn from "@/assets/saturn.svg";
import star from "@/assets/star.svg";
import { Footer } from "@/components/Footer/Footer";
import { GameCard } from "@/components/GameCard/Root";
import { Header } from "@/components/Header/Header";
import { useNavigate } from "react-router";
import gamesData from "./games.json";

export default function AboutGames() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <main className="flex h-full min-h-screen flex-col pt-28">
        <div className="relative mb-10 flex w-full flex-col gap-16 md:mb-40">
          <div className="mt-20 flex w-3/4 flex-col gap-10 self-center text-center">
            <h1 className="font-1 text-center text-3xl font-bold md:text-4xl">
              Nossos Jogos
            </h1>
            <p className="font-1 text-center text-lg text-wrap md:text-xl">
              Nossos jogos são criados com{" "}
              <strong>acompanhamento pedagógico</strong> para garantir que o
              tempo de tela seja tempo de <strong>aprendizado efetivo</strong>.
            </p>
          </div>
          <img
            src={saturn}
            alt="saturn"
            className="absolute top-12.5 -right-2.5 -z-10 size-35 -translate-y-18.5 scale-50 md:right-25 md:size-55"
          />
          <img
            src={moon}
            alt="moon"
            className="absolute top-0 left-5 -z-10 size-16 scale-75 md:left-65 md:size-25"
          />
          {/* <img
            src={star}
            alt="star"
            className="absolute top-30 right-20 -z-10 size-13 scale-50"
          /> */}
          <img
            src={star}
            alt="star"
            className="absolute -top-2.5 left-0 -z-10 size-13 translate-y-20 scale-50 md:-top-5 md:left-40 md:size-20"
          />
          <img
            src={star}
            alt="star"
            className="absolute -top-22.5 left-42 -z-10 size-13 translate-y-20 scale-50 md:-top-30 md:left-120 md:size-20"
          />
          <img
            src={star}
            alt="star"
            className="absolute top-48 left-5 -z-10 size-13 translate-y-20 scale-50 md:top-43 md:left-15 md:block md:size-20"
          />
          <img
            src={star}
            alt="star"
            className="absolute -z-10 hidden translate-y-20 scale-50 opacity-0 md:-top-20 md:right-90 md:block md:size-20 md:opacity-100"
          />
          <img
            src={constelation}
            alt="constelation"
            className="absolute top-50 -right-6.25 -z-10 size-30 scale-50 -rotate-75 md:right-30 md:size-40"
          />
          <img
            src={rocket}
            alt="rocket"
            className="absolute top-37 -left-8 -z-10 size-30 scale-50 -rotate-35 md:top-30 md:left-23 md:size-50 md:-rotate-27"
          />
          {gamesData &&
            gamesData.games.map(
              ({ badges, description, title, preview, previewType }) => (
                <GameCard.Wrapper key={title} id={title}>
                  <GameCard.Preview
                    previewContent={`/assets/common/media/videos/${preview}`}
                    previewType={previewType as "image" | "video"}
                  />
                  <div className="flex h-full w-full flex-col gap-2 lg:gap-4">
                    <div className="flex flex-wrap gap-2">
                      {badges.map((badge) => (
                        <GameCard.Badge
                          key={badge.id}
                          name={badge.name}
                          bgColor={badge.bgColor}
                          textColor={badge.textColor}
                        />
                      ))}
                    </div>
                    <GameCard.Content title={title} description={description} />
                    <GameCard.Button
                      text="Jogar"
                      onClick={() => {
                        navigate(`/games`);
                      }}
                    />
                  </div>
                </GameCard.Wrapper>
              ),
            )}
        </div>
        <img src={cloudsBanner} alt="clouds" className="m-0 mt-auto w-full" />
      </main>
      <Footer />
    </>
  );
}
