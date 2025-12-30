import { FancyMultiSelect } from "@/components/forms/MultiSelect";
import { Form } from "@/components/forms/Root";
import { useResponsible } from "@/hooks/Responsible/useResponsible";
import { useUpdateResponsible } from "@/hooks/Responsible/useUpdateResponsible";
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
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  nome_completo: z
    .string({ error: "Nome completo é obrigatório" })
    .max(80, { error: "O limite suportado é de 80 caracteres" })
    .min(2, { error: "Nome completo deve ter pelo menos 2 caracteres" }),
  email: z.email({ error: "Digite um email válido" }),
  escolaId: z.string().optional(),
  usersIds: z.array(z.string()).optional(),
  parentesco: z
    .string()
    .max(50, { error: "Parentesco deve ter no máximo 50 caracteres" }),
});

type ResponsibleFormProps = {
  id: number;
  onSuccess: () => void;
};

export function ResponsibleEditForm({ id, onSuccess }: ResponsibleFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { user } = useUser();
  const escolaSelecionada = form.watch("escolaId");
  const isAdmin = user?.perfil === UserPerfilEnum.ADMIN;

  // Fetch responsible data
  const { responsibleQuery, responsibleStudentsQuery } = useResponsible({
    responsibleId: id,
  });
  const { data: responsibleData, isLoading: isLoadingResponsible } =
    responsibleQuery;
  const { data: studentsReturn, isLoading: isLoadingStudents } =
    responsibleStudentsQuery;
  const studentsData = studentsReturn?.data;

  // Fetch schools for admin
  const schoolFilters: FilterSchoolOption = isAdmin
    ? {}
    : { escolaId: Number(user?.escolaId) };
  const { schoolsQuery } = useSchool({ filters: schoolFilters });
  const { data: schoolsReturn, isLoading: isLoadingSchools } = schoolsQuery;
  const schoolsData = schoolsReturn?.data;

  // Fetch available students
  const studentRelationsFilters: FilterStudentRelationsOption = {
    isNull: true,
    escolaId: isAdmin
      ? escolaSelecionada
        ? Number(escolaSelecionada)
        : undefined
      : Number(user?.escolaId),
  };
  const { studentsByRelationQuery } = useStudentsRelations({
    type: "responsible",
    filters: studentRelationsFilters,
  });
  const {
    data: availableStudentsReturn,
    isLoading: isLoadingAvailableStudents,
  } = studentsByRelationQuery;
  const availableStudentsData = availableStudentsReturn?.data;

  // Update mutations
  const {
    update: updateResponsibleMutation,
    updateRelation: updateRelationMutation,
  } = useUpdateResponsible();
  const {
    mutateAsync: updateResponsible,
    isPending: isUpdatingResponsible,
    isSuccess: isUpdateResponsibleSuccess,
  } = updateResponsibleMutation;
  const {
    mutateAsync: updateRelation,
    isPending: isUpdatingRelation,
    isSuccess: isUpdateRelationSuccess,
  } = updateRelationMutation;

  const isLoading =
    isLoadingResponsible ||
    isLoadingStudents ||
    (isAdmin && isLoadingSchools) ||
    isLoadingAvailableStudents;
  const isSubmitting = isUpdatingResponsible || isUpdatingRelation;

  // Initialize form with responsible data
  useEffect(() => {
    if (responsibleData) {
      form.reset({
        nome_completo: responsibleData.nome_completo,
        email: responsibleData.email,
        parentesco: responsibleData.parentesco,
        escolaId: String(responsibleData.escolaId),
      });
    }
  }, [responsibleData, form]);

  // Set initial students when data loads
  useEffect(() => {
    if (studentsData) {
      const originalIds = studentsData.map((student) =>
        String(student.codigo_usuario),
      );
      form.setValue("usersIds", originalIds);
    }
  }, [studentsData, form]);

  // Handle success
  useEffect(() => {
    const usersIds = form.getValues("usersIds");
    const hasStudents = usersIds && usersIds.length > 0;

    if (hasStudents) {
      if (isUpdateResponsibleSuccess && isUpdateRelationSuccess) {
        onSuccess();
      }
    } else if (isUpdateResponsibleSuccess) {
      onSuccess();
    }
  }, [isUpdateResponsibleSuccess, isUpdateRelationSuccess, onSuccess, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const { usersIds, parentesco, ...userData } = data;

    try {
      await updateResponsible({
        responsibleId: id,
        data: {
          ...userData,
          escolaId: isAdmin ? Number(data.escolaId) : Number(user?.escolaId),
        },
      });

      if (usersIds && usersIds.length > 0) {
        await updateRelation({
          responsibleId: id,
          studentsIds: usersIds.map((id) => Number(id)),
          parentesco,
        });
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

  const hasNoStudents = availableStudentsData?.length === 0;

  if (isLoading) {
    return (
      <Form.Wrapper>
        <Form.Title text="Atualizar Dados do(a) Responsável" />
        <div className="flex flex-col gap-4 p-8">
          <Loader2 className="mx-auto animate-spin" size={48} />
          <p className="text-muted-foreground text-center">
            Carregando dados...
          </p>
        </div>
      </Form.Wrapper>
    );
  }

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
              placeholder="Mudar nome do(a) responsável"
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
        {isAdmin && schoolsData && (
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
                options={schoolsData.map((school) => ({
                  value: String(school.id),
                  label: school.nome,
                }))}
              />
            )}
          />
        )}
        {availableStudentsData && studentsData && (
          <Form.Field
            form={form}
            name="usersIds"
            disabled={isAdmin && !escolaSelecionada}
            render={({ field }) => (
              <>
                <FancyMultiSelect
                  onSelect={field.onChange}
                  label="Alunos do Responsável"
                  placeholder="Selecione os alunos do responsável..."
                  data={
                    availableStudentsData?.map(({ codigo_usuario, email }) => ({
                      value: String(codigo_usuario),
                      label: email,
                    })) || []
                  }
                  preSelectedData={studentsData.map(
                    ({ codigo_usuario, email }) => ({
                      value: String(codigo_usuario),
                      label: email,
                    }),
                  )}
                />
                {isAdmin && !escolaSelecionada && (
                  <p className="mt-1 text-sm text-yellow-800">
                    Selecione uma escola para carregar os alunos
                  </p>
                )}
                {hasNoStudents && escolaSelecionada && (
                  <p className="mt-1 text-sm text-yellow-800">
                    Não há alunos disponíveis nesta escola!
                  </p>
                )}
              </>
            )}
          />
        )}
        <Form.Submit disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Atualizar Dados"
          )}
        </Form.Submit>
      </Form.Main>
    </Form.Wrapper>
  );
}
