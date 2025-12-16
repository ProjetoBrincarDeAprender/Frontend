export interface CompetenceWithArea {
  id: number;
  nome: string;
  descricao: string | null;
  areaId: number;
  areaName?: string;
}
