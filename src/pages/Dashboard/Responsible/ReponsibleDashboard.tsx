import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { useUser } from "@/hooks/User/useUser";
import { useEffect, useState } from "react";
import StudentCard from "@/components/studentCard/StudentCard";
import saturn from "../../../assets/saturn.svg";
import api from "@/utils/api";

export function ResponsibleDashboard() {
  const { user } = useUser();
  const [response, setResponse] = useState<any>([]);
  const username = user?.nome_completo || "Usuário";

  useEffect(() => {
    if (!user?.id) return;

    const fetchData = async () => {
      try {
        const students = await api.get(
          `/responsible/list/${user?.id}/students`,
        );
        console.log(students);
        setResponse(students.data);
      } catch (error) {
        console.error("Erro ao buscar aluno:", error);
      }
    };

    fetchData();
  }, [user?.id]);

  return (
    <div className="flex h-fit flex-col bg-neutral-200 pt-28 text-gray-800">
      <Header />
      <section className="h-full px-78 pt-8">
        <div className="flex items-center gap-4">
          <img className="max-w-24" src={saturn} alt="Saturn" />
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold">Bem vindo {username},</h1>
            <h1 className="text-5xl font-bold">Alunos sob sua tutela</h1>
          </div>
        </div>
      </section>
      {response.map(
        (student: { avatar_url: string | null; nome_completo: string }) => {
          return (
            <StudentCard
              imageUrl={student.avatar_url}
              studentName={student.nome_completo}
            />
          );
        },
      )}
      <Footer />
    </div>
  );
}
