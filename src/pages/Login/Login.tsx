import { Footer } from "../../components/Footer/Footer";
import { Header } from "../../components/Header/Header";
import { SignUpForm } from "../../components/SignUpForm/SignUpForm";

export default function Form() {
  return (
    <>
      <Header />
      <main className="mt-38 mb-10 grid justify-items-center">
        <SignUpForm
          title="Conectar-se"
          fields={[
            {
              name: "email",
              label: "Email",
              type: "email",
              placeholder: "Insira seu email",
            },
            {
              name: "password",
              label: "Senha",
              type: "password",
              placeholder: "Insira sua senha",
            },
          ]}
          buttonText="Entrar"
          onSubmit={(formData) => {
            console.log("Form submitted:", formData);
          }}
          footerLink={{
            text: "Não possui conta?",
            linkText: "Conectar",
            href: "/cadastro",
          }}
        />
      </main>
      <Footer />
    </>
  );
}
