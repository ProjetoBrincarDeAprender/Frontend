import { toast } from "sonner";
import { CreateKnowledgeAreaForm } from "@/components/features/curriculum/knowledgeAreas/CreateKnowledgeAreaForm";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { DesktopWarningDialog } from "@/components/features/users/common/DesktopWarningDialog";
import { useDesktopWarning } from "@/hooks/useMobileDetection";

export default function CreateKnowledgeArea() {
  const { showWarning, setShowWarning } = useDesktopWarning();

  const handleSuccess = () => {
    toast.success("Área de conhecimento criada com sucesso!");
    window.location.href = "/dashboard/teacher";
  };

  return (
    <div className="flex h-fit flex-col bg-neutral-200 pt-28 text-gray-800">
      <DesktopWarningDialog
        isOpen={showWarning}
        onClose={() => setShowWarning(false)}
      />
      <Header />

      <main className="min-h-96 flex-1 px-78 py-8">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md space-y-8">
            <CreateKnowledgeAreaForm onSuccess={handleSuccess} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
