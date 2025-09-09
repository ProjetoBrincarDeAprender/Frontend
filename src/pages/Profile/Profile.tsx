import { useEffect, useState} from "react";
import { useNavigate } from "react-router";
import useAuth from "@/hooks/Auth/useAuth";
import type { UserProfile } from "@/types/user";

import { EditStudentModal } from "@/components/features/users/students/edit/StudentEditModal";
import { EditTeacherModal } from "@/components/features/users/teacher/edit/TeacherEditModal";
import { EditResponsableModal } from "@/components/features/users/responsible/edit/ResponsibleEditModal";
import { TableProvider } from "@/contexts/Table/provider";
import { Header } from "@/components/Header/Header";

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
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-white animate-pulse">Carregando Perfil de Usuário...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-red-400">Usuário não encontrado.</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-no-repeat bg-bottom"
      style={{ backgroundImage: "url('../../assets/nuvem.svg')" }} 
    >
      <Header/>

      <div className="relative bg-purplish-blue-dark/95 rounded-3xl shadow-2xl p-8 w-[900px] flex  items-center z-10 mt-30">
        <div className="flex flex-col items-center  justify-center w-1/4">
          {/* Pensei em colocar o avatar do usuário - Implementação futura */}
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt="Foto de perfil"
              className="w-36 h-36 rounded-full border-4 border-am0 object-cover shadow-lg"
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-am2 flex items-center justify-center text-white text-4xl font-bold shadow-lg border-7 border-am1">
              {user.nome_completo.charAt(0).toUpperCase()}
            </div>
          )}
        

          <div className="mt-18 flex flex-col gap-3 w-full font-1 "> 
            <TableProvider>
             {user.perfil?.nome?.toLowerCase() === "aluno" && (
              <EditStudentModal
                id={Number(user.id)}
              />
            )}
            {user.perfil?.nome?.toLowerCase() === "responsavel" && (
              <EditResponsableModal
                id={Number(user.id)}
              /> 
              
            )}
            {user.perfil?.nome?.toLowerCase() === "professor" && (
              <EditTeacherModal
                id={Number(user.id)}
              />
            )}
            </TableProvider>

            <button
              onClick={() => alert("Funcionalidade em desenvolvimento!")}
              className="rounded-lg bg-az3 px-5 py-2 text-white font-semibold hover:bg-az2 transition"
            >
              Alterar Senha
            </button>
           

          </div>
        </div>

        <div className="flex-1 text-white font-1 text-2xl flex-col justify-between space-y-4 pl-11">
          <h1 className="mb-4 text-4xl font-bold border-b border-gray-500 pb-2">
            Perfil do Usuário
          </h1>
          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>Nome:</strong> {user.nome_completo}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Perfil:</strong> {user.perfil?.nome}
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
            className="mt-6 rounded bg-am0 px-4 py-2 text-az3 font-semibold hover:bg-am4 hover:text-white  self-end transition"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>

  );
}

