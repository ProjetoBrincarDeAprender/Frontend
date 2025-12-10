import { TrueFalseForm } from "./TrueFalseForm";
import { MultipleChoiceForm } from "./MultipleChoiceForm";

interface NotSelectedActProps {
  isFormValid?: boolean;
  selectedTemplate?: string;
}

export default function NotSelectedAct({
  isFormValid = false,
  selectedTemplate = "",
}: NotSelectedActProps) {
  const getTemplateName = (templateValue: string) => {
    switch (templateValue) {
      case "multiple_choice":
        return <MultipleChoiceForm />;
      case "true_false":
        return <TrueFalseForm />;
      default:
        return null;
    }
  };
  return (
    <div className="flex h-full w-full">
      {isFormValid ? (
        <div className="h-full w-full">{getTemplateName(selectedTemplate)}</div>
      ) : (
        <div className="flex h-full w-full flex-col rounded-2xl bg-slate-700 p-6">
          <div className="flex h-full w-full flex-col rounded-2xl border-2 border-gray-300 bg-slate-100 p-8 shadow-md">
            {getTemplateName(selectedTemplate)}
          </div>
        </div>
      )}
    </div>
  );
}
