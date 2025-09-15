import useAuth from "@/hooks/Auth/useAuth";
import type { UserProfile } from "@/types/user";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { EditResponsableModal } from "@/components/features/users/responsible/edit/ResponsibleEditModal";
import { EditStudentModal } from "@/components/features/users/students/edit/StudentEditModal";
import { EditTeacherModal } from "@/components/features/users/teacher/edit/TeacherEditModal";
import { Header } from "@/components/Header/Header";
import { TableProvider } from "@/contexts/Table/provider";
import { ChangePasswordModal } from "@/components/features/users/password/ChangePasswordModal";

import NuvemSVG from "../../assets/nuvem.svg";
import StarSVG from "../../assets/star.svg";

export function Profile() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    profile()
      .then((data) => {
        if (data) setUser(data);
      })
      .catch(() => {
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="animate-pulse text-xl text-white">
          Carregando Perfil de Usuário...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl text-red-400">Usuário não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="bg-purplish-blue-dark relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={StarSVG}
          alt="Estrela decorativa"
          className="absolute top-60 -left-1 h-10 w-10"
        />
        <img
          src={StarSVG}
          alt="Estrela decorativa"
          className="absolute -right-10 bottom-20 h-10 w-10 rotate-12"
        />
        <img
          src={StarSVG}
          alt="Estrela decorativa"
          className="absolute right-1/4 bottom-1/2 h-12 w-12 -rotate-6"
        />
        <img
          src={NuvemSVG}
          alt="Nuvem decorativa"
          className="absolute bottom-0 left-0 h-auto w-full object-cover object-bottom opacity-70"
        />
      </div>

      <Header />

      <main className="relative z-10 mt-28 px-6">
        <div className="from-am0 to-az3 relative h-28 w-full rounded-b-md bg-gradient-to-r shadow-lg">
          <div className="absolute -bottom-12 left-10 flex items-center space-x-4">
            <div className="text-am0 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-gray-200 text-3xl font-bold shadow-lg">
              {user.nome_completo.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                {user.nome_completo}
              </h2>
              <p className="text-gray-200">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="mt-32 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="bg-purplish-blue/40 col-span-2 rounded-xl p-6 text-white shadow-lg backdrop-blur-sm">
            <h3 className="mb-4 border-b border-gray-500 pb-2 text-xl font-semibold">
              Informações Gerais
            </h3>
            <p>
              <strong>ID:</strong> {user.codigo_usuario}
            </p>
            <p>
              <strong>Nome:</strong> {user.nome_completo}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Perfil:</strong> {user.perfil}
            </p>
            <p>
              <strong>Escola:</strong> {user.escola || "Não vinculado"}
            </p>
            <p>
              <strong>Data de criação:</strong>{" "}
              {new Date(user.created_At).toLocaleDateString()}
            </p>
          </div>

          <div className="bg-purplish-blue/50 rounded-xl p-6 text-white shadow-lg backdrop-blur-sm">
            <h3 className="mb-4 border-b border-gray-500 pb-2 text-xl font-semibold">
              Ações
            </h3>

            <div className="font-1 mt-10 flex w-full flex-col gap-3">
              <TableProvider>
                {user.perfil?.toLowerCase() === "aluno" && (
                  <EditStudentModal id={Number(user.codigo_usuario)} />
                )}
                {user.perfil?.toLowerCase() === "responsavel" && (
                  <EditResponsableModal id={Number(user.codigo_usuario)} />
                )}
                {user.perfil?.toLowerCase() === "professor" && (
                  <EditTeacherModal id={Number(user.codigo_usuario)} />
                )}
              </TableProvider>
            </div>

            <ChangePasswordModal />
            {/* <button
              onClick={() => alert("Funcionalidade em desenvolvimento!")}
              className="bg-az1 hover:bg-az2 mt-4 w-full rounded-lg px-5 py-2 font-semibold text-white transition"
            >
              Alterar Senha
            </button> */}
               
               <button
            onClick={() => navigate(-1)}
            className=" mt-4 w-full rounded-lg bg-yellow-400 px-6 py-2 font-semibold text-black shadow-md transition hover:bg-yellow-300"
          >
            Voltar
          </button>
          </div>
        </div>
      </main>
    </div>
  );
}
