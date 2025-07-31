import { Header } from "../../components/Header/Header";
import { SignUpForm } from "../../components/SignUpForm/SignUpForm";
import "../CadProfessor/CadProfessor.css";

export function RegisterStudentPage() {
  const studentFields = [
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
      placeholder: "Exemplo exemplo",
    },
    {
      name: "birthDate",
      label: "Data de Nascimento",
      type: "date",
      placeholder: "xx/xx/xxxx",
    },
    {
      name: "avatarUrl",
      label: "Avatar Personalizado (URL)",
      type: "url",
      placeholder: "https://www.url.com/",
    },
    {
      name: "preferredTheme",
      label: "Tema Preferido",
      type: "text",
      placeholder: "Insira aqui",
    },
    {
      name: "password",
      label: "Senha",
      type: "password",
      placeholder: "********",
    },
  ] as const;

  const handleRegisterStudent = (formData: Record<string, string>) => {
    console.log("Dados do formulário do aluno:", formData);

    alert("Cadastro de aluno enviado! Verifique o console para ver os dados.");
  };

  return (
    <div className="page-whith-header">
      <Header username="Usuario" />

      <div className="page-container">
        <SignUpForm
          title="Cadastrar Novo Aluno"
          fields={studentFields}
          buttonText="Concluir"
          onSubmit={handleRegisterStudent}
          footerLink={{
            text: "O aluno já possui conta?",
            linkText: " Voltar",
            href: "/login",
          }}
        />
      </div>
    </div>
  );
}
