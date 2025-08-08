import { Header } from "@/components/Header/Header";
import EditSchoolForm from "@/components/School/EditForm";
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
