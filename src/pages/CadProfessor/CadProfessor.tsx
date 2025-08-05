import { Footer } from "@/components/Footer/Footer";
import { TeacherSignUpForm } from "@/components/SignUpForms/TeacherForm";
import { Header } from "../../components/Header/Header";
import "./CadProfessor.css";

export function RegisterProfessorPage() {
  return (
    <div className="page-with-header">
      <Header username="Usuario" />

      <div className="page-container">
        <TeacherSignUpForm />
      </div>
      <Footer />
    </div>
  );
}
