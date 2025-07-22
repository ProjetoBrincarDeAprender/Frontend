import "./Footer.css";

import logo from "../../assets/brincardeaprender_blackandwhite.svg";
import { Link } from "../utils/Link/Link";
import { FaFacebook, FaInstagram } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="bg-az4 shadow-2xl flex flex-col font-2 font-semibold text-xl py-8">
      <div className="flex justify-around items-start">
        <div>
          <div className="max-w-48">
            <img
              className="block max-w-full h-auto object-cover"
              src={logo}
              alt="Brincar de Aprender Logo"
            />
          </div>
          <div className="flex flex-col gap-4 mt-4 ml-2.5">
            <Link
              href="#"
              variant="light"
              target="new_blank"
              className="text-2xl"
            >
              <FaInstagram
                className="inline-block outline-2 rounded-full"
                size={32}
              />
              <span className="ml-5">Instagram</span>
            </Link>
            <Link
              href="#"
              variant="light"
              target="new_blank"
              className="text-2xl"
            >
              <FaFacebook
                className="inline-block outline-2 rounded-full"
                size={32}
              />
              <span className="ml-5">Facebook</span>
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-8">
          <h1 className="mb-6 text-blue-200">Utilidades</h1>
          <Link href="/" variant="light">
            Inicio
          </Link>
          <Link href="/about" variant="light">
            Sobre
          </Link>
          <Link href="/games" variant="light">
            Jogos
          </Link>
        </div>
        <div className="flex flex-col gap-4 mt-8">
          <h1 className="mb-6 text-blue-200">Contato</h1>
          <Link href="mailto:brincardeaprenderedu@gmail.com" variant="light">
            brincardeaprenderedu@gmail.com
          </Link>
        </div>
      </div>
      <div className="self-center mt-12">
        <h1 className="text-sm font-normal">
          © 2025. Todos os direitos reservados
        </h1>
      </div>
    </footer>
  );
}
