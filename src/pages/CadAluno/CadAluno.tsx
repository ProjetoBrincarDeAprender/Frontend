import { Header } from "@/components/Header/Header";
import { StudentSignUpForm } from "@/components/SignUpForms/StudentForm";

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
