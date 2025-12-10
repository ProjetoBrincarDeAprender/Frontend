export type FilterOption = {
  page?: number;
  limit?: 10 | 25 | 50 | 100 | 500;
  search?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  searchBy?: string;
  sortOrder?: "asc" | "desc";
};

export type FilterStudentOption = FilterOption & {
  type?: string;
  escolaId?: number;
  dataNascStart?: string | Date;
  dataNascEnd?: string | Date;
  temaPreferido?: string;
  responsibleId?: number | null;
};

export type FilterStudentRelationsOption = FilterOption & {
  isNull?: boolean;
  escolaId?: number;
};

export type FilterTeacherOption = FilterOption & {
  escolaId?: number;
};

export type FilterResponsibleOption = FilterOption & {
  escolaId?: number;
};

export type FilterSchoolOption = FilterOption & {
  escolaId?: number;
};

export type FilterSchoolAdminOption = FilterOption & {
  escolaId?: number;
};

export type FilterActivityOption = FilterOption & {};

export type FilterQuestionOption = FilterOption & {};

export type FilterDifficultyLevelOption = FilterOption & {};

export type FilterCompetenceOption = FilterOption & {};

export type FilterKnowledgeAreaOption = FilterOption & {};
