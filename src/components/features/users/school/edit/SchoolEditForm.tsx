import { Form } from "@/components/forms/Root";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/components/utils/Link/Link";
import { useSchool } from "@/hooks/School/useSchool";
import { useUpdateSchool } from "@/hooks/School/useUpdateSchool";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { IMaskInput } from "react-imask";
import z from "zod";

const formSchema = z.object({
  nome: z
    .string({ error: "Nome é obrigatório" })
    .max(80, { error: "O limite suportado é de 80 caracteres" })
    .min(2, { error: "Nome da escola deve ter pelo menos 2 caracteres" })
    .optional(),
  descricao: z.string().optional(),
  localizacao: z
    .string({ error: "O endereço da escola é obrigatório" })
    .min(1, { message: "A localização da escola é obrigatória" }),
  telefone: z
    .string()
    .refine(
      (val) => {
        const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
        return phoneRegex.test(val);
      },
      { message: "Telefone inválido" },
    )
    .optional(),
  email: z.email({ error: "Email inválido" }).optional(),
});

type EditSchoolFormProps = {
  id: number;
  onSuccess: () => void;
};

export default function EditSchoolForm({ id, onSuccess }: EditSchoolFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { update: updateSchoolMutation } = useUpdateSchool();
  const {
    mutateAsync: updateSchool,
    isPending,
    isSuccess,
  } = updateSchoolMutation;

  const { schoolQuery } = useSchool({ schoolId: id });
  const { data: schoolData, isLoading: isSchoolLoading } = schoolQuery;

  useEffect(() => {
    if (schoolData) {
      form.reset({
        nome: schoolData.nome || "",
        descricao: schoolData.descricao ?? undefined,
        localizacao: schoolData.localizacao || "",
        telefone: schoolData.telefone || "",
        email: schoolData.email || "",
      });
    }
  }, [schoolData, form]);

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    }
  }, [isSuccess, onSuccess]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        ...data,
        descricao: data.descricao?.trim() === "" ? undefined : data.descricao,
        nome: data.nome?.trim() || undefined,
        localizacao: data.localizacao?.trim() || undefined,
        email: data.email?.trim() || undefined,
        telefone: data.telefone?.trim() || undefined,
      };

      await updateSchool({ schoolId: id, data: payload });
    } catch (error) {
      console.error("Erro ao atualizar escola:", error);
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
                message: `Erro ao atualizar escola: ${field.message.join(", ")}`,
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
      <Form.Title text="Atualizar Dados da Escola" />
      <Form.Main
        form={form}
        onSubmit={onSubmit}
        className="flex flex-col gap-4"
      >
        {isSchoolLoading ? (
          <div className="flex flex-col gap-4">
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
        ) : (
          <>
            <Form.Field
              form={form}
              name="nome"
              render={({ field }) => (
                <Form.Input
                  {...field}
                  label="Nome da Instituição"
                  placeholder="Universidade Estadual da Paraíba"
                />
              )}
            />

            <Form.Field
              form={form}
              name="descricao"
              render={({ field }) => (
                <Form.Input
                  {...field}
                  label="Descrição da Instituição (Opcional)"
                  placeholder="Escreva aqui a descrição"
                />
              )}
            />
            <Form.Field
              form={form}
              name="localizacao"
              render={({ field }) => (
                <Form.Input
                  {...field}
                  label="Endereço da Instituição"
                  placeholder="Ex: Rua Manoel Mendes dos Santos, 54"
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
              name="telefone"
              render={({ field }) => (
                <Form.Item>
                  <div className="flex w-full flex-col gap-2">
                    <label htmlFor="telefone" className="text-sm font-medium">
                      Telefone
                    </label>
                    <IMaskInput
                      mask={[
                        { mask: "(00) 0000-0000" },
                        { mask: "(00) 00000-0000" },
                      ]}
                      value={field.value || ""}
                      onAccept={(value: string) => {
                        field.onChange(value);
                      }}
                      placeholder="(83) 99999-9999"
                      className="border-purplish-blue hover:border-purplish-blue flex h-13 w-full rounded-lg border bg-transparent px-6 py-2 text-base text-gray-800 transition-colors duration-200 ease-in-out placeholder:text-gray-500 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </Form.Item>
              )}
            />
            <Form.Submit disabled={isPending}>
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Atualizar Escola"
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
