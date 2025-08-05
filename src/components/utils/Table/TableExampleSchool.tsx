import React from "react";
import { Table } from "./Table";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

// Interface para os dados da escola
interface School {
  id: string;
  photo?: string;
  name: string;
  acronym: string;
  partnershipDate: string;
  password: string;
  isActive: boolean;
}

// Dados de exemplo
const sampleSchools: School[] = [
  {
    id: "1",
    name: "USUARIO",
    acronym: "CCEA",
    partnershipDate: "00-00-0000",
    password: "'5,13,12'",
    isActive: true,
  },
  {
    id: "2",
    name: "USUARIO",
    acronym: "CCEA",
    partnershipDate: "00-00-0000",
    password: "'5,13,12'",
    isActive: true,
  },
  {
    id: "3",
    name: "USUARIO",
    acronym: "CCEA",
    partnershipDate: "00-00-0000",
    password: "'5,13,12'",
    isActive: true,
  },
  {
    id: "4",
    name: "USUARIO",
    acronym: "CCEA",
    partnershipDate: "00-00-0000",
    password: "'5,13,12'",
    isActive: true,
  },
  {
    id: "5",
    name: "USUARIO",
    acronym: "CCEA",
    partnershipDate: "00-00-0000",
    password: "'5,13,12'",
    isActive: false,
  },
];

// Componente para foto de perfil
const ProfilePhoto: React.FC<{ photo?: string }> = ({ photo }) => {
  if (photo) {
    return (
      <img
        src={photo}
        alt="Foto de perfil"
        className="h-10 w-10 rounded-full border-2 border-black"
      />
    );
  }

  return <div className="photo-placeholder"></div>;
};

// Componente para status de ativação com ícones modernos
const ActivationStatus: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  return (
    <div className="flex justify-center">
      {isActive ? (
        <FaCheckCircle
          className="text-2xl text-green-500 transition-colors duration-300 hover:text-green-600"
          title="Ativo"
        />
      ) : (
        <FaTimesCircle
          className="text-2xl text-red-500 transition-colors duration-300 hover:text-red-600"
          title="Inativo"
        />
      )}
    </div>
  );
};

export function TableExampleSchool() {
  const handleDetailsClick = (school: School) => {
    // Navegação para /profile/{id}
    console.log(`Navegando para perfil da escola: ${school.id}`);
    // O componente Table já fará a navegação automaticamente para /profile/{school.id}
  };

  const columns = [
    {
      header: "FOTO",
      accessor: (school: School) => <ProfilePhoto photo={school.photo} />,
      className: "photo-cell",
    },
    {
      header: "NOME",
      accessor: (school: School) => (
        <div className="bold-text">
          {school.name}
          <br />
          {school.name}
        </div>
      ),
    },
    {
      header: "SIGLA",
      accessor: (school: School) => (
        <span className="numeric-value">{school.acronym}</span>
      ),
    },
    {
      header: "DATA DE PARC",
      accessor: (school: School) => (
        <span className="numeric-value">{school.partnershipDate}</span>
      ),
    },
    {
      header: "SENHA",
      accessor: (school: School) => (
        <span className="numeric-value">{school.password}</span>
      ),
    },
    {
      header: "ATIVADAS",
      accessor: (school: School) => (
        <ActivationStatus isActive={school.isActive} />
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold">Lista de Escolas</h2>
      <Table
        data={sampleSchools}
        columns={columns}
        onDetailsClick={handleDetailsClick}
      />
    </div>
  );
}
