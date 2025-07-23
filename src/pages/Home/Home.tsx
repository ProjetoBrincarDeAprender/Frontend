import { Footer } from "../../components/Footer/Footer";
import { Header } from "../../components/Header/Header";
import girl from "../../assets/girlmainpage.svg";
import { Link } from "../../components/utils/Link/Link";
import { BiJoystick } from "react-icons/bi";

import "./Home.css";

export function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-col container m-auto py-16">
        <section className="flex justify-around items-center font-1">
          <div className="flex flex-col gap-8">
            <h1 className="font-bold text-5xl">
              Plataforma de Jogos
              <br />
              Educacionais
            </h1>
            <p>Porque o amor não conta cromossomos!</p>
            <Link
              href="/games"
              variant="dark"
              className="play-button px-16 py-3 bg-yellow hover:bg-yellow-600 rounded-2xl text-4xl font-bold text-center self-start"
            >
              <BiJoystick className="inline-block text-purplish-blue" /> Jogar
            </Link>
          </div>
          <div>
            <img src={girl} alt="" className="block max-h-[31.25rem]" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
