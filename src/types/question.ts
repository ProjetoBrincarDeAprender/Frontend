export type Question = {
  id: number;
  conteudo: unknown;
  atividade_id: number;
  ordem: number;
  created_At: string;
  nivelDificuldadeId: number;
  proximaSucessoId: number | null;
  proximaFalhaId: number | null;
};

export type QuestionFormData = {
  content: string;
  ordem: number;
  difficultyId: number;
};
