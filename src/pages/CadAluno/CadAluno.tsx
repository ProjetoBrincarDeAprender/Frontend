import { StudentSignUpForm } from "@/components/Forms/SignUpForms/StudentForm";
import { Header } from "@/components/Header/Header";

export function RegisterStudentPage() {
  return (
    <div className="page-whith-header">
      <Header username="Usuario" />

      <div className="page-container">
        <StudentSignUpForm />
      </div>
    </div>
  );
}
