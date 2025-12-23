import { QUESTION_QUERY_KEY, useQuestion } from "@/hooks/Question/useQuestion";
import { useUser } from "@/hooks/User/useUser";
import { useDelete } from "@/hooks/useDelete";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { DataTable } from "../../../../utils/DataTable/DataTable";
import { QuestionColumns, type QuestionFormatted } from "./TableData";

import { SkeletonTable } from "@/components/ui/skeleton-table";
import useActivity from "@/hooks/Activity/useActivity";
import type { Activity } from "@/types/activity";
import type { FilterQuestionOption } from "@/types/filter";

interface CellContext {
  row: {
    original: QuestionFormatted;
  };
}

export default function QuestionTable() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { user } = useUser();

  const { multiDeleteMutation } = useDelete({
    route: "/question/remove",
    entity: "Questão",
    queryKey: QUESTION_QUERY_KEY,
  });
  const { mutateAsync: deleteQuestions, isError: isQuestionError } =
    multiDeleteMutation;

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    await deleteQuestions(selectedIds);
    setSelectedIds([]);
  };

  useEffect(() => {
    if (isQuestionError) {
      setSelectedIds([]);
    }
  }, [isQuestionError]);

  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredActivities, setFilteredActivities] = useState<number[]>([]);

  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;

  const filters: FilterQuestionOption = {
    page,
    limit: pageSize as 10 | 25 | 50 | 100 | 500,
  };

  if (user?.perfil === "Professor") {
    filters.activitiesIds = filteredActivities;
  }

  const { questionsQuery } = useQuestion({ filters });
  const { data: questionsData, isLoading: loading } = questionsQuery;

  const { activitiesQuery } = useActivity();
  const { data: activitiesData, isLoading: activitiesLoading } =
    activitiesQuery;

  // Handle pagination change
  const handlePaginationChange = (pagination: {
    pageIndex: number;
    pageSize: number;
  }) => {
    setSearchParams({
      page: String(pagination.pageIndex + 1),
      pageSize: String(pagination.pageSize),
    });
    setSelectedIds([]);
  };

  const [formattedQuestions, setFormattedQuestions] = useState<
    QuestionFormatted[]
  >([]);

  useEffect(() => {
    if (questionsData?.data && activitiesData?.data) {
      let filteredActivities = activitiesData.data;

      if (user?.perfil === "Professor") {
        const userEscolaId = user?.escolaId;
        const userCodigo = user?.codigo_usuario;

        filteredActivities = activitiesData.data.filter(
          (activity: Activity) => {
            if (!activity.usuarioCriadorId) {
              return false;
            }

            const criadorId = String(activity.usuarioCriadorId);

            if (userCodigo && criadorId === userCodigo) {
              return true;
            }

            if (userEscolaId && activity.escolaId === userEscolaId) {
              return true;
            }

            return false;
          },
        );
      }

      setFilteredActivities(filteredActivities.map((activity) => activity.id));

      const activitiesMap = new Map<number, Activity>();
      filteredActivities.forEach((activity: Activity) => {
        activitiesMap.set(activity.id, activity);
      });

      const enrichedQuestions: QuestionFormatted[] = questionsData.data
        .filter((question) => activitiesMap.has(question.atividade_id))
        .map((question) => {
          let content = "";
          if (question.conteudo) {
            if (
              typeof question.conteudo === "object" &&
              (question.conteudo as { texto: string })
            ) {
              content = (question.conteudo as { texto: string }).texto;
            } else if (typeof question.conteudo === "string") {
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
            usuarioCriadorId: activity?.usuarioCriadorId,
            activity: activity
              ? {
                  id: activity.id,
                  titulo: activity.titulo,
                }
              : undefined,
            createdAt: question.created_At || "",
          };
        });

      console.log(enrichedQuestions);

      setFormattedQuestions(enrichedQuestions);
    }
  }, [
    questionsData,
    activitiesData,
    user?.perfil,
    user?.codigo_usuario,
    user?.escolaId,
  ]);

  const columnsWithCheckbox: ColumnDef<QuestionFormatted>[] = [
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
            aria-label={checked ? "Desmarcar questão" : "Selecionar questão"}
          />
        );
      },
      enableSorting: false,
    },
    ...QuestionColumns.map((col) => col),
  ];

  return (
    <>
      {loading || activitiesLoading ? (
        <SkeletonTable rows={6} cols={columnsWithCheckbox.length} />
      ) : (
        <DataTable
          columns={columnsWithCheckbox}
          data={formattedQuestions ?? []}
          manualPagination
          pageCount={questionsData?.meta.totalPages}
          pagination={{
            pageIndex: page - 1,
            pageSize,
          }}
          onPaginationChange={handlePaginationChange}
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
