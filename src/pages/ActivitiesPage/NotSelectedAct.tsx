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
        return (
          <>
            <div>
              <h2 className="flex flex-col justify-center text-center text-2xl font-semibold">
                Múltipla Escolha
              </h2>
            </div>
          </>
        );
      case "true_false":
        return (
          <>
            <h2 className="flex flex-col justify-center text-center text-2xl font-semibold">
              Verdadeiro ou Falso
            </h2>
            <p>Template indisponível no momento. Mais informações em breve.</p>
          </>
        );
      default:
        return "";
    }
  };
  return (
    <div className="flex h-120 w-8/9 flex-col items-center justify-center rounded-2xl bg-slate-700">
      <div className="flex h-80 w-8/9 flex-col items-center justify-center rounded-2xl border-2 border-gray-300 bg-slate-100 p-8 shadow-md">
        {isFormValid ? (
          <>
            <div className="text-gray-800">
              {getTemplateName(selectedTemplate)}
            </div>
          </>
        ) : (
          <>
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              Preencha o formulário
            </h2>
            <p className="text-center text-gray-600">
              Por favor, preencha o título, selecione uma competência e escolha
              um template para visualizar a confirmação aqui.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
