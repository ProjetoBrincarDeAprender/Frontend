import "./studentCard.css";
import profile from "../../assets/astronauta-profile.svg";
import { Link } from "react-router";

export default function StudentCard() {
  return (
    // Divisao geral
    <div>
      {/* Card */}
      <div className="mx-auto mt-10 mb-20 flex max-w-4xl gap-8 rounded-lg bg-sky-800 p-10 shadow-xl">
        {/* imagem */}
        <div className="flex flex-col justify-items-center gap-4">
          <img
            src={profile}
            alt=""
            className="border-amarelo w-3xl rounded-2xl border-8"
          />
          <span className="baloobhai text-amarelo block text-center text-4xl font-extrabold">
            Aluno
          </span>
        </div>

        {/* Tempo */}
        <div className="baloobhai border-amarelo flex flex-col items-center justify-center gap-4 rounded-lg border-8 bg-slate-100 px-4 py-8 text-center text-xl font-bold text-stone-700">
          <span className="rounded-full border-6 border-sky-800 px-4 py-7">
            00:00
          </span>
          <span>Tempo hoje</span>
        </div>

        {/* Dificuldade */}
        <div className="flex flex-col items-center gap-4 rounded-lg border-8 border-red-900 bg-slate-100 p-4 text-center font-bold text-stone-700">
          <h2 className="text-2xl text-red-900">Dificuldade</h2>
          <p>
            Notou-se que nos exercícios correlacionaos a experiências
            matemáticas, [user] tem dificuldades notáveis. é necessário
            encorajá-lo para que não desista!
          </p>
        </div>

        {/* Parte da direita*/}
        <div className="flex flex-col gap-10">
          {/* Estrelinha */}
          <div className="baloobhai border-amarelo rounded-full border-6 bg-slate-100 px-2 text-end font-bold text-stone-700">
            <img src="" alt="" />
            <span>0/1000</span>
          </div>

          {/* Menu de itens */}
          <ul className="flex flex-col gap-2">
            <li>
              <Link
                to="/"
                className="blue bg-yellow hover:bg-purplish-blue hover:text-yellow flex min-h-[60px] justify-center gap-8 rounded-2xl px-8 py-4 text-center font-bold text-stone-700 uppercase shadow-xl transition duration-200"
              >
                Voltar
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="blue bg-yellow hover:bg-purplish-blue hover:text-yellow flex min-h-[60px] justify-center gap-8 rounded-2xl px-8 py-4 text-center font-bold text-stone-700 uppercase shadow-xl transition duration-200"
              >
                Trilha
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="blue bg-yellow hover:bg-purplish-blue hover:text-yellow flex min-h-[60px] justify-center gap-8 rounded-2xl px-8 py-4 text-center font-bold text-stone-700 uppercase shadow-xl transition duration-200"
              >
                Detalhes
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
