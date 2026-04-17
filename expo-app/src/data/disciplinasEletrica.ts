import { Disciplina } from '../types';

export const disciplinasEletrica: Disciplina[] = [
  // --- 1º SEMESTRE ---
  { id: 'ele_1_1', nome: 'Cálculo I', semestre: 1, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_1_2', nome: 'Química Geral', semestre: 1, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_1_3', nome: 'Algoritmos e Estruturas de Dados I', semestre: 1, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_1_4', nome: 'Filosofia', semestre: 1, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_1_5', nome: 'Introdução a Engenharia', semestre: 1, preRequisitos: [], status: 'disponivel' },

  // --- 2º SEMESTRE ---
  { id: 'ele_2_1', nome: 'Cálculo II', semestre: 2, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_2_2', nome: 'Física I', semestre: 2, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_2_3', nome: 'Algoritmos e Estruturas de Dados II', semestre: 2, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_2_4', nome: 'Desenho', semestre: 2, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_2_5', nome: 'Engenharia Ambiental', semestre: 2, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_2_6', nome: 'Geometria Analítica e Álgebra Linear', semestre: 2, preRequisitos: [], status: 'disponivel' },

  // --- 3º SEMESTRE ---
  { id: 'ele_3_1', nome: 'Cálculo III', semestre: 3, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_3_2', nome: 'Física II', semestre: 3, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_3_3', nome: 'Estatística e Probabilidade', semestre: 3, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_3_4', nome: 'Equações Diferenciais', semestre: 3, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_3_5', nome: 'Física III', semestre: 3, preRequisitos: [], status: 'disponivel' },

  // --- 4º SEMESTRE ---
  { id: 'ele_4_1', nome: 'Eletromagnetismo', semestre: 4, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_4_2', nome: 'Mecânica Geral', semestre: 4, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_4_3', nome: 'Circuitos Elétricos I', semestre: 4, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_4_4', nome: 'Sinais e Sistemas', semestre: 4, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_4_5', nome: 'Algoritmos Numéricos', semestre: 4, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_4_6', nome: 'Laboratório de Circuitos Elétricos I', semestre: 4, preRequisitos: [], status: 'disponivel' },

  // --- 5º SEMESTRE ---
  { id: 'ele_5_1', nome: 'Circuitos Elétricos II', semestre: 5, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_5_2', nome: 'Laboratório de Circuitos Elétricos II', semestre: 5, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_5_3', nome: 'Eletrônica I', semestre: 5, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_5_4', nome: 'Laboratório de Eletrônica I', semestre: 5, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_5_5', nome: 'Conversão Eletromecânica de Energia', semestre: 5, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_5_6', nome: 'Prototipagem de Sistemas Eletrônicos', semestre: 5, preRequisitos: [], status: 'disponivel' },

  // --- 6º SEMESTRE ---
  { id: 'ele_6_1', nome: 'Eletrônica Digital', semestre: 6, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_6_2', nome: 'Laboratório de Eletrônica Digital', semestre: 6, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_6_3', nome: 'Eletrônica II', semestre: 6, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_6_4', nome: 'Laboratório de Eletrônica II', semestre: 6, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_6_5', nome: 'Acionamentos Elétricos', semestre: 6, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_6_6', nome: 'Eletrônica Industrial', semestre: 6, preRequisitos: [], status: 'disponivel' },

  // --- 7º SEMESTRE ---
  { id: 'ele_7_1', nome: 'Sistemas Microcontrolados', semestre: 7, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_7_2', nome: 'Sistemas Digitais', semestre: 7, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_7_3', nome: 'Segurança do Trabalho', semestre: 7, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_7_4', nome: 'Eletrotécnica', semestre: 7, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_7_5', nome: 'Sistemas de Controle', semestre: 7, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_7_6', nome: 'Laboratório de Sistemas de Controle', semestre: 7, preRequisitos: [], status: 'disponivel' },

  // --- 8º SEMESTRE ---
  { id: 'ele_8_1', nome: 'Projetos Elétricos', semestre: 8, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_8_2', nome: 'Fenômenos dos Transportes', semestre: 8, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_8_3', nome: 'Redes e Comunicação de Dados', semestre: 8, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_8_4', nome: 'Medição e Instrumentação Eletrônica', semestre: 8, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_8_5', nome: 'Proteção de Sistemas Elétricos', semestre: 8, preRequisitos: [], status: 'disponivel' },

  // --- 9º SEMESTRE ---
  { id: 'ele_9_1', nome: 'Ciências dos Materiais', semestre: 9, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_9_2', nome: 'Optativa I', semestre: 9, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_9_3', nome: 'Optativa II', semestre: 9, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_9_4', nome: 'Gestão de Projetos de Engenharia', semestre: 9, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_9_5', nome: 'Trabalho de Conclusão de Curso I', semestre: 9, preRequisitos: [], status: 'disponivel' },

  // --- 10º SEMESTRE ---
  { id: 'ele_10_1', nome: 'Empreendedorismo', semestre: 10, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_10_2', nome: 'Economia para Engenheiros', semestre: 10, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_10_3', nome: 'Gestão da Qualidade', semestre: 10, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_10_4', nome: 'Libras', semestre: 10, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_10_5', nome: 'Optativa III', semestre: 10, preRequisitos: [], status: 'disponivel' },
  { id: 'ele_10_6', nome: 'Trabalho de Conclusão de Curso II', semestre: 10, preRequisitos: [], status: 'disponivel' },
];