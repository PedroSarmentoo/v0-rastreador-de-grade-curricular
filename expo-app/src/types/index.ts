export type StatusDisciplina = 'concluida' | 'disponivel' | 'bloqueada';

export interface Disciplina {
  id: string;
  nome: string;
  semestre: number;
  preRequisitos: string[];
  status: StatusDisciplina;
}
