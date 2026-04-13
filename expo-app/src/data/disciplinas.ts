import { Disciplina } from '../types';

export const disciplinasIniciais: Disciplina[] = [
  // Semestre 1
  { id: 'calc1', nome: 'Calculo I', semestre: 1, preRequisitos: [], status: 'disponivel' },
  { id: 'prog1', nome: 'Programacao I', semestre: 1, preRequisitos: [], status: 'disponivel' },
  { id: 'algebra', nome: 'Algebra Linear', semestre: 1, preRequisitos: [], status: 'disponivel' },
  { id: 'intro_eng', nome: 'Intro. Engenharia', semestre: 1, preRequisitos: [], status: 'disponivel' },
  
  // Semestre 2
  { id: 'calc2', nome: 'Calculo II', semestre: 2, preRequisitos: ['calc1'], status: 'bloqueada' },
  { id: 'prog2', nome: 'Programacao II', semestre: 2, preRequisitos: ['prog1'], status: 'bloqueada' },
  { id: 'fisica1', nome: 'Fisica I', semestre: 2, preRequisitos: ['calc1'], status: 'bloqueada' },
  { id: 'estatistica', nome: 'Estatistica', semestre: 2, preRequisitos: ['calc1'], status: 'bloqueada' },
  
  // Semestre 3
  { id: 'calc3', nome: 'Calculo III', semestre: 3, preRequisitos: ['calc2'], status: 'bloqueada' },
  { id: 'estrut_dados', nome: 'Estrutura de Dados', semestre: 3, preRequisitos: ['prog2'], status: 'bloqueada' },
  { id: 'fisica2', nome: 'Fisica II', semestre: 3, preRequisitos: ['fisica1'], status: 'bloqueada' },
  { id: 'circuitos', nome: 'Circuitos Eletricos', semestre: 3, preRequisitos: ['fisica1', 'calc2'], status: 'bloqueada' },
];
