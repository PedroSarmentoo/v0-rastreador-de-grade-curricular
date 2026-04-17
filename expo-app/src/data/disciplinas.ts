import { Disciplina } from '../types';

export const disciplinasIniciais: Disciplina[] = [
  // --- 1º SEMESTRE ---
  { id: 'aed1', nome: 'Algoritmos e Estruturas de Dados I', semestre: 1, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'proj_hum1', nome: 'Projeto Orientado em Humanidades I', semestre: 1, preRequisitos: [], status: 'disponivel', cargaHoraria: 30 },
  { id: 'calc1', nome: 'Cálculo Integral e Diferencial I', semestre: 1, preRequisitos: [], status: 'disponivel', cargaHoraria: 90 },
  { id: 'intro_eng', nome: 'Introdução à Engenharia de Sistemas', semestre: 1, preRequisitos: [], status: 'disponivel', cargaHoraria: 30 },
  { id: 'sist_dig', nome: 'Sistemas Digitais', semestre: 1, preRequisitos: [], status: 'disponivel', cargaHoraria: 45 },
  { id: 'gaal', nome: 'Geometria Analítica e Álgebra Linear', semestre: 1, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },

  // --- 2º SEMESTRE ---
  { id: 'aed2', nome: 'Algoritmos e Estruturas de Dados II', semestre: 2, preRequisitos: ['aed1'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'bd', nome: 'Banco de Dados', semestre: 2, preRequisitos: ['aed1'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'calc2', nome: 'Cálculo Integral e Diferencial II', semestre: 2, preRequisitos: ['calc1'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'fund_mec', nome: 'Fundamentos de Mecânica', semestre: 2, preRequisitos: ['calc1'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'lab_sist_dig', nome: 'Laboratório de Sistemas Digitais', semestre: 2, preRequisitos: ['sist_dig'], status: 'bloqueada', cargaHoraria: 30 },
  { id: 'circ_elet1', nome: 'Circuitos Elétricos I', semestre: 2, preRequisitos: ['gaal'], status: 'bloqueada', cargaHoraria: 30 },

  // --- 3º SEMESTRE ---
  { id: 'aed3', nome: 'Algoritmos e Estruturas de Dados III', semestre: 3, preRequisitos: ['aed2'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'eq_dif_a', nome: 'Equações Diferenciais A', semestre: 3, preRequisitos: ['calc2'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'calc3', nome: 'Cálculo Integral e Diferencial III', semestre: 3, preRequisitos: ['calc2'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'fund_mec_sol', nome: 'Fund. Mecânica dos Sólidos e Fluidos', semestre: 3, preRequisitos: ['fund_mec'], status: 'bloqueada', cargaHoraria: 30 },
  { id: 'fund_eletromag', nome: 'Fundamentos de Eletromagnetismo', semestre: 3, preRequisitos: ['calc2'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'analise_num', nome: 'Análise Numérica', semestre: 3, preRequisitos: ['calc2','gaal'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'inic_filo', nome: 'Iniciação Filosófica', semestre: 3, preRequisitos: [], status: 'disponivel', cargaHoraria: 30 },

  // --- 4º SEMESTRE ---
  { id: 'poo', nome: 'Programação Orientada a Objetos', semestre: 4, preRequisitos: ['aed2'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'eq_dif_b', nome: 'Equações Diferenciais B', semestre: 4, preRequisitos: ['eq_dif_a'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'estat_prob', nome: 'Estatística e Probabilidade', semestre: 4, preRequisitos: ['calc2'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'fund_termo', nome: 'Fundamentos de Termodinâmica', semestre: 4, preRequisitos: ['fund_mec_sol'], status: 'bloqueada', cargaHoraria: 30 },
  { id: 'otim_nao_linear', nome: 'Otimização Não Linear', semestre: 4, preRequisitos: ['calc2', 'gaal'], status: 'bloqueada', cargaHoraria: 30 },
  { id: 'circ_elet2', nome: 'Circuitos Elétricos II', semestre: 4, preRequisitos: ['circ_elet1'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'lab_circ_elet', nome: 'Laboratório de Circuitos Elétricos', semestre: 4, preRequisitos: ['circ_elet1'], status: 'bloqueada', cargaHoraria: 30 },

  // --- 5º SEMESTRE ---
  { id: 'eng_soft', nome: 'Engenharia de Software', semestre: 5, preRequisitos: ['poo','bd'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'pac', nome: 'Projeto Assistido por Computador', semestre: 5, preRequisitos: ['poo'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'sin_sist', nome: 'Sinais e Sistemas', semestre: 5, preRequisitos: ['eq_dif_b'], status: 'bloqueada', cargaHoraria: 90 },
  { id: 'proj_hum2', nome: 'Projeto Orientado em Humanidades II', semestre: 5, preRequisitos: [], status: 'disponivel', cargaHoraria: 30 },
  { id: 'lab_eletronica', nome: 'Laboratório de Eletrônica', semestre: 5, preRequisitos: ['lab_circ_elet'], status: 'bloqueada', cargaHoraria: 30 },
  { id: 'eletronica', nome: 'Eletrônica', semestre: 5, preRequisitos: ['circ_elet2'], status: 'bloqueada', cargaHoraria: 60 },

  // --- 6º SEMESTRE ---
  { id: 'com_dados1', nome: 'Comunicação de Dados I', semestre: 6, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'gest_proj', nome: 'Gestão de Projetos', semestre: 6, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'sist_dinam', nome: 'Sistemas Dinâmicos', semestre: 6, preRequisitos: ['sin_sist'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'pesq_op', nome: 'Pesquisa Operacional', semestre: 6, preRequisitos: ['otim_nao_linear'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'comp_evol', nome: 'Computação Evolutiva', semestre: 6, preRequisitos: ['otim_nao_linear'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'intel_comp', nome: 'Inteligência Computacional', semestre: 6, preRequisitos: ['otim_nao_linear'], status: 'bloqueada', cargaHoraria: 60 },

  // --- 7º SEMESTRE ---
  { id: 'com_dados2', nome: 'Comunicação de Dados II', semestre: 7, preRequisitos: ['com_dados1'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'tees1', nome: 'Tópicos Especiais em Eng. de Sistemas I', semestre: 7, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'confiabilidade', nome: 'Confiabilidade', semestre: 7, preRequisitos: ['estat_prob'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'met_comp_apl_eng', nome: 'Mét. Computacionais Aplicados à Engenharia', semestre: 7, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'sist_micro', nome: 'Sistemas Microprocessados', semestre: 7, preRequisitos: ['eletronica'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'acion_elet', nome: 'Acionamentos Elétricos', semestre: 7, preRequisitos: ['circ_elet2'], status: 'bloqueada', cargaHoraria: 60 },

  // --- 8º SEMESTRE ---
  { id: 'form_ger', nome: 'Formação Gerencial', semestre: 8, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'prog_tempo_real', nome: 'Programação em Tempo Real', semestre: 8, preRequisitos: ['pac'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'controle_sist', nome: 'Controle de Sistemas', semestre: 8, preRequisitos: ['sin_sist'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'sist_comp', nome: 'Sistemas Complexos', semestre: 8, preRequisitos: ['sist_dinam'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'teta', nome: 'Téc. Elaboração de Trabalhos Acadêmicos', semestre: 8, preRequisitos: [], status: 'disponivel', cargaHoraria: 30 },
  { id: 'inst_ind', nome: 'Instrumentação Industrial', semestre: 8, preRequisitos: ['eletronica'], status: 'bloqueada', cargaHoraria: 60 },

  // --- 9º SEMESTRE ---
  { id: 'sist_dist', nome: 'Sistemas Distribuídos', semestre: 9, preRequisitos: ['com_dados2', 'aed3'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'sist_esp', nome: 'Sistemas Especialistas', semestre: 9, preRequisitos: ['aed3'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'tees2', nome: 'Tópicos Especiais em Eng. de Sistemas II', semestre: 9, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'proc_criad_emp', nome: 'Processos Criativos e Empreendedorismo', semestre: 9, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'teo_decisao', nome: 'Teoria da Decisão', semestre: 9, preRequisitos: ['pesq_op', 'estat_prob'], status: 'bloqueada', cargaHoraria: 60 },

  // --- 10º SEMESTRE ---
  { id: 'gest_qual', nome: 'Gestão da Qualidade', semestre: 10, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'tees3', nome: 'Tópicos Especiais em Eng. de Sistemas III', semestre: 10, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'gest_rh', nome: 'Gestão de Recursos Humanos', semestre: 10, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'libras', nome: 'Libras', semestre: 10, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'econ_eng', nome: 'Economia para Engenheiros', semestre: 10, preRequisitos: [], status: 'disponivel', cargaHoraria: 30 }
];