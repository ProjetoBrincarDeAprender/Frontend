import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { useUser } from "@/hooks/User/useUser";
import StudentCard from "@/components/studentCard/StudentCard";
import saturn from "../../../assets/saturn.svg";
import api from "@/utils/api";
import { useEffect } from "react";

export function ResponsibleDashboard() {
  const { user } = useUser();
  const username = user?.nome_completo || "Usuário";

  useEffect(() => {
    if (!user?.id) return;

    const buscarAlunos = async () => {
      try {
        const response = await api.get(
          `/responsible/list/${user?.id}/students`,
        );
        console.log(response);
        return response.data;
      } catch (error) {
        console.error("Erro ao buscar aluno:", error);
      }
    };

    buscarAlunos();
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

      <StudentCard />
      <Footer />
    </div>
  );
}
