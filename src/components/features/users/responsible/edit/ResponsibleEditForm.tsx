import { useUser } from "@/hooks/User/useUser";
import api from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../../../../forms/Root";

const formSchema = z.object({
  nome_completo: z
    .string({ error: "Nome completo é obrigatório" })
    .max(80, { error: "O limite suportado é de 80 caracteres" })
    .min(2, { error: "Nome completo deve ter pelo menos 2 caracteres" }),
  email: z.email({ error: "Digite um email válido" }),
  escolaId: z.string().optional(),
});

type ResponsableFormProps = {
  id: number;
  onSuccess: () => void;
};

export function ResponsableEditForm({ id, onSuccess }: ResponsableFormProps) {
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
        const response = await api.get(`/user/list/${id}`);

        if (response.status === 200) {
          const userData = {
            ...response.data,
          };
          form.reset(userData);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Erro ao buscar dados do usuário:", error.message);
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

    fetchUserData();
    if (user?.perfil == "Admin") {
      fetchSchools();
    }
  }, [id, form, user?.perfil]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const payload = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== undefined && value !== "",
      ),
    );

    try {
      const response = await api.put(`/user/update/${id}`, payload);

      if (response.status === 200) {
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
              placeholder="Modificar nome completo"
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
        {user?.perfil == "Admin" && schools && (
          <Form.Field
            form={form}
            name="escolaId"
            render={({ field }) => (
              <Form.Select
                {...field}
                label="Escola"
                placeholder="Selecione a Escola"
                options={schools.map((school) => ({
                  value: String(school.id),
                  label: school.nome,
                }))}
              />
            )}
          />
        )}
        <Form.Submit>Atualizar Dados</Form.Submit>
      </Form.Main>
    </Form.Wrapper>
  );
}
