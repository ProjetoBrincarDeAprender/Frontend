import { Form } from "@/components/forms/Root";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/components/utils/Link/Link";
import { useSchoolAdmin } from "@/hooks/SchoolAdmin/useSchoolAdmin";
import { useUpdateSchoolAdmin } from "@/hooks/SchoolAdmin/useUpdateSchool";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
// No topo do EditForm.tsx

const formSchema = z.object({
  nome_completo: z
    .string({ error: "Nome completo é obrigatório" })
    .max(80, { error: "O limite suportado é de 80 caracteres" })
    .min(2, { error: "Nome completo deve ter pelo menos 2 caracteres" })
    .optional(),
  email: z.email({ error: "Digite um email válido" }).optional(),
});

type EditSchoolUserFormProps = {
  id: number;
  onSuccess: () => void;
};

export default function EditSchoolUserForm({
  id,
  onSuccess,
}: EditSchoolUserFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { update: updateSchoolAdminMutation } = useUpdateSchoolAdmin();
  const {
    mutateAsync: updateSchoolAdmin,
    isPending,
    isSuccess,
  } = updateSchoolAdminMutation;

  const { schoolAdminQuery } = useSchoolAdmin({ schoolAdminId: id });
  const { data: schoolAdminData, isLoading: isSchoolAdminLoading } =
    schoolAdminQuery;

  useEffect(() => {
    if (schoolAdminData) {
      form.reset({
        nome_completo: schoolAdminData.nome_completo || "",
        email: schoolAdminData.email || "",
      });
    }
  }, [form, schoolAdminData]);

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    }
  }, [isSuccess, onSuccess]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const verifiedData = Object.fromEntries(Object.entries(data));

      const payload = verifiedData;

      await updateSchoolAdmin({ schoolAdminId: id, updateData: payload });
    } catch (error) {
      console.error("Erro ao atualizar o usuário da escola:", error);
      if (error instanceof AxiosError) {
        const response = error.response;

        if (Array.isArray(response?.data?.message)) {
          response?.data?.message.map(
            (field: { field: string; message: string[] }) => {
              if (form.control._fields[field.field]) {
                form.setError(field.field as keyof z.infer<typeof formSchema>, {
                  message: field.message.join(", "),
                });
                return;
              }
              form.setError("root", {
                message: `Erro ao atualizar usuário da escola: ${field.message.join(", ")}`,
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
      <Form.Title text="Atualizar Dados do Usuário da Escola" />
      <Form.Main
        form={form}
        onSubmit={onSubmit}
        className="flex flex-col gap-4"
      >
        {isSchoolAdminLoading ? (
          <>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
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
                  placeholder="Escreva aqui o seu nome completo"
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
            <Form.Submit disabled={isPending}>
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Atualizar Dados"
              )}
            </Form.Submit>
          </>
        )}
      </Form.Main>
      <p className="mt-6 w-full text-center text-lg">
        Desistiu de realizar as mordificações?{" "}
        <Link
          className="w-fit font-bold no-underline"
          variant="secondary"
          href="/"
        >
          Voltar
        </Link>
      </p>
    </Form.Wrapper>
  );
}
