import type { Student } from "./student";
import type { User, UserFormData } from "./user";

export type School = {
  id: number;
  nome: string;
  descricao: string;
  localizacao: string;
  telefone: string;
  email: string;
  usuarios?: Student[];
};

export type SchoolFormData = {
  nome: string;
  descricao?: string | null;
  email: string;
  telefone?: string | null;
  localizacao: string | null;
};

export type SchoolAdmin = {
  escolaId: number;
} & User;

export type SchoolAdminFormData = {
  escolaId: number | string;
} & UserFormData;
