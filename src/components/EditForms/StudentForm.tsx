/* eslint-disable @typescript-eslint/no-unused-vars */
import api from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";
import { Form } from "../Form/Root";

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
  tema_preferido: z.string({ error: "Insira um tema válido" }),
  data_nascimento: z.string({
    error: "Data de nascimento é obrigatória",
  }),
});

type StudentFormProps = {
  id: number;
};

export function StudentEditForm({ id }: StudentFormProps) {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/student/list/${id}`);

        if (response.status === 200) {
          const studentData = {
            ...response.data,
            avatar_url: response.data.avatar_url || "",
            data_nascimento: response.data.data_nascimento.split("T")[0],
          };
          form.reset(studentData);
          console.log(form.formState);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Erro ao buscar dados do usuário:", error.message);
          form.setError("root", {
            message:
              "Erro ao buscar dados do usuário. Tente novamente mais tarde.",
          });
        }
      }
    };

    fetchUserData();
  }, [id, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const userPayload = Object.fromEntries(
      Object.entries({
        nome_completo: data.nome_completo,
        email: data.email,
      }).filter(([_, value]) => value !== undefined && value !== ""),
    );

    const studentPayload = Object.fromEntries(
      Object.entries({
        avatar_url: data.avatar_url,
        tema_preferido: data.tema_preferido,
        data_nascimento: new Date(data.data_nascimento).toISOString(),
      }).filter(([_, value]) => value !== undefined && value !== ""),
    );

    try {
      const userResponse = await api.put(`/user/update/${id}`, userPayload);

      const studentResponse = await api.put(
        `/student/update/${id}`,
        studentPayload,
      );

      if (studentResponse.status === 201 && userResponse.status === 201) {
        navigate("/login");
      }
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
          render={({ field }) => (
            <Form.Input
              {...field}
              label="Data de Nascimento"
              placeholder=""
              type="date"
            />
          )}
        />
        <Form.Field
          form={form}
          name="avatar_url"
          render={({ field }) => (
            <Form.Input
              {...field}
              label="URL do Avatar Personalizado"
              placeholder="https://urlDoAvatarPersonalizado.jpg"
              type="text"
            />
          )}
        />
        <Form.Field
          form={form}
          name="tema_preferido"
          render={({ field }) => (
            <Form.Select
              label="Tema Preferido"
              placeholder="Selecione um tema"
              options={[
                { value: "SISTEMA", label: "Sistema" },
                { value: "ESCURO", label: "Escuro" },
                { value: "CLARO", label: "Claro" },
              ]}
              onChange={field.onChange}
              defaultValue={field.value}
            />
          )}
        />
        <Form.Submit>Atualizar Dados</Form.Submit>
      </Form.Main>
    </Form.Wrapper>
  );
}
