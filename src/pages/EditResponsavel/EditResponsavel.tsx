import { Header } from "@/components/Header/Header";
import { ResponsableEditForm } from "@/components/EditForms/ResponsableForm";

export function EditResponsablePage() {
  return (
    <div className="page-whith-header">
      <Header username="Usuario" />

      <div className="page-container">
        <ResponsableEditForm />
      </div>
    </div>
  );
}
