//import { RegisterSchoolModal } from "@/components/features/users/school/create/SchoolCreateModal";

import SchoolUserTable from "@/components/features/users/schoolUser/files/SchoolUserTable";
import saturn from "../../../assets/saturn.svg";

//import { RegisterSchoolModal } from "@/components/modals/RegisterSchoolModal";

import { RegisterSchoolUserModal } from "@/components/features/users/schoolUser/create/SchoolUserCreateModal";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header/Header";
import { useUser } from "@/hooks/User/useUser";
import { LateralMenu } from "../../../components/sideBar/sideBar";
import { Link } from "react-router";
import { TableProvider } from "@/contexts/Table/provider";


export function SchoolUsers() {
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
            <h1 className="text-5xl font-bold">Usuários Escola</h1>
          </div>
        </div>

        <TableProvider>
          <div className="mt-16 flex items-center justify-between">
            <div className="flex items-center gap-8 text-2xl font-bold">
              <RegisterSchoolUserModal />
              <Link
                to="/dashboard/schools"
                className="blue bg-yellow hover:bg-purplish-blue hover:text-yellow flex min-h-[60px] items-center justify-center gap-8 rounded-2xl px-8 py-4 text-center text-sm font-bold uppercase shadow-xl transition duration-200"
              >
                Cadastrar Escola
              </Link>
            </div>
          </div>
          <div className="mt-12">
            <SchoolUserTable />
          </div>
        </TableProvider>
      </main>
      <Footer />
    </>
  );
}
