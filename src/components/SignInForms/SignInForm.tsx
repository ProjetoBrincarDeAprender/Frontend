import useAuth from "@/hooks/Auth/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import z from "zod";
import { Form } from "../Form/Root";

const formSchema = z.object({
  email: z.email({ error: "Email inválido" }),
  senha: z
    .string({ error: "Senha deve ter entre 8 e 32 caracteres" })
    .min(8, { error: "Senha deve ter pelo menos 8 caracteres" })
    .max(32, { error: "Senha deve ter no máximo 32 caracteres" }),
});

export default function SignInForm() {
  const { login, profile } = useAuth();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await login(data.email, data.senha);
      const profileData = await profile();

      // aqui coloca o redirecionamento para a pagina do perfil
      if (profileData) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("Error during sign-in:", error);
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
                message: response?.data?.message || "Erro desconhecido",
              });
            },
          );
        } else {
          form.setError("root", {
            message: response?.data?.message || "Erro desconhecido",
          });
        }
      } else {
        form.setError("root", { message: "Erro desconhecido" });
      }
    }
  };

  return (
    <Form.Wrapper>
      <Form.Title text="Entrar" />
      <Form.Main form={form} onSubmit={onSubmit}>
        <Form.Field
          form={form}
          name="email"
          render={({ field }) => <Form.Input label="Email" {...field} />}
        />
        <Form.Field
          form={form}
          name="senha"
          render={({ field }) => <Form.Input label="Senha" {...field} />}
        />
        <Form.Submit>Entrar</Form.Submit>
      </Form.Main>
    </Form.Wrapper>
  );
}
