import { useTable } from "@/hooks/Table/useTable";
import { useUser } from "@/hooks/User/useUser";
import api from "@/utils/api";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { DataTable } from "../../../../utils/DataTable/DataTable";
import { QuestionColumns, type Question } from "./TableData";
import type { ColumnDef } from "@tanstack/react-table";
import { AxiosError } from "axios";

import { SkeletonTable } from "@/components/ui/skeleton-table";
import DeleteModal from "@/components/utils/DataTable/DeleteModal";
// import { EditQuestionModal } from "../edit/QuestionEditModal";

interface CellContext {
  row: {
    original: Question;
  };
}

interface Activity {
  id: number;
  titulo: string;
  descricao?: string;
  tipo?: string;
}

interface QuestionApiResponse {
  id: number;
  conteudo: {
    texto: string;
  } | string;
  atividade_id: number;
  ordem: number;
  created_At?: string;
  updated_At?: string;
}

export default function QuestionTable() {
  const [data, setData] = useState<Question[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    
    try {
      // Deletar questões selecionadas uma por vez
      for (const id of selectedIds) {
        try {
          await api.delete(`/question/remove/${id}`);
        } catch (error) {
          console.error(`Erro ao deletar questão ${id}:`, error);
        }
      }
      setSelectedIds([]);
      setUpdating(true);
    } catch (error) {
      console.error("Erro ao deletar questões:", error);
    }
  };

  const [searchParams, _] = useSearchParams();
  const { updating, setUpdating } = useTable();
  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);      
      try {
        const [questionsResponse, activitiesResponse] = await Promise.all([
          api.get("/question/list"),
          api.get("/activity/list"),
        ]);
   
        if (questionsResponse.status === 200) {
          const questionsData: QuestionApiResponse[] = questionsResponse.data || [];
          
          // Criar mapa de atividades
          const activitiesMap = new Map<number, Activity>();
          if (activitiesResponse.status === 200 && activitiesResponse.data) {
            activitiesResponse.data.forEach((activity: Activity) => {
              activitiesMap.set(activity.id, activity);
            });
          }
          
          // Mapear e enriquecer os dados das questões
          const enrichedQuestions: Question[] = questionsData.map((question) => {
            // Extrair conteúdo
            let content = "";
            if (question.conteudo) {
              if (typeof question.conteudo === 'object' && question.conteudo.texto) {
                content = question.conteudo.texto;
              } else if (typeof question.conteudo === 'string') {
                // Se for uma string JSON, tentar fazer parse
                try {
                  const parsed = JSON.parse(question.conteudo);
                  content = parsed.texto || question.conteudo;
                } catch {
                  content = question.conteudo;
                }
              }
            }
            
            // Buscar dados da atividade
            const activity = activitiesMap.get(question.atividade_id);
            
            return {
              id: question.id,
              content: content,
              ordem: question.ordem,
              activityId: question.atividade_id,
              activity: activity ? {
                id: activity.id,
                titulo: activity.titulo
              } : undefined,
              createdAt: question.created_At || "",
              updatedAt: question.updated_At || "",
            };
          });
          
          setData(enrichedQuestions);
        } else {
          setData([]);
        }
      } catch (error) {        
        if (error instanceof AxiosError) {
          if (error.response?.status === 404) {
            setData([]);
          } else {
            console.error("Erro ao buscar questões:", error);
            setData([]);
          }
        } else {
          console.error("Erro desconhecido:", error);
          setData([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData().then(() => setUpdating(false));
  }, [updating, setUpdating, user]);

  const columnsWithCheckbox: ColumnDef<Question>[] = [
    {
      id: "select",
      header: () => <span className="font-bold">Selecionar</span>,
      cell: ({ row }: CellContext) => {
        const id = row.original.id;
        const checked = selectedIds.includes(id);
        return (
          <input
            type="checkbox"
            checked={checked}
            onChange={() => {
              setSelectedIds((prev) =>
                checked ? prev.filter((item) => item !== id) : [...prev, id],
              );
            }}
            className="h-4 w-4 cursor-pointer accent-blue-600"
            aria-label={
              checked ? "Desmarcar questão" : "Selecionar questão"
            }
          />
        );
      },
      enableSorting: false,
    },
    ...QuestionColumns.map((col) => {
      if ((col as ColumnDef<Question>).id === "actions") {
        return {
          ...col,
          cell: ({ row }: CellContext) => (
            <div className="flex items-center justify-center gap-2">
              <button
                disabled={selectedIds.length > 0}
                className={
                  selectedIds.length > 0 ? "cursor-not-allowed opacity-50" : ""
                }
              >
                {/* <EditQuestionModal id={row.original.id} /> */}
              </button>
              <button
                disabled={selectedIds.length > 0}
                className={
                  selectedIds.length > 0 ? "cursor-not-allowed opacity-50" : ""
                }
              >
                <DeleteModal
                  route="/question/remove"
                  id={row.original.id}
                />
              </button>
            </div>
          ),
        };
      }
      return col;
    }),
  ];

  return (
    <>
      {loading ? (
        <SkeletonTable rows={6} cols={columnsWithCheckbox.length} />
      ) : (
        <DataTable
          columns={columnsWithCheckbox}
          data={data ?? []}
          page={
            searchParams.get("page") ? parseInt(searchParams.get("page")!) : 0
          }
          renderExtra={() =>
            selectedIds.length > 0 && !loading ? (
              <button
                onClick={handleDeleteSelected}
                className="ml-2 flex items-center gap-2 rounded bg-red-500 px-4 py-2 font-bold text-white transition-all hover:bg-red-700"
                title="Excluir questões selecionadas"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Excluir Selecionadas ({selectedIds.length})
              </button>
            ) : null
          }
        />
      )}
    </>
  );
}