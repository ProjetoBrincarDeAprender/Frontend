import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import lua from "@/assets/moon1.png";
import saturno from "@/assets/saturn.svg";
import estrela from "@/assets/star.svg";
import pipa from "@/assets/pipa.svg";
import nuvem from "@/assets/nuvem.svg";

export function About() {
  return (
    <>
      <Header />
      <div className="relative mt-80 justify-items-center">
        <img src={lua} className="absolute bottom-115 left-80" />
        <img src={saturno} className="absolute right-120 bottom-120 h-30" />
        <img src={estrela} className="absolute top-20 right-160" />
        <img src={pipa} className="absolute top-20 right-40 rotate-310" />
        <h1 className="text-6xl font-black uppercase">Quem somos</h1>
        <img src={nuvem} className="mt-40" />
      </div>
      <Footer />
    </>
  );
}
