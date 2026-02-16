import { Link } from "react-router";

// imagens
import logo from "../../assets/brincardeaprender.svg";
import NavMenu from "./NavMenu";

export function Header() {
  return (
    <header className="font-1 fixed top-0 z-50 m-auto flex h-18 w-full items-center justify-between bg-slate-200 px-4 py-2 font-bold shadow-xl md:h-auto md:px-28 md:py-4">
      <div>
        <Link to="/">
          <img
            src={logo}
            alt="Brincar de Aprender Logo"
            className="block h-14 md:h-20"
          />
        </Link>
      </div>

      <NavMenu />
    </header>
  );
}
