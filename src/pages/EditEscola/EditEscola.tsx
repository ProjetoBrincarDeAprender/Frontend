import { Header } from "@/components/Header/Header";
import EditSchoolForm from "@/components/School/EditForm";

export function EditSchoolPage() {
  return (
    <div className="page-whith-header">
      <Header username="Usuario" />

      <div className="page-container">
        <EditSchoolForm />
      </div>
    </div>
  );
}
