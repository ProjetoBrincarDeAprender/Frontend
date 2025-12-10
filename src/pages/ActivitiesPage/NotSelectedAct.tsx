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
        return "Múltipla Escolha";
      case "true_false":
        return "Verdadeiro ou Falso";
      default:
        return "";
    }
  };
  return (
    <div className="flex h-120 w-8/9 flex-col items-center justify-center rounded-2xl bg-slate-700">
      <div className="flex h-80 w-8/9 flex-col items-center justify-center rounded-2xl border-2 border-gray-300 bg-slate-100 p-8 shadow-md">
        {isFormValid ? (
          <>
            <h2 className="mb-4 text-2xl font-semibold text-green-800">
              ✅ Formulário Preenchido!
            </h2>
            <div className="text-center">
              <p className="mb-3 text-green-600">
                Todas as informações necessárias foram preenchidas. Você pode
                criar a atividade agora!
              </p>
              {selectedTemplate && (
                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
                  <p className="mb-1 text-sm font-medium text-green-700">
                    Template Selecionado:
                  </p>
                  <p className="text-lg font-semibold text-green-800">
                    {getTemplateName(selectedTemplate)}
                  </p>
                </div>
              )}
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
