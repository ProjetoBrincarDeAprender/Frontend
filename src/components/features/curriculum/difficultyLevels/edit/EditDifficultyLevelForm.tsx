import { Form } from "@/components/forms/Root";
import { useDifficultyLevel } from "@/hooks/DificultyLevel/useDifficultyLevel";
import { useUpdateDifficultyLevel } from "@/hooks/DificultyLevel/useUpdateDifficultyLevel";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string({ error: "Nome é obrigatório" })
    .max(100, { error: "O limite suportado é de 100 caracteres" })
    .min(3, { error: "Nome deve ter pelo menos 3 caracteres" }),
});

type EditDifficultyLevelFormProps = {
  id: number;
  onSuccess: () => void;
};

export function EditDifficultyLevelForm({
  id,
  onSuccess,
}: EditDifficultyLevelFormProps) {
  const { difficultyLevelQuery } = useDifficultyLevel({ id });
  const {
    data: difficultyLevelData,
    isLoading: isDifficultyLevelLoading,
    isError: isDifficultyLevelError,
  } = difficultyLevelQuery;

  const { update: updateDifficultyLevelMutation } = useUpdateDifficultyLevel();
  const {
    mutateAsync: updateDifficultyLevel,
    isPending: isDifficultyLevelPending,
    isSuccess: isDifficultyLevelSuccess,
  } = updateDifficultyLevelMutation;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (difficultyLevelData) {
      const levelData = {
        name: difficultyLevelData.nome || "",
      };
      form.reset(levelData);
    }
  }, [difficultyLevelData, form]);

  useEffect(() => {
    if (isDifficultyLevelSuccess) {
      onSuccess();
    }
  }, [isDifficultyLevelSuccess, onSuccess]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const cleanData = {
      name: String(data.name).trim(),
    };

    try {
      await updateDifficultyLevel({
        difficultyLevelId: id,
        data: cleanData,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        const response = error.response;

        if (Array.isArray(response?.data?.message)) {
          response?.data?.message.forEach(
            (fieldError: { field: string; message: string[] }) => {
              if (fieldError.field === "name") {
                form.setError("name", {
                  message: fieldError.message.join(", "),
                });
              } else {
                form.setError("root", {
                  message: `${fieldError.field}: ${fieldError.message.join(", ")}`,
                });
              }
            },
          );
        } else {
          form.setError("root", {
            message:
              response?.data?.message || "Erro desconhecido na atualização",
          });
        }
      }
    }
  };

  if (isDifficultyLevelError) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-red-600">
        <p>Erro ao carregar dados</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (isDifficultyLevelLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando dados...</span>
      </div>
    );
  }

  return (
    <Form.Wrapper>
      <Form.Title text="Atualizar Dados do Nível de Dificuldade" />
      <Form.Main
        form={{ ...form }}
        onSubmit={onSubmit}
        className="flex flex-col gap-4"
      >
        <Form.Field
          form={form}
          name="name"
          render={({ field }) => (
            <Form.Input
              {...field}
              label="Nome do Nível de Dificuldade"
              placeholder="Digite o nome do nível de dificuldade"
              disabled={isDifficultyLevelPending}
            />
          )}
        />

        <Form.Submit disabled={isDifficultyLevelPending}>
          {isDifficultyLevelPending ? (
            <>
              <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
              Atualizando...
            </>
          ) : (
            "Atualizar"
          )}
        </Form.Submit>
      </Form.Main>
    </Form.Wrapper>
  );
}
