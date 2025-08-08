import { Footer } from "../../../components/Footer/Footer";
import { Header } from "../../../components/Header/Header";
import { LateralMenu } from "../../../components/LateralMenu/LateralMenu";

import TeacherTable from "@/components/Teacher/TeacherTable";
import saturn from "../../../assets/saturn.svg";

import { RegisterTeacherModal } from "@/components/modals/RegisterTeacherModal";

export function Teachers() {
  return (
    <>
      <div className="bg-slate-200">
        <Header />
        <LateralMenu username="Placeholder" />
        <main className="font-1 px-64 pt-32 text-gray-800">
          <div className="flex items-center gap-4">
            <img className="max-w-24" src={saturn} alt="Saturn" />
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-semibold">Bem vindo usuário,</h1>
              <h1 className="text-5xl font-bold">Professores</h1>
            </div>
          </div>
        <div className="mt-16 flex items-center justify-between">
          <input
            type="text"
            placeholder="Pesquisar por nome"
            name="searchInput"
            id="searchInput"
            className="text-purplish-blue outline-am0 focus:outline-yellow rounded-lg px-2 py-1 font-bold outline-4 transition duration-300"
          />
          <div className="flex items-center gap-8 text-2xl font-bold">
            {/* <a
              className="bg-yellow text-purplish-blue hover:bg-purplish-blue hover:text-yellow rounded-lg px-6 py-2 shadow transition duration-300"
              href="/edit/teacher"
            >
              Editar
            </a> */}
            <RegisterTeacherModal/>
            {/* <a
              className="bg-yellow text-purplish-blue hover:bg-purplish-blue hover:text-yellow rounded-lg px-6 py-2 shadow transition duration-300"
              href="/register/teacher"
            >
              Cadastrar
            </a> */}
          </div>
          </div>

          <TeacherTable />
        </main>
        <div className="mt-20">
          <Footer />
        </div>
      </div>

    </>
  );
}
