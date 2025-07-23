import { Footer } from "../../components/Footer/Footer";
import { Header } from "../../components/Header/Header";
import { Introduction } from "./components/Introduction/Introduction";

import "./Home.css";

export function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-col container m-auto py-16">
        <Introduction />
      </main>
      <Footer />
    </>
  );
}
