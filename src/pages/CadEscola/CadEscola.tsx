import CreateSchoolForm from "@/components/features/users/school/create/SchoolCreateForm";
import { Header } from "../../components/header/Header";
import "../CadProfessor/CadProfessor.css";

export function RegisterSchoolPage() {
  return (
    <div className="page-whith-header">
      <Header username="Usuario" />
      <div className="page-container">
        <CreateSchoolForm />
      </div>
    </div>
  );
}
