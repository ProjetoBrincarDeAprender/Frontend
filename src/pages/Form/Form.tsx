import { api } from "@/utils/api";
import { Footer } from "../../components/Footer/Footer";
import { SignUpForm } from "../../components/Form/SignUpForm";
import { Header } from "../../components/Header/Header";

export default function Form() {
  return (
    <>
      <Header />
      <main className="mt-38 mb-10 grid justify-items-center">
        <SignUpForm
          onSubmit={async (data) => {
            const result = await api.post("/user/register", data);

            console.log(result);
          }}
          title="Sign Up"
          fields={[
            {
              name: "nome_completo",
              label: "Nome Completo",
              type: "text",
              placeholder: "Enter your nome completo",
            },
            {
              name: "email",
              label: "Email",
              type: "email",
              placeholder: "Enter your email",
            },
            {
              name: "senha",
              label: "Senha",
              type: "password",
              placeholder: "Enter your senha",
            },
            {
              name: "confirmar_senha",
              label: "Confirmar Senha",
              type: "password",
              placeholder: "Enter your confirmar senha",
            },
          ]}
          buttonText="Create Account"
          footerLink={{
            text: "Already have an account?",
            linkText: "Log in",
            href: "/login",
          }}
        />
      </main>
      <Footer />
    </>
  );
}
