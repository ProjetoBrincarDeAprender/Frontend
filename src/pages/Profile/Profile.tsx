import React from "react";
import { useParams } from "react-router";

export function Profile() {
  const { id } = useParams();

  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">Perfil do Usuário</h1>
      <p className="text-lg">ID do usuário: {id}</p>
      <p className="mt-4">Esta é a página de perfil do usuário com ID: {id}</p>

      <div className="mt-6">
        <button
          onClick={() => window.history.back()}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
