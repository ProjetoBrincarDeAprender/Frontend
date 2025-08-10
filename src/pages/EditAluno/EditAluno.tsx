import { StudentEditForm } from "@/components/Forms/EditForms/StudentForm";
import { Header } from "@/components/Header/Header";
import { useParams } from "react-router";

export function EditStudentPage() {
  const { id } = useParams();

  if (!id) {
    return <div>Erro: ID do aluno não fornecido.</div>;
  }

  return (
    <div className="page-whith-header">
      <Header username="Usuario" />

      <div className="page-container">
        <StudentEditForm id={+id} />
      </div>
    </div>
  );
}
