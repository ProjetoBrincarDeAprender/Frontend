import astronauta from "@/assets/astronauta_na_lua.png";

export function NotFound() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-100 px-4">
      <div className="animate-fade-in flex flex-col items-center gap-6 rounded-3xl border border-gray-200 bg-white/80 p-10 shadow-xl">
        <img
          src={astronauta}
          alt="Astronauta na Lua"
          className="animate-float mb-2 h-56 w-56 object-contain drop-shadow-lg"
        />
        <h1 className="text-center text-5xl font-extrabold text-purple-700 drop-shadow-sm">
          404
          <span className="mt-2 block text-2xl font-semibold text-gray-700">
            Página Não Encontrada
          </span>
        </h1>
        <p className="max-w-md text-center text-lg text-gray-600">
          Ops! A página que você está procurando não existe ou foi movida.
          <br />
          Que tal voltar para a página inicial?
        </p>
        <a
          href="/"
          className="mt-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 font-bold text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
        >
          Voltar para a página inicial
        </a>
      </div>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.8s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-float { animation: float 2.5s ease-in-out infinite alternate; }
        @keyframes float { from { transform: translateY(0); } to { transform: translateY(-18px); } }
      `}</style>
    </div>
  );
}
