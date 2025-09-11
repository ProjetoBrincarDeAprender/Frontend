import { Form } from "@/components/forms/Root";
import { useUser } from "@/hooks/User/useUser";
import api from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
//import { PasswordInput } from "@/components/ui/password-input";
import { IMaskInput } from "react-imask";

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
    .string()
    .nonempty({ error: "Data de nascimento é obrigatória" })
    .refine((val) => /^\d{2}\/\d{2}\/\d{4}$/.test(val), {
      error: "Formato inválido. Use dd/mm/aaaa",
    })
    .refine(
      (val) => {
        const [dia, mes, ano] = val.split("/").map(Number);
        const date = new Date(ano, mes - 1, dia);
        return (
          date.getFullYear() === ano &&
          date.getMonth() === mes - 1 &&
          date.getDate() === dia
        );
      },
      { error: "Data inexistente" },
    )
    .refine(
      (val) => {
        const [_dia, _mes, ano] = val.split("/").map(Number);
        const year = ano;
        const currentYear = new Date().getFullYear();
        return year >= 1940 && year <= currentYear;
      },
      {
        error: "Data de nascimento inválida",
      },
    )
    .refine(
      (val) => {
        const [dia, mes, ano] = val.split("/").map(Number);
        const today = new Date();
        let age = today.getFullYear() - ano;
        const m = today.getMonth() - (mes - 1);
        if (m < 0 || (m === 0 && today.getDate() < dia)) {
          age--;
        }
        return age >= 5;
      },
      {
        error: "O aluno deve ter pelo menos 5 anos de idade",
      },
    )
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
            tema_preferido: response.data.tema_preferido || "",
            avatar_url: response.data.avatar_url || "",
            data_nascimento: response.data.data_nascimento
              ? (() => {
                  const match = response.data.data_nascimento.match(
                    /^(\d{4})-(\d{2})-(\d{2})/,
                  );
                  if (!match) return "";
                  const [, year, month, day] = match.map(Number);
                  return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
                })()
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
      }),
    );

    const studentPayload = Object.fromEntries(
      Object.entries({
        avatar_url: data.avatar_url?.trim() === "" ? null : data.avatar_url,
        tema_preferido: data.tema_preferido,
        data_nascimento: data.data_nascimento
          ? (() => {
              const [dia, mes, ano] = data.data_nascimento
                .split("/")
                .map(Number);
              return `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
            })()
          : undefined,
      }),
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
          render={({ field, fieldState }) => (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Data de Nascimento</label>
              <IMaskInput
                {...field}
                mask="00/00/0000"
                placeholder="dd/mm/aaaa"
                value={field.value || ""}
                onAccept={(value) => field.onChange(value)}
                className="border-purplish-blue hover:border-purplish-blue flex h-13 w-full rounded-lg border bg-transparent px-6 py-2 text-base text-gray-800 transition-colors duration-200 ease-in-out placeholder:text-gray-500 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
              {fieldState.error && (
                <p className="text-sm text-red-600">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />

        <Form.Field
          form={form}
          name="avatar_url"
          render={({ field }) => (
            <Form.Input
              {...field}
              label="URL do Avatar Personalizado (Opcional)"
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
              label="Tema Preferido (Opcional)"
              placeholder="Ex: Fundo do Mar, Espaço"
            />
          )}
        />
       {user?.perfil == "Admin" && (
          schools ? (
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
            <span>Carregando escolas...</span>
          )
        )}
        <Form.Submit>Atualizar Dados</Form.Submit>
      </Form.Main>
    </Form.Wrapper>
  );
}
