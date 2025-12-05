import { Form } from "@/components/forms/Root";
import { Link } from "@/components/utils/Link/Link";
import useAuth from "@/hooks/Auth/useAuth";
import { useUser } from "@/hooks/User/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  login: z.string().min(1, "Login é obrigatório"),
  senha: z
    .string()
    .min(8, { message: "Senha deve ter pelo menos 8 caracteres" })
    .max(32, { message: "Senha deve ter no máximo 32 caracteres" }),
});

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, profile } = useAuth();
  const { registerUser } = useUser();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      senha: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await login(data.login, data.senha);
      const profileData = await profile();

      if (profileData) {
        registerUser({
          codigo_usuario: profileData.codigo_usuario,
          nome_completo: profileData.nome_completo,
          email: profileData.email,
          perfil: profileData.perfil,
          escola: {
            id: profileData.escolaId || null,
            nome: profileData.escola || "",
          },
        });
        toast.success("Login realizado com sucesso!");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const response = error.response;
        if (Array.isArray(response?.data?.message)) {
          response?.data?.message.forEach(
            (field: { field: string; message: string[] }) => {
              if (field.field in form.getValues()) {
                form.setError(field.field as keyof z.infer<typeof formSchema>, {
                  message: field.message.join(", "),
                });
              }
            },
          );
        } else {
          form.setError("root", {
            message:
              response?.data?.message ||
              "Credenciais inválidas ou erro no servidor.",
          });
        }
      } else {
        form.setError("root", {
          message: "Erro desconhecido. Tente novamente.",
        });
      }
    }
  };

  return (
    <Form.Wrapper>
      <Form.Title text="Entrar" />
      <Form.Main form={form} onSubmit={onSubmit}>
        <Form.Field
          form={form}
          name="login"
          render={({ field }) => (
            <Form.Input
              {...field}
              label="Login"
              placeholder="Insira sua matrícula"
            />
          )}
        />
        <Form.Field
          form={form}
          name="senha"
          render={({ field }) => (
            <div className="relative mt-4 w-full">
              <Form.Input
                {...field}
                label="Senha"
                placeholder="Digite sua senha"
                type={showPassword ? "text" : "password"}
                className="mb-4"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-9 right-3 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          )}
        />

        <Form.Submit>Entrar</Form.Submit>
      </Form.Main>
      <p className="mt-4 text-sm text-gray-600">
        Não lembra a sua senha?{" "}
        <Link variant="secondary" href="/get-password-token">
          Recuperar senha
        </Link>
      </p>
    </Form.Wrapper>
  );
}
