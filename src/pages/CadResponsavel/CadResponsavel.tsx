import { Footer } from "@/components/footer/Footer";
import { ResponsableSignUpForm } from "@/components/features/users/responsible/create/ResponsibleCreateForm";
import { Header } from "../../components/header/Header";
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
