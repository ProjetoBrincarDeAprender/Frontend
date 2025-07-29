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
        <section>
          <div className="flex items-center font-bold font-1 gap-4 justify-center">
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
        </section>
      </main>
      <Footer />
    </>
  );
}
