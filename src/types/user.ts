export type UserProfile = {
  codigo_usuario: string;
  nome_completo: string;
  email: string;
  perfil: string;
  escola: string;
  created_At: string;
  perfil_id: number;
  escolaId: number | null;
};

export const UserPerfilEnum = {
  ADMIN: "Admin",
  SCHOOL_ADMIN: "Escola",
  TEACHER: "Professor",
  STUDENT: "Aluno",
  RESPONSIBLE: "Responsavel",
} as const;

export type UserPerfilEnum =
  (typeof UserPerfilEnum)[keyof typeof UserPerfilEnum];

export type User = {
  codigo_usuario: string;
  nome_completo: string;
  email: string;
  perfil: UserPerfilEnum;
  escola: string | null;
  escolaId: number | null;
};

export type UserFormData = {
  nome_completo: string;
  email: string;
  senha: string;
  confirmar_senha: string;
  escolaId?: number | string;
};
