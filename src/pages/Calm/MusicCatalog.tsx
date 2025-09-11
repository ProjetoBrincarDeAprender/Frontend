import { CalmItem } from "./CalmItem";

export function MusicCatalog() {
  // Placeholder para futuras músicas
  const musicas = [
    { id: 1, title: "Música Relaxante 1", color: "bg-blue-400" },
    { id: 2, title: "Música Relaxante 2", color: "bg-blue-400" },
    { id: 3, title: "Música Relaxante 3", color: "bg-blue-400" },
  ];

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <h2 className="mb-6 text-2xl font-bold text-blue-100">
        Músicas para Relaxar
      </h2>
      <div className="flex flex-col gap-4">
        {musicas.map((musica) => (
          <CalmItem key={musica.id} title={musica.title} variant="music" />
        ))}
      </div>
    </div>
  );
}
