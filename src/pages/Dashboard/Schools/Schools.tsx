import { RegisterSchoolModal } from "@/components/modals/RegisterSchoolModal";
import { RegisterSchoolUserModal } from "@/components/modals/RegisterSchoolUserModal";
import { useUser } from "@/hooks/User/useUser";
import { Footer } from "../../../components/Footer/Footer";
import { Header } from "../../../components/Header/Header";
import { LateralMenu } from "../../../components/LateralMenu/LateralMenu";

import SchoolTable from "@/components/School/SchoolTable";
import { TableProvider } from "@/contexts/Table/provider";
import saturn from "../../../assets/saturn.svg";

//import { RegisterSchoolModal } from "@/components/modals/RegisterSchoolModal";

export function Schools() {
  const { user } = useUser();

  const username = user?.nome_completo || "Usuário";
  return (
    <>
      <Header />
      <LateralMenu username={username} />
      <main className="font-1 h-full bg-neutral-200 px-64 pt-32 text-gray-800">
        <div className="flex items-center gap-4">
          <img className="max-w-24" src={saturn} alt="Saturn" />
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold">Bem vindo {username},</h1>
            <h1 className="text-5xl font-bold">Escolas</h1>
          </div>
        </div>

        <TableProvider>
          <div className="mt-16 flex items-center justify-between">
            <div className="flex items-center gap-8 text-2xl font-bold">
              <RegisterSchoolModal isOnTable />
              <RegisterSchoolUserModal />
            </div>
          </div>
          <div className="mt-12">
            <SchoolTable />
          </div>
        </TableProvider>
      </main>
      <Footer />
    </>
  );
}
