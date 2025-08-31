import { Header } from "@/components/Header/Header";
import { LateralMenu } from "@/components/sideBar/sideBar";
import { useUser } from "@/hooks/User/useUser";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { useNavigate, useSearchParams } from "react-router";

import saturn from "../../../../assets/saturn.svg";
import { TableProvider } from "@/contexts/Table/provider";
import { Button } from "@/components/ui/button";
import { StudentsUnlinkedTable } from "./StudentsUnlinkedTable/StudentsUnlinkedTable";
import { toast } from "sonner";

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
        const response = await api.get(
          `/responsible/list/${teacherId}/students`,
        );
        if (response.status === 200 && Array.isArray(response.data)) {
          setStudentsIdToLink(
            response.data.map((student: { id: number }) => student.id),
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
      <LateralMenu username={username} />
      <main className="font-1 h-full bg-neutral-200 px-32 pt-32 pb-32 text-gray-800">
        <section className="mb-8 flex items-center gap-6">
          <img className="max-w-24" src={saturn} alt="Saturn" />
          <div>
            <h1 className="mb-2 text-2xl font-semibold">
              Bem-vindo, {username}
            </h1>
            <h2 className="text-4xl font-bold">
              Vincular Alunos a(o) {username}
            </h2>
            <p className="mt-2 text-lg text-gray-600"></p>
          </div>
        </section>
        <TableProvider>
          <div className="mt-16 flex items-center justify-between">
            <div className="flex items-center gap-8 text-2xl font-bold">
              <Button
                className={`${
                  studentsIdToLink.length > 0
                    ? "hover:bg-purplish-blue hover:text-yellow opacity-100"
                    : "opacity-50"
                } bg-yellow text-purplish-blue px-14 py-7 text-xl font-bold shadow-md`}
                disabled={studentsIdToLink.length === 0}
                title={
                  studentsIdToLink.length === 0
                    ? "Deve ser selecionado algum aluno primeiro"
                    : undefined
                }
                onClick={async () => {
                  if (studentsIdToLink.length === 0) return;
                  try {
                    const response = await api.put(
                      `/responsible/update/${teacherId}`,
                      { usersIds: studentsIdToLink },
                    );
                    if (!response || response.status !== 200) {
                      toast.error(
                        "Erro ao vincular alunos ao professor. Tente novamente.",
                      );
                    } else {
                      toast.success("Alunos vinculados com sucesso!");
                    }
                  } catch (error) {
                    toast.error(
                      "Erro ao vincular alunos ao professor. Tente novamente.",
                    );
                    console.error(error);
                  }
                }}
              >
                Vincular Aluno(s)
              </Button>
            </div>
          </div>
          <StudentsUnlinkedTable
            selectedIds={studentsIdToLink}
            setSelectedIds={setStudentsIdToLink}
          />
        </TableProvider>
      </main>
    </>
  );
}
