import { Form } from "@/components/forms/Root";
import { Link } from "@/components/utils/Link/Link";
import api from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/user/list/${id}`);

        if (response.status === 200) {
          const formData = {
            nome_completo: response.data.nome_completo || "",
            email: response.data.email || "",
          };
          form.reset(formData);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error(
            "Erro ao buscar dados do usuário da escola:",
            error.message,
          );
        }
      }
    };

    fetchData();
  }, [id, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      console.log("Dados enviados:", data);
      const verifiedData = Object.fromEntries(
        Object.entries(data).filter(
          ([_, value]) => value !== undefined && value !== null,
        ),
      );

      const payload = verifiedData;

      const response = await api.put(`/user/update/${id}`, payload);

      if (response.status === 200) {
        onSuccess();
      }
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
        <Form.Submit>Atualizar Dados</Form.Submit>
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
