import CreateSchoolForm from "@/components/School/CreateForm";
import { Header } from "../../components/Header/Header";
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
