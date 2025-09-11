import { useState } from "react";
import { MusicCatalog } from "./MusicCatalog";
import { BreathingCatalog } from "./BreathingCatalog";

const categories = [
  { id: "music", label: "Músicas", color: "bg-blue-200 text-blue-700" },
  {
    id: "breathing",
    label: "Respiração",
    color: "bg-green-200 text-green-700",
  },
];

export function Calm() {
  const [selected, setSelected] = useState("music");
  return (
    <div className="bg-purplish-blue flex min-h-screen w-full flex-col items-center px-4 py-16">
      <h1 className="mb-12 font-sans text-5xl font-black tracking-tight text-white drop-shadow-xl">
        Catálogo de Relaxamento
      </h1>
      <div className="mb-14 flex w-full max-w-2xl flex-wrap justify-center gap-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`min-w-[160px] flex-1 rounded-2xl border-2 border-transparent px-10 py-5 text-2xl font-bold shadow-xl transition-all duration-200 ${selected === cat.id ? "scale-105 border-yellow-400 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-400 text-white" : "bg-zinc-800 text-zinc-200 hover:scale-105 hover:bg-zinc-700"}`}
            onClick={() => setSelected(cat.id)}
            type="button"
            style={{ letterSpacing: "0.04em" }}
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className="w-full max-w-2xl">
        {selected === "music" && <MusicCatalog />}
        {selected === "breathing" && <BreathingCatalog />}
      </div>
    </div>
  );
}
