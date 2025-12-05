import type { User, UserFormData } from "./user";

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
} & UserFormData;
