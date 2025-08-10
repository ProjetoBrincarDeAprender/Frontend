export type UserProfile = {
  id: string;
  nome_completo: string;
  email: string;
  perfil: {
    nome: string;
  };
  escola: {
    nome: string;
  };
  created_At: string;
  perfil_id: number;
  escolaId: number | null;
};

export type User = {
  id: string;
  nome_completo: string;
  email: string;
  perfil: string;
  escola: string | null;
};
