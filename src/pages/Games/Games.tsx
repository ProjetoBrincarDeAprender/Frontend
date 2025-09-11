import { useEffect, useState } from "react";

import { Card, type CardProps } from "../../components/utils/Card/Card";

import gamesData from "./games.json";

import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header/Header";
import { BiSearch } from "react-icons/bi";
import "./Games.css";

export function Games() {
  const [games, setGames] = useState<CardProps[]>([]);

  useEffect(() => {
    setGames(gamesData);
  }, []);

  const handleSubmitSearch = () => {
    return null;
  };

  return (
    <>
      <Header />
      <main className="bg-slate-200 pt-48">
        <div className="border-am2 mx-auto mb-16 flex max-w-md items-center rounded-xl border-4 text-gray-900">
          <input type="text" className="w-full px-6 py-2 focus:outline-0" />
          <span className="block px-4" onClick={handleSubmitSearch}>
            <BiSearch size={32} className="text-purplish-blue" />
          </span>
        </div>
        <div className="grid grid-cols-1 gap-y-32 py-16 sm:grid-cols-2 md:grid-cols-3">
          {games.map((game) => (
            <Card
              key={game.gameIdUrl}
              gameIdUrl={game.gameIdUrl}
              title={game.title}
              variant="game"
              {...(game.image ? { image: game.image } : {})} // Verifica se tem imagem, se tiver retorna, se não deixa vazio
            />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
