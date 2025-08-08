import api from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { Link } from "../../utils/Link/Link";
import { Form } from "../Form/Root";

const formSchema = z
  .object({
    nome_completo: z
      .string({ error: "Nome completo é obrigatório" })
      .max(80, { error: "O limite suportado é de 80 caracteres" })
      .min(2, { error: "Nome completo deve ter pelo menos 2 caracteres" }),
    email: z.email({ error: "Digite um email válido" }),
    avatar_url: z
      .url({ error: "Insira uma URL válida" })
      .optional()
      .or(z.literal("")),
    tema_preferido: z.string({ error: "Insira um tema válido" }),
    data_nascimento: z.string({
      error: "Data de nascimento é obrigatória",
    }),
    senha: z
      .string({ error: "Senha deve ter entre 8 e 32 caracteres" })
      .min(8, { error: "Senha deve ter pelo menos 8 caracteres" })
      .max(32, { error: "Senha deve ter no máximo 32 caracteres" }),
    confirmar_senha: z
      .string({
        error: "Confirmação de senha deve ter entre 8 e 32 caracteres",
      })
      .min(8, {
        error: "Confirmação de senha deve ter pelo menos 8 caracteres",
      })
      .max(32, {
        error: "Confirmação de senha deve ter no máximo 32 caracteres",
      }),
  })
  .refine((data) => data.senha == data.confirmar_senha, {
    error: "As senhas devem ser iguais",
    path: ["confirmar_senha"],
  });

export function StudentSignUpForm() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome_completo: "",
      email: "",
      senha: "",
      confirmar_senha: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!data.avatar_url) {
      delete data.avatar_url;
    }

    const payload = {
      ...data,
      data_nascimento: new Date(data.data_nascimento).toISOString(),
      perfilId: 2,
    };

    try {
      const response = await api.post("/student/register", payload);

      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const response = error.response;

        response?.data?.message.map(
          (field: { field: string; message: string[] }) => {
            if (form.control._fields[field.field]) {
              form.setError(field.field as keyof z.infer<typeof formSchema>, {
                message: field.message.join(", "),
              });
            }
            form.setError("root", {
              message: `Erro ao criar conta: ${field.message.join(", ")}`,
            });
          },
        );
      }
    }
  };

  return (
    <Form.Wrapper>
      <Form.Title text="Cadastrar Novo Aluno" />
      <Form.Main
        form={{ ...form }}
        onSubmit={onSubmit}
        className="flex flex-col gap-4"
      >
        <Form.Field
          form={form}
          name="nome_completo"
          render={({ field }) => (
            <Form.Input
              {...field}
              label="Nome Completo"
              placeholder="Insira seu nome completo"
            />
          )}
        />
        <Form.Field
          form={form}
          name="email"
          render={({ field }) => (
            <Form.Input
              {...field}
              label="E-Mail"
              placeholder="exemplo@gmail.com"
            />
          )}
        />
        <Form.Field
          form={form}
          name="data_nascimento"
          render={({ field }) => (
            <Form.Input
              {...field}
              label="Data de Nascimento"
              placeholder=""
              type="date"
            />
          )}
        />
        <Form.Field
          form={form}
          name="avatar_url"
          render={({ field }) => (
            <Form.Input
              {...field}
              label="URL do Avatar Personalizado"
              placeholder="https://urlDoAvatarPersonalizado.jpg"
              type="text"
            />
          )}
        />
        <Form.Field
          form={form}
          name="tema_preferido"
          render={({ field }) => (
            <Form.Input
              {...field}
              label="Tema Preferido"
              placeholder="Ex: Fundo do Mar, Espaço"
            />
          )}
        />
        <Form.Field
          form={form}
          name="senha"
          render={({ field }) => (
            <Form.Input
              {...field}
              label="Senha"
              placeholder="Senha"
              type="password"
            />
          )}
        />
        <Form.Field
          form={form}
          name="confirmar_senha"
          render={({ field }) => (
            <Form.Input
              {...field}
              label="Confirmar Senha"
              placeholder="Confirmar Senha"
              type="password"
            />
          )}
        />
        <Form.Submit>Criar Conta</Form.Submit>
      </Form.Main>
      <p className="mt-6 w-full text-center text-lg">
        O aluno já possui uma conta?{" "}
        <Link
          className="w-fit font-bold no-underline"
          variant="secondary"
          href="/dashboard"
        >
          Cancelar
        </Link>
      </p>
    </Form.Wrapper>
  );
}
