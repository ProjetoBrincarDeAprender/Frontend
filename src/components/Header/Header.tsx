import "./Header.css";
import logo from "../../assets/brincardeaprender.svg";
import { BiHome } from "react-icons/bi";
import { FaRegQuestionCircle } from "react-icons/fa";
import { MdOutlinePersonAddAlt1 } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";

interface HeaderProps {
  isLoggedIn?: boolean;
}

export function Header({ isLoggedIn = false }: HeaderProps) {
  return (
    <header className="bg-slate-200 flex items-center justify-between px-10 py-4">
      <div>
        <a href="/">
          <img
            src={logo}
            alt="Brincar de Aprender Logo"
            className="block logo"
          />
        </a>
      </div>
      <nav aria-label="Navegação Principal">
        <ul className="flex gap-4 text-base">
          <li className="rounded-2xl bg-yellow px-5 py-2 shadow-lg">
            <a href="/" className="flex gap-2 items-center">
              <BiHome /> <span>Inicio</span>
            </a>
          </li>
          <li className="rounded-2xl bg-yellow px-5 py-2 shadow-lg">
            <a href="/about" className="flex gap-2 items-center">
              <FaRegQuestionCircle /> <span>Sobre</span>
            </a>
          </li>
          {isLoggedIn == true ? (
            <>
              <li className="rounded-2xl bg-yellow px-5 py-2 shadow-lg">
                <a href="/register" className="flex gap-2 items-center">
                  <MdOutlinePersonAddAlt1 /> <span>Cadastrar-se</span>
                </a>
              </li>
              <li className="rounded-2xl bg-yellow px-5 py-2 shadow-lg">
                <a href="/login" className="flex gap-2 items-center">
                  <FiLogIn />
                  <span>Entrar</span>
                </a>
              </li>
            </>
          ) : (
            <>
              <li className="rounded-2xl bg-yellow px-5 py-2 shadow-lg">
                <a href="/register" className="flex gap-2 items-center">
                  <MdOutlinePersonAddAlt1 /> <span>Cadastrar-se</span>
                </a>
              </li>
              <li className="rounded-2xl bg-yellow px-5 py-2 shadow-lg">
                <a href="/login" className="flex gap-2 items-center">
                  <FiLogIn />
                  <span>Entrar</span>
                </a>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
