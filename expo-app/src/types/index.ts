export type StatusDisciplina = 'concluida' | 'disponivel' | 'bloqueada' |'cursando';

export interface Disciplina {
  id: string;
  nome: string;
  semestre: number;
  preRequisitos: string[];
  status: StatusDisciplina;
}
