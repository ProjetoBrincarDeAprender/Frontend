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
  titulo: string;
  type: string;
  competenceId: number;
  content: string;
  nivel_dificuldade_inicial: number;
  escolaId?: number | null;
  quantQuestoes: number;
  creatorId: number;
};
