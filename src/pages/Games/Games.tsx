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
    nome?: string;
    descricao?: string;
    areaId?: {
      id: number;
      nome: string;
    };
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

interface KnowledgeAreaData {
  id: number;
  nome: string;
  descricao?: string;
}

interface CompetenceData {
  id: number;
  nome: string;
  descricao?: string;
  areaId?: {
    id: number;
    nome: string;
  };
}

type KnowledgeArea = string;

interface KnowledgeAreaFilter {
  id: string;
  label: string;
  color: string;
}

// Áreas padrão permitidas
const ALLOWED_AREAS = ["PORTUGUÊS", "MATEMÁTICA", "CIÊNCIAS", "GEOGRAFIA", "COORDENAÇÃO", "COGNIÇÃO"];

const AREA_COLORS: Record<string, string> = {
  TODOS: "bg-gradient-to-br from-gray-400 to-gray-600",
  PORTUGUÊS: "bg-gradient-to-br from-red-400 to-red-600",
  MATEMÁTICA: "bg-gradient-to-br from-blue-400 to-blue-600",
  CIÊNCIAS: "bg-gradient-to-br from-green-400 to-green-600",
  GEOGRAFIA: "bg-gradient-to-br from-yellow-400 to-yellow-600",
  COORDENAÇÃO: "bg-gradient-to-br from-purple-400 to-purple-600",
  COGNIÇÃO: "bg-gradient-to-br from-purple-400 to-purple-600",
};

// Mapeamento de tipos de atividade para gameIdUrl
const ACTIVITY_TYPE_TO_GAME_URL: Record<string, string> = {
  "tonicStress": "stresssyllable",
  "syllableClassification": "syllable",
  "vowels": "vowels",
  "forms": "forms",
  "maze": "maze",
  "space": "space",
  "locations": "locations",
  "memory": "memory",
  "plants": "plants",
  "professions": "professions",
  "sum": "sum",
  "subtraction": "subtraction",
  "numbers": "numbers",
  "address": "address",
  "housing": "housing",
  "useSyllable": "use-syllable",
  "simpleSyllable": "simple-syllable",
  "complexSyllable": "complex-syllable",
  "hygiene": "hygiene",
  "comDates": "com-dates",
};

