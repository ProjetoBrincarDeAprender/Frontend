import { Header } from "@/components/Header/Header";
import { LateralMenu } from "@/components/sideBar/sideBar";
import { useUser } from "@/hooks/User/useUser";
import api from "@/utils/api";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

import { Footer } from "@/components/Footer/Footer";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/utils/BackButton";
import { TableProvider } from "@/contexts/Table/provider";
import type { User } from "@/types/user";
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
      navigate("/dashboard/teachers"); // redireciona se não houver id
      return;
    }
    const fetchLinkedStudents = async () => {
      try {
        const response = await api.get(`/teacher/list/${teacherId}/students`);
        if (response.status === 200 && Array.isArray(response.data)) {
          setStudentsIdToLink(
            response.data.map((student: User) =>
              Number(student.codigo_usuario),
            ),
          );
        }
      } catch (error) {
        // Se der erro, não faz nada
      }
    };
    fetchLinkedStudents();
  }, [teacherId, navigate]);

  return (
    <>
      <Header />
      <BackButton />
      <LateralMenu username={username} />
      <main className="font-1 h-full bg-neutral-200 px-32 pt-32 pb-32 text-gray-800">
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
                      { usersIds: studentsIdToLink.map((id) => Number(id)) },
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
          />
        </TableProvider>
      </main>
      <Footer />
    </>
  );
}
