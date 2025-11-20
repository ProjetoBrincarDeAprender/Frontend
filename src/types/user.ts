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

export type User = {
  codigo_usuario: string;
  nome_completo: string;
  email: string;
  perfil: string;
  escola: {
    id: number | null;
    nome: string | null;
  } | null;
  escolaId: number | null;
};
