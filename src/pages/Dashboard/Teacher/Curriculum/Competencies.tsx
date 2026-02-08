import { CreateCompetenceModal } from "@/components/features/curriculum/competencies/CreateCompetenceModal";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { useUser } from "@/hooks/User/useUser";
import { LateralMenu } from "../../../../components/sideBar/sideBar";
import CompetenceTable from "@/components/features/curriculum/competencies/files/CompetenceTable";
import { TableProvider } from "@/contexts/Table/provider";
import { Link } from "react-router";
import saturn from "../../../../assets/saturn.svg";
import { DesktopWarningDialog } from "@/components/features/users/common/DesktopWarningDialog";
import { useDesktopWarning } from "@/hooks/useMobileDetection";

export function Competencies() {
  const { user } = useUser();
  const { showWarning, setShowWarning } = useDesktopWarning();
  const username = user?.nome_completo || "Usuário";

  return (
    <>
      <DesktopWarningDialog
        isOpen={showWarning}
        onClose={() => setShowWarning(false)}
      />
      <Header />
      <LateralMenu username={username} />
      <main className="font-1 h-full bg-neutral-200 px-32 pt-32 pb-32 text-gray-800">
        <div className="flex items-center gap-4">
          <img className="max-w-24" src={saturn} alt="Saturn" />
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold">Bem vindo {username},</h1>
            <h1 className="text-5xl font-bold">Competências</h1>
          </div>
        </div>

        <TableProvider>
          <div className="mt-16 flex items-center justify-between">
            <div className="flex items-center gap-8 text-2xl font-bold">
              <CreateCompetenceModal
                trigger={
                  <button className="blue bg-yellow hover:bg-purplish-blue hover:text-yellow flex min-h-[60px] items-center justify-center gap-8 rounded-2xl px-8 py-4 text-center text-sm font-bold uppercase shadow-xl transition duration-200">
                    Cadastrar Competência
                  </button>
                }
              />
              <Link
                to="/dashboard/teacher/curriculum/knowledge-areas"
                className="blue bg-yellow hover:bg-purplish-blue hover:text-yellow flex min-h-[60px] items-center justify-center gap-8 rounded-2xl px-8 py-4 text-center text-sm font-bold uppercase shadow-xl transition duration-200"
              >
                Gerenciar Áreas de Conhecimento
              </Link>
            </div>
          </div>
          <CompetenceTable />
        </TableProvider>
      </main>
      <Footer />
    </>
  );
}
