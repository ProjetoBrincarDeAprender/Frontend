import { Footer } from "@/components/Footer/Footer";
import { Form } from "@/components/forms/Root";
import { Header } from "@/components/Header/Header";
import api from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import z from "zod";

const formSchema = z
  .object({
    password: z
      .string("A nova senha é obrigatória")
      .min(8, "A senha deve ter no mínimo 8 caracteres"),
    confirmPassword: z
      .string("A confirmação de senha é obrigatória")
      .min(8, "A confirmação de senha deve ter no mínimo 8 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export function RecoverPassword() {
  const [searchParams, _] = useSearchParams();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  if (!searchParams.get("token")) {
    navigate("/login", { replace: true });
    return;
  }

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await api.post("/auth/reset-password", {
        token: searchParams.get("token"),
        senha: data.password,
      });

      if (response.status === 200) {
        toast.success("Senha alterada com sucesso!");
        navigate("/login", { replace: true });
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status == 401) {
          toast.error("Token inválido ou expirado.");
          return navigate("/login", { replace: true });
        }
      }
      toast.error("Erro ao alterar a senha.");
    }
  };

  return (
    <>
      <Header />
      <main className="mt-38 mb-10 grid justify-items-center">
        <Form.Wrapper>
          <Form.Title text="Recuperar Senha" />
          <Form.Main form={form} onSubmit={handleSubmit} className="space-y-4">
            <Form.Field
              name="password"
              form={form}
              render={({ field }) => (
                <Form.PasswordInput
                  {...field}
                  label="Nova Senha"
                  placeholder="Digite sua nova senha"
                />
              )}
            />
            <Form.Field
              name="confirmPassword"
              form={form}
              render={({ field }) => (
                <Form.PasswordInput
                  {...field}
                  label="Confirmar Nova Senha"
                  placeholder="Confirme sua nova senha"
                />
              )}
            />
            <Form.Submit>Redefinir Senha</Form.Submit>
          </Form.Main>
        </Form.Wrapper>
      </main>
      <Footer />
    </>
  );
}
