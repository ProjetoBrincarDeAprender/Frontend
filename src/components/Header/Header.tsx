import "./Header.css";
import logo from "../../assets/brincardeaprender.svg";
import profile from "../../assets/astronauta-profile.svg";
import { BiHome } from "react-icons/bi";
import { FaRegQuestionCircle } from "react-icons/fa";
import { MdOutlinePersonAddAlt1 } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";

interface HeaderProps {
  username?: string;
}

export function Header({ username = "" }: HeaderProps) {
  return (
    <header className="bg-slate-200 flex items-center justify-between px-28 py-4 shadow-xl font-bold fixed top-0 left-0 right-0 z-1000">
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
        <ul className="flex gap-4 items-center text-base text-gray-900">
          <li className="button-nav rounded-2xl bg-yellow px-5 py-2 shadow-lg">
            <a href="/" className="flex gap-2 items-center">
              <BiHome /> <span>Inicio</span>
            </a>
          </li>
          <li className="button-nav rounded-2xl bg-yellow px-5 py-2 shadow-lg">
            <a href="/about" className="flex gap-2 items-center">
              <FaRegQuestionCircle /> <span>Sobre</span>
            </a>
          </li>
          {username !== "" ? (
            <>
              <a
                href="/dashboard"
                className="profile-nav flex items-center gap-5 bg-am1 rounded-full"
              >
                <span className="block px-5 ml-4">{username}</span>
                <div className="bg-yellow rounded-full w-14 h-14 overflow-hidden p-2 border border-am2">
                  <img
                    src={profile}
                    alt="profile image"
                    className="w-full h-full object-cover"
                  />
                </div>
              </a>
            </>
          ) : (
            <>
              <li className="button-nav rounded-2xl bg-yellow px-5 py-2 shadow-lg">
                <a href="/register" className="flex gap-2 items-center">
                  <MdOutlinePersonAddAlt1 /> <span>Cadastrar-se</span>
                </a>
              </li>
              <li className="button-nav rounded-2xl bg-yellow px-5 py-2 shadow-lg">
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
