import z from "zod";

export const formSchema = z.object({
  title: z
    .string({ error: "Título é obrigatório" })
    .min(3, { error: "Título deve ter pelo menos 3 caracteres" })
    .max(100, { error: "Título deve ter no máximo 100 caracteres" }),
  type: z
    .string({ error: "Tipo é obrigatório" })
    .min(1, { error: "Selecione um tipo de atividade" }),
  competenceId: z
    .string({ error: "Competência é obrigatória" })
    .min(1, { error: "Selecione uma competência" }),
  template: z.string().min(1, "Template é obrigatório"),
});