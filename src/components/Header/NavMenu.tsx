import profile from "@/assets/astronauta-profile.svg";
import { useUser } from "@/hooks/User/useUser";
import { Heart, Joystick, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { BiHome, BiJoystick } from "react-icons/bi";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { Link, useNavigate } from "react-router";

export default function NavMenu() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  function handleInicio() {
    if (user?.perfil == "Admin" || user?.perfil == "Escola") {
      navigate("/dashboard");
    } else if (user?.perfil == "Responsavel") {
      navigate("/responsibledashboard");
    } else if (user?.perfil == "Professor") {
      navigate("/teacherdashboard");
    } else {
      navigate("/");
    }
  }

  return (
    <nav
      aria-label="Navegação Principal"
      className="flex items-center gap-2 md:gap-0"
    >
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="items-center rounded-md p-2 md:hidden"
      >
        <Menu
          className="text-purplish-blue hover:text-yellow data-[open=true]:text-am2 h-7 w-7"
          data-open={menuOpen}
        />
      </button>
      <ul
        className="absolute top-18 left-0 flex w-full -translate-y-2 flex-wrap items-center justify-center gap-4 bg-slate-300 p-3 text-base text-gray-900 inset-shadow-xs transition-all duration-300 ease-in-out max-md:data-[menuopen=false]:opacity-0 max-md:data-[menuopen=true]:translate-y-0 max-md:data-[menuopen=true]:opacity-100 md:static md:flex md:translate-0 md:bg-transparent md:p-4 md:inset-shadow-none"
        data-menuopen={menuOpen}
      >
        <li className="bg-yellow text-purplish-blue hover:bg-purplish-blue hover:text-yellow rounded-2xl px-3 py-2 text-sm shadow-lg transition-all duration-200 ease-in hover:translate-y-0.5 md:px-5 md:py-2 md:text-base">
          <button
            onClick={handleInicio}
            className="flex cursor-pointer items-center gap-2"
          >
            <BiHome className="h-4 w-4" /> <span>Inicio</span>
          </button>
        </li>

        {user ? (
          <>
            {user.perfil === "Aluno" && (
              <li className="bg-yellow text-purplish-blue hover:bg-purplish-blue hover:text-yellow rounded-2xl px-3 py-2 text-sm shadow-lg transition-all duration-200 ease-in hover:translate-y-0.5 md:px-5 md:py-2 md:text-base">
                <Link to="/calm" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span>Relaxar</span>
                </Link>
              </li>
            )}
            <li className="bg-yellow text-purplish-blue hover:bg-purplish-blue hover:text-yellow rounded-2xl px-3 py-2 text-sm shadow-lg transition-all duration-200 ease-in hover:translate-y-0.5 md:px-5 md:py-2 md:text-base">
              <Link to="/games" className="flex items-center gap-2">
                <BiJoystick className="h-4 w-4" />
                <span>Jogar</span>
              </Link>
            </li>
            <li className="bg-yellow text-purplish-blue hover:bg-purplish-blue hover:text-yellow rounded-2xl px-3 py-2 text-sm shadow-lg transition-all duration-200 ease-in hover:translate-y-0.5 md:px-5 md:py-2 md:text-base">
              <Link to="/logout" className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </Link>
            </li>
          </>
        ) : (
          <>
            <li className="bg-yellow text-purplish-blue hover:bg-purplish-blue hover:text-yellow rounded-2xl px-3 py-2 text-sm shadow-lg transition-all duration-200 ease-in hover:translate-y-0.5 md:px-5 md:py-2 md:text-base">
              <Link to="/about" className="flex items-center gap-2">
                <FaRegQuestionCircle className="h-4 w-4" /> <span>Sobre</span>
              </Link>
            </li>
            <li className="bg-yellow text-purplish-blue hover:bg-purplish-blue hover:text-yellow rounded-2xl px-3 py-2 text-sm shadow-lg transition-all duration-200 ease-in hover:translate-y-0.5 md:px-5 md:py-2 md:text-base">
              <Link to="/about-games" className="flex items-center gap-2">
                <Joystick className="h-4 w-4" /> <span>Sobre Jogos</span>
              </Link>
            </li>
            <li className="bg-yellow text-purplish-blue hover:bg-purplish-blue hover:text-yellow rounded-2xl px-3 py-2 text-sm shadow-lg transition-all duration-200 ease-in hover:translate-y-0.5 md:px-5 md:py-2 md:text-base">
              <Link to="/login" className="flex items-center gap-2">
                <FiLogIn className="h-4 w-4" />
                <span>Entrar</span>
              </Link>
            </li>
          </>
        )}
      </ul>
      {user && (
        <Link
          to="/profile"
          className="text-purplish-blue hover:text-am2 bg-am1 flex items-center gap-5 rounded-full transition-all duration-200 ease-in"
        >
          <span className="hidden md:ml-4 md:block md:px-5">
            {user.nome_completo}
          </span>
          <div className="bg-yellow border-am2 size-12 overflow-hidden rounded-full border p-2 md:size-14">
            <img
              src={profile}
              alt="profile image"
              className="h-full w-full object-cover"
            />
          </div>
        </Link>
      )}
    </nav>
  );
}
