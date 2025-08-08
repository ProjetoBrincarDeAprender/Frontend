import { Footer } from "@/components/Footer/Footer";
import { ResponsableSignUpForm } from "@/components/Forms/SignUpForms/ResponsableForm";
import { Header } from "../../components/Header/Header";
import "./CadResponsavel.css";

export function RegisterResponsablePage() {
  return (
    <div className="page-with-header">
      <Header username="Usuario" />

      <div className="page-container">
        <ResponsableSignUpForm />
      </div>
      <Footer />
    </div>
  );
}
