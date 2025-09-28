import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { Form } from "@/components/forms/Root";
import api from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  email: z.email("E-mail inválido").min(1, "E-mail é obrigatório"),
});

export function SendPasswordToken() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await api.post("/auth/get-password-token", {
        email: data.email,
      });

      if (response.status === 200) {
        toast.success("E-mail enviado com sucesso!");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      form.setError("email", {
        type: "manual",
        message:
          "Não foi possível enviar o e-mail. Verifique se o e-mail está correto.",
      });
    }
  };

  return (
    <>
      <Header />
      <main className="mt-38 mb-10 grid justify-items-center">
        <Form.Wrapper>
          <Form.Title text="Recuperar Senha" />
          <p className="mb-4 text-center">
            Informe seu endereço de e-mail cadastrado para que possamos enviar
            as instruções de recuperação de senha.
          </p>
          <Form.Main form={form} onSubmit={handleSubmit}>
            <Form.Field
              name="email"
              form={form}
              render={({ field }) => (
                <Form.Input
                  {...field}
                  label="E-mail"
                  placeholder="Digite seu e-mail"
                  type="text"
                />
              )}
            />
            <Form.Submit>Enviar</Form.Submit>
          </Form.Main>
        </Form.Wrapper>
      </main>
      <Footer />
    </>
  );
}
