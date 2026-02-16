import "./Footer.css";

import { Link } from "@/components/utils/Link/Link";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import logo from "../../assets/brincardeaprender_blackandwhite.svg";
import laco from "../../assets/laco.svg";
import pipa from "../../assets/pipa.svg";
import star from "../../assets/star.svg";

export function Footer() {
  return (
    <footer className="footer-pseudo bg-az4 font-2 mt-auto flex flex-col overflow-hidden py-8 text-xl font-semibold shadow-2xl">
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
      <div className="flex flex-col items-center gap-10 px-6 md:flex-row md:items-start md:justify-around md:gap-0 md:px-0">
        <div className="flex flex-col items-center md:items-start">
          <div className="max-w-36 md:max-w-48">
            <img
              className="block h-auto max-w-full object-cover"
              src={logo}
              alt="Brincar de Aprender Logo"
            />
          </div>
          <div className="mt-4 flex flex-col gap-4 md:ml-2.5">
            <Link
              href="#"
              variant="light"
              target="new_blank"
              className="flex items-center gap-3 text-lg md:text-2xl"
            >
              <FaInstagram
                className="inline-block rounded-full outline-2"
                size={28}
              />
              <span>Instagram</span>
            </Link>
            <Link
              href="#"
              variant="light"
              target="new_blank"
              className="flex items-center gap-3 text-lg md:text-2xl"
            >
              <FaFacebook
                className="inline-block rounded-full outline-2"
                size={28}
              />
              <span>Facebook</span>
            </Link>
          </div>
        </div>
        <div className="flex flex-col items-center gap-3 md:mt-8 md:items-start md:gap-4">
          <h1 className="mb-2 text-blue-200 md:mb-6">Utilidades</h1>
          <Link href="/" variant="light" className="text-base md:text-xl">
            Inicio
          </Link>
          <Link href="/about" variant="light" className="text-base md:text-xl">
            Sobre
          </Link>
          <Link href="/games" variant="light" className="text-base md:text-xl">
            Jogos
          </Link>
        </div>
        <div className="flex flex-col items-center gap-3 md:mt-8 md:items-start md:gap-4">
          <h1 className="mb-2 text-blue-200 md:mb-6">Contato</h1>
          <Link
            href="mailto:brincardeaprenderedu@gmail.com"
            variant="light"
            className="text-sm break-all md:text-xl md:break-normal"
          >
            brincardeaprenderedu@gmail.com
          </Link>
        </div>
      </div>
      <div className="mt-10 self-center px-4 md:mt-12">
        <h1 className="text-center text-xs font-normal text-blue-200 md:text-sm">
          © 2025. Todos os direitos reservados
        </h1>
      </div>
    </footer>
  );
}
