import { Header } from "@/components/Header/Header";
import { StudentEditForm } from "@/components/EditForms/StudentForm";

export function EditResponsablePage() {
  return (
    <div className="page-whith-header">
      <Header username="Usuario" />

      <div className="page-container">
        <StudentEditForm />
      </div>
    </div>
  );
}
