import { Header } from "@/components/Header/Header";
import { TeacherEditForm } from "@/components/EditForms/TeacherForm";

export function EditTeacherPage() {
  return (
    <div className="page-whith-header">
      <Header username="Usuario" />

      <div className="page-container">
        <TeacherEditForm />
      </div>
    </div>
  );
}
