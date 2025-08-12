import { Footer } from "../../components/footer/Footer";
import { Header } from "../../components/header/Header";
import { Introduction } from "./components/Introduction/Introduction";
import { PopularGames } from "./components/PopularGames/PopularGames";
import { SkillGroup } from "./components/SkillGroup/SkillGroup";

import "./Home.css";

export function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-col">
        <Introduction />
        <PopularGames className="mt-48" />
        <SkillGroup className="mt-48" />
      </main>
      <Footer />
    </>
  );
}
