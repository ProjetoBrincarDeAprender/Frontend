/* eslint-disable @typescript-eslint/no-unused-vars */
import api from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form } from "../Form/Root";
import { Link } from "../utils/Link/Link";

const formSchema = z.object({
  nome: z
    .string({ error: "Nome é obrigatório" })
    .max(80, { error: "O limite suportado é de 80 caracteres" })
    .min(2, { error: "Nome da escola deve ter pelo menos 2 caracteres" })
    .optional(),
  descricao: z.string().optional(),
  localizacao: z.string({ error: "O endereço da escola é obrigatório" }),
  telefone: z.string().refine(
    (val) => {
      const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
      return phoneRegex.test(val);
    },
    { message: "Telefone inválido" },
  ),
  email: z.email({ error: "Email inválido" }),
  usuariosIds: z
    .string()
    .refine(
      (val) => {
        const ids = val.split(",").map((id) => id.trim());
        return ids.every((id) => !isNaN(Number(id)));
      },
      { message: "IDs de usuários inválidos" },
    )
    .optional(),
});

type EditSchoolFormProps = {
  id: number;
};

export default function EditSchoolForm({ id }: EditSchoolFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/school/list/${id}`);

        if (response.status === 200) {
          const formData = {
            nome: response.data.nome || "",
            descricao: response.data.descricao || "",
            localizacao: response.data.localizacao || "",
            telefone: response.data.telefone || "",
            email: response.data.email || "",
            usuariosIds: response.data.usuarios
              ? response.data.usuarios
                  .map((user: { id: number }) => user.id)
                  .join(", ")
              : "",
          };
          console.log(formData);
          form.reset(formData);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Erro ao buscar dados da escola:", error.message);
        }
      }
    };

    fetchData();
  }, [id, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const verifyData = Object.fromEntries(
        Object.entries(data).filter(
          ([_, value]) => value !== undefined && value !== null,
        ),
      );

      const payload = {
        ...verifyData,
        usuariosIds: verifyData.usuariosIds
          ? verifyData.usuariosIds.split(",").map((id) => Number(id.trim()))
          : [],
      };

      const response = await api.put(`/school/update/${id}`, payload);

      if (response.status === 200) {
        alert("Escola atualizada com sucesso!");
      }
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
          name="usuariosIds"
          render={({ field }) => (
            <Form.Input
              {...field}
              label="Usuários"
              placeholder="IDs dos usuários"
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
          href="/home"
        >
          Voltar
        </Link>
      </p>
    </Form.Wrapper>
  );
}
