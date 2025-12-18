// import { TrueFalseForm } from "./TrueFalseForm";
import { MultipleChoiceForm } from "./MultipleChoiceForm";

interface CreateQuestionsFormProps {
  selectedTemplate?: string;
}

export default function CreateQuestionsForm({
  selectedTemplate = "",
}: CreateQuestionsFormProps) {
  const getTemplateName = (templateValue: string) => {
    switch (templateValue) {
      case "multiple_choice":
        return <MultipleChoiceForm />;
      case "true_false":
        return (
          <div className="flex h-80 items-center justify-center rounded-2xl bg-gray-200">
            <span className="text-2xl font-semibold text-gray-800">
              Em breve...
            </span>
          </div>
        );
      // <TrueFalseForm />;
      default:
        return null;
    }
  };
  return getTemplateName(selectedTemplate);
}
