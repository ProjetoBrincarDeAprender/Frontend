import { useState } from "react"; 
import useAuth from "@/hooks/Auth/useAuth";
import { useUser } from "@/hooks/User/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Form } from "@/components/forms/Root";
import { Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  senha: z
    .string()
    .min(8, { message: "Senha deve ter pelo menos 8 caracteres" }) 
    .max(32, { message: "Senha deve ter no máximo 32 caracteres" }),
});

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);

  const { login, profile } = useAuth();
  const { registerUser } = useUser();
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

      if (profileData) {
        registerUser({
          id: profileData.id,
          nome_completo: profileData.nome_completo,
          email: profileData.email,
          perfil: profileData.perfil.nome,
          escola: {
            id: profileData.escolaId || null,
            nome: profileData.escola?.nome || "",
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
            message: response?.data?.message || "Credenciais inválidas ou erro no servidor.",
          });
        }
      } else {
        form.setError("root", { message: "Erro desconhecido. Tente novamente." });
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
          render={({ field }) => (
            <Form.Input
              {...field}
              label="Email"
              placeholder="exemplo@gmail.com"
              className="mb-4"
            />
          )}
        />
        <Form.Field
          form={form}
          name="senha"
          render={({ field }) => (
            <div className="relative w-full">
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
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          )}
        />
        
        <Form.Submit>Entrar</Form.Submit>
      </Form.Main>
    </Form.Wrapper>
  );
}