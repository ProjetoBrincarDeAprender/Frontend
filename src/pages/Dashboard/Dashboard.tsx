import { Footer } from "../../components/Footer/Footer";
import { Header } from "../../components/Header/Header";
import { LateralMenu } from "../../components/LateralMenu/LateralMenu";

export default function dashboard() {
  return (
    <>
      <Header />
      <main className="mt-28 bg-slate-100">
        {<LateralMenu />}
      </main>
      <Footer />
    </>
  );
}
