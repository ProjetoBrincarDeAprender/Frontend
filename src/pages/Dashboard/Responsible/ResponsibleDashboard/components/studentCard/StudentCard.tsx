import { Link } from "react-router";
import { useNavigate } from "react-router";

import star from "../../../../../../assets/star.svg";

import "./studentCard.css";

type StudentCardProps = {
  imageUrl: string | null;
  studentName: string;
};

export default function StudentCard({
  imageUrl = null,
  studentName,
}: StudentCardProps) {
  const navigate = useNavigate();

  if (!imageUrl)
    imageUrl =
      "https://static.vecteezy.com/system/resources/previews/005/194/102/non_2x/user-icon-flat-design-isolated-on-white-background-free-vector.jpg";

  return (
    // Divisao geral
    <div>
      {/* Card */}
      <div className="mx-auto mb-10 flex max-w-4xl gap-8 rounded-lg bg-sky-800 p-10 shadow-xl">
        {/* imagem */}
        <div className="flex flex-col justify-items-center gap-4">
          <img
            src={imageUrl}
            alt=""
            className="border-amarelo w-3xl rounded-2xl border-8"
          />
          <span className="baloobhai text-amarelo block text-center text-4xl font-extrabold">
            {studentName}
          </span>
        </div>

        {/* Tempo */}
        <div className="baloobhai border-amarelo flex flex-col items-center justify-center gap-4 rounded-lg border-8 bg-slate-100 px-4 py-8 text-center text-xl font-bold text-stone-700">
          <span className="rounded-full border-6 border-sky-800 px-4 py-7">
            {/* Precisa virar prop (analisar como vai puxar o tempo) */}
            00:00
          </span>
          <span>Tempo hoje</span>
        </div>

        {/* Dificuldade */}
        <div className="flex flex-col items-center gap-4 rounded-lg border-8 border-red-900 bg-slate-100 p-4 text-center font-bold text-stone-700">
          <h2 className="text-2xl text-red-900">Dificuldade</h2>

          {/* Precisa virar prop (analisar como vai puxar as dificuldades) */}
          <p>
            Notou-se que nos exercícios correlacionaos a experiências
            matemáticas, [user] tem dificuldades notáveis. é necessário
            encorajá-lo para que não desista!
          </p>
        </div>

        {/* Parte da direita*/}
        <div className="flex flex-col gap-10">
          {/* Estrelinha */}
          <div className="baloobhai border-amarelo relative rounded-full border-6 bg-slate-100 px-2 text-end font-bold text-stone-700">
            <img
              src={star}
              alt=""
              className="absolute -top-6 -left-8 max-w-16"
            />
            <span>0/1000</span>
          </div>

          {/* Menu de itens */}
          <ul className="flex flex-col gap-2">
            <li>
              <button
                onClick={() => navigate(-1)}
                className="blue bg-yellow hover:bg-purplish-blue hover:text-yellow flex min-h-[60px] cursor-pointer justify-center gap-8 rounded-2xl px-8 px-11 py-4 text-center font-bold text-stone-700 uppercase shadow-xl transition duration-200"
              >
                Voltar
              </button>
            </li>
            <li>
              <Link
                to="/trilha"
                className="blue bg-yellow hover:bg-purplish-blue hover:text-yellow flex min-h-[60px] justify-center gap-8 rounded-2xl px-8 py-4 text-center font-bold text-stone-700 uppercase shadow-xl transition duration-200"
              >
                Trilha
              </Link>
            </li>
            <li>
              <Link
                to="/detalhes"
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
