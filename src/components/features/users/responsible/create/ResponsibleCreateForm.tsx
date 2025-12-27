import { FancyMultiSelect } from "@/components/forms/MultiSelect";
import { Form } from "@/components/forms/Root";
import { PasswordInput } from "@/components/ui/password-input";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/components/utils/Link/Link";
import { useCreateResponsible } from "@/hooks/Responsible/useCreateResponsible";
import { useSchool } from "@/hooks/School/useSchool";
import { useStudentsRelations } from "@/hooks/Student/useStudent";
import { useUser } from "@/hooks/User/useUser";
import type {
  FilterSchoolOption,
  FilterStudentRelationsOption,
} from "@/types/filter";
import { UserPerfilEnum } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
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
    parentesco: z
      .string( { error: "Parentesco é obrigatório" })      
      .min(2, { error: "Parentesco deve ter pelo menos 2 caracteres" })
      .max(50, { error: "Parentesco deve ter no máximo 50 caracteres" }),
  })
  .refine((data) => data.senha == data.confirmar_senha, {
    error: "As senhas devem ser iguais",
    path: ["confirmar_senha"],
  });

type FormSchema = z.infer<typeof formSchema>;

function CommonFormFields({ form }: { form: UseFormReturn<FormSchema> }) {
  return (
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
        name="parentesco"
        render={({ field }) => (
          <Form.Input
            {...field}
            label="Parentesco"
            placeholder="Insira qual seu parentesco"
          />
        )}
      />
    </>
  );
}

function PasswordFields({ form }: { form: UseFormReturn<FormSchema> }) {
  return (
    <>
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
              <p className="text-sm text-red-600">{fieldState.error.message}</p>
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
              <p className="text-sm text-red-600">{fieldState.error.message}</p>
            )}
          </>
        )}
      />
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}

export function ResponsableSignUpForm({ onSuccess }: SignUpFormProps) {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome_completo: "",
      email: "",
      senha: "",
      confirmar_senha: "",
    },
  });
  const { user } = useUser();

  const {
    create: createResponsibleMutation,
    createRelations: createResponsibleRelationsMutation,
  } = useCreateResponsible();
  const {
    mutateAsync: createResponsible,
    isPending: isResponsiblePending,
    isSuccess: isResponsibleSuccess,
  } = createResponsibleMutation;
  const {
    mutateAsync: createResponsibleRelations,
    isPending: isResponsibleRelationsPending,
    isSuccess: isResponsibleRelationsSuccess,
  } = createResponsibleRelationsMutation;

  const escolaSelecionada = form.watch("escolaId");
  const isAdmin = user?.perfil === UserPerfilEnum.ADMIN;

  const schoolFilters: FilterSchoolOption = isAdmin
    ? {}
    : { escolaId: Number(user?.escolaId) };

  const studentRelationsFilters: FilterStudentRelationsOption = {
    isNull: true,
  };

  if (!isAdmin) {
    studentRelationsFilters.escolaId = Number(user?.escolaId);
  }

  const { schoolsQuery } = useSchool({ filters: schoolFilters });
  const { data: schoolsReturn, isLoading: isSchoolLoading } = schoolsQuery;
  const schoolsData = schoolsReturn?.data;

  const { studentsByRelationQuery } = useStudentsRelations(
    "responsible",
    studentRelationsFilters,
  );
  const { data: studentsReturn, isLoading: isStudentsLoading } =
    studentsByRelationQuery;
  const studentsData = studentsReturn?.data;

  const isLoading = isAdmin
    ? isSchoolLoading || isStudentsLoading
    : isStudentsLoading;
  const isSubmitting = isResponsiblePending || isResponsibleRelationsPending;

  useEffect(() => {
    const studentsIds = form.getValues("usersIds");
    const hasStudents = studentsIds && studentsIds.length > 0;

    if (hasStudents) {
      if (isResponsibleSuccess && isResponsibleRelationsSuccess) {
        onSuccess();
      }
    } else if (isResponsibleSuccess) {
      onSuccess();
    }
  }, [isResponsibleSuccess, isResponsibleRelationsSuccess, onSuccess, form]);

  const onSubmit = async (data: FormSchema) => {
    const { usersIds, parentesco, ...userData } = data;

    const payload = {
      ...userData,
      perfilId: 5,
      escolaId: isAdmin ? Number(data.escolaId) : Number(user?.escolaId),
    };

    try {
      const response = await createResponsible(payload);

      console.log(response);

      if (usersIds && usersIds.length > 0) {
        await createResponsibleRelations({
          responsibleId: parseInt(response.codigo_usuario),
          parentesco,
          studentsIds: usersIds.map((value) => Number(value)),
        });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const response = error.response;

        if (Array.isArray(response?.data?.message)) {
          response?.data?.message.map(
            (field: { field: string; message: string[] }) => {
              if (form.control._fields[field.field]) {
                form.setError(field.field as keyof FormSchema, {
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

  const filteredStudents = studentsData?.filter(({ escola }) => {
    const targetSchoolId = isAdmin
      ? schoolsData?.find((school) => school.id === Number(escolaSelecionada))
          ?.nome
      : user?.escola;
    return escola === targetSchoolId;
  });

  return (
    <Form.Wrapper>
      <Form.Title text="Cadastrar Novo Responsável" />
      <Form.Main
        form={{ ...form }}
        onSubmit={onSubmit}
        className="flex flex-col gap-4"
      >
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <CommonFormFields form={form} />

            {isAdmin && (
              <Form.Field
                form={form}
                name="escolaId"
                render={({ field }) => (
                  <Form.Select
                    {...field}
                    label="Escola"
                    placeholder="Selecione a Escola"
                    onValueChange={(e) => {
                      field.onChange(e);
                      form.setValue("usersIds", []);
                    }}
                    options={schoolsData!.map((school) => ({
                      value: String(school.id),
                      label: school.nome,
                    }))}
                  />
                )}
              />
            )}

            <PasswordFields form={form} />

            <Form.Field
              form={form}
              name="usersIds"
              disabled={isAdmin && !escolaSelecionada}
              render={({ field }) => (
                <>
                  <FancyMultiSelect
                    onSelect={field.onChange}
                    preSelectedData={
                      Array.isArray(field.value)
                        ? filteredStudents
                            ?.filter((student) =>
                              field.value.includes(
                                String(student.codigo_usuario),
                              ),
                            )
                            .map((student) => ({
                              value: String(student.codigo_usuario),
                              label: student.email,
                            })) || []
                        : []
                    }
                    label="Alunos do Responsável"
                    placeholder="Selecione os alunos do responsável..."
                    data={
                      filteredStudents?.map(({ codigo_usuario, email }) => ({
                        value: codigo_usuario,
                        label: email,
                      })) || []
                    }
                  />
                  {isAdmin && !escolaSelecionada && (
                    <p className="mt-1 text-sm text-yellow-800">
                      Selecione uma escola para carregar os alunos
                    </p>
                  )}
                </>
              )}
            />

            <Form.Submit disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Cadastrar Responsável"
              )}
            </Form.Submit>
          </>
        )}
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
