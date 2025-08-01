import React from "react";
import { Table } from "./Table";

// Interface para os dados do usuário
interface User {
  id: string;
  photo?: string;
  name: string;
  registration: string;
  birthDate: string;
  password: string;
}

// Dados de exemplo
const sampleUsers: User[] = [
  {
    id: "1",
    name: "USUARIO",
    registration: "00000000",
    birthDate: "00-00-0000",
    password: "'5,12,3'",
  },
  {
    id: "2",
    name: "USUARIO",
    registration: "00000000",
    birthDate: "00-00-0000",
    password: "'5,12,3'",
  },
  {
    id: "3",
    name: "USUARIO",
    registration: "00000000",
    birthDate: "00-00-0000",
    password: "'5,12,3'",
  },
  {
    id: "4",
    name: "USUARIO",
    registration: "00000000",
    birthDate: "00-00-0000",
    password: "'5,12,3'",
  },
  {
    id: "5",
    name: "USUARIO",
    registration: "00000000",
    birthDate: "00-00-0000",
    password: "'5,12,3'",
  },
];

// Componente para foto de perfil
const ProfilePhoto: React.FC<{ photo?: string }> = ({ photo }) => {
  if (photo) {
    return (
      <img
        src={photo}
        alt="Foto de perfil"
        className="w-10 h-10 rounded-full border-2 border-black"
      />
    );
  }

  return <div className="photo-placeholder"></div>;
};

// Componente para link de detalhes
const DetailsLink: React.FC<{
  userId: string;
  onClick: (userId: string) => void;
}> = ({ userId, onClick }) => {
  return (
    <span className="details-link" onClick={() => onClick(userId)}>
      DETALHES
    </span>
  );
};

export function TableExample() {
  const handleDetailsClick = (user: User) => {
    // Navegação para /profile/{id}
    console.log(`Navegando para perfil do usuário: ${user.id}`);
    // O componente Table já fará a navegação automaticamente para /profile/{user.id}
  };

  const columns = [
    {
      header: "FOTO",
      accessor: (user: User) => <ProfilePhoto photo={user.photo} />,
      className: "photo-cell",
    },
    {
      header: "NOME",
      accessor: (user: User) => (
        <div className="bold-text">
          {user.name}
          <br />
          {user.name}
        </div>
      ),
    },
    {
      header: "MATRICULA",
      accessor: (user: User) => (
        <span className="numeric-value">{user.registration}</span>
      ),
    },
    {
      header: "DATA DE NASC",
      accessor: (user: User) => (
        <span className="numeric-value">{user.birthDate}</span>
      ),
    },
    {
      header: "SENHA",
      accessor: (user: User) => (
        <span className="numeric-value">{user.password}</span>
      ),
    },
    {
      header: "DETALHES",
      accessor: (user: User, handleDetailsClick?: (user: User) => void) => (
        <span
          className="details-link"
          onClick={() => handleDetailsClick?.(user)}
        >
          DETALHES
        </span>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Lista de Usuários</h2>
      <Table
        data={sampleUsers}
        columns={columns}
        onDetailsClick={handleDetailsClick}
      />
    </div>
  );
}
