export type Competence = {
  id: number;
  nome: string;
  descricao: string | null;
  areaId: number;
  preRequisitos: Competence[] | null;
  createdAt: string;
};

export type CompetenceFormData = {
  name: string;
  description?: string;
  prerequisiteIds?: number;
  escolaId?: number | null;
  creatorId: number;
};
