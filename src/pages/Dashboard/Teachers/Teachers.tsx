import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { LateralMenu } from "@/components/sideBar/sideBar";
import { useUser } from "@/hooks/User/useUser";

import TeacherTable from "@/components/features/users/teacher/files/TeacherTable";
import saturn from "../../../assets/saturn.svg";

import { RegisterTeacherModal } from "@/components/features/users/teacher/create/TeacherCreateModal";
import { TableProvider } from "@/contexts/Table/provider";
import { DesktopWarningDialog } from "@/components/features/users/common/DesktopWarningDialog";
import { useDesktopWarning } from "@/hooks/useMobileDetection";

export function Teachers() {
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
            <h1 className="text-5xl font-bold">Professores</h1>
          </div>
        </div>
        <TableProvider>
          <div className="mt-16 flex items-center justify-between">
            <div className="flex items-center gap-8 text-2xl font-bold">
              <RegisterTeacherModal isOnTable />
            </div>
          </div>
          <TeacherTable />
        </TableProvider>
      </main>
      <Footer />
    </>
  );
}
