import { StudentSignUpForm } from "@/components/features/users/students/create/StudentCreateForm";
import { Header } from "@/components/header/Header";

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
