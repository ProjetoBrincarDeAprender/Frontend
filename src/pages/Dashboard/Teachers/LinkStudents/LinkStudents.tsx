import { Header } from "@/components/Header/Header";
import { LateralMenu } from "@/components/sideBar/sideBar";
import { useUser } from "@/hooks/User/useUser";
import api from "@/utils/api";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { Footer } from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BackButton } from "@/components/utils/BackButton";
import { TableProvider } from "@/contexts/Table/provider";
import { useTeacher } from "@/hooks/Teacher/useTeacher";
import { toast } from "sonner";
import saturn from "../../../../assets/saturn.svg";
import { StudentsUnlinkedTable } from "./StudentsUnlinkedTable/StudentsUnlinkedTable";

export function LinkStudents() {
  const [studentsIdToLink, setStudentsIdToLink] = useState<number[]>([]);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const teacherId = searchParams.get("id");

  const { user } = useUser();

  const username = user?.nome_completo || "Usuário";

  useEffect(() => {
    if (!teacherId) {
      navigate("/dashboard/teachers");
      return;
    }
  }, [teacherId, navigate]);

  const { teacherQuery } = useTeacher({ teacherId: Number(teacherId) });
  const { data: teacherData, isLoading } = teacherQuery;

  return (
    <>
      <Header />
      <BackButton />
      <LateralMenu username={username} />
      <main className="font-1 h-full bg-neutral-200 px-32 pt-32 pb-32 text-gray-800">
        {isLoading ? (
          <>
            <div className="animate-pulse">
              <section className="mb-8 flex items-center gap-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="mb-2 h-8 w-48" />
                  <Skeleton className="h-10 w-96" />
                  <Skeleton className="mt-2 h-6 w-64" />
                </div>
              </section>
              <div className="mt-16 flex items-center justify-between">
                <Skeleton className="h-14 w-48" />
              </div>
              <div className="mt-8">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="mt-2 h-64 w-full" />
              </div>
            </div>
          </>
        ) : (
          <>
            <section className="mb-8 flex items-center gap-6">
              <img className="max-w-24" src={saturn} alt="Saturn" />
              <div>
                <h1 className="mb-2 text-2xl font-semibold">
                  Bem-vindo, {username}
                </h1>
                <h2 className="text-4xl font-bold">
                  Vincular Alunos a(o) Professor(a)
                </h2>
                <p className="mt-2 text-lg text-gray-600"></p>
              </div>
            </section>
            <TableProvider>
              <div className="mt-16 flex items-center justify-between">
                <div className="flex items-center gap-8 text-2xl font-bold">
                  <Button
                    className={`bg-yellow text-purplish-blue hover:bg-purplish-blue hover:text-yellow px-14 py-7 text-xl font-bold shadow-md`}
                    onClick={async () => {
                      try {
                        const response = await api.put(
                          `/teacher/update/${teacherId}/relation`,
                          {
                            usersIds: studentsIdToLink.map((id) => Number(id)),
                          },
                        );
                        if (!response || response.status !== 200) {
                          toast.error(
                            "Erro ao atualizar vínculos do professor. Tente novamente.",
                          );
                        } else {
                          if (studentsIdToLink.length === 0) {
                            toast.success(
                              "Todos os alunos foram desvinculados do professor!",
                            );
                          } else {
                            toast.success("Alunos vinculados com sucesso!");
                          }
                          navigate("/dashboard/teachers");
                        }
                      } catch (error) {
                        toast.error(
                          "Erro ao atualizar vínculos do professor. Tente novamente.",
                        );
                        console.error(error);
                      }
                    }}
                  >
                    {studentsIdToLink.length === 0
                      ? "Desvincular Todos"
                      : "Vincular Aluno(s)"}
                  </Button>
                </div>
              </div>
              <StudentsUnlinkedTable
                selectedIds={studentsIdToLink}
                setSelectedIds={setStudentsIdToLink}
                teacherData={teacherData!}
              />
            </TableProvider>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
