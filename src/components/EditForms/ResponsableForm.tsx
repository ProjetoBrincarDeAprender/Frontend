import api from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { Form } from "../Form/Root";
import { Link } from "../utils/Link/Link";

const formSchema = z
  .object({
    nome_completo: z
      .string({ error: "Nome completo é obrigatório" })
      .max(80, { error: "O limite suportado é de 80 caracteres" })
      .min(2, { error: "Nome completo deve ter pelo menos 2 caracteres" }),
    email: z.email({ error: "Digite um email válido" }),
    avatar_url: z.url({ error: "Insira uma URL válida" }),
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

export function ResponsableEditForm() {
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
    const payload = {
      ...data,
      perfilId: 3,
    };

    try {
      const response = await api.post("/user/register", payload);

      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const response = error.response;

        if (Array.isArray(response?.data?.message)) {
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
        } else {
          form.setError("root", {
            message: `${response?.data?.message}`,
          });
        }
      }
    }
  };

  return (
    <Form.Wrapper>
      <Form.Title text="Atualizar Dados do(a) Responsável" />
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
              placeholder="Modificar nome completo"
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
              type="url"
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
        <Form.Submit>Atualizar Dados</Form.Submit>
      </Form.Main>
      <p className="mt-6 w-full text-center text-lg">
        Desistiu de realizar as mordificações?{" "}
        <Link
          className="w-fit font-bold no-underline"
          variant="secondary"
          href="/home"
        >
          Voltar
        </Link>
      </p>
    </Form.Wrapper>
  );
}
