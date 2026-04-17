import { Disciplina } from '../types';

export const disciplinasEletrica: Disciplina[] = [
  // --- 1º SEMESTRE ---
  { id: 'calc1', nome: 'Cálculo I', semestre: 1, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'quim_geral', nome: 'Química Geral', semestre: 1, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'aed1', nome: 'Algoritmos e Estruturas de Dados I', semestre: 1, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'filosofia', nome: 'Filosofia', semestre: 1, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'intro_eng', nome: 'Introdução à Engenharia', semestre: 1, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },

  // --- 2º SEMESTRE ---
  { id: 'calc2', nome: 'Cálculo II', semestre: 2, preRequisitos: ['calc1'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'fis1', nome: 'Física I', semestre: 2, preRequisitos: ['calc1'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'aed2', nome: 'Algoritmos e Estruturas de Dados II', semestre: 2, preRequisitos: ['aed1'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'desenho', nome: 'Desenho', semestre: 2, preRequisitos: [], status: 'disponivel', cargaHoraria: 30 },
  { id: 'eng_amb', nome: 'Engenharia Ambiental', semestre: 2, preRequisitos: [], status: 'disponivel', cargaHoraria: 30 },
  { id: 'gaal', nome: 'Geometria Analítica e Álgebra Linear', semestre: 2, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },

  // --- 3º SEMESTRE ---
  { id: 'calc3', nome: 'Cálculo III', semestre: 3, preRequisitos: ['calc2'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'fis2', nome: 'Física II', semestre: 3, preRequisitos: ['fis1'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'estat_prob', nome: 'Estatística e Probabilidade', semestre: 3, preRequisitos: ['calc2'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'eq_dif', nome: 'Equações Diferenciais', semestre: 3, preRequisitos: ['calc2'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'fis3', nome: 'Física III', semestre: 3, preRequisitos: ['calc2'], status: 'bloqueada', cargaHoraria: 60 },

  // --- 4º SEMESTRE ---
  { id: 'eletromag', nome: 'Eletromagnetismo', semestre: 4, preRequisitos: ['fis2'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'mec_geral', nome: 'Mecânica Geral', semestre: 4, preRequisitos: ['fis1'], status: 'bloqueada', cargaHoraria: 30 },
  { id: 'circ_elet1', nome: 'Circuitos Elétricos I', semestre: 4, preRequisitos: ['gaal', 'eq_dif'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'sin_sist', nome: 'Sinais e Sistemas', semestre: 4, preRequisitos: ['eq_dif'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'alg_num', nome: 'Algoritmos Numéricos', semestre: 4, preRequisitos: ['fis1'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'lab_circ_elet1', nome: 'Laboratório de Circuitos Elétricos I', semestre: 4, preRequisitos: ['gaal', 'eq_dif'], status: 'bloqueada', cargaHoraria: 30 },

  // --- 5º SEMESTRE ---
  { id: 'circ_elet2', nome: 'Circuitos Elétricos II', semestre: 5, preRequisitos: ['circ_elet1'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'lab_circ_elet2', nome: 'Laboratório de Circuitos Elétricos II', semestre: 5, preRequisitos: ['circ_elet1', 'lab_circ_elet1'], status: 'bloqueada', cargaHoraria: 30 },
  { id: 'eletro1', nome: 'Eletrônica I', semestre: 5, preRequisitos: ['circ_elet1'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'lab_eletro1', nome: 'Laboratório de Eletrônica I', semestre: 5, preRequisitos: ['circ_elet1'], status: 'bloqueada', cargaHoraria: 30 },
  { id: 'conv_eletromec', nome: 'Conversão Eletromecânica de Energia', semestre: 5, preRequisitos: ['circ_elet1'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'prototipagem', nome: 'Prototipagem de Sistemas Eletrônicos', semestre: 5, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },

  // --- 6º SEMESTRE ---
  { id: 'eletro_dig', nome: 'Eletrônica Digital', semestre: 6, preRequisitos: ['eletro1'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'lab_eletro_dig', nome: 'Laboratório de Eletrônica Digital', semestre: 6, preRequisitos: ['eletro1'], status: 'bloqueada', cargaHoraria: 30 },
  { id: 'eletro2', nome: 'Eletrônica II', semestre: 6, preRequisitos: ['eletro1'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'lab_eletro2', nome: 'Laboratório de Eletrônica II', semestre: 6, preRequisitos: ['eletro1'], status: 'bloqueada', cargaHoraria: 30 },
  { id: 'acionamentos', nome: 'Acionamentos Elétricos', semestre: 6, preRequisitos: ['conv_eletromec'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'eletro_ind', nome: 'Eletrônica Industrial', semestre: 6, preRequisitos: ['eletro1'], status: 'bloqueada', cargaHoraria: 60 },

  // --- 7º SEMESTRE ---
  { id: 'sist_micro', nome: 'Sistemas Microcontrolados', semestre: 7, preRequisitos: ['eletro_dig'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'sist_dig', nome: 'Sistemas Digitais', semestre: 7, preRequisitos: ['eletro_dig'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'seg_trab', nome: 'Segurança do Trabalho', semestre: 7, preRequisitos: ['eletro_dig'], status: 'bloqueada', cargaHoraria: 30 },
  { id: 'eletrotec', nome: 'Eletrotécnica', semestre: 7, preRequisitos: ['circ_elet2'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'sist_controle', nome: 'Sistemas de Controle', semestre: 7, preRequisitos: ['sin_sist'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'lab_sist_controle', nome: 'Laboratório de Sistemas de Controle', semestre: 7, preRequisitos: ['sin_sist'], status: 'bloqueada', cargaHoraria: 30 },

  // --- 8º SEMESTRE ---
  { id: 'proj_elet', nome: 'Projetos Elétricos', semestre: 8, preRequisitos: ['eletrotec'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'fen_transp', nome: 'Fenômenos dos Transportes', semestre: 8, preRequisitos: ['sist_dig'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'redes_com', nome: 'Redes e Comunicação de Dados', semestre: 8, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'med_instr', nome: 'Medição e Instrumentação Eletrônica', semestre: 8, preRequisitos: ['eletro2'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'prot_sist_elet', nome: 'Proteção de Sistemas Elétricos', semestre: 8, preRequisitos: ['eletrotec'], status: 'bloqueada', cargaHoraria: 60 },

  // --- 9º SEMESTRE ---
  { id: 'cien_mat', nome: 'Ciências dos Materiais', semestre: 9, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'opt1', nome: 'Optativa I', semestre: 9, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'opt2', nome: 'Optativa II', semestre: 9, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'gest_proj_eng', nome: 'Gestão de Projetos de Engenharia', semestre: 9, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'tcc1', nome: 'Trabalho de Conclusão de Curso I', semestre: 9, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },

  // --- 10º SEMESTRE ---
  { id: 'empree', nome: 'Empreendedorismo', semestre: 10, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'eco_eng', nome: 'Economia para Engenheiros', semestre: 10, preRequisitos: [], status: 'disponivel', cargaHoraria: 30 },
  { id: 'gest_qual', nome: 'Gestão da Qualidade', semestre: 10, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'libras', nome: 'Libras', semestre: 10, preRequisitos: [], status: 'disponivel', cargaHoraria: 30 },
  { id: 'opt3', nome: 'Optativa III', semestre: 10, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'tcc2', nome: 'Trabalho de Conclusão de Curso II', semestre: 10, preRequisitos: ['tcc1'], status: 'bloqueada', cargaHoraria: 60 }
];