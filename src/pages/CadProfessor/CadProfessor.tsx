import TeacherSignUpForm from "@/components/features/users/teacher/create/TeacherCreateForm";
import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import "./CadProfessor.css";

export function RegisterProfessorPage() {
  return (
    <div className="page-with-header">
      <Header />

      <div className="page-container">
        <TeacherSignUpForm />
      </div>
      <Footer />
    </div>
  );
}
