import { FancyMultiSelect } from "@/components/forms/MultiSelect";
import { Form } from "@/components/forms/Root";
import { PasswordInput } from "@/components/ui/password-input";
import { Link } from "@/components/utils/Link/Link";
import { useUser } from "@/hooks/User/useUser";
import type { UserProfile } from "@/types/user";
import api from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { SignUpFormProps } from "../../common/signUpFormProps";

const formSchema = z
  .object({
    nome_completo: z
      .string({ error: "Nome completo é obrigatório" })
      .max(80, { error: "O limite suportado é de 80 caracteres" })
      .min(2, { error: "Nome completo deve ter pelo menos 2 caracteres" }),
    email: z.email({ error: "Digite um email válido" }),
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
    escolaId: z.string().optional(),
    usersIds: z.array(z.string()).optional(),
  })
  .refine((data) => data.senha == data.confirmar_senha, {
    error: "As senhas devem ser iguais",
    path: ["confirmar_senha"],
  });

export function ResponsableSignUpForm({ onSuccess }: SignUpFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome_completo: "",
      email: "",
      senha: "",
      confirmar_senha: "",
    },
  });
  const { user } = useUser();
  const [schools, setSchools] = useState<{ id: number; nome: string }[] | null>(
    null,
  );
  const [users, setUsers] = useState<UserProfile[] | null>(null);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await api.get("/school/list");

        if (response.status === 200) {
          setSchools(response.data);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          form.setError("root", {
            message: `Erro ao carregar escolas: ${error.message}`,
          });
        }
      }
    };
    const fetchUsers = async () => {
      try {
        const response = await api.get(
          `/user/list?type=Aluno${user?.perfil == "Admin" ? "" : `&escolaId=${user?.escola?.id}`}`,
        );

        if (response.status == 200) {
          const users = response.data;
          setUsers(users);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (user?.perfil == "Admin") {
      fetchSchools();
    }
    fetchUsers();
  }, [form, user]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { usersIds, ...userData } = data;

    const payload = {
      ...userData,
      perfilId: 5,
      escolaId: user?.escola?.id || data.escolaId,
    };

    try {
      const response = await api.post("/user/register", payload);

      if (usersIds && usersIds.length > 0) {
        const responseLinking = await api.post("/responsible/register", {
          userId: response.data.id,
          educandosIds: usersIds.map((value) => Number(value)),
        });

        if (response.status == 201 && responseLinking.status == 201) {
          return onSuccess();
        }
      }

      if (response.status == 201) {
        return onSuccess();
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
      <Form.Title text="Cadastrar Novo Responsável" />
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
              label="Email"
              placeholder="exemplo@gmail.com"
            />
          )}
        />
        {user?.perfil == "Admin" && schools && (
          <Form.Field
            form={form}
            name="escolaId"
            render={({ field }) => (
              <Form.Select
                {...field}
                label="Escola"
                placeholder="Selecione a Escola"
                options={schools.map((school) => ({
                  value: String(school.id),
                  label: school.nome,
                }))}
              />
            )}
          />
        )}

        <Form.Field
          form={form}
          name="senha"
          render={({ field }) => (
            <PasswordInput
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
            <PasswordInput
              {...field}
              label="Confirmar Senha"
              placeholder="Confirmar Senha"
              type="password"
            />
          )}
        />

        <Form.Field
          form={form}
          name="usersIds"
          render={({ field }) => (
            <FancyMultiSelect
              onSelect={field.onChange}
              label="Alunos do Responsável"
              placeholder="Selecione os alunos do responsável..."
              data={
                users
                  ? users.map(({ id, email }) => ({
                      value: String(id),
                      label: email,
                    }))
                  : []
              }
            />
          )}
        />
        <Form.Submit>Criar Conta</Form.Submit>
      </Form.Main>
      <p className="mt-6 w-full text-center text-lg">
        O responsável já possui uma conta?{" "}
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
