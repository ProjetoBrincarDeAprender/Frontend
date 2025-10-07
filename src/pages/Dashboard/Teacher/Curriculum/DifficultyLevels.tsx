import { CreateDifficultyLevelModal } from "@/components/features/curriculum/difficultyLevels/CreateDifficultyLevelModal";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { useUser } from "@/hooks/User/useUser";
import { LateralMenu } from "../../../../components/sideBar/sideBar";
// import DifficultyLevelTable from "@/components/features/curriculum/difficultyLevels/DifficultyLevelTable";
import { TableProvider } from "@/contexts/Table/provider";
import { Link } from "react-router";
import saturn from "../../../../assets/saturn.svg";

export function DifficultyLevels() {
  const { user } = useUser();
  const username = user?.nome_completo || "Usuário";

  return (
    <>
      <Header />
      <LateralMenu username={username} />
      <main className="font-1 h-full bg-neutral-200 px-32 pt-32 pb-32 text-gray-800">
        <div className="flex items-center gap-4">
          <img className="max-w-24" src={saturn} alt="Saturn" />
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold">Bem vindo {username},</h1>
            <h1 className="text-5xl font-bold">Níveis de Dificuldade</h1>
          </div>
        </div>

        <TableProvider>
          <div className="mt-16 flex items-center justify-between">
            <div className="flex items-center gap-8 text-2xl font-bold">
              <CreateDifficultyLevelModal 
                trigger={
                  <button className="blue bg-yellow hover:bg-purplish-blue hover:text-yellow flex min-h-[60px] items-center justify-center gap-8 rounded-2xl px-8 py-4 text-center text-sm font-bold uppercase shadow-xl transition duration-200">
                    Cadastrar Nível de Dificuldade
                  </button>
                }
              />
              <Link
                to="/dashboard/teacher/curriculum/competences"
                className="blue bg-yellow hover:bg-purplish-blue hover:text-yellow flex min-h-[60px] items-center justify-center gap-8 rounded-2xl px-8 py-4 text-center text-sm font-bold uppercase shadow-xl transition duration-200"
              >
                Gerenciar Competências
              </Link>
            </div>
          </div>
          {/* <DifficultyLevelTable /> */}
        </TableProvider>
      </main>
      <Footer />
    </>
  );
}