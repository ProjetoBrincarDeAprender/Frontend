export type FilterOption = {
  page?: number;
  limit?: 10 | 25 | 50 | 100 | 500;
  search?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  searchBy?: string;
  sortOrder?: "asc" | "desc";
};

export type FilterUserOption = FilterOption & {
  type?: string;
  escolaId?: number;
  searchBy?: "nome_completo" | "email";
};

export type FilterStudentOption = FilterUserOption & {
  dataNascStart?: string | Date;
  dataNascEnd?: string | Date;
  temaPreferido?: string;
  responsibleId?: number | null;
};

export type FilterStudentRelationsOption = FilterUserOption & {
  isNull?: boolean;
};

export type FilterTeacherOption = FilterUserOption & {};

export type FilterResponsibleOption = FilterUserOption & {};

export type FilterSchoolAdminOption = FilterUserOption & {};

export type FilterSchoolOption = FilterOption & {
  escolaId?: number;
  searchBy?: "nome" | "localizacao" | "telefone" | "email" | "id";
};

export type FilterActivityOption = FilterOption & {
  competenceId?: number;
  creatorId?: number;
  escolaId?: number;
  searchBy?: "id" | "titulo" | "tipo";
};

export type FilterQuestionOption = FilterOption & {
  activitiesIds?: number[];
  searchBy?: "id" | "ordem" | "atividade_id";
};

export type FilterDifficultyLevelOption = FilterOption & {
  searchBy?: "nome" | "id";
};

export type FilterCompetenceOption = FilterOption & {
  searchBy?: "id" | "nome" | "descricao";
};

export type FilterKnowledgeAreaOption = FilterOption & {
  searchBy?: "id" | "nome" | "descricao";
};
