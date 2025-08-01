import useAuth from "@/hooks/Auth/useAuth";
import api from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form } from "../Form/Root";

const formSchema = z.object({
  nome: z.string({ error: "Nome é obrigatório" }),
  descricao: z.string().optional(),
  endereco: z.string().optional(),
  telefone: z.string().optional(),
  email: z.email({ error: "Email inválido" }).optional(),
});

export default function CreateSchoolForm() {
  const { profile } = useAuth();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      endereco: "",
      telefone: "",
      email: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const userProfile = await profile();

      const payload = {
        ...data,
        usuariosIds: [userProfile?.id],
      };

      const response = await api.post("/school/register", payload);
      if (response.status === 201) {
        form.reset();
        alert("Escola criada com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao criar escola:", error);
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
      <Form.Title text="Criar Escola" />
      <Form.Main onSubmit={onSubmit} form={form}>
        <Form.Field
          form={form}
          name="nome"
          render={({ field }) => (
            <Form.Input required label="Nome" {...field} />
          )}
        />
        <Form.Field
          form={form}
          name="descricao"
          render={({ field }) => <Form.Input label="Descrição" {...field} />}
        />
        <Form.Field
          form={form}
          name="endereco"
          render={({ field }) => <Form.Input label="Endereço" {...field} />}
        />
        <Form.Field
          form={form}
          name="telefone"
          render={({ field }) => <Form.Input label="Telefone" {...field} />}
        />
        <Form.Field
          form={form}
          name="email"
          render={({ field }) => <Form.Input label="Email" {...field} />}
        />
        <Form.Submit>Cadastrar</Form.Submit>
      </Form.Main>
    </Form.Wrapper>
  );
}
