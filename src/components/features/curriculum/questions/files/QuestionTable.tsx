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
import { EditQuestionModal } from "../edit/QuestionEditModal";

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
        const questionsResponse = await api.get("/question/list");
   
        if (questionsResponse.status === 200) {
          let questionsData = questionsResponse.data || [];
                  
          if (Array.isArray(questionsData) && questionsData.length > 0) {
            try {
             
              const activitiesResponse = await api.get("/activity/list");
              
           
              if (activitiesResponse.status === 200 && activitiesResponse.data) {
                const activitiesMap = new Map<number, Activity>();
                activitiesResponse.data.forEach((activity: Activity) => {
                  activitiesMap.set(activity.id, activity);
                });
                
              
                questionsData = questionsData.map((question: Question) => {
                  const activity = activitiesMap.get(question.activityId);
                  const enrichedQuestion = {
                    ...question,
                    activity: activity ? {
                      id: question.activityId,
                      titulo: activity.titulo
                    } : undefined
                  };
                  
                 
                  return enrichedQuestion;
                });
              }
            } catch (activityError) {
              console.warn("Erro ao buscar atividades para enriquecer dados:", activityError);
            }
          } else {
            // console.log("ℹ Nenhuma questão encontrada para enriquecer");
          }
          
          setData(questionsData);
        } else {
       
          setData([]);
        }
      } catch (error) {        
        if (error instanceof AxiosError) {
          
          if (error.response?.status === 404) {
            setData([]);
          } else {
            setData([]);
          }
        } else {
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
                <EditQuestionModal id={row.original.id} />
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
        <>
          {data && data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-700">
                Nenhuma questão encontrada
              </h3>
              <p className="text-gray-500 mb-2">
                Ainda não há questões cadastradas no sistema.
              </p>
              <p className="text-sm text-gray-400">
                Crie algumas atividades e adicione questões para vê-las aqui.
              </p>
            </div>
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
      )}
    </>
  );
}