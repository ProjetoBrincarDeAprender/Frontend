export type Activity = {
  id: number;
  titulo: string;
  tipo: string;
  conteudo: JSON;
  competencia_id: number;
  nivel_dificuldade_inicial: number;
  escolaId: number | null;
  usuarioCriadorId: number;
  quantQuestoes: number;
};

export type ActivityFormData = {
  template: string;
  title: string;
  type: string;
  competenceId: number;
  content: string;
  creatorId: number;
  maxQuestions: number;
  escolaId?: number | null;
};
