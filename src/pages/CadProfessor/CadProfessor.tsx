import { Footer } from "@/components/footer/Footer";
import TeacherSignUpForm from "@/components/features/users/teacher/create/TeacherCreateForm";
import { Header } from "../../components/header/Header";
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
