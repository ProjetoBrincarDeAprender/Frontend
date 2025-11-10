// dependencias
import { Link } from "react-router";

// componentes do site
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { useUser } from "@/hooks/User/useUser";
import { LateralMenu } from "../../../components/sideBar/sideBar";
import { InfoBadge } from "../../../components/utils/InfoBadge/InfoBadge";

// imagens
// import graphic from "../../../assets/graphic.svg";
import saturn from "../../../assets/saturn.svg";

// estilos
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useUser();

  const username = user?.nome_completo || "Usuário";

  return (
    <>
      <Header />
      <LateralMenu username={username} />
      <main className="flex h-fit flex-col bg-neutral-200 pt-28 text-gray-800">
        <section className="h-full px-78 py-16">
          <div className="font-1 flex items-center gap-4 font-bold">
            <img className="block h-auto max-w-26" src={saturn} alt="saturn" />
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-semibold">Bem vindo {username},</h1>
              <h1 className="text-4xl">Painel de Logistica</h1>
            </div>
          </div>
          <div className="mt-16 flex justify-center gap-8">
            <InfoBadge
              label="Prof. Ativos"
              value="Em breve..."
              variant="blue"
            />
            <InfoBadge
              label="Alunos Ativos"
              value="Em breve..."
              variant="yellow"
            />
            <InfoBadge
              label="Escolas Ativas"
              value="Em breve..."
              variant="red"
            />
          </div>
          <h1 className="font-1 mt-16 text-2xl font-bold">Ações Rápidas</h1>
          <div className="font-1 text-purplish-blue mt-8 flex justify-center gap-8 font-bold uppercase">
            <Link
              to="/dashboard/teachers"
              className="blue bg-yellow hover:bg-purplish-blue hover:text-yellow flex min-h-[60px] justify-center gap-8 rounded-2xl px-8 py-4 text-center font-bold uppercase shadow-xl transition duration-200"
            >
              Cadastrar Professor(a)
            </Link>

            <Link
              to="/dashboard/students"
              className="blue bg-yellow hover:bg-purplish-blue hover:text-yellow flex min-h-[60px] justify-center gap-8 rounded-2xl px-8 py-4 text-center font-bold uppercase shadow-xl transition duration-200"
            >
              Cadastrar Aluno(a)
            </Link>
            <Link
              to="/dashboard/responsables"
              className="blue bg-yellow hover:bg-purplish-blue hover:text-yellow flex min-h-[60px] justify-center gap-8 rounded-2xl px-8 py-4 text-center font-bold uppercase shadow-xl transition duration-200"
            >
              Cadastrar Responsável
            </Link>
            {user?.perfil == "Admin" && (
              <>
                <Link
                  to="/dashboard/schools"
                  className="blue bg-yellow hover:bg-purplish-blue hover:text-yellow flex min-h-[60px] justify-center gap-8 rounded-2xl px-8 py-4 text-center font-bold uppercase shadow-xl transition duration-200"
                >
                  Cadastrar Escola
                </Link>
                <Link
                  to="/dashboard/schoolusers"
                  className="blue bg-yellow hover:bg-purplish-blue hover:text-yellow flex min-h-[60px] justify-center gap-8 rounded-2xl px-8 py-4 text-center font-bold uppercase shadow-xl transition duration-200"
                >
                  Cadastrar Adm Escol.
                </Link>
              </>
            )}
          </div>
          <div className="mt-16 flex justify-around rounded-2xl bg-slate-300 py-8 shadow-2xl">
            <div className="bg-purplish-blue-dark rounded-2xl">
              <div className="font-1 bg-purplish-blue m-3 rounded-md p-1 text-center text-lg font-bold text-gray-100">
                <h1>Alunos por Maestria</h1>
              </div>
              {/* <img src={graphic} alt="grafico" />
              <div className="font-1 text-md bg-purplish-blue m-3 flex items-center justify-center gap-2 rounded-md p-1 text-center font-bold text-gray-100 uppercase">
                <span className="text-white">Não Iniciado</span>
                <span className="text-yellow">Iniciante</span>
                <span className="text-green-600">Avançado</span>
                <span className="text-red-600">Mestre</span>
              </div> */}
              <p className="font-1 text-md m-3 flex items-center justify-center gap-2 rounded-md p-1 text-center font-bold text-gray-100">
                Em breve...
              </p>
            </div>
            <div className="bg-purplish-blue-dark rounded-2xl">
              <div className="font-1 bg-purplish-blue m-3 rounded-md p-1 text-center text-lg font-bold text-gray-100">
                <h1>Alunos por Maestria</h1>
              </div>
              <p className="font-1 text-md m-3 flex items-center justify-center gap-2 rounded-md p-1 text-center font-bold text-gray-100">
                Em breve...
              </p>
              {/* <img src={graphic} alt="grafico" />
              <div className="font-1 text-md bg-purplish-blue m-3 flex items-center justify-center gap-2 rounded-md p-1 text-center font-bold text-gray-100 uppercase">
                <span className="text-white">Não Iniciado</span>
                <span className="text-yellow">Iniciante</span>
                <span className="text-green-600">Avançado</span>
                <span className="text-red-600">Mestre</span>
              </div> 
              */}
            </div>
          </div>
          <h1 className="font-1 mt-16 mb-4 text-2xl font-bold">
            Atividades Recentes
          </h1>
          <div className="border-purplish-blue font-1 flex w-max flex-col rounded-3xl border-2 px-8 py-4 pl-12 text-lg font-semibold text-red-900">
            <ul className="flex list-disc flex-col gap-4">
              <li>Em breve...</li>
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
