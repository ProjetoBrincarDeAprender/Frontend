# Documentação - Componentes Forms

Esta pasta contém um conjunto de componentes React para criação de formulários padronizados, utilizando React Hook Form e Shadcn/UI como base. Os componentes são organizados de forma modular e reutilizável.

## Índice

- [Form (Root)](#form-root)
- [Form.Wrapper](#formwrapper)
- [Form.Title](#formtitle)
- [Form.Main](#formmain)
- [Form.Field](#formfield)
- [Form.Input](#forminput)
- [Form.PasswordInput](#formpasswordinput)
- [Form.Select](#formselect)
- [Form.Combobox](#formcombobox)
- [Form.MultiSelect](#formmultiselect)
- [Form.Item](#formitem)
- [Form.Submit](#formsubmit)
- [Exemplo Completo](#exemplo-completo)

---

## Form (Root)

**Arquivo**: `Root.tsx`

O componente principal que exporta todos os outros componentes forms como propriedades de um único objeto `Form`. Isso permite um uso mais organizado e semântico dos componentes.

### Uso

```tsx
import { Form } from "@/components/forms/Root";

// Agora você pode usar Form.Input, Form.Select, etc.
```

---

## Form.Wrapper

**Arquivo**: `Wrapper.tsx`

Container principal do formulário com estilização padronizada.

### Props

```tsx
type FormWrapperProps = {
  children: React.ReactNode;
  className?: string;
};
```

### Exemplo

```tsx
<Form.Wrapper className="mx-auto max-w-md">
  {/* Conteúdo do formulário */}
</Form.Wrapper>
```

---

## Form.Title

Componente para título do formulário com estilização padronizada.

### Props

```tsx
{
  text: string;
  className?: string;
}
```

### Exemplo

```tsx
<Form.Title text="Cadastrar Usuário" className="text-3xl" />
```

---

## Form.Main

**Arquivo**: `Main.tsx`

Wrapper principal que gerencia o formulário usando React Hook Form, incluindo tratamento de erros globais.

### Props

```tsx
type FromMainProps = {
  form: UseFormReturn<any>;
  onSubmit: (values: any) => void;
  className?: string;
  children?: React.ReactNode;
};
```

### Exemplo

```tsx
const form = useForm<LoginData>({
  resolver: zodResolver(loginSchema),
});

const onSubmit = (data: LoginData) => {
  // Lógica de submissão
};

<Form.Main form={form} onSubmit={onSubmit} className="space-y-4">
  {/* Campos do formulário */}
</Form.Main>;
```

---

## Form.Field

**Arquivo**: `Field.tsx`

Wrapper para campos de formulário que integra com React Hook Form, gerenciando validação e estado.

### Props

```tsx
type FormFieldProps = {
  form: UseFormReturn<any>;
  name: string;
  render: ({ field }) => JSX.Element;
};
```

### Exemplo

```tsx
<Form.Field
  form={form}
  name="email"
  render={({ field }) => (
    <Form.Input {...field} label="Email" placeholder="Digite seu email" />
  )}
/>
```

---

## Form.Input

**Arquivo**: `Input.tsx`

Campo de entrada de texto padrão com label, validação e descrição opcional.

### Props

```tsx
type FormInputProps = {
  wrapperClassName?: string;
  labelClassName?: string;
  label: string;
  inputDescription?: string;
  autofocus?: boolean;
} & React.ComponentProps<typeof ShadcnInput>;
```

### Exemplo

```tsx
<Form.Input
  label="Nome completo"
  placeholder="Digite seu nome"
  inputDescription="Seu nome será exibido publicamente"
  autoFocus
/>
```

---

## Form.PasswordInput

**Arquivo**: `PasswordInput.tsx`

Campo de senha com botão para mostrar/ocultar a senha.

### Props

```tsx
type FormPasswordInputProps = {
  wrapperClassName?: string;
  labelClassName?: string;
  label: string;
  inputDescription?: string;
  autofocus?: boolean;
} & React.ComponentProps<typeof ShadcnInput>;
```

### Características

- Ícone de olho para alternar visibilidade
- Acessibilidade com `aria-label`
- Mesmo padrão de props do Form.Input

### Exemplo

```tsx
<Form.PasswordInput
  label="Senha"
  placeholder="Digite sua senha"
  inputDescription="Mínimo 8 caracteres"
/>
```

---

## Form.Select

**Arquivo**: `Select.tsx`

Dropdown de seleção simples com opções pré-definidas.

### Props

```tsx
type FormSelectProps = {
  wrapperClassName?: string;
  labelClassName?: string;
  label: string;
  autofocus?: boolean;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
} & React.ComponentProps<typeof ShadcnSelect>;
```

### Exemplo

```tsx
const statusOptions = [
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
  { value: "pendente", label: "Pendente" },
];

<Form.Select
  label="Status"
  placeholder="Selecione um status"
  options={statusOptions}
  onChange={(value) => setValue("status", value)}
/>;
```

---

## Form.Combobox

**Arquivo**: `Combobox.tsx`

Componente de seleção com busca/filtro em tempo real, ideal para listas grandes de opções.

### Props

```tsx
type FormComboboxProps = {
  label: string;
  labelClassName?: string;
  noItemFoundMessage?: string;
  options?: { value: string; label: string }[];
  placeholder?: string;
  wrapperClassName?: string;
  variant?:
    | "default"
    | "link"
    | "outline"
    | "destructive"
    | "secondary"
    | "ghost";
  value?: string;
  onChange?: (value: string) => void;
};
```

### Características

- Busca pelo label, retorna o value
- Suporte a componentes controlados e não-controlados
- Mensagem customizável para "nenhum item encontrado"

### Exemplo

```tsx
const competencias = [
  { value: "1", label: "Matemática Básica" },
  { value: "2", label: "Português Avançado" },
  // ...mais opções
];

<Form.Combobox
  label="Competência"
  placeholder="Busque uma competência..."
  options={competencias}
  noItemFoundMessage="Nenhuma competência encontrada"
  value={selectedCompetencia}
  onChange={setSelectedCompetencia}
/>;
```

---

## Form.MultiSelect

**Arquivo**: `MultiSelect.tsx`

Componente para seleção múltipla com busca, exibindo seleções como badges removíveis.

### Props

```tsx
type MultiSelectProps = {
  data: { value: string; label: string }[];
  label?: string;
  placeholder?: string;
  preSelectedData?: { value: string; label: string }[];
  onSelect: (ids: number[] | string[]) => void;
};
```

### Características

- Múltipla seleção com badges
- Busca em tempo real
- Pré-seleção de items
- Remoção individual de seleções

### Exemplo

```tsx
const categories = [
  { value: "tech", label: "Tecnologia" },
  { value: "design", label: "Design" },
  { value: "marketing", label: "Marketing" },
];

<Form.MultiSelect
  label="Categorias"
  placeholder="Selecione categorias..."
  data={categories}
  preSelectedData={[{ value: "tech", label: "Tecnologia" }]}
  onSelect={(selectedIds) => {
    console.log("Selecionados:", selectedIds);
  }}
/>;
```

---

## Form.Item

**Arquivo**: `Item.tsx`

Componente genérico para criar campos customizados, fornecendo estrutura básica de FormItem.

### Props

```tsx
type FormItemProps = {
  children?: React.ReactNode;
  wrapperClassName?: string;
  labelClassName?: string;
  label?: string;
  autofocus?: boolean;
};
```

### Exemplo

```tsx
<Form.Item label="Campo customizado" wrapperClassName="my-4">
  {/* Seu componente customizado aqui */}
  <CustomComponent />
</Form.Item>
```

---

## Form.Submit

Botão de submissão padronizado com estilos consistentes.

### Props

```tsx
React.ComponentProps<typeof Button> & {
  className?: string;
}
```

### Exemplo

```tsx
<Form.Submit disabled={isLoading}>
  {isLoading ? "Carregando..." : "Enviar"}
</Form.Submit>
```

---

## Exemplo Completo

```tsx
import { Form } from "@/components/forms/Root";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  role: z.string().min(1, "Selecione um papel"),
  skills: z.array(z.string()).min(1, "Selecione pelo menos uma habilidade"),
});

type UserFormData = z.infer<typeof userSchema>;

function UserForm() {
  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
      skills: [],
    },
  });

  const handleSubmit = (data: UserFormData) => {
    console.log("Dados do formulário:", data);
  };

  const roleOptions = [
    { value: "admin", label: "Administrador" },
    { value: "user", label: "Usuário" },
    { value: "guest", label: "Convidado" },
  ];

  const skillsData = [
    { value: "js", label: "JavaScript" },
    { value: "react", label: "React" },
    { value: "node", label: "Node.js" },
    { value: "python", label: "Python" },
  ];

  return (
    <Form.Wrapper>
      <Form.Title text="Cadastro de Usuário" />

      <Form.Main form={form} onSubmit={handleSubmit}>
        <Form.Field
          form={form}
          name="name"
          render={({ field }) => (
            <Form.Input
              {...field}
              label="Nome completo"
              placeholder="Digite seu nome"
            />
          )}
        />

        <Form.Field
          form={form}
          name="email"
          render={({ field }) => (
            <Form.Input
              {...field}
              label="Email"
              placeholder="seu@email.com"
              type="email"
            />
          )}
        />

        <Form.Field
          form={form}
          name="password"
          render={({ field }) => (
            <Form.PasswordInput
              {...field}
              label="Senha"
              placeholder="Digite uma senha segura"
            />
          )}
        />

        <Form.Field
          form={form}
          name="role"
          render={({ field }) => (
            <Form.Select
              {...field}
              label="Papel do usuário"
              placeholder="Selecione um papel"
              options={roleOptions}
            />
          )}
        />

        <Form.MultiSelect
          label="Habilidades"
          placeholder="Selecione suas habilidades..."
          data={skillsData}
          onSelect={(skills) => form.setValue("skills", skills)}
        />

        <Form.Submit>Cadastrar Usuário</Form.Submit>
      </Form.Main>
    </Form.Wrapper>
  );
}
```

## Padrões de Uso

### 1. **Sempre use Form.Field para campos conectados ao form**

```tsx
// ✅ Correto
<Form.Field
  form={form}
  name="fieldName"
  render={({ field }) => (
    <Form.Input {...field} label="Label" />
  )}
/>

// ❌ Incorreto (não conectado ao form)
<Form.Input label="Label" />
```

### 2. **Use form.setValue para campos que não usam Form.Field**

```tsx
<Form.MultiSelect onSelect={(values) => form.setValue("skills", values)} />
```

### 3. **Estrutura recomendada**

```tsx
<Form.Wrapper>
  <Form.Title text="Título" />
  <Form.Main form={form} onSubmit={onSubmit}>
    {/* Campos aqui */}
    <Form.Submit>Enviar</Form.Submit>
  </Form.Main>
</Form.Wrapper>
```

## Dependências

- React Hook Form
- Shadcn/UI
- Tailwind CSS
- Zod (para validação)
- Lucide React (ícones)
