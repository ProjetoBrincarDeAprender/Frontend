import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { FiMenu } from "react-icons/fi";
import profile from "../../assets/astronauta-profile.svg";

interface LateralMenuProps {
  username: string;
}

export function LateralMenu({ username }: LateralMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

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
        className={`fixed top-0 left-0 z-[1101] flex h-full flex-col bg-[var(--color-purplish-blue)] shadow-2xl transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "-translate-x-full"} w-64 max-w-full`}
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
        <ul className="flex flex-col gap-2 px-4">
          <li>
            <button
              onClick={() => {
                navigate("/dashboard/");
                setMenuOpen(false);
              }}
              className="block w-full cursor-pointer rounded-lg px-4 py-3 text-center text-lg font-bold text-white transition-colors hover:bg-[var(--color-am2)]"
            >
              Logística
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                navigate("/dashboard/students");
                setMenuOpen(false);
              }}
              className="block w-full cursor-pointer rounded-lg px-4 py-3 text-center text-lg font-bold text-white transition-colors hover:bg-[var(--color-am2)]"
            >
              Alunos
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                navigate("/dashboard/schools");
                setMenuOpen(false);
              }}
              className="block w-full cursor-pointer rounded-lg px-4 py-3 text-center text-lg font-bold text-white transition-colors hover:bg-[var(--color-am2)]"
            >
              Escolas
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                navigate("/dashboard/teachers");
                setMenuOpen(false);
              }}
              className="block w-full cursor-pointer rounded-lg px-4 py-3 text-center text-lg font-bold text-white transition-colors hover:bg-[var(--color-am2)]"
            >
              Professores
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                navigate("/dashboard/responsable");
                setMenuOpen(false);
              }}
              className="block w-full cursor-pointer rounded-lg px-4 py-3 text-center text-lg font-bold text-white transition-colors hover:bg-[var(--color-am2)]"
            >
              Responsáveis
            </button>
          </li>
        </ul>
      </aside>
    </>
  );
}
