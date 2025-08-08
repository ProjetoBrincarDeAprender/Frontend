import { BiHome } from "react-icons/bi";
import { FaRegQuestionCircle } from "react-icons/fa";
import { FiLogIn } from "react-icons/fi";
import { Link } from "react-router";
import profile from "../../assets/astronauta-profile.svg";
import logo from "../../assets/brincardeaprender.svg";
import "./Header.css";

interface HeaderProps {
  username?: string;
}

export function Header({ username = "" }: HeaderProps) {
  return (
    <header className="fixed top-0 z-50 flex w-full items-center justify-between bg-slate-200 px-28 py-4 font-bold shadow-xl">
      <div>
        <Link to="/">
          <img
            src={logo}
            alt="Brincar de Aprender Logo"
            className="logo block"
          />
        </Link>
      </div>
      <nav aria-label="Navegação Principal">
        <ul className="flex items-center gap-4 text-base text-gray-900">
          <li className="button-nav bg-yellow rounded-2xl px-5 py-2 shadow-lg">
            <Link to="/" className="flex items-center gap-2">
              <BiHome /> <span>Inicio</span>
            </Link>
          </li>
          <li className="button-nav bg-yellow rounded-2xl px-5 py-2 shadow-lg">
            <Link to="/about" className="flex items-center gap-2">
              <FaRegQuestionCircle /> <span>Sobre</span>
            </Link>
          </li>
          {username !== "" ? (
            <>
              <Link
                to="/dashboard"
                className="profile-nav bg-am1 flex items-center gap-5 rounded-full"
              >
                <span className="ml-4 block px-5">{username}</span>
                <div className="bg-yellow border-am2 h-14 w-14 overflow-hidden rounded-full border p-2">
                  <img
                    src={profile}
                    alt="profile image"
                    className="h-full w-full object-cover"
                  />
                </div>
              </Link>
            </>
          ) : (
            <>
              <li className="button-nav bg-yellow rounded-2xl px-5 py-2 shadow-lg">
                <Link to="/login" className="flex items-center gap-2">
                  <FiLogIn />
                  <span>Entrar</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
