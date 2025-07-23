import { Footer } from "../../components/Footer/Footer";
import { Header } from "../../components/Header/Header";
import { Card } from "../../components/utils/Card/Card";
import { Introduction } from "./components/Introduction/Introduction";

import "./Home.css";

export function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-col m-auto py-16">
        <Introduction />
        <Card gameIdUrl="/12" title="Jogo da Velha" variant="skill" />
      </main>
      <Footer />
    </>
  );
}
