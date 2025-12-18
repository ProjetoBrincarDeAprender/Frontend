import { AxiosError } from "axios";
import type z from "zod";

export default function handleAxiosError(
  error: any,
  form: any,
  formSchema: any,
) {
  if (error instanceof AxiosError) {
    const response = error.response;

    if (Array.isArray(response?.data?.message)) {
      response?.data?.message.map(
        (field: { field: string; message: string[] }) => {
          if (form.control._fields[field.field]) {
            form.setError(field.field as keyof z.infer<typeof formSchema>, {
              message: field.message.join(", "),
            });
          }
          form.setError("root", {
            message: `Erro ao criar atividade: ${field.message.join(", ")}`,
          });
        },
      );
    } else {
      form.setError("root", {
        message: `${response?.data?.message}`,
      });
    }
  }
}
