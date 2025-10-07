import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import { useUser } from "@/hooks/User/useUser";
import StudentCard from "@/pages/Dashboard/Responsible/ResponsibleDashboard/components/studentCard/StudentCard";
import api from "@/utils/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { BookOpen, Target, Activity, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import saturn from "../../../../assets/saturn.svg";

export function TeacherDashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [response, setResponse] = useState<any>([]);
  const username = user?.nome_completo || "Usuário";

  useEffect(() => {
    if (!user?.codigo_usuario) return;

    const fetchData = async () => {
      try {
        const students = await api.get(
          `/teacher/list/${user?.codigo_usuario}/students`,
        );
        setResponse(students.data);
      } catch (error) {
        console.error("Erro ao buscar alunos do professor:", error);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="flex min-h-screen flex-col bg-neutral-200 pt-28 text-gray-800">
      <Header />
      
      {/* Seção de Boas-vindas */}
      <div className="w-full px-4 sm:px-6 lg:px-78 pt-8 mb-6">
        <div className="flex items-center gap-4">
          <img className="max-w-16 sm:max-w-24" src={saturn} alt="Saturn" />
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Bem vindo, {username}</h1>
          </div>
        </div>
      </div>

      {/* Seção de Ações do Professor */}
      <div className="w-full px-4 sm:px-6 lg:px-72 mb-8">
        <div className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Ações do Professor</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Button
              onClick={() => navigate("/dashboard/teacher/curriculum/knowledge-areas/create")}
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white h-auto py-3 sm:py-4 flex flex-col items-center gap-2 text-sm sm:text-base"
            >
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="font-medium text-center">Áreas de Conhecimento</span>
            </Button>
            
            <Button
              onClick={() => navigate("/dashboard/teacher/curriculum/competences/create")}
              className="bg-green-600 hover:bg-green-700 cursor-pointer text-white h-auto py-3 sm:py-4 flex flex-col items-center gap-2 text-sm sm:text-base"
            >
              <Target className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="font-medium text-center">Competências</span>
            </Button>

            <Button
              onClick={() => navigate("/dashboard/teacher/curriculum/activities/create")}
              className="bg-purple-600 hover:bg-purple-700 cursor-pointer text-white h-auto py-3 sm:py-4 flex flex-col items-center gap-2 text-sm sm:text-base"
            >
              <Activity className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="font-medium text-center">Atividades</span>
            </Button>

            <Button
              onClick={() => navigate("/dashboard/teacher/curriculum/questions/create")}
              className="bg-orange-600 hover:bg-orange-700 cursor-pointer text-white h-auto py-3 sm:py-4 flex flex-col items-center gap-2 text-sm sm:text-base"
            >
              <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="font-medium text-center">Questões</span>
            </Button>
            
            {/* <Button
              onClick={() => navigate("/dashboard/teacher/curriculum/difficulty-levels/create")}
              className="bg-orange-600 hover:bg-orange-700 text-white h-auto py-3 sm:py-4 flex flex-col items-center gap-2 text-sm sm:text-base"
            >
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="font-medium text-center">Criar Nível de Dificuldade</span>
            </Button> */}
          </div>
        </div>
      </div>

      {/* Alunos */}
      <main className="min-h-96 flex-1 px-78">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Aluno(s)</h2>

        {response.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-gray-700">
              Ops! Nenhum aluno encontrado
            </h2>
            <div className="max-w-sm rounded-2xl border-2 border-dashed border-gray-300 bg-white p-8 shadow-lg">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-200"></div>
              <div className="mb-2 h-4 rounded bg-gray-200"></div>
              <div className="mx-auto mb-4 h-3 w-3/4 rounded bg-gray-100"></div>
              <div className="h-8 rounded bg-blue-100"></div>
            </div>
            <p className="mt-8 max-w-md text-lg text-gray-500">
              Parece que este professor não possui alunos vinculados no momento.
            </p>
          </div>
        ) : (
          response.map(
            (student: { avatar_url: string | null; nome_completo: string }) => (
              <StudentCard
                key={student.nome_completo}
                imageUrl={student.avatar_url}
                studentName={student.nome_completo}
              />
            ),
          )
        )}
      </main>
      
      <Footer />
    </div>
  );
}

export default TeacherDashboard;
