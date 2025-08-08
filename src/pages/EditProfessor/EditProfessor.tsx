import { TeacherEditForm } from "@/components/EditForms/TeacherForm";
import { Header } from "@/components/Header/Header";
import { useParams } from "react-router";

export function EditTeacherPage() {
  const { id } = useParams();

  if (!id) {
    return <div>Erro: ID do professor não fornecido.</div>;
  }

  return (
    <div className="page-whith-header">
      <Header username="Usuario" />

      <div className="page-container">
        <TeacherEditForm id={+id} />
      </div>
    </div>
  );
}
