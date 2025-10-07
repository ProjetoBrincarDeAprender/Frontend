import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { CreateQuestionForm } from "@/components/features/curriculum/questions/CreateQuestionForm";
import { useNavigate } from "react-router";
// import { ArrowLeft } from "lucide-react";
// import { Button } from "@/components/ui/button";

export function CreateQuestion() {
  const navigate = useNavigate();
//   const { activityId } = useParams<{ activityId: string }>();

  const handleSuccess = () => {
    navigate("/dashboard/teacher");
  };

//   const handleBack = () => {
//     navigate("/dashboard/teacher");
//   };

  return (
    <div className="flex min-h-screen flex-col bg-neutral-200 pt-28 text-gray-800">
      <Header />
      
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-78 py-8">
        <div className="max-w-2xl mx-auto">
            <CreateQuestionForm onSuccess={handleSuccess} />
          </div>
      </main>

      <Footer />
    </div>
  );
}

export default CreateQuestion;