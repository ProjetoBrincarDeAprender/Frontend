import { ResponsableEditForm } from "@/components/Forms/EditForms/ResponsableForm";
import { Header } from "@/components/Header/Header";
import { useParams } from "react-router";

export function EditResponsablePage() {
  const { id } = useParams();

  if (!id) {
    return <div>Erro: ID do responsável não fornecido.</div>;
  }

  return (
    <div className="page-whith-header">
      <Header />

      <div className="page-container">
        <ResponsableEditForm id={+id} />
      </div>
    </div>
  );
}
