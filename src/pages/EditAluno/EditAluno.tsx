import { StudentEditForm } from "@/components/features/users/students/edit/StudentEditForm";
import { Header } from "@/components/header/Header";
import { useParams } from "react-router";

export function EditStudentPage() {
  const { id } = useParams();

  if (!id) {
    return <div>Erro: ID do aluno não fornecido.</div>;
  }

  return (
    <div className="page-whith-header">
      <Header />

      <div className="page-container">
        <StudentEditForm id={+id} />
      </div>
    </div>
  );
}
