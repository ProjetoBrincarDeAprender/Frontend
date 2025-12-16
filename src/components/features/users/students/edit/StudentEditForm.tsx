import { Form } from "@/components/forms/Root";
import { useSchool } from "@/hooks/School/useSchool";
import { useStudent } from "@/hooks/Student/useStudent";
import { useUpdateStudent } from "@/hooks/Student/useUpdateStudent";
import { useUser } from "@/hooks/User/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
//import { PasswordInput } from "@/components/ui/password-input";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { IMaskInput } from "react-imask";

const formSchema = z.object({
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
        const year = ano;
        const currentYear = new Date().getFullYear();
        return year >= 1940 && year <= currentYear;
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
    )
    .optional(),
  escolaId: z.string().optional(),
});

type StudentFormProps = {
  id: number;
  onSuccess: () => void;
};

export function StudentEditForm({ id, onSuccess }: StudentFormProps) {
  const { studentQuery } = useStudent({ studentId: id });
  const { data: studentData, isLoading } = studentQuery;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { user } = useUser();
  const { schoolsQuery } = useSchool({});
  const { data: schoolsData, isLoading: isSchoolsLoading } = schoolsQuery;

  const { update } = useUpdateStudent();
  const { mutateAsync: updateStudent, isPending } = update;

  useEffect(() => {
    if (studentData) {
      form.reset({
        nome_completo: studentData.nome_completo || "",
        email: studentData.email || "",
        data_nascimento: studentData.data_nascimento
          ? (() => {
              const date = new Date(studentData.data_nascimento);
              const dia = String(date.getDate()).padStart(2, "0");
              const mes = String(date.getMonth() + 1).padStart(2, "0");
              const ano = date.getFullYear();
              return `${dia}/${mes}/${ano}`;
            })()
          : "",
        avatar_url: studentData.avatar_url || "",
        tema_preferido: studentData.tema_preferido || "",
        escolaId: studentData.escolaId ? String(studentData.escolaId) : "",
      });
    }
  }, [id, form, studentData]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const studentPayload = Object.fromEntries(
      Object.entries({
        nome_completo: data.nome_completo,
        email: data.email,
        escolaId: user?.perfil == "Admin" ? data.escolaId : undefined,
        avatar_url: data.avatar_url?.trim() === "" ? null : data.avatar_url,
        tema_preferido: data.tema_preferido,
        data_nascimento: data.data_nascimento
          ? (() => {
              const [dia, mes, ano] = data.data_nascimento
                .split("/")
                .map(Number);
              return `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
            })()
          : undefined,
      }),
    );
    try {
      await updateStudent({ studentId: id, updateData: studentPayload });

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
              message: `Erro ao atualizar conta: ${field.message.join(", ")}`,
            });
          },
        );
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <Form.Wrapper>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-13 w-full" />
            <Skeleton className="h-13 w-full" />
            <Skeleton className="h-13 w-full" />
            <Skeleton className="h-13 w-full" />
            <Skeleton className="h-13 w-full" />
            {user?.perfil == "Admin" && <Skeleton className="h-13 w-full" />}
            <Skeleton className="h-13 w-full" />
          </div>
        </Form.Wrapper>
      ) : (
        <Form.Wrapper>
          <Form.Title text="Atualizar Dados do Aluno" />
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
                  placeholder="Edite o nome completo"
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
                  <label className="text-sm font-medium">
                    Data de Nascimento
                  </label>
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
                      value={String(field.value)}
                      onChange={field.onChange}
                      label="Escola"
                      placeholder="Selecione a Escola"
                      options={
                        schoolsData?.data?.map((school) => ({
                          value: String(school.id),
                          label: school.nome,
                        })) ?? []
                      }
                    />
                  )}
                />
              ))}
            <Form.Submit disabled={isPending}>
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Atualizar Dados"
              )}
            </Form.Submit>
          </Form.Main>
        </Form.Wrapper>
      )}
    </>
  );
}
