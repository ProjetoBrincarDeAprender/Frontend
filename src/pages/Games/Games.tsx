import { useEffect, useState } from "react";
import { Card, type CardProps } from "../../components/utils/Card/Card";
import gamesData from "./games.json";
import api from "../../utils/api";

import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { BackButton } from "@/components/utils/BackButton";
import { BiSearch } from "react-icons/bi";
import "./Games.css";

interface ActivityData {
  id: number;
  titulo: string;
  tipo: string;
  competenciaId: {
    id: number;
  };
  conteudo: Record<string, unknown>;
  created_At: string;
  updated_At: string;
  competencia_id: number;
  nivel_dificuldade_inicial: number;
  deleted: boolean;
  deletedBy: number;
  deleted_At: string;
}

type KnowledgeArea = "TODOS" | "PORTUGUES" | "MATEMATICA" | "CIENCIAS" | "GEOGRAFIA" | "COORDENAÇÃO";

const KNOWLEDGE_AREAS = [
  { id: "TODOS", label: "TODOS", color: "bg-gradient-to-br from-gray-400 to-gray-600" },
  { id: "PORTUGUES", label: "PORTUGUÊS", color: "bg-gradient-to-br from-red-400 to-red-600" },
  { id: "MATEMATICA", label: "MATEMÁTICA", color: "bg-gradient-to-br from-blue-400 to-blue-600" },
  { id: "CIENCIAS", label: "CIÊNCIAS", color: "bg-gradient-to-br from-green-400 to-green-600" },
  { id: "GEOGRAFIA", label: "GEOGRAFIA", color: "bg-gradient-to-br from-yellow-400 to-yellow-600" },
  { id: "COORDENAÇÃO", label: "COGNIÇÃO", color: "bg-gradient-to-br from-purple-400 to-purple-600" },
] as const;


export function Games() {
  const [games, setGames] = useState<CardProps[]>([]);
  const [filteredGames, setFilteredGames] = useState<CardProps[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<KnowledgeArea>("TODOS");
  const [_activities, _setActivities] = useState<ActivityData[]>([]);
  const [_loading, _setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await api.get('/activity/list');
        _setActivities(response.data);
      } catch (error) {
        console.error('Erro ao buscar atividades:', error);
        setGames(gamesData);
        setFilteredGames(gamesData);
      } finally {
        _setLoading(false);
      }
    };

    fetchActivities();
    setGames(gamesData);
    setFilteredGames(gamesData);
  }, []);

  const _mapCompetenciaToArea = (competenciaId: number): KnowledgeArea => {
    switch (competenciaId) {
      case 1:
      case 2:
        return "PORTUGUES";
      case 3:
      case 4:
        return "MATEMATICA";
      case 5:
        return "CIENCIAS";
      case 6:
        return "GEOGRAFIA";
      case 7:
      case 8:
        return "COORDENAÇÃO";
      default:
        return "COORDENAÇÃO";
    }
  };

  const filterGames = (term: string, area: KnowledgeArea) => {
    let filtered = [...games];

    if (area !== "TODOS") {
     
      filtered = filtered.filter((game) => {
        const gameArea = getGameArea(game.title);
        return gameArea === area;
      });
    }
    if (term.trim()) {
      filtered = filtered.filter((game) =>
        game.title.toLowerCase().includes(term.toLowerCase())
      );
    }

    setFilteredGames(filtered);
  };

  const getGameArea = (gameTitle: string): KnowledgeArea => {
    const title = gameTitle.toLowerCase();
    
    if (title.includes("vogais") || title.includes("sílaba") ) {
      return "PORTUGUES";
    }
    if (title.includes("soma") || title.includes("números") || title.includes("numero")) {
      return "MATEMATICA";
    }
    if (title.includes("moradia") || title.includes("profissões")) {
      return "GEOGRAFIA";
    }
    if (title.includes("formas") || title.includes("labirinto") || title.includes("memoria")) {
      return "COORDENAÇÃO";
    }
    if (title.includes("espaço") || title.includes("ciclo") || title.includes("planta")) {
      return "CIENCIAS";
    }
    return "COORDENAÇÃO"; // Default
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    filterGames(value, selectedArea);
  };

  const handleSubmitSearch = (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    filterGames(searchTerm, selectedArea);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmitSearch();
    }
  };

  const handleAreaFilter = (area: KnowledgeArea) => {
    setSelectedArea(area);
    filterGames(searchTerm, area);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSelectedArea("TODOS");
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

   {/* Filtros por área de conhecimento */}
        <div className="mx-auto mb-8 max-w-6xl px-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {KNOWLEDGE_AREAS.map((area) => (
              <button
                key={area.id}
                onClick={() => handleAreaFilter(area.id)}
                className={`
                  ${area.color} 
                  ${selectedArea === area.id 
                    ? 'ring-4 ring-purplish-blue ring-opacity-80 scale-105 shadow-xl transform-gpu' 
                    : 'hover:scale-105 hover:shadow-lg'
                  }
                  text-white font-1 py-4 px-6 rounded-2xl 
                  transition-all duration-300 ease-in-out
                  text-2xl sm:text-base lg:text-lg
                  transform active:scale-95
                  min-h-[60px] flex items-center justify-center hover:cursor-pointer
                  border-2 border-purplish-blue border-opacity-60
                  hover:border-opacity-100 hover:shadow-blue-800/25
                  backdrop-blur-sm
                `}
              >
                {area.label}
              </button>
            ))}
          </div>
        </div>

        {(searchTerm || selectedArea !== "TODOS") && (
          <div className="flex justify-center text-center mb-8">
              <p className="text-gray-600 font-1 text-xl"></p>
              {filteredGames.length === 0 && (
                <div className="mt-4">
                  <p className="text-orange-600 font-1 text-lg mb-4">
                    Tente pesquisar por outros termos ou veja todos os jogos disponíveis
                  </p>
                  <button
                    onClick={clearSearch}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white 
                             rounded-full font-1-bold text-xl hover:from-orange-600 hover:to-red-600 
                             transform hover:scale-105 transition-all duration-200 
                             active:scale-95 shadow-lg hover:shadow-xl hover:cursor-pointer"
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

        {filteredGames.length === 0 && !searchTerm && selectedArea === "TODOS" && (
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
