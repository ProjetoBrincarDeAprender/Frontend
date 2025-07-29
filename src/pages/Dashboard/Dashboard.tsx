import { Footer } from "../../components/Footer/Footer";
import { Header } from "../../components/Header/Header";
import { LateralMenu } from "../../components/LateralMenu/LateralMenu";
import { InfoBadge } from "../../components/utils/InfoBadge/InfoBadge";

import "./Dashboard.css";

export default function dashboard() {
  return (
    <>
      <Header />
      <main className="mt-28 bg-slate-100">
        <LateralMenu />
        <InfoBadge variant="blue" label="Professores Ativos" value="12" />
      </main>
      <Footer />
    </>
  );
}
