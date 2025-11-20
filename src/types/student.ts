import type { User } from "./user";

export type Student = {
  data_nascimento: string | Date;
  avatar_url: string;
  tema_preferido: string;
  senha_visual_sequencia: string;
  created_At: string | Date;
} & User;

export type StudentFormData = {
  data_nascimento?: string | Date;
  avatar_url?: string;
  tema_preferido?: string;
  senha_visual_sequencia?: string;
  nome_completo: string;
  email: string;
  senha: string;
  confirmar_senha: string;
  escolaId?: number | string;
};
