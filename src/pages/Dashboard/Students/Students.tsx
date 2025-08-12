import { useUser } from "@/hooks/User/useUser";
import { Footer } from "../../../components/footer/Footer";
import { Header } from "../../../components/header/Header";
import { LateralMenu } from "../../../components/sideBar/sideBar";

import StudentTable from "@/components/features/users/students/files/StudentTable";
import saturn from "../../../assets/saturn.svg";

import { RegisterStudentModal } from "@/components/features/users/students/create/StudentCreateModal";
import { TableProvider } from "@/contexts/Table/provider";

export function Students() {
  const { user } = useUser();

  const username = user?.nome_completo || "Usuário";
  return (
    <>
      <div className="bg-slate-200">
        <Header />
        <LateralMenu username={username} />
        <main className="font-1 px-64 pt-32 text-gray-800">
          <div className="flex items-center gap-4">
            <img className="max-w-24" src={saturn} alt="Saturn" />
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold">Bem vindo {username},</h1>
              <h1 className="text-5xl font-bold">Alunos</h1>
            </div>
          </div>
          <TableProvider>
            <div className="mt-16 flex items-center justify-between">
              <div className="flex items-center gap-8 text-2xl font-bold">
                <RegisterStudentModal isOnTable />
              </div>
            </div>
            <StudentTable />
          </TableProvider>
        </main>
        <div className="mt-20">
          <Footer />
        </div>
      </div>
    </>
  );
}
