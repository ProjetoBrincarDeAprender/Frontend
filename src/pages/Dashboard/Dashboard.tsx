import { Footer } from "../../components/Footer/Footer";
import { Header } from "../../components/Header/Header";
import { LateralMenu } from "../../components/LateralMenu/LateralMenu";

import saturn from "../../assets/saturn.svg";

import "./Dashboard.css";
import { InfoBadge } from "../../components/utils/InfoBadge/InfoBadge";

export default function dashboard() {
  //Remover isto para produção
  const username = "Placeholder";

  return (
    <>
      <Header />
      <main className="mt-28 bg-slate-100 text-gray-800">
        <LateralMenu username={username} />
        <section className="py-16 px-78">
          <div className="flex items-center font-bold font-1 gap-4 ">
            <img className="block max-w-26 h-auto" src={saturn} alt="saturn" />
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-semibold">Bem vindo {username},</h1>
              <h1 className="text-4xl">PAINEL DE LOGISTICA</h1>
            </div>
          </div>
          <div className="flex gap-8 justify-center mt-16">
            <InfoBadge label="Professores Ativos" value="0000" variant="blue" />
            <InfoBadge label="Alunos Ativos" value="0000" variant="yellow" />
            <InfoBadge label="Escolas Ativas" value="0000" variant="red" />
          </div>
          <h1 className="font-bold font-1 text-2xl mt-16">Ações Rápidas</h1>
          <div className="flex justify-center font-1 font-bold gap-8 mt-8 text-purplish-blue uppercase">
            <a
              href="/register/teacher"
              className="bg-yellow shadow-xl py-4 px-8 rounded-2xl text-center hover:bg-purplish-blue hover:text-yellow transition duration-200"
            >
              Cadastrar Professor
            </a>
            <a
              href="/register/student"
              className="bg-yellow shadow-xl py-4 px-8 rounded-2xl text-center hover:bg-purplish-blue hover:text-yellow transition duration-200"
            >
              Cadastrar Aluno
            </a>
            <a
              href="/register/school"
              className="bg-yellow shadow-xl py-4 px-8 rounded-2xl text-center hover:bg-purplish-blue hover:text-yellow transition duration-200"
            >
              Cadastrar Escola
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
