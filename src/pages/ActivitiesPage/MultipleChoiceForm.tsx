import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/forms/Root";

const formSchema = z.object({
  comando: z
    .string({ error: "O comando é obrigatório" })
    .min(3, { error: "O comando deve ter pelo menos 3 caracteres" })
    .max(30, { error: "O comando deve ter no máximo 30 caracteres" }),

  question: z
    .string({ error: "A questão é obrigatória" })
    .min(2, { error: "A questão deve conter ao menos 2 caracteres" })
    .max(20, { error: "A questão deve ter no máximo 20 caracteres" }),
});

export function MultipleChoiceForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comando: "",
      question: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const payload = {
      comando: data.comando,
      question: data.question,
    };
    payload;

    // try {
    //   setIsSubmitting(true);
    //   //   const response = await api.post("/activity/register", payload);
    // }
  };

  return (
    <Form.Wrapper>
      <Form.Title text="Atividade" />
      <Form.Main
        form={{ ...form }}
        onSubmit={onSubmit}
        className="flex flex-col gap-4"
      >
        <Form.Field
          form={form}
          name="comando"
          render={({ field }) => (
            <Form.Input
              {...field}
              label="Comando"
              placeholder="Ex: Selecione a alternativa correta"
            />
          )}
        />
        <Form.Field
          form={form}
          name="question"
          render={({ field }) => (
            <Form.Input
              {...field}
              label="Questão"
              placeholder="Ex: 1 + 2 = ?"
            />
          )}
        />

        <Form.Submit className="bg-primary hover:bg-primary/90">
          Criar
        </Form.Submit>
      </Form.Main>
    </Form.Wrapper>
  );
}
