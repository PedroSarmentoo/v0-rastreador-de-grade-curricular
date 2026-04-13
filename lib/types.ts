export type StatusDisciplina = 'concluida' | 'disponivel' | 'bloqueada'

export interface Disciplina {
  id: string
  nome: string
  semestre: number
  prerequisitos: string[]
  concluida: boolean
}

export interface DisciplinaComStatus extends Disciplina {
  status: StatusDisciplina
}
