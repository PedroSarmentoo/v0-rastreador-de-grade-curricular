export type StatusDisciplina = 'concluida' | 'disponivel' | 'bloqueada' | 'cursando';

export interface Disciplina {
  id: string;
  nome: string;
  semestre: number;
  preRequisitos: string[];
  status: StatusDisciplina;
}

export interface DisciplinaNode extends Disciplina {
  dependentes: DisciplinaNode[]; // Disciplinas que ramificam a partir desta (que a exigem como pré-requisito)
}
