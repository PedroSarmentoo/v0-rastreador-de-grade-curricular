import { Disciplina } from '../types';

export const disciplinasSI: Disciplina[] = [
  // 1º Semestre
  { id: 'si_1_1', nome: 'Algoritmos e Estruturas de Dados I', semestre: 1, status: 'disponivel', preRequisitos: [] },
  { id: 'si_1_2', nome: 'Administração', semestre: 1, status: 'disponivel', preRequisitos: [] },
  { id: 'si_1_3', nome: 'Computação e Sociedade', semestre: 1, status: 'disponivel', preRequisitos: [] },
  { id: 'si_1_4', nome: 'Fundamentos de Sistemas de Informação', semestre: 1, status: 'disponivel', preRequisitos: [] },
  { id: 'si_1_5', nome: 'Inglês I', semestre: 1, status: 'disponivel', preRequisitos: [] },
  { id: 'si_1_6', nome: 'Introdução à Computação', semestre: 1, status: 'disponivel', preRequisitos: [] },
  { id: 'si_1_7', nome: 'Matemática Computacional', semestre: 1, status: 'disponivel', preRequisitos: [] },
  { id: 'si_1_8', nome: 'Português', semestre: 1, status: 'disponivel', preRequisitos: [] },

  // 2º Semestre
  { id: 'si_2_1', nome: 'Algoritmos e Estruturas de Dados II', semestre: 2, status: 'bloqueada', preRequisitos: ['si_1_1'] },
  { id: 'si_2_2', nome: 'Arquitetura', semestre: 2, status: 'bloqueada', preRequisitos: ['si_1_6'] },
  { id: 'si_2_3', nome: 'Cálculo', semestre: 2, status: 'disponivel', preRequisitos: [] },
  { id: 'si_2_4', nome: 'Geometria Analítica e Álgebra Linear', semestre: 2, status: 'disponivel', preRequisitos: [] },
  { id: 'si_2_5', nome: 'Inglês II', semestre: 2, status: 'bloqueada', preRequisitos: ['si_1_5'] },
  { id: 'si_2_6', nome: 'Metodologia Científica', semestre: 2, status: 'disponivel', preRequisitos: [] },
  { id: 'si_2_7', nome: 'Probabilidade e Estatística', semestre: 2, status: 'disponivel', preRequisitos: [] },
  { id: 'si_2_8', nome: 'Teoria Geral dos Sistemas', semestre: 2, status: 'disponivel', preRequisitos: [] },

  // 3º Semestre
  { id: 'si_3_1', nome: 'Banco de Dados I', semestre: 3, status: 'bloqueada', preRequisitos: ['si_2_1','si_1_7'] },
  { id: 'si_3_2', nome: 'Engenharia de Software I', semestre: 3, status: 'bloqueada', preRequisitos: ['si_1_1'] },
  { id: 'si_3_3', nome: 'Cálculo Numérico', semestre: 3, status: 'bloqueada', preRequisitos: ['si_2_3','si_2_4'] },
  { id: 'si_3_4', nome: 'Gestão da Informação', semestre: 3, status: 'disponivel', preRequisitos: [] },
  { id: 'si_3_5', nome: 'Grafos', semestre: 3, status: 'bloqueada', preRequisitos: ['si_2_1'] },
  { id: 'si_3_6', nome: 'Programação I', semestre: 3, status: 'bloqueada', preRequisitos: ['si_2_1'] },
  { id: 'si_3_7', nome: 'Sistemas de Informação Geográfica (SIG)', semestre: 3, status: 'disponivel', preRequisitos: [] },
  { id: 'si_3_8', nome: 'Teoria da Computação', semestre: 3, status: 'bloqueada', preRequisitos: ['si_1_7'] },

  // 4º Semestre
  { id: 'si_4_1', nome: 'Banco de Dados II', semestre: 4, status: 'bloqueada', preRequisitos: ['si_3_1'] },
  { id: 'si_4_2', nome: 'Engenharia de Software II', semestre: 4, status: 'bloqueada', preRequisitos: ['si_3_2'] },
  { id: 'si_4_3', nome: 'Gestão Financeira', semestre: 4, status: 'disponivel', preRequisitos: [] },
  { id: 'si_4_4', nome: 'Interação Humano-Computador (IHC)', semestre: 4, status: 'disponivel', preRequisitos: [] },
  { id: 'si_4_5', nome: 'Marketing', semestre: 4, status: 'disponivel', preRequisitos: [] },
  { id: 'si_4_6', nome: 'Programação II', semestre: 4, status: 'disponivel', preRequisitos: [] },
  { id: 'si_4_7', nome: 'Redes', semestre: 4, status: 'bloqueada', preRequisitos: ['si_1_6'] },
  { id: 'si_4_8', nome: 'Sistemas Operacionais', semestre: 4, status: 'bloqueada', preRequisitos: ['si_2_2','si_1_1'] },

  // 5º Semestre
  { id: 'si_5_1', nome: 'Qualidade de Software', semestre: 5, status: 'bloqueada', preRequisitos: ['si_4_2'] },
  { id: 'si_5_2', nome: 'Pesquisa Operacional', semestre: 5, status: 'bloqueada', preRequisitos: ['si_2_3','si_2_4'] },
  { id: 'si_5_3', nome: 'Computação Gráfica', semestre: 5, status: 'bloqueada', preRequisitos: ['si_2_4'] },
  { id: 'si_5_4', nome: 'Desenvolvimento Web', semestre: 5, status: 'bloqueada', preRequisitos: ['si_3_6'] },
  { id: 'si_5_5', nome: 'Comunicação de Dados', semestre: 5, status: 'bloqueada', preRequisitos: ['si_4_7'] },
  { id: 'si_5_6', nome: 'Sistemas Distribuídos I', semestre: 5, status: 'bloqueada', preRequisitos: ['si_4_8'] },

  // 6º Semestre
  { id: 'si_6_1', nome: 'Inteligência Artificial', semestre: 6, status: 'bloqueada', preRequisitos: ['si_2_1','si_2_3'] },
  { id: 'si_6_2', nome: 'Gerência de Projetos de Software', semestre: 6, status: 'bloqueada', preRequisitos: ['si_5_1'] },
  { id: 'si_6_3', nome: 'Psicologia Organizacional', semestre: 6, status: 'disponivel', preRequisitos: [] },
  { id: 'si_6_4', nome: 'PTCC', semestre: 6, status: 'bloqueada', preRequisitos: ['si_2_6'] },
  { id: 'si_6_5', nome: 'Optativa I', semestre: 6, status: 'bloqueada', preRequisitos: ['si_3_6'] },
  { id: 'si_6_6', nome: 'Sistemas Distribuídos II', semestre: 6, status: 'bloqueada', preRequisitos: ['si_5_6','si_4_7'] },

  // 7º Semestre
  { id: 'si_7_1', nome: 'Gestão de Processos', semestre: 7, status: 'disponivel', preRequisitos: [] },
  { id: 'si_7_2', nome: 'Empreendedorismo em Informática', semestre: 7, status: 'disponivel', preRequisitos: [] },
  { id: 'si_7_3', nome: 'Economia e Finanças', semestre: 7, status: 'disponivel', preRequisitos: [] },
  { id: 'si_7_4', nome: 'TCC I', semestre: 7, status: 'bloqueada', preRequisitos: ['si_6_4'] },
  { id: 'si_7_5', nome: 'Optativa II', semestre: 7, status: 'bloqueada', preRequisitos: ['si_6_1'] },
  { id: 'si_7_6', nome: 'Sistemas de Apoio à Decisão', semestre: 7, status: 'disponivel', preRequisitos: [] },

  // 8º Semestre
  { id: 'si_8_1', nome: 'Segurança e Auditoria', semestre: 8, status: 'disponivel', preRequisitos: [] },
  { id: 'si_8_2', nome: 'Legislação e Ética', semestre: 8, status: 'disponivel', preRequisitos: [] },
  { id: 'si_8_3', nome: 'Sociologia', semestre: 8, status: 'disponivel', preRequisitos: [] },
  { id: 'si_8_4', nome: 'Filosofia e Ética', semestre: 8, status: 'disponivel', preRequisitos: [] },
  { id: 'si_8_5', nome: 'TCC II', semestre: 8, status: 'bloqueada', preRequisitos: ['si_7_4'] },
  { id: 'si_8_6', nome: 'Optativa III', semestre: 8, status: 'bloqueada', preRequisitos: ['si_4_7'] },
  { id: 'si_8_7', nome: 'Optativa IV', semestre: 8, status: 'disponivel', preRequisitos: [] },
];