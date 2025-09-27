import { useEffect, useState } from "react";
import { Card, type CardProps } from "../../components/utils/Card/Card";
import gamesData from "./games.json";

import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import { BiSearch } from "react-icons/bi";
import "./Games.css";


export function Games() {
  const [games, setGames] = useState<CardProps[]>([]);
  const [filteredGames, setFilteredGames] = useState<CardProps[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    setGames(gamesData);
    setFilteredGames(gamesData);
  }, []);

  const filterGames = (term: string) => {
    if (!term.trim()) {
      setFilteredGames(games);
      return;
    }

    const filtered = games.filter((game) =>
      game.title.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredGames(filtered);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    filterGames(value);
  };

  const handleSubmitSearch = (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    filterGames(searchTerm);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmitSearch();
    }
  };

   const clearSearch = () => {
    setSearchTerm("");
    setFilteredGames(games);
  };

  return (
    <>
      <Header />
      <BackButton />
      <main className="bg-slate-200 pt-48">
        <div className="border-am2 mx-auto mb-16 flex max-w-lg items-center rounded-xl border-4 text-gray-900 relative 
                        hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out shadow-md">
          <input
            type="text"
            className="w-full px-6 py-2 focus:outline-0 rounded-l-lg"
            placeholder="Pesquisar jogos..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-16 text-gray-400 hover:text-gray-700 text-xl 
                         hover:scale-110 transition-all duration-200"
              title="Limpar pesquisa"
            >
              ×
            </button>
          )}
          <span
            className="bg-slate-200 block px-5 py-3 cursor-pointer hover:bg-gray-200 rounded-r-lg transition-all duration-300"
            onClick={handleSubmitSearch}
            title="Pesquisar"
          >
            <BiSearch size={32} className="text-purplish-blue hover:text-purplish-blue-dark transition-colors duration-300" />
          </span>
        </div>

        {searchTerm && (
          <div className="flexjustify-center text-center mb-8">
            <p className="text-gray-600 font-1 text-xl">
              {filteredGames.length > 0
                ? `Encontrados ${filteredGames.length} jogo(s) para "${searchTerm}"`
                : `Nenhum jogo encontrado para "${searchTerm}"`}
            </p>
            {filteredGames.length === 0 && (
             <div className="mt-4">
             
                  <p className="text-orange-600 font-1 text-lg mb-4">Tente pesquisar por outros termos ou veja todos os jogos disponíveis</p>
                  
                  <button
                    onClick={clearSearch}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white 
                             rounded-full font-1-bold text-xl hover:from-orange-600 hover:to-red-600 
                             transform hover:scale-105 transition-all duration-200 
                             active:scale-95 shadow-lg hover:shadow-xl"
                  >
                     Ver todos os jogos
                  </button>
                </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-y-32 py-16 sm:grid-cols-2 md:grid-cols-3">
          {filteredGames.map((game) => (
            <Card
              key={game.gameIdUrl}
              gameIdUrl={game.gameIdUrl}
              title={game.title}
              variant="game"
              {...(game.image ? { image: game.image } : {})}
            />
          ))}
        </div>

        {/* Mensagem quando não há jogos para mostrar */}
        {filteredGames.length === 0 && !searchTerm && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl">
              Nenhum jogo disponível no momento.
            </p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
