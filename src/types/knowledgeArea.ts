export type KnowledgeArea = {
  id: number;
  nome: string;
  descricao: string;
  createdAt: string;
};

export type KnowledgeAreaFormData = {
  nome: string;
  description: string;
  escolaId?: number | null;
  creatorId: number;
};
