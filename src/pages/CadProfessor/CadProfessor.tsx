import { Header } from "../../components/Header/Header";
import { SignUpForm } from "../../components/SignUpForm/SignUpForm";
import "./CadProfessor.css";

export function RegisterProfessorPage() {
  const professorFields = [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "exemplo@gmail.com",
    },
    {
      name: "fullName",
      label: "Nome Completo",
      type: "text",
      placeholder: "Nome completo",
    },
    { name: "birthDate", label: "Data de Nascimento", type: "date" },
    {
      name: "avatarUrl",
      label: "Avatar Personalizado (URL)",
      type: "url",
      placeholder: "https://www.url.com/",
    },
    {
      name: "password",
      label: "Senha",
      type: "password",
      placeholder: "Senha",
    },
  ] as const;

  const handleRegisterProfessor = (formData: Record<string, string>) => {
    console.log("Dados do formulário do professor:", formData);
    //

    //
    alert("Cadastro enviado! Verifique o console para ver os dados.");
  };

  return (
    <div className="page-whith-header">
      <Header username="Usuario" />

      <div className="page-container">
        <SignUpForm
          title="Cadastrar Novo(a) Professor(a)"
          fields={professorFields}
          buttonText="Cadastrar"
          onSubmit={handleRegisterProfessor}
          footerLink={{
            text: "O(a) professor(a), já possui conta?",
            linkText: "Voltar",
            href: "/login",
          }}
        />
      </div>
    </div>
  );
}
