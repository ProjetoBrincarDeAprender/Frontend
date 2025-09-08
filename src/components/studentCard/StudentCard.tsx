import "./studentCard.css";
import profile from "../../assets/astronauta-profile.svg";

export default function StudentCard() {
  return (
    // Divisao geral
    <div className="pt-27">
      {/* Card */}
      <div className="mx-auto my-20 flex max-w-4xl gap-8 rounded-lg bg-sky-800 p-10">
        {/* imagem */}
        <div className="flex flex-col justify-items-center gap-4">
          <img
            src={profile}
            alt=""
            className="border-amarelo w-xl rounded-2xl border-8"
          />
          <span className="baloobhai text-amarelo block text-center text-4xl font-extrabold">
            Aluno
          </span>
        </div>

        {/* Tempo */}
        <div>
          <span>00:00</span>
          <span>Tempo hoje</span>
        </div>

        {/* Dificuldade */}
        <div>
          <h2>Dificuldade</h2>
          <p>
            Notou-se que nos exercícios correlacionaos a experiências
            matemáticas, [user] tem dificuldades notáveis. é necessário
            encorajá-lo para que não desista!
          </p>
        </div>

        {/* Parte da direita*/}
        <div>
          {/* Estrelinha */}
          <div>
            <img src="" alt="" />
            <span>0/1000</span>
          </div>

          {/* Menu de itens */}
          <div>
            <span>Voltar</span>
            <span>Trilha</span>
            <span>Detalhes</span>
          </div>
        </div>
      </div>
    </div>
  );
}