export function Games() {
  const [games, setGames] = useState<CardProps[]>([]);
  const [filteredGames, setFilteredGames] = useState<CardProps[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<KnowledgeArea>("TODOS");
  const [knowledgeAreas, setKnowledgeAreas] = useState<KnowledgeAreaFilter[]>([
    {
      id: "TODOS",
      label: "TODOS",
      color: AREA_COLORS.TODOS,
    },
  ]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Buscar todas as áreas de conhecimento
        const areasResponse = await api.get("/knowledge-area/list");
        const areas: KnowledgeAreaData[] = areasResponse.data || [];

        // Filtrar apenas as áreas permitidas e criar filtros
        const allowedAreasFromDB = areas.filter((area) => 
          ALLOWED_AREAS.includes(area.nome.toUpperCase())
        );

        const areaFilters: KnowledgeAreaFilter[] = [
          {
            id: "TODOS",
            label: "TODOS",
            color: AREA_COLORS.TODOS,
          },
          ...allowedAreasFromDB.map((area) => ({
            id: area.nome.toUpperCase(),
            label: area.nome.toUpperCase(),
            color: AREA_COLORS[area.nome.toUpperCase()] || "bg-gradient-to-br from-gray-400 to-gray-600",
          })),
        ];
        setKnowledgeAreas(areaFilters);

        // Buscar todas as competências de todas as áreas
        const allCompetences: CompetenceData[] = [];
        for (const area of areas) {
          try {
            const competencesResponse = await api.get(`/knowledge-area/list/${area.id}/competences`);
            if (competencesResponse.status === 200 && competencesResponse.data) {
              const competences = competencesResponse.data.map((comp: CompetenceData) => ({
                ...comp,
                areaId: {
                  id: area.id,
                  nome: area.nome,
                },
              }));
              allCompetences.push(...competences);
            }
          } catch (error) {
            console.error(`Erro ao buscar competências da área ${area.id}:`, error);
          }
        }

        // Buscar atividades do banco
        const activitiesResponse = await api.get("/activity/list");
        const activities: ActivityData[] = activitiesResponse.data || [];

        // Mapear atividades do banco para formato de CardProps
        const activitiesCards: CardProps[] = activities
          .filter((activity) => !activity.deleted)
          .map((activity) => {
            const competence = allCompetences.find((c) => c.id === activity.competencia_id);
            const gameUrl = ACTIVITY_TYPE_TO_GAME_URL[activity.tipo] || activity.tipo.toLowerCase();
            
            return {
              title: activity.titulo,
              gameIdUrl: gameUrl,
              image: undefined,
              variant: "game" as const,
              disabled: false,
              competency: competence?.nome,
              knowledgeArea: competence?.areaId?.nome,
            };
          });

        // Combinar jogos do JSON com atividades do banco (evitar duplicatas)
        const existingGameUrls = new Set(gamesData.map((g) => g.gameIdUrl));
        const newGamesFromDB = activitiesCards.filter(
          (activityCard) => activityCard.gameIdUrl && !existingGameUrls.has(activityCard.gameIdUrl)
        );

        // Adicionar competências aos jogos existentes do JSON se houver match
        const gamesWithCompetencies = gamesData.map((game) => {
          const matchingActivity = activitiesCards.find(
            (actCard) => actCard.gameIdUrl === game.gameIdUrl
          );
          if (matchingActivity) {
            return {
              ...game,
              competency: matchingActivity.competency,
              knowledgeArea: matchingActivity.knowledgeArea,
            };
          }
          return game;
        });

        const allGames = [...gamesWithCompetencies, ...newGamesFromDB];
        setGames(allGames);
        setFilteredGames(allGames);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
        // Em caso de erro, usar apenas os dados do JSON
        setGames(gamesData);
        setFilteredGames(gamesData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterGames = (term: string, area: KnowledgeArea) => {
    let filtered = [...games];

    if (area !== "TODOS") {
      filtered = filtered.filter((game) => {
        return game.knowledgeArea?.toUpperCase() === area;
      });
    }
    if (term.trim()) {
      filtered = filtered.filter((game) =>
        game.title.toLowerCase().includes(term.toLowerCase()),
      );
    }

    setFilteredGames(filtered);
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
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-xl text-gray-600">Carregando jogos...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="border-am2 relative mx-auto mb-16 flex max-w-lg items-center rounded-xl border-4 text-gray-900 shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl">
          <input
            type="text"
            className="w-full rounded-l-lg px-6 py-2 focus:outline-0"
            placeholder="Pesquisar jogos..."
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-16 text-xl text-gray-400 transition-all duration-200 hover:scale-110 hover:text-gray-700"
              title="Limpar pesquisa"
            >
              ×
            </button>
          )}
          <span
            className="block cursor-pointer rounded-r-lg bg-slate-200 px-5 py-3 transition-all duration-300 hover:bg-gray-200"
            onClick={handleSubmitSearch}
            title="Pesquisar"
          >
            <BiSearch
              size={32}
              className="text-purplish-blue hover:text-purplish-blue-dark transition-colors duration-300"
            />
          </span>
        </div>

        {/* Filtros por área de conhecimento */}
        <div className="mx-auto mb-8 max-w-6xl px-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {knowledgeAreas.map((area) => (
              <button
                key={area.id}
                onClick={() => handleAreaFilter(area.id)}
                className={` ${area.color} ${
                  selectedArea === area.id
                    ? "outline-4 outline-offset-1 outline-solid outline-purplish-blue ring-opacity-80 scale-105 transform-gpu shadow-xl"
                    : "hover:scale-105 hover:shadow-lg"
                } font-1 border-purplish-blue border-opacity-60 hover:border-opacity-100 flex min-h-[60px] transform items-center justify-center rounded-2xl border-2 px-6 py-4 text-2xl text-white backdrop-blur-sm transition-all duration-300 ease-in-out hover:cursor-pointer hover:shadow-blue-800/25 active:scale-95 sm:text-base lg:text-lg`}
              >
                {area.label}
              </button>
            ))}
          </div>
        </div>

        {(searchTerm || selectedArea !== "TODOS") && (
          <div className="mb-8 flex justify-center text-center">
            <p className="font-1 text-xl text-gray-600"></p>
            {filteredGames.length === 0 && (
              <div className="mt-4">
                <p className="font-1 mb-4 text-lg text-orange-600">
                  Tente pesquisar por outros termos ou veja todos os jogos
                  disponíveis
                </p>
                <button
                  onClick={clearSearch}
                  className="font-1-bold transform rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-xl text-white shadow-lg transition-all duration-200 hover:scale-105 hover:cursor-pointer hover:from-orange-600 hover:to-red-600 hover:shadow-xl active:scale-95"
                >
                  Ver todos os jogos
                </button>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 gap-y-32 py-16 sm:grid-cols-2 md:grid-cols-3">
          {filteredGames.map((game, index) => (
            <Card
              key={`${game.gameIdUrl}-${index}`}
              gameIdUrl={game.gameIdUrl}
              title={game.title}
              variant="game"
              image={game.image}
              competency={game.competency}
              knowledgeArea={game.knowledgeArea}
            />
          ))}
        </div>

        {filteredGames.length === 0 &&
          !searchTerm &&
          selectedArea === "TODOS" && (
            <div className="py-16 text-center">
              <p className="text-xl text-gray-500">
                Nenhum jogo disponível no momento.
              </p>
            </div>
          )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
