import { Form } from "@/components/forms/Root";
import { PasswordInput } from "@/components/ui/password-input";
import { Link } from "@/components/utils/Link/Link";
import { useSchool } from "@/hooks/School/useSchool";
import { useCreateStudent } from "@/hooks/Student/useCreateStudent";
import { useUser } from "@/hooks/User/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { IMaskInput } from "react-imask";
import { z } from "zod";
import type { SignUpFormProps } from "../../common/signUpFormProps";

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
    tema_preferido: z.string({ error: "Insira um tema válido" }).optional(),
    data_nascimento: z
      .string()
      .nonempty({ error: "Data de nascimento é obrigatória" })
      .refine((val) => /^\d{2}\/\d{2}\/\d{4}$/.test(val), {
        error: "Formato inválido. Use dd/mm/aaaa",
      })
      .refine(
        (val) => {
          const [dia, mes, ano] = val.split("/").map(Number);
          const date = new Date(ano, mes - 1, dia);

          return (
            date.getFullYear() === ano &&
            date.getMonth() === mes - 1 &&
            date.getDate() === dia
          );
        },
        { error: "Data inexistente" },
      )
      .refine(
        (val) => {
          const [_dia, _mes, ano] = val.split("/").map(Number);
          const currentYear = new Date().getFullYear();
          return ano >= 1940 && ano <= currentYear;
        },
        {
          error: "Data de nascimento inválida",
        },
      )
      .refine(
        (val) => {
          const [dia, mes, ano] = val.split("/").map(Number);

          const today = new Date();
          let age = today.getFullYear() - ano;
          const m = today.getMonth() - (mes - 1);

          if (m < 0 || (m === 0 && today.getDate() < dia)) {
            age--;
          }
          return age >= 5;
        },
        {
          error: "O aluno deve ter pelo menos 5 anos de idade",
        },
      ),

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
  })
  .refine((data) => data.senha == data.confirmar_senha, {
    error: "As senhas devem ser iguais",
    path: ["confirmar_senha"],
  });

export function StudentSignUpForm({ onSuccess }: SignUpFormProps) {
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
  const { schoolsQuery } = useSchool({});
  const { data: schoolsReturn, isLoading: isSchoolsLoading } = schoolsQuery;
  const schoolsData = schoolsReturn?.data;

  const { create } = useCreateStudent();
  const { mutateAsync: createUser, isPending } = create;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!data.avatar_url) {
      delete data.avatar_url;
    }

    const [dia, mes, ano] = data.data_nascimento.split("/").map(Number);
    const dataFormatada = `${ano.toString().padStart(4, "0")}-${mes
      .toString()
      .padStart(2, "0")}-${dia.toString().padStart(2, "0")}`;

    const payload = {
      ...data,
      data_nascimento: dataFormatada,
      perfilId: 3,
      escolaId: user?.escolaId || data.escolaId,
    };

    try {
      await createUser(payload);
      onSuccess();
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
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Data de Nascimento</label>
              <IMaskInput
                {...field}
                mask="00/00/0000"
                placeholder="dd/mm/aaaa"
                value={field.value || ""}
                onAccept={(value) => field.onChange(value)}
                className="border-purplish-blue hover:border-purplish-blue flex h-13 w-full rounded-lg border bg-transparent px-6 py-2 text-base text-gray-800 transition-colors duration-200 ease-in-out placeholder:text-gray-500 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
              {fieldState.error && (
                <p className="text-sm text-red-600">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        <Form.Field
          form={form}
          name="avatar_url"
          render={({ field }) => (
            <Form.Input
              {...field}
              // value={field.value || ""}
              label="URL do Avatar Personalizado (Opcional)"
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
              label="Tema Preferido (Opcional)"
              placeholder="Ex: Fundo do Mar, Espaço"
            />
          )}
        />
        {user?.perfil == "Admin" &&
          (isSchoolsLoading ? (
            <span>Carregando escolas...</span>
          ) : (
            <Form.Field
              form={form}
              name="escolaId"
              render={({ field }) => (
                <Form.Select
                  {...field}
                  // value={field.value || ""}
                  label="Escola"
                  placeholder="Selecione a Escola"
                  options={
                    schoolsData?.map((school) => ({
                      value: String(school.id),
                      label: school.nome,
                    })) ?? []
                  }
                />
              )}
            />
          ))}
        <Form.Field
          form={form}
          name="senha"
          render={({ field, fieldState }) => (
            <>
              <PasswordInput
                {...field}
                label="Senha"
                placeholder="Senha"
                type="password"
              />
              {fieldState.error && (
                <p className="text-sm text-red-600">
                  {fieldState.error.message}
                </p>
              )}
            </>
          )}
        />
        <Form.Field
          form={form}
          name="confirmar_senha"
          render={({ field, fieldState }) => (
            <>
              <PasswordInput
                {...field}
                label="Confirmar Senha"
                placeholder="Confirmar Senha"
                type="password"
              />
              {fieldState.error && (
                <p className="text-sm text-red-600">
                  {fieldState.error.message}
                </p>
              )}
            </>
          )}
        />
        <Form.Submit>
          {isPending ? <Loader2 className="animate-spin" /> : "Criar Conta"}
        </Form.Submit>
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
