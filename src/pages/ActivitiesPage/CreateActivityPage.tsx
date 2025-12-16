import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { CreateActivityForm } from "@/components/features/curriculum/activities/CreateActivityForm";
import { TableProvider } from "@/contexts/Table/provider";
import NotSelectedAct from "./NotSelectedAct";
import { useState } from "react";

export default function CreateActivityPage() {
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const handleFormStateChange = (isValid: boolean, template?: string) => {
    console.log("handleFormStateChange chamado:", { isValid, template });
    setIsFormValid(isValid);
    setSelectedTemplate(template || "");
  };

  return (
    <>
      <Header />
      <main className="mx-20 mt-40 mb-20 flex items-start gap-10">
        <div className="w-[30%]">
          <TableProvider>
            <CreateActivityForm
              onSuccess={() => {}}
              onFormStateChange={handleFormStateChange}
            />
          </TableProvider>
        </div>
        <div className="w-[70%]">
          <NotSelectedAct
            isFormValid={isFormValid}
            selectedTemplate={selectedTemplate}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
