export type KnowledgeArea = {
  id: number;
  nome: string;
  descricao: string;
  createdAt: string;
  usuarioCriadorId: number;
  escolaId: number | null;
};

export type KnowledgeAreaFormData = {
  nome: string;
  description: string;
};
