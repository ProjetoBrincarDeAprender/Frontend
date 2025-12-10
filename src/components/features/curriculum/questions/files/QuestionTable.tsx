import { QUESTION_QUERY_KEY, useQuestion } from "@/hooks/Question/useQuestion";
import { useDelete } from "@/hooks/useDelete";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { DataTable } from "../../../../utils/DataTable/DataTable";
import { QuestionColumns, type QuestionFormatted } from "./TableData";

import { SkeletonTable } from "@/components/ui/skeleton-table";
import DeleteModal from "@/components/utils/DataTable/DeleteModal";
import useActivity from "@/hooks/Activity/useActivity";
import type { Activity } from "@/types/activity";
import type { Question } from "@/types/question";
// import { EditQuestionModal } from "../edit/QuestionEditModal";

interface CellContext {
  row: {
    original: QuestionFormatted;
  };
}

export default function QuestionTable() {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

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

  const [searchParams, _] = useSearchParams();

  const { questionsQuery } = useQuestion({});
  const { data: questionsData, isLoading: loading } = questionsQuery;

  const { activitiesQuery } = useActivity();
  const { data: activitiesData, isLoading: activitiesLoading } =
    activitiesQuery;

  const [formattedQuestions, setFormattedQuestions] = useState<
    QuestionFormatted[]
  >([]);

  useEffect(() => {
    if (questionsData && activitiesData) {
      const activitiesMap = new Map<number, Activity>();
      activitiesData.forEach((activity: Activity) => {
        activitiesMap.set(activity.id, activity);
      });

      const enrichedQuestions: QuestionFormatted[] = questionsData?.map(
        (question) => {
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
            activity: activity
              ? {
                  id: activity.id,
                  titulo: activity.titulo,
                }
              : undefined,
            createdAt: question.created_At || "",
          };
        },
      );

      setFormattedQuestions(enrichedQuestions);
    }
  }, [questionsData, activitiesData]);

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
                  entity="Questão"
                  queryKey={QUESTION_QUERY_KEY}
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
      {loading || activitiesLoading ? (
        <SkeletonTable rows={6} cols={columnsWithCheckbox.length} />
      ) : (
        <DataTable
          columns={columnsWithCheckbox}
          data={formattedQuestions ?? []}
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
