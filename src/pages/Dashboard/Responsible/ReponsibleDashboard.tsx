import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { useUser } from "@/hooks/User/useUser";
import { LateralMenu } from "@/components/sideBar/sideBar";
import StudentCard from "@/components/studentCard/StudentCard";
import saturn from "../../../assets/saturn.svg";

export function ResponsibleDashboard() {
  const { user } = useUser();
  const username = user?.nome_completo || "Usuário";

  return (
    <div className="flex h-fit flex-col bg-neutral-200 pt-28 text-gray-800">
      <section className="h-full px-78 pt-8">
        <div className="flex items-center gap-4">
          <img className="max-w-24" src={saturn} alt="Saturn" />
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold">Bem vindo {username},</h1>
            <h1 className="text-5xl font-bold">Alunos sob sua tutela</h1>
          </div>
        </div>
      </section>

      <Header />
      <StudentCard />
      <Footer />
    </div>
  );
}
