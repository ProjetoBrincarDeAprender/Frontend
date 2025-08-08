import "./Footer.css";

import { FaFacebook, FaInstagram } from "react-icons/fa";
import logo from "../../assets/brincardeaprender_blackandwhite.svg";
import laco from "../../assets/laco.svg";
import pipa from "../../assets/pipa.svg";
import star from "../../assets/star.svg";
import { Link } from "../utils/Link/Link";

export function Footer() {
  return (
    <footer className="footer-pseudo bg-az4 font-2 mt-auto flex flex-col py-8 text-xl font-semibold shadow-2xl">
      {/* Pipa/Constelação */}
      <img
        src={pipa}
        alt="Constelação"
        className="footer-pipa-decoration"
        aria-hidden="true"
      />
      {/* Estrela central superior */}
      <img
        src={star}
        alt="Estrela"
        className="footer-star-center"
        aria-hidden="true"
      />
      {/* Estrela inferior direita */}
      <img
        src={star}
        alt="Estrela"
        className="footer-star-bottom"
        aria-hidden="true"
      />
      {/* Laço inferior direita */}
      <img src={laco} alt="Laço" className="footer-laco" aria-hidden="true" />
      {/* Conteúdo original */}
      <div className="flex items-start justify-around">
        <div>
          <div className="max-w-48">
            <img
              className="block h-auto max-w-full object-cover"
              src={logo}
              alt="Brincar de Aprender Logo"
            />
          </div>
          <div className="mt-4 ml-2.5 flex flex-col gap-4">
            <Link
              href="#"
              variant="light"
              target="new_blank"
              className="text-2xl"
            >
              <FaInstagram
                className="inline-block rounded-full outline-2"
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
                className="inline-block rounded-full outline-2"
                size={32}
              />
              <span className="ml-5">Facebook</span>
            </Link>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-4">
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
        <div className="mt-8 flex flex-col gap-4">
          <h1 className="mb-6 text-blue-200">Contato</h1>
          <Link href="mailto:brincardeaprenderedu@gmail.com" variant="light">
            brincardeaprenderedu@gmail.com
          </Link>
        </div>
      </div>
      <div className="mt-12 self-center">
        <h1 className="text-sm font-normal text-blue-200">
          © 2025. Todos os direitos reservados
        </h1>
      </div>
    </footer>
  );
}
