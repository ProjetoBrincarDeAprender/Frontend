import { useUser } from "@/hooks/User/useUser";
import { ChangePasswordModal } from "@/components/features/users/password/ChangePasswordModal";
import { useEffect, useRef, useState } from "react";
import { FiMenu } from "react-icons/fi";
// import { BookOpen, Target, Activity, HelpCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import profile from "../../assets/astronauta-profile.svg";

interface LateralMenuProps {
  username: string;
  mode?: "dashboard" | "profile"; // profile: exibe apenas ações do perfil (Alterar Senha)
}

export function LateralMenu({
  username,
  mode = "dashboard",
}: LateralMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  // Fecha o menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleNavigation = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Menu para professores
  const renderTeacherMenu = () => (
    <ul className="flex flex-col gap-2 px-4">
      <li>
        <button
          onClick={() => handleNavigation("/dashboard/teacher")}
          className={`hover:text-az3 block w-full cursor-pointer rounded-lg px-4 py-3 text-center text-lg font-bold text-white transition-colors hover:bg-[var(--color-am2)] ${isActive("/dashboard/teacher") ? "bg-[var(--color-am2)] text-az3" : ""}`}
        >
          Logística
        </button>
      </li>
      <li>
        <button
          onClick={() =>
            handleNavigation("/dashboard/teacher/curriculum/activities")
          }
          className={`hover:text-az3 block w-full cursor-pointer rounded-lg px-4 py-3 text-center text-lg font-bold text-white transition-colors hover:bg-[var(--color-am2)] ${isActive("/dashboard/teacher/curriculum/activities") ? "bg-[var(--color-am2)] text-az3" : ""}`}
        >
          Atividades
        </button>
      </li>

      <li>
        <button
          onClick={() =>
            handleNavigation("/dashboard/teacher/curriculum/questions")
          }
          className={`hover:text-az3 block w-full cursor-pointer rounded-lg px-4 py-3 text-center text-lg font-bold text-white transition-colors hover:bg-[var(--color-am2)] ${isActive("/dashboard/teacher/curriculum/questions") ? "bg-[var(--color-am2)]" : ""}`}
        >
          Questões
        </button>
      </li>
      <li>
        <button
          onClick={() =>
            handleNavigation("/dashboard/teacher/curriculum/competences")
          }
          className={`hover:text-az3 block w-full cursor-pointer rounded-lg px-4 py-3 text-center text-lg font-bold text-white transition-colors hover:bg-[var(--color-am2)] ${isActive("/dashboard/teacher/curriculum/competences") ? "bg-[var(--color-am2)]" : ""}`}
        >
          Competências
        </button>
      </li>
      <li>
        <button
          onClick={() =>
            handleNavigation("/dashboard/teacher/curriculum/knowledge-areas")
          }
          className={`hover:text-az3 block w-full cursor-pointer rounded-lg px-4 py-3 text-center text-lg font-bold text-white transition-colors hover:bg-[var(--color-am2)] ${isActive("/dashboard/teacher/curriculum/knowledge-areas") ? "bg-[var(--color-am2)] text-az3" : ""}`}
        >
          Áreas de Conhecimento
        </button>
      </li>
      <li>
        <button
          onClick={() =>
            handleNavigation("/dashboard/teacher/curriculum/difficulty-levels")
          }
          className={`hover:text-az3 block w-full cursor-pointer rounded-lg px-4 py-3 text-center text-lg font-bold text-white transition-colors hover:bg-[var(--color-am2)] ${isActive("/dashboard/teacher/curriculum/difficulty-levels") ? "bg-[var(--color-am2)]" : ""}`}
        >
          Níveis de Dificuldade
        </button>
      </li>
    </ul>
  );

  // Menu para admin e outros perfis
  const renderAdminMenu = () => (
    <ul className="flex flex-col gap-2 px-4 pb-8">
      <li>
        <button
          onClick={() => handleNavigation("/dashboard/")}
          className={`w-full text-lg font-semibold text-white rounded-lg py-2.5 px-4 hover:bg-[var(--color-am2)] hover:text-az3 cursor-pointer transition-colors flex items-center justify-center gap-2 ${isActive("/dashboard") || isActive("/dashboard/") ? "bg-[var(--color-am2)] text-az3" : ""}`}
        >
          Logística
        </button>
      </li>
      <li>
        <button
          onClick={() => handleNavigation("/dashboard/students")}
          className={`w-full text-lg font-semibold text-white rounded-lg py-2.5 px-4 hover:bg-[var(--color-am2)] hover:text-az3 cursor-pointer transition-colors flex items-center justify-center gap-2 ${isActive("/dashboard/students") ? "bg-[var(--color-am2)] text-az3" : ""}`}
        >
          Alunos
        </button>
      </li>
      {user?.perfil === "Admin" && (
        <>
          <li>
            <button
              onClick={() => handleNavigation("/dashboard/schools")}
              className={`w-full text-lg font-semibold text-white rounded-lg py-2.5 px-4 hover:bg-[var(--color-am2)] hover:text-az3 cursor-pointer transition-colors flex items-center justify-center gap-2 ${isActive("/dashboard/schools") ? "bg-[var(--color-am2)] text-az3" : ""}`}
            >
              Escolas
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("/dashboard/schoolusers")}
              className={`w-full text-lg font-semibold text-white rounded-lg py-2.5 px-4 hover:bg-[var(--color-am2)] hover:text-az3 cursor-pointer transition-colors flex items-center justify-center gap-2 ${isActive("/dashboard/schoolusers") ? "bg-[var(--color-am2)] text-az3" : ""}`}
            >
              Usuários Escola
            </button>
          </li>
        </>
      )}
      <li>
        <button
          onClick={() => handleNavigation("/dashboard/teachers")}
          className={`w-full text-lg font-semibold text-white rounded-lg py-2.5 px-4 hover:bg-[var(--color-am2)] hover:text-az3 cursor-pointer transition-colors flex items-center justify-center gap-2 ${isActive("/dashboard/teachers") ? "bg-[var(--color-am2)] text-az3" : ""}`}
        >
          Professores
        </button>
      </li>
      <li>
        <button
          onClick={() => handleNavigation("/dashboard/responsables")}
          className={`w-full text-lg font-semibold text-white rounded-lg py-2.5 px-4 hover:bg-[var(--color-am2)] hover:text-az3 cursor-pointer transition-colors flex items-center justify-center gap-2 ${isActive("/dashboard/responsables") ? "bg-[var(--color-am2)] text-az3" : ""}`}
        >
          Responsáveis
        </button>
      </li>

      {/* Seção de Gestão de Aprendizagem para Admin */}
      {user?.perfil === "Admin" && (
        <>
          <li className="mt-6">
            <div className="text-sm font-semibold text-yellow-400 uppercase tracking-wide px-4 py-2 text-center">
              Gestão de Aprendizagem
            </div>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("/dashboard/teacher/curriculum/knowledge-areas")}
              className={`w-full text-lg font-semibold text-white rounded-lg py-2.5 px-4 hover:bg-[var(--color-am2)] hover:text-az3 cursor-pointer transition-colors flex items-center justify-center gap-2 ${isActive("/dashboard/teacher/curriculum/knowledge-areas") ? "bg-[var(--color-am2)] text-az3" : ""}`}
            >
              {/* <BookOpen className="h-4 w-4" /> */}
              Áreas de Conhecimento 
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("/dashboard/teacher/curriculum/competences")}
              className={`w-full text-lg font-semibold text-white rounded-lg py-2.5 px-4 hover:bg-[var(--color-am2)] hover:text-az3 cursor-pointer transition-colors flex items-center justify-center gap-2 ${isActive("/dashboard/teacher/curriculum/competences") ? "bg-[var(--color-am2)] text-az3" : ""}`}
            >
              {/* <Target className="h-4 w-4" /> */}
              Competências
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("/dashboard/teacher/curriculum/activities")}
              className={`w-full text-lg font-semibold text-white rounded-lg py-2.5 px-4 hover:bg-[var(--color-am2)] hover:text-az3 cursor-pointer transition-colors flex items-center justify-center gap-2 ${isActive("/dashboard/teacher/curriculum/activities") ? "bg-[var(--color-am2)] text-az3" : ""}`}
            >
              {/* <Activity className="h-4 w-4" /> */}
              Atividades
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("/dashboard/teacher/curriculum/questions")}
              className={`w-full text-lg font-semibold text-white rounded-lg py-2.5 px-4 hover:bg-[var(--color-am2)] hover:text-az3 cursor-pointer transition-colors flex items-center justify-center gap-2 ${isActive("/dashboard/teacher/curriculum/questions") ? "bg-[var(--color-am2)] text-az3" : ""}`}
            >
              {/* <HelpCircle className="h-4 w-4" /> */}
              Questões
            </button>
          </li>
        </>
      )}
    </ul>
  );

  return (
    <>
      {/* Botão de abrir menu */}
      {!menuOpen && (
        <button
          className="fixed top-6 left-6 z-[1100] rounded-full bg-yellow-400 p-3 shadow-lg transition-colors hover:bg-yellow-300"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu lateral"
        >
          <FiMenu size={28} />
        </button>
      )}

      {/* Overlay escuro ao abrir o menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-[1090] bg-black/40 transition-opacity" />
      )}

      {/* Menu lateral */}
      <aside
        ref={menuRef}
        className={`fixed top-0 left-0 z-[1101] flex h-full flex-col bg-[var(--color-purplish-blue)] shadow-2xl transition-transform duration-300 ease-in-out overflow-y-auto ${menuOpen ? "translate-x-0" : "-translate-x-full"} w-64 max-w-full
        [&::-webkit-scrollbar]:w-2
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-yellow-400/50
        [&::-webkit-scrollbar-thumb]:rounded-full
        [&::-webkit-scrollbar-thumb]:hover:bg-yellow-400/70
        [&::-webkit-scrollbar-thumb]:transition-colors`}
        style={{ minHeight: "100vh" }}
      >
        <div className="flex flex-col items-center py-10">
          <img
            src={profile}
            className="mb-2 h-28 w-28 rounded-full border-4 border-transparent object-cover outline-3 outline-yellow-400"
            alt="Perfil"
          />
          <span className="mb-8 text-xl font-bold text-white">{username}</span>
        </div>

        {/* Renderiza conteúdo baseado no modo */}
        {mode === "profile" ? (
          <div className="px-4">
            <ChangePasswordModal onTriggerClick={() => setMenuOpen(false)} />
          </div>
        ) : (
          // Menu padrão do dashboard
          <>
            {user?.perfil === "Professor"
              ? renderTeacherMenu()
              : renderAdminMenu()}
          </>
        )}
      </aside>
    </>
  );
}
