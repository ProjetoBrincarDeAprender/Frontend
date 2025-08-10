import api from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form } from "../Forms/Form/Root";
import type { SignUpFormProps } from "../Forms/SignUpForms/signUpFormProps";
import { Link } from "../utils/Link/Link";
import { IMaskInput } from "react-imask";


const formSchema = z.object({
  nome: z
    .string({ error: "Nome é obrigatório" })
    .max(80, { error: "O limite suportado é de 80 caracteres" })
    .min(2, { error: "Nome da escola deve ter pelo menos 2 caracteres" }),
  descricao: z.string().optional(),
  localizacao: z.string({ error: "O endereço da escola é obrigatório" }),
telefone: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
        return phoneRegex.test(val);
      },
      {
        message: "Formato inválido.",
      },
    ),  email: z.email({ error: "Email inválido" }).optional(),
});

export default function CreateSchoolForm({ onSuccess }: SignUpFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      localizacao: "",
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
        onSuccess();
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
                  { mask: '(00) 0000-0000' },
                  { mask: '(00) 00000-0000' }
                ]}
                value={field.value}
                onAccept={(value: string) => {
                  field.onChange(value);
                }}
                inputRef={field.ref}
                placeholder="(83) 99999-9999"
                className="flex h-13 w-full rounded-lg bg-amber-50 px-6 py-2 text-base text-gray-800 bg-transparent border border-purplish-blue placeholder:text-gray-500 transition-colors ease-in-out duration-200 hover:border-purplish-blue focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              </div>
              {/* <Form.Message /> */}
            </Form.Item>
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
