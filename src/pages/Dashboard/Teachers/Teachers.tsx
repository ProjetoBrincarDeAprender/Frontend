import { Footer } from "../../../components/Footer/Footer";
import { Header } from "../../../components/Header/Header";
import { LateralMenu } from "../../../components/LateralMenu/LateralMenu";

import saturn from "../../../assets/saturn.svg";
import { TableTest } from "../../../components/utils/Table/TableTest";

export function Teachers() {
  return (
    <>
      <Header />
      <LateralMenu username="Placeholder" />
      <main className="bg-slate-200 text-gray-800 font-1 pt-32 px-64">
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
            className="text-purplish-blue font-bold py-1 px-2 rounded-lg outline-4 outline-am0 focus:outline-yellow transition duration-300"
          />
          <div className="flex gap-8 items-center font-bold text-2xl">
            <a
              className="bg-yellow text-purplish-blue hover:bg-purplish-blue hover:text-yellow transition duration-300 py-2 px-6 rounded-lg shadow"
              href="edit/teacher"
            >
              Editar
            </a>
            <a
              className="bg-yellow text-purplish-blue hover:bg-purplish-blue hover:text-yellow transition duration-300 py-2 px-6 rounded-lg shadow"
              href="register/teacher"
            >
              Cadastrar
            </a>
          </div>
        </div>
        <TableTest />
      </main>
      <Footer />
    </>
  );
}
