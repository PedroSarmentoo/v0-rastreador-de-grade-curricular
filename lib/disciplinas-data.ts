import type { Disciplina } from './types'

export const disciplinasIniciais: Disciplina[] = [
  // SEMESTRE 1
  { id: 'aed1', nome: 'Algoritmos e Estruturas de Dados I', semestre: 1, prerequisitos: [], concluida: false },
  { id: 'proj_hum1', nome: 'Projeto Orientado em Humanidades I', semestre: 1, prerequisitos: [], concluida: false },
  { id: 'calc1', nome: 'Cálculo Integral e Diferencial I', semestre: 1, prerequisitos: [], concluida: false },
  { id: 'intro_eng', nome: 'Introdução à Engenharia de Sistemas', semestre: 1, prerequisitos: [], concluida: false },
  { id: 'sist_dig', nome: 'Sistemas Digitais', semestre: 1, prerequisitos: [], concluida: false },
  { id: 'gaal', nome: 'Geometria Analítica e Álgebra Linear', semestre: 1, prerequisitos: [], concluida: false },

  // SEMESTRE 2
  { id: 'aed2', nome: 'Algoritmos e Estruturas de Dados II', semestre: 2, prerequisitos: ['aed1'], concluida: false },
  { id: 'bd', nome: 'Banco de Dados', semestre: 2, prerequisitos: ['aed1'], concluida: false },
  { id: 'calc2', nome: 'Cálculo Integral e Diferencial II', semestre: 2, prerequisitos: ['calc1', 'gaal'], concluida: false },
  { id: 'fund_mec', nome: 'Fundamentos de Mecânica', semestre: 2, prerequisitos: ['calc1', 'gaal'], concluida: false },
  { id: 'lab_sist_dig', nome: 'Laboratório de Sistemas Digitais', semestre: 2, prerequisitos: ['sist_dig'], concluida: false },
  { id: 'circ_elet1', nome: 'Circuitos Elétricos I', semestre: 2, prerequisitos: ['calc1', 'gaal'], concluida: false },

  // SEMESTRE 3
  { id: 'aed3', nome: 'Algoritmos e Estruturas de Dados III', semestre: 3, prerequisitos: ['aed2'], concluida: false },
  { id: 'eq_dif_a', nome: 'Equações Diferenciais A', semestre: 3, prerequisitos: ['calc2'], concluida: false },
  { id: 'calc3', nome: 'Cálculo Integral e Diferencial III', semestre: 3, prerequisitos: ['calc2'], concluida: false },
  { id: 'fund_mec_sol', nome: 'Fund. Mecânica dos Sólidos e Fluidos', semestre: 3, prerequisitos: ['calc2', 'fund_mec'], concluida: false },
  { id: 'fund_eletromag', nome: 'Fundamentos de Eletromagnetismo', semestre: 3, prerequisitos: ['calc2', 'fund_mec'], concluida: false },
  { id: 'analise_num', nome: 'Análise Numérica', semestre: 3, prerequisitos: ['calc2', 'aed1', 'gaal'], concluida: false },
  { id: 'inic_filo', nome: 'Iniciação Filosófica', semestre: 3, prerequisitos: [], concluida: false },

  // SEMESTRE 4 - Adicione mais disciplinas aqui
  // { id: 'xxx', nome: 'Disciplina X', semestre: 4, prerequisitos: ['yyy'], concluida: false },

  // SEMESTRE 5 - Adicione mais disciplinas aqui

  // SEMESTRE 6 - Adicione mais disciplinas aqui

  // SEMESTRE 7 - Adicione mais disciplinas aqui

  // SEMESTRE 8 - Adicione mais disciplinas aqui

  // SEMESTRE 9 - Adicione mais disciplinas aqui

  // SEMESTRE 10 - Adicione mais disciplinas aqui
]
