import { Header } from "@/components/header/Header";
import EditSchoolForm from "@/components/features/users/school/edit/SchoolEditForm";
import { useParams } from "react-router";

export function EditSchoolPage() {
  const { id } = useParams();

  if (!id) {
    return <div>Erro: ID do aluno não fornecido.</div>;
  }

  return (
    <div className="page-whith-header">
      <Header />

      <div className="page-container">
        <EditSchoolForm id={+id} />
      </div>
    </div>
  );
}
