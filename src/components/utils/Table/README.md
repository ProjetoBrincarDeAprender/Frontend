# Componente Table

Este componente cria uma tabela com a estilização exata mostrada na imagem de referência, usando a fonte `font-1` definida no `index.css`.

## Características

- ✅ Estilização idêntica à imagem de referência
- ✅ Fonte `font-1` conforme definido no `index.css`
- ✅ Suporte para foto de perfil (placeholder ou imagem real)
- ✅ Link de detalhes clicável
- ✅ Totalmente reutilizável
- ✅ Tipagem TypeScript completa

## Como usar

### 1. Importar o componente

```tsx
import { Table } from "./components/utils/Table/Table";
```

### 2. Definir a interface dos dados

```tsx
interface User {
  id: string;
  photo?: string;
  name: string;
  registration: string;
  birthDate: string;
  password: string;
}
```

### 3. Criar os dados

```tsx
const users: User[] = [
  {
    id: "1",
    name: "João Silva",
    registration: "12345678",
    birthDate: "15-03-2000",
    password: "'5,12,3'",
  },
  // ... mais usuários
];
```

### 4. Definir as colunas

```tsx
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
    accessor: (user: User) => (
      <DetailsLink userId={user.id} onClick={handleDetailsClick} />
    ),
  },
];
```

### 5. Implementar o handler de detalhes (opcional)

```tsx
const handleDetailsClick = (user: User) => {
  // Navegação personalizada (opcional)
  // Se não fornecido, o componente navegará automaticamente para /profile/{user.id}
  console.log(`Navegando para perfil do usuário: ${user.id}`);
};
```

### 6. Renderizar o componente

```tsx
<Table
  data={users}
  columns={columns}
  onDetailsClick={handleDetailsClick} // Opcional - se não fornecido, navega para /profile/{id}
/>
```

## Classes CSS disponíveis

- `.photo-cell`: Para centralizar a coluna de foto
- `.photo-placeholder`: Placeholder para foto de perfil
- `.details-link`: Estilo para o link de detalhes
- `.bold-text`: Texto em negrito
- `.numeric-value`: Valores numéricos com fonte monospace

## Exemplo completo

Veja o arquivo `TableExample.tsx` para um exemplo completo de implementação.

## Navegação automática

O componente Table possui navegação automática para `/profile/{id}` quando o link "DETALHES" é clicado. Para isso funcionar:

1. **O item deve ter uma propriedade `id`** (string ou number)
2. **Não deve ser fornecido um `onDetailsClick` personalizado** (ou ele deve chamar a navegação manualmente)

### Exemplo de uso sem handler personalizado:

```tsx
// Navegação automática para /profile/{id}
<Table data={users} columns={columns} />
```

### Exemplo com handler personalizado:

```tsx
const handleDetailsClick = (user: User) => {
  // Lógica personalizada antes da navegação
  console.log(`Acessando perfil de ${user.name}`);
  // Navegação manual se necessário
  navigate(`/profile/${user.id}`);
};

<Table data={users} columns={columns} onDetailsClick={handleDetailsClick} />;
```

## Personalização

O componente é totalmente flexível e pode ser usado para qualquer tipo de dados, não apenas usuários. Basta adaptar a interface e as colunas conforme necessário.
