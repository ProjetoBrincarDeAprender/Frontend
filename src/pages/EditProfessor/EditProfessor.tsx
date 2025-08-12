import { TeacherEditForm } from "@/components/features/users/teacher/edit/TeacherEditForm";
import { Header } from "@/components/header/Header";
import { useParams } from "react-router";

export function EditTeacherPage() {
  const { id } = useParams();

  if (!id) {
    return <div>Erro: ID do professor não fornecido.</div>;
  }

  return (
    <div className="page-whith-header">
      <Header />

      <div className="page-container">
        <TeacherEditForm id={+id} />
      </div>
    </div>
  );
}
