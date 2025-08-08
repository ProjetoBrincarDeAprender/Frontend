import api from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form } from "../Forms/Form/Root";
import { Link } from "../utils/Link/Link";

const formSchema = z.object({
  nome: z
    .string({ error: "Nome é obrigatório" })
    .max(80, { error: "O limite suportado é de 80 caracteres" })
    .min(2, { error: "Nome da escola deve ter pelo menos 2 caracteres" }),
  descricao: z.string().optional(),
  endereco: z.string({ error: "O endereço da escola é obrigatório" }),
  telefone: z.string().optional(),
  email: z.email({ error: "Email inválido" }).optional(),
});

export default function CreateSchoolForm() {
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
      const payload = {
        ...data,
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
      <Form.Title text="Cadastrar Nova Escola" />
      <Form.Main
        form={{ ...form }}
        onSubmit={onSubmit}
        className="flex flex-col gap-4"
      >
        <Form.Field
          form={form}
          name="nome_escola"
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
          name="sigla"
          render={({ field }) => (
            <Form.Input
              {...field}
              label="Sigla da Instituição"
              placeholder="UEPB"
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
          name="endereco"
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
            <Form.Input
              {...field}
              label="Número da Instituição"
              placeholder="83999399089"
              type="tel"
            />
          )}
        />
        <Form.Field
          form={form}
          name="senha"
          render={({ field }) => (
            <Form.Input
              {...field}
              label="Senha"
              placeholder="Senha"
              type="password"
            />
          )}
        />
        <Form.Field
          form={form}
          name="confirmar_senha"
          render={({ field }) => (
            <Form.Input
              {...field}
              label="Confirmar Senha"
              placeholder="Confirmar Senha"
              type="password"
            />
          )}
        />
        <Form.Submit>Criar Conta</Form.Submit>
      </Form.Main>
      <p className="mt-6 w-full text-center text-lg">
        A escola já possui uma conta?{" "}
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
