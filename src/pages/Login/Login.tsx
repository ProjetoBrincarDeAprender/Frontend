import SignInForm from "@/components/features/login/SignInForm";
import { useUser } from "@/hooks/User/useUser";
import { Navigate } from "react-router";
import { Footer } from "../../components/footer/Footer";
import { Header } from "../../components/header/Header";

export default function Login() {
  const { user } = useUser();

  switch (user?.perfil) {
    case "Admin":
      return <Navigate to="/dashboard" replace />;

    case "Escola":
      return <Navigate to="/dashboard" replace />;
  }

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
