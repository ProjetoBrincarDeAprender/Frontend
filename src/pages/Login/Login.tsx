import SignInForm from "@/components/SignInForms/SignInForm";
import { Footer } from "../../components/Footer/Footer";
import { Header } from "../../components/Header/Header";

export default function Form() {
  return (
    <>
      <Header />
      <main className="mt-38 mb-10 grid justify-items-center">
        <SignInForm />
      </main>
      <Footer />
    </>
  );
}
