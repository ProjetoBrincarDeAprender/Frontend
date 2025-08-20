import { Form } from "@/components/forms/Root";
import { useUser } from "@/hooks/User/useUser";
import api from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PasswordInput } from "@/components/ui/password-input";


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
    .string({
      error: "Data de nascimento é obrigatória",
    })
    .optional(),
  escolaId: z.string().optional(),
});

type StudentFormProps = {
  id: number;
  onSuccess: () => void;
};

export function StudentEditForm({ id, onSuccess }: StudentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { user } = useUser();
  const [schools, setSchools] = useState<{ id: number; nome: string }[] | null>(
    null,
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/student/list/${id}`);

        if (response.status === 200) {
          const studentData = {
            nome_completo: response.data.nome_completo,
            email: response.data.email,
            tema_preferido: response.data.tema_preferido,
            avatar_url: response.data.avatar_url || "",
            data_nascimento: response.data.data_nascimento
              ? response.data.data_nascimento.split("T")[0]
              : "",
            escolaId: String(response.data.escolaId) || "",
          };
          form.reset(studentData);
        }
      } catch (error) {
        console.log(error);
        if (error instanceof AxiosError) {
          console.error("Erro ao buscar dados do usuário:", error.message);
          form.setError("root", {
            message:
              "Erro ao buscar dados do usuário. Tente novamente mais tarde.",
          });
        }
      }
    };
    const fetchSchools = async () => {
      try {
        const response = await api.get("/school/list");

        if (response.status === 200) {
          setSchools(response.data);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          form.setError("root", {
            message: `Erro ao carregar escolas: ${error.message}`,
          });
        }
      }
    };

    if (user?.perfil == "Admin") {
      fetchSchools();
    }
    fetchUserData();
  }, [id, form, user?.perfil]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const userPayload = Object.fromEntries(
      Object.entries({
        nome_completo: data.nome_completo,
        email: data.email,
        escolaId: user?.perfil == "Admin" ? data.escolaId : undefined,
      }).filter(([_, value]) => value !== undefined && value !== ""),
    );

    const studentPayload = Object.fromEntries(
      Object.entries({
        avatar_url: data.avatar_url,
        tema_preferido: data.tema_preferido,
        data_nascimento: data.data_nascimento
          ? new Date(data.data_nascimento).toISOString()
          : undefined,
      }).filter(([_, value]) => value !== undefined && value !== ""),
    );

    try {
      const userResponse = await api.put(`/user/update/${id}`, userPayload);

      const studentResponse = await api.put(
        `/student/update/${id}`,
        studentPayload,
      );

      if (studentResponse.status === 200 && userResponse.status === 200) {
        onSuccess();
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
            <Form.Input
              {...field}
              label="Tema Preferido"
              placeholder="Ex: Fundo do Mar, Espaço"
            />
          )}
        />
        {user?.perfil == "Admin" && schools ? (
          <Form.Field
            form={form}
            name="escolaId"
            render={({ field }) => (
              <Form.Select
                value={String(field.value)}
                onChange={field.onChange}
                label="Escola"
                placeholder="Selecione a Escola"
                options={schools.map((school) => ({
                  value: String(school.id),
                  label: school.nome,
                }))}
              />
            )}
          />
        ) : (
          <span>Loading...</span>
        )}
        <Form.Submit>Atualizar Dados</Form.Submit>
      </Form.Main>
    </Form.Wrapper>
  );
}
