import { CalmItem } from "./CalmItem";

export function BreathingCatalog() {
  // Placeholder para futuros exercícios
  const exercicios = [
    { id: 1, title: "Respiração Profunda", color: "bg-green-200" },
    { id: 2, title: "Respiração Alternada", color: "bg-green-300" },
    { id: 3, title: "Respiração Quadrada", color: "bg-green-400" },
  ];

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <h2 className="mb-6 text-2xl font-bold text-blue-100">
        Exercícios de Respiração
      </h2>
      <div className="flex flex-col gap-4">
        {exercicios.map((ex) => (
          <CalmItem key={ex.id} title={ex.title} variant="breathing" />
        ))}
      </div>
    </div>
  );
}
