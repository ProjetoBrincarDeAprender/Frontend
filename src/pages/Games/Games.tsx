import { useEffect, useState } from "react";
import { Footer } from "../../components/Footer/Footer";
import { Header } from "../../components/Header/Header";

import { Card, type CardProps } from "../../components/utils/Card/Card";

import gamesData from "./games.json";

import "./Games.css";
import { BiSearch } from "react-icons/bi";

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
      <main className="pt-48 bg-slate-200">
        <div className="mb-16 flex border-4 border-am2 items-center rounded-xl mx-auto max-w-md text-gray-900">
          <input type="text" className="py-2 px-6 w-full focus:outline-0" />
          <span className="block px-4" onClick={handleSubmitSearch}>
            <BiSearch size={32} className="text-purplish-blue" />
          </span>
        </div>
        <div className="py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-32">
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
