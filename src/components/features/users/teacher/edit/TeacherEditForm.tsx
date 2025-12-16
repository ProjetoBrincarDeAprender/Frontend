import { Form } from "@/components/forms/Root";
import { Skeleton } from "@/components/ui/skeleton";
import { useSchool } from "@/hooks/School/useSchool";
import { useTeacher } from "@/hooks/Teacher/useTeacher";
import { useUpdateTeacher } from "@/hooks/Teacher/useUpdateTeacher";
import { useUser } from "@/hooks/User/useUser";
import type { FilterSchoolOption, FilterTeacherOption } from "@/types/filter";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  nome_completo: z
    .string({ error: "Nome completo é obrigatório" })
    .max(80, { error: "O limite suportado é de 80 caracteres" })
    .min(2, { error: "Nome completo deve ter pelo menos 2 caracteres" }),
  email: z.email({ error: "Digite um email válido" }),
  escolaId: z.string().optional(),
});

type TeacherFormProps = {
  id: number;
  onSuccess: () => void;
};

export function TeacherEditForm({ id, onSuccess }: TeacherFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome_completo: "",
      email: "",
      escolaId: "",
    },
  });
  const { user } = useUser();

  const { update: updateTeacherMutation } = useUpdateTeacher();
  const { mutateAsync: updateTeacher, isPending: isUpdateTeacherPending } =
    updateTeacherMutation;

  const filters: FilterTeacherOption = {};
  const schoolFilters: FilterSchoolOption = {};

  if (user?.perfil !== "Admin") {
    filters.escolaId = user?.escolaId as number;
    schoolFilters.escolaId = user?.escolaId as number;
  }

  const { schoolsQuery } = useSchool({ filters: schoolFilters });
  const { data: schoolsReturn, isLoading: isSchoolsLoading } = schoolsQuery;
  const schoolsData = schoolsReturn?.data;

  const { teacherQuery } = useTeacher({
    teacherId: id,
    filters,
  });
  const { data: teacherData, isLoading: isTeacherLoading } = teacherQuery;

  useEffect(() => {
    if (teacherData && schoolsData) {
      form.reset({
        email: teacherData?.email || "",
        nome_completo: teacherData?.nome_completo || "",
        escolaId: teacherData?.escolaId ? String(teacherData.escolaId) : "",
      });
    }
  }, [teacherData, schoolsData, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const userData = {
      nome_completo: data.nome_completo,
      email: data.email,
      escolaId:
        user?.perfil === "Admin"
          ? Number(data.escolaId)
          : Number(user?.escolaId),
    };

    try {
      const responseUser = await updateTeacher({
        teacherId: id,
        data: userData,
      });

      if (responseUser) {
        onSuccess();
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
                message: `Erro ao atualizar conta: ${field.message.join(", ")}`,
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
      <Form.Title text="Atualizar Dados do(a) Professor(a)" />
      <Form.Main
        form={{ ...form }}
        onSubmit={onSubmit}
        className="flex flex-col gap-4"
      >
        {isTeacherLoading || isSchoolsLoading ? (
          <>
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            {user?.perfil === "Admin" && (
              <Skeleton className="h-10 w-full rounded-md" />
            )}
            <Skeleton className="h-10 w-24 rounded-md" />
          </>
        ) : (
          <>
            <Form.Field
              form={form}
              name="nome_completo"
              render={({ field }) => (
                <Form.Input
                  {...field}
                  label="Nome Completo"
                  placeholder="Mudar nome do(a) professor(a)"
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
            {user?.perfil === "Admin" && (
              <Form.Field
                form={form}
                name="escolaId"
                render={({ field }) => (
                  <Form.Select
                    key={field.value}
                    value={field.value || ""}
                    onChange={field.onChange}
                    label="Escola"
                    placeholder="Selecione a Escola"
                    options={schoolsData!.map((school) => ({
                      value: String(school.id),
                      label: school.nome,
                    }))}
                  />
                )}
              />
            )}

            <Form.Submit disabled={isUpdateTeacherPending}>
              {isUpdateTeacherPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Atualizar Professor(a)"
              )}
            </Form.Submit>
          </>
        )}
      </Form.Main>
    </Form.Wrapper>
  );
}
