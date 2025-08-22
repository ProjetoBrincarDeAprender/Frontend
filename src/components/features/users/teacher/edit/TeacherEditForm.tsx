import { FancyMultiSelect } from "@/components/forms/MultiSelect";
import { Form } from "@/components/forms/Root";
import { useUser } from "@/hooks/User/useUser";
import api from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
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
});

type TeacherFormProps = {
  id: number;
  onSuccess: () => void;
};

export function TeacherEditForm({ id, onSuccess }: TeacherFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { user } = useUser();
  const [schools, setSchools] = useState<{ id: number; nome: string }[] | null>(
    null,
  );
  const [students, setStudents] = useState<
    { id: number; nome_completo: string; email: string }[] | null
  >(null);
  const [allStudents, setAllStudents] = useState<
    { id: number; nome_completo: string; email: string }[] | null
  >(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/user/list/${id}`);

        if (response.status === 200) {
          const userData = {
            nome_completo: response.data.nome_completo,
            email: response.data.email,
            escolaId: String(response.data.escolaId) || "",
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
    const fetchRelations = async () => {
      try {
        const response = await api.get(`/responsible/list/${id}/students`);
        if (response.status == 200) {
          const users = response.data;
          setStudents(users);
          const originalIds = users.map((user: { id: number }) =>
            String(user.id),
          );
          form.setValue("usersIds", originalIds);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchAllStudents = async () => {
      try {
        const response = await api.get(
          `/user/list?type=Aluno${user?.perfil == "Admin" ? "" : `&escolaId=${user?.escola?.id}`}`,
        );
        if (response.status == 200) {
          const users = response.data;
          setAllStudents(users);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchRelations();
    fetchAllStudents();
    if (user?.perfil == "Admin") {
      fetchSchools();
    }
    fetchUserData();
  }, [id, form, user?.perfil, user?.escola?.id]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const userData = {
      nome_completo: data.nome_completo,
      email: data.email,
      escolaId: data.escolaId,
    };

    const userPayload = Object.fromEntries(
      Object.entries(userData).filter(
        ([_, value]) => value !== undefined && value !== "",
      ),
    );

    try {
      const responseUser = await api.put(`/user/update/${id}`, userPayload);

      await api.put(`/responsible/update/${id}`, {
        usersIds: data.usersIds?.map((id) => Number(id)) || [],
      });

      if (responseUser.status === 200) {
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
      <Form.Title text="Atualizar Dados do(a) Professor(a)" />
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
              placeholder="Mudar nome do(a) professor(a)"
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
        {allStudents && students && (
          <Form.Field
            form={form}
            name="usersIds"
            render={({ field }) => (
              <FancyMultiSelect
                onSelect={field.onChange}
                label="Alunos do Professor"
                placeholder="Selecione os alunos do professor..."
                data={allStudents.map(({ id, email }) => ({
                  value: String(id),
                  label: email,
                }))}
                preSelectedData={students.map(({ id, email }) => ({
                  value: String(id),
                  label: email,
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
