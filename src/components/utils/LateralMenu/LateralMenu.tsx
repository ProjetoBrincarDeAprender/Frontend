import { useState, useRef, useEffect } from "react";
import { FiMenu } from "react-icons/fi";
import profile from "../../assets/astronauta-profile.svg";

interface LateralMenuProps {
  username: string;
}

export function LateralMenu({ username }: LateralMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      {/* Botão de abrir menu */}
      {!menuOpen && (
        <button
          className="fixed top-6 left-6 z-[1100] bg-yellow-400 hover:bg-yellow-300 p-3 rounded-full shadow-lg transition-colors"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu lateral"
        >
          <FiMenu size={28} />
        </button>
      )}

      {/* Overlay escuro ao abrir o menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/40 z-[1090] transition-opacity" />
      )}

      {/* Menu lateral */}
      <aside
        ref={menuRef}
        className={`fixed top-0 left-0 h-full z-[1101] bg-[var(--color-purplish-blue)] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
          w-64 max-w-full`}
        style={{ minHeight: "100vh" }}
      >
        <div className="flex flex-col items-center py-10">
          <img
            src={profile}
            className="rounded-full mb-2 w-28 h-28 object-cover border-4 border-transparent outline-3 outline-yellow-400"
            alt="Perfil"
          />
          <span className="font-bold text-xl text-white mb-8">{username}</span>
        </div>
        <ul className="flex flex-col gap-2 px-4">
          <li>
            <a
              href="dashboard"
              className="block text-lg font-bold text-white rounded-lg py-3 px-4 hover:bg-[var(--color-am2)] transition-colors text-center"
            >
              Logística
            </a>
          </li>
          <li>
            <a
              href="dashboard/students"
              className="block text-lg font-bold text-white rounded-lg py-3 px-4 hover:bg-[var(--color-am2)] transition-colors text-center"
            >
              Alunos
            </a>
          </li>
          <li>
            <a
              href="dashboard/teachers"
              className="block text-lg font-bold text-white rounded-lg py-3 px-4 hover:bg-[var(--color-am2)] transition-colors text-center"
            >
              Professores
            </a>
          </li>
          <li>
            <a
              href="dashboard/schools"
              className="block text-lg font-bold text-white rounded-lg py-3 px-4 hover:bg-[var(--color-am2)] transition-colors text-center"
            >
              Escolas
            </a>
          </li>
          
        </ul>
      </aside>
    </>
  );
}
