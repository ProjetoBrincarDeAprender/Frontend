import { Footer } from "../../components/Footer/Footer";
import { Header } from "../../components/Header/Header";
import { Introduction } from "./components/Introduction/Introduction";
import { PopularGames } from "./components/PopularGames/PopularGames";

import "./Home.css";

export function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-col m-auto py-16">
        <Introduction />
        <PopularGames className="mt-48" />
      </main>
      <Footer />
    </>
  );
}
