import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";
import { CreateActivityForm } from "@/components/features/curriculum/activities/CreateActivityForm";
import { TableProvider } from "@/contexts/Table/provider";
import NotSelectedAct from "./NotSelectedAct";
import { useState } from "react";

export default function CreateActivityPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const handleTemplateChange = (template?: string) => {
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
              templateChange={handleTemplateChange}
            />
          </TableProvider>
        </div>
        <div className="w-[70%]">
          <NotSelectedAct
            isFormValid={true}
            selectedTemplate={selectedTemplate}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
