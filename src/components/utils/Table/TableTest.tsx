import { Table } from "./Table";

// Interface para os dados do usuário
interface User {
  id: string;
  name: string;
  registration: string;
  birthDate: string;
  password: string;
}

// Dados de exemplo
const sampleUsers: User[] = [
  {
    id: "1",
    name: "João Silva",
    registration: "12345678",
    birthDate: "15-03-2000",
    password: "'5,12,3'",
  },
  {
    id: "2",
    name: "Maria Santos",
    registration: "87654321",
    birthDate: "20-07-1995",
    password: "'1,2,3'",
  },
];

export function TableTest() {
  const columns = [
    {
      header: "NOME",
      accessor: (user: User) => <div className="bold-text">{user.name}</div>,
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
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`=== CLIQUE DETECTADO ===`);
            console.log(`Usuário: ${user.name} (ID: ${user.id})`);
            console.log(`handleDetailsClick existe: ${!!handleDetailsClick}`);
            handleDetailsClick?.(user);
          }}
        >
          DETALHES
        </span>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Teste da Tabela</h2>
      <Table data={sampleUsers} columns={columns} />
    </div>
  );
}
