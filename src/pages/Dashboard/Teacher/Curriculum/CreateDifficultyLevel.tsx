import { toast } from "sonner";
import { CreateDifficultyLevelForm } from "@/components/features/curriculum/difficultyLevels/CreateDifficultyLevelForm";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";

export default function CreateDifficultyLevel() {
  const handleSuccess = () => {
    window.location.href = "/dashboard/teacher";
    toast.success("Nível de dificuldade criado com sucesso!");
  };

  return (
    <div className="flex h-fit flex-col bg-neutral-200 pt-28 text-gray-800">
      <Header />
      
      <main className="min-h-96 flex-1 px-78 py-8">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md space-y-8">
            <CreateDifficultyLevelForm onSuccess={handleSuccess} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}