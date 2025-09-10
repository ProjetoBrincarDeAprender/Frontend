import useAuth from "@/hooks/Auth/useAuth";
import type { UserProfile } from "@/types/user";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { EditResponsableModal } from "@/components/features/users/responsible/edit/ResponsibleEditModal";
import { EditStudentModal } from "@/components/features/users/students/edit/StudentEditModal";
import { EditTeacherModal } from "@/components/features/users/teacher/edit/TeacherEditModal";
import { Header } from "@/components/Header/Header";
import { TableProvider } from "@/contexts/Table/provider";

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
  }, [profile, navigate]);

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
    <div
      className="flex min-h-screen items-center justify-center bg-cover bg-bottom bg-no-repeat"
      style={{ backgroundImage: "url('../../assets/nuvem.svg')" }}
    >
      <Header />

      <div className="bg-purplish-blue-dark/95 relative z-10 mt-30 flex w-[900px] items-center rounded-3xl p-8 shadow-2xl">
        <div className="flex w-1/4 flex-col items-center justify-center">
          {/* Pensei em colocar o avatar do usuário - Implementação futura */}
          {/* {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt="Foto de perfil"
              className="w-36 h-36 rounded-full border-4 border-am0 object-cover shadow-lg"
            />
          ) : ( */}
          <div className="bg-am2 border-am1 flex h-36 w-36 items-center justify-center rounded-full border-7 text-4xl font-bold text-white shadow-lg">
            {user.nome_completo.charAt(0).toUpperCase()}
          </div>
          {/* )} */}

          <div className="font-1 mt-18 flex w-full flex-col gap-3">
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

            <button
              onClick={() => alert("Funcionalidade em desenvolvimento!")}
              className="bg-az3 hover:bg-az2 rounded-lg px-5 py-2 font-semibold text-white transition"
            >
              Alterar Senha
            </button>
          </div>
        </div>

        <div className="font-1 flex-1 flex-col justify-between space-y-4 pl-11 text-2xl text-white">
          <h1 className="mb-4 border-b border-gray-500 pb-2 text-4xl font-bold">
            Perfil do Usuário
          </h1>
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
            <strong>Escola:</strong> {user.escola?.nome ?? "Não vinculado"}
          </p>
          <p>
            <strong>Data de criação:</strong>{" "}
            {new Date(user.created_At).toLocaleDateString()}
          </p>

          <button
            onClick={() => navigate(-1)}
            className="bg-am0 text-az3 hover:bg-am4 mt-6 self-end rounded px-4 py-2 font-semibold transition hover:text-white"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
