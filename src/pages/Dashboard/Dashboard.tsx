import { Footer } from "../../components/Footer/Footer";
import { Header } from "../../components/Header/Header";
import { LateralMenu } from "../../components/LateralMenu/LateralMenu";

import graphic from "../../assets/graphic.svg";
import saturn from "../../assets/saturn.svg";

import { InfoBadge } from "../../components/utils/InfoBadge/InfoBadge";
import "./Dashboard.css";

import { RegisterSchoolUserModal } from "@/components/modals/RegisterSchoolUserModal";
import { useUser } from "@/hooks/User/useUser";
import { RegisterResponsableModal } from "../../components/modals/RegisterResponsableModal";
import { RegisterSchoolModal } from "../../components/modals/RegisterSchoolModal";
import { RegisterStudentModal } from "../../components/modals/RegisterStudentModal";
import { RegisterTeacherModal } from "../../components/modals/RegisterTeacherModal";

export default function Dashboard() {
  const { user } = useUser();

  const username = user?.nome_completo || "Usuário";

  return (
    <>
      <div className="bg-slate-100">
        <Header />
        <main className="mt-28 text-gray-800">
          <LateralMenu username={username} />
          <section className="px-78 py-16">
            <div className="font-1 flex items-center gap-4 font-bold">
              <img
                className="block h-auto max-w-26"
                src={saturn}
                alt="saturn"
              />
              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-semibold">Bem vindo {username},</h1>
                <h1 className="text-4xl">Painel de Logistica</h1>
              </div>
            </div>
            <div className="mt-16 flex justify-center gap-8">
              <InfoBadge
                label="Professores Ativos"
                value="0000"
                variant="blue"
              />
              <InfoBadge label="Alunos Ativos" value="0000" variant="yellow" />
              <InfoBadge label="Escolas Ativas" value="0000" variant="red" />
            </div>
            <h1 className="font-1 mt-16 text-2xl font-bold">Ações Rápidas</h1>
            <div className="font-1 text-purplish-blue mt-8 flex justify-center gap-8 font-bold uppercase">
              <RegisterTeacherModal isOnTable={false} />
              <RegisterStudentModal isOnTable={false} />
              {user?.perfil == "Admin" && (
                <>
                  <RegisterSchoolModal isOnTable={false} />
                  <RegisterSchoolUserModal />
                </>
              )}
              <RegisterResponsableModal isOnTable={false} />
            </div>
            <div className="mt-16 flex justify-around rounded-2xl bg-slate-300 py-8 shadow-2xl">
              <div className="bg-purplish-blue-dark rounded-2xl">
                <div className="font-1 bg-purplish-blue m-3 rounded-md p-1 text-center text-lg font-bold text-gray-100">
                  <h1>Alunos por Maestria</h1>
                </div>
                <img src={graphic} alt="grafico" />
                <div className="font-1 text-md bg-purplish-blue m-3 flex items-center justify-center gap-2 rounded-md p-1 text-center font-bold text-gray-100 uppercase">
                  <span className="text-white">Não Iniciado</span>
                  <span className="text-yellow">Iniciante</span>
                  <span className="text-green-600">Avançado</span>
                  <span className="text-red-600">Mestre</span>
                </div>
              </div>
              <div className="bg-purplish-blue-dark rounded-2xl">
                <div className="font-1 bg-purplish-blue m-3 rounded-md p-1 text-center text-lg font-bold text-gray-100">
                  <h1>Alunos por Maestria</h1>
                </div>
                <img src={graphic} alt="grafico" />
                <div className="font-1 text-md bg-purplish-blue m-3 flex items-center justify-center gap-2 rounded-md p-1 text-center font-bold text-gray-100 uppercase">
                  <span className="text-white">Não Iniciado</span>
                  <span className="text-yellow">Iniciante</span>
                  <span className="text-green-600">Avançado</span>
                  <span className="text-red-600">Mestre</span>
                </div>
              </div>
            </div>
            <h1 className="font-1 mt-16 mb-4 text-2xl font-bold">
              Atividades Recentes
            </h1>
            <div className="border-purplish-blue font-1 flex w-max flex-col rounded-3xl border-2 px-8 py-4 pl-12 text-lg font-semibold text-red-900">
              <ul className="flex list-disc flex-col gap-4">
                <li>
                  Professora ‘ana lima’ foi cadastrada no sistema. (há 3 min)
                </li>
                <li>
                  Aluno ‘joão silva guedes’ foi cadastrada no sistema. (há 8
                  min)
                </li>
                <li>
                  A escola ‘Sebastião Guedes da Silva’ foi cadastrada no
                  sistema. (há 15 min)
                </li>
              </ul>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
