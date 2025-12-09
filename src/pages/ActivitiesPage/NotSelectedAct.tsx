export default function NotSelectedAct() {
  return (
    <div className="flex h-120 w-8/9 flex-col items-center justify-center rounded-2xl bg-slate-700">
      <div className="flex h-80 w-8/9 flex-col items-center justify-center rounded-2xl border-2 border-gray-300 bg-slate-100 p-8 shadow-md">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">
          Nenhuma atividade selecionada
        </h2>
        <p className="text-gray-600">
          Por favor, selecione uma atividade para visualizar ou editar seus
          detalhes.
        </p>
      </div>
    </div>
  );
}
