import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { useUser } from "@/hooks/User/useUser";
// import { LateralMenu } from "@/components/sideBar/sideBar";
import StudentCard from "@/components/studentCard/StudentCard";

export function ResponsibleDashboard() {
  //   const { user } = useUser();
  //   const username = user?.nome_completo || "Usuário";

  return (
    <>
      <Header />
      <StudentCard />
      <Footer />
    </>
  );
}
