// import { FancyMultiSelect } from "@/components/forms/MultiSelect";
import { Form } from "@/components/forms/Root";
import { PasswordInput } from "@/components/ui/password-input";
import { Link } from "@/components/utils/Link/Link";
import { useUser } from "@/hooks/User/useUser";
// import type { User, UserProfile } from "@/types/user";
import { Skeleton } from "@/components/ui/skeleton";
import { useSchool } from "@/hooks/School/useSchool";
import { useCreateTeacher } from "@/hooks/Teacher/useCreateTeacher";
import { UserPerfilEnum } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
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
  })
  .refine((data) => data.senha == data.confirmar_senha, {
    error: "As senhas devem ser iguais",
    path: ["confirmar_senha"],
  });

export default function TeacherSignUpForm({ onSuccess }: SignUpFormProps) {
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
  const { data: schoolsReturn, isLoading: isLoadingSchools } = schoolsQuery;
  const schoolsData = schoolsReturn?.data;

  const { create: createTeacherMutation } = useCreateTeacher();
  const {
    mutateAsync: createTeacher,
    isPending: isCreatingTeacher,
    isSuccess: isCreateTeacherSuccess,
  } = createTeacherMutation;

  useEffect(() => {
    if (isCreateTeacherSuccess) {
      onSuccess();
    }
  }, [isCreateTeacherSuccess, onSuccess]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const payload = {
      ...data,
      perfilId: 4,
      escolaId: Number(user?.escolaId) || Number(data.escolaId),
    };

    try {
      await createTeacher(payload);
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
      <Form.Title text="Cadastrar Novo Professor" />
      <Form.Main
        form={{ ...form }}
        onSubmit={onSubmit}
        className="flex flex-col gap-4"
      >
        {user?.perfil !== UserPerfilEnum.ADMIN ? (
          <>
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
            <Form.Submit disabled={isCreatingTeacher}>
              {isCreatingTeacher ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Criar Conta"
              )}
            </Form.Submit>
          </>
        ) : isLoadingSchools ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <>
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
            <Form.Field
              form={form}
              name="escolaId"
              render={({ field }) => (
                <Form.Select
                  {...field}
                  label="Escola"
                  placeholder="Selecione a Escola"
                  options={schoolsData!.map((school) => ({
                    value: String(school.id),
                    label: school.nome,
                  }))}
                />
              )}
            />
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
            <Form.Submit disabled={isCreatingTeacher}>
              {isCreatingTeacher ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Criar Conta"
              )}
            </Form.Submit>
          </>
        )}
      </Form.Main>
      <p className="mt-6 w-full text-center text-lg">
        O professor já possui uma conta?{" "}
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
