import { Disciplina } from '../types';

export const disciplinasIniciais: Disciplina[] = [
  // SEMESTRE 1
  { id: 'aed1', nome: 'Algoritmos e Estruturas de Dados I', semestre: 1, preRequisitos: [], status: 'disponivel' },
  { id: 'proj_hum1', nome: 'Projeto Orientado em Humanidades I', semestre: 1, preRequisitos: [], status: 'disponivel' },
  { id: 'calc1', nome: 'Cálculo Integral e Diferencial I', semestre: 1, preRequisitos: [], status: 'disponivel' },
  { id: 'intro_eng', nome: 'Introdução à Engenharia de Sistemas', semestre: 1, preRequisitos: [], status: 'disponivel' },
  { id: 'sist_dig', nome: 'Sistemas Digitais', semestre: 1, preRequisitos: [], status: 'disponivel' },
  { id: 'gaal', nome: 'Geometria Analítica e Álgebra Linear', semestre: 1, preRequisitos: [], status: 'disponivel' },

  // SEMESTRE 2
  { id: 'aed2', nome: 'Algoritmos e Estruturas de Dados II', semestre: 2, preRequisitos: ['aed1'], status: 'bloqueada' },
  { id: 'bd', nome: 'Banco de Dados', semestre: 2, preRequisitos: ['aed1'], status: 'bloqueada' },
  { id: 'calc2', nome: 'Cálculo Integral e Diferencial II', semestre: 2, preRequisitos: ['calc1'], status: 'bloqueada' },
  { id: 'fund_mec', nome: 'Fundamentos de Mecânica', semestre: 2, preRequisitos: ['calc1'], status: 'bloqueada' },
  { id: 'lab_sist_dig', nome: 'Laboratório de Sistemas Digitais', semestre: 2, preRequisitos: ['sist_dig'], status: 'bloqueada' },
  { id: 'circ_elet1', nome: 'Circuitos Elétricos I', semestre: 2, preRequisitos: ['gaal'], status: 'bloqueada' },

  // SEMESTRE 3
  { id: 'aed3', nome: 'Algoritmos e Estruturas de Dados III', semestre: 3, preRequisitos: ['aed2'], status: 'bloqueada' },
  { id: 'eq_dif_a', nome: 'Equações Diferenciais A', semestre: 3, preRequisitos: ['calc2'], status: 'bloqueada' },
  { id: 'calc3', nome: 'Cálculo Integral e Diferencial III', semestre: 3, preRequisitos: ['calc2'], status: 'bloqueada' },
  { id: 'fund_mec_sol', nome: 'Fund. Mecânica dos Sólidos e Fluidos', semestre: 3, preRequisitos: ['fund_mec'], status: 'bloqueada' },
  { id: 'fund_eletromag', nome: 'Fundamentos de Eletromagnetismo', semestre: 3, preRequisitos: ['calc2'], status: 'bloqueada' },
  { id: 'analise_num', nome: 'Análise Numérica', semestre: 3, preRequisitos: ['calc2','gaal'], status: 'bloqueada' },
  { id: 'inic_filo', nome: 'Iniciação Filosófica', semestre: 3, preRequisitos: [], status: 'disponivel' }, // Como não tem pré-requisitos, fica disponível!

  // SEMESTRE 4
  { id: 'poo', nome: 'Programação Orientada a Objetos', semestre: 4, preRequisitos: ['aed2'], status: 'bloqueada' },
  { id: 'eq_dif_b', nome: 'Equações Diferenciais B', semestre: 4, preRequisitos: ['eq_dif_a'], status: 'bloqueada' },
  { id: 'estat_prob', nome: 'Estatística e Probabilidade', semestre: 4, preRequisitos: ['calc2'], status: 'bloqueada' },
  { id: 'fund_termo', nome: 'Fundamentos de Termodinâmica', semestre: 4, preRequisitos: ['fund_mec_sol'], status: 'bloqueada' },
  { id: 'otim_nao_linear', nome: 'Otimização Não Linear', semestre: 4, preRequisitos: ['calc2', 'gaal'], status: 'bloqueada' },
  { id: 'circ_elet2', nome: 'Circuitos Elétricos II', semestre: 4, preRequisitos: ['circ_elet1'], status: 'bloqueada' },
  { id: 'lab_circ_elet', nome: 'Laboratório de Circuitos Elétricos', semestre: 4, preRequisitos: ['circ_elet1'], status: 'bloqueada' },

  // SEMESTRE 5
  { id: 'eng_soft', nome: 'Engenharia de Software', semestre: 5, preRequisitos: ['poo','bd'], status: 'bloqueada' },
  { id: 'pac', nome: 'Projeto Assistido por Computador', semestre: 5, preRequisitos: ['poo'], status: 'bloqueada' },
  { id: 'sin_sist', nome: 'Sinais e Sistemas', semestre: 5, preRequisitos: ['eq_dif_b'], status: 'bloqueada' },
  { id: 'proj_hum2', nome: 'Projeto Orientado em Humanidades II', semestre: 5, preRequisitos: [], status: 'disponivel' },
  { id: 'lab_eletronica', nome: 'Laboratório de Eletrônica', semestre: 5, preRequisitos: ['lab_circ_elet'], status: 'bloqueada' },
  { id: 'eletronica', nome: 'Eletrônica', semestre: 5, preRequisitos: ['circ_elet2'], status: 'bloqueada' },

  // SEMESTRE 6
  { id: 'com_dados1', nome: 'Comunicação de Dados I', semestre: 6, preRequisitos: [], status: 'disponivel' },
  { id: 'gest_proj', nome: 'Gestão de Projetos', semestre: 6, preRequisitos: [], status: 'disponivel' },
  { id: 'sist_dinam', nome: 'Sistemas Dinâmicos', semestre: 6, preRequisitos: ['sin_sist'], status: 'bloqueada' },
  { id: 'pesq_op', nome: 'Pesquisa Operacional', semestre: 6, preRequisitos: ['otim_nao_linear'], status: 'bloqueada' },
  { id: 'comp_evol', nome: 'Computação Evolutiva', semestre: 6, preRequisitos: ['otim_nao_linear'], status: 'bloqueada' },
  { id: 'intel_comp', nome: 'Inteligência Computacional', semestre: 6, preRequisitos: ['otim_nao_linear'], status: 'bloqueada' },

  // SEMESTRE 7
  { id: 'com_dados2', nome: 'Comunicação de Dados II', semestre: 7, preRequisitos: ['com_dados1'], status: 'bloqueada' },
  { id: 'tees1', nome: 'Tópicos Especiais em Eng. de Sistemas I', semestre: 7, preRequisitos: [], status: 'disponivel' },
  { id: 'confiabilidade', nome: 'Confiabilidade', semestre: 7, preRequisitos: ['estat_prob'], status: 'bloqueada' },
  { id: 'met_comp_apl_eng', nome: 'Mét. Computacionais Aplicados à Engenharia', semestre: 7, preRequisitos: [], status: 'disponivel' },
  { id: 'sist_micro', nome: 'Sistemas Microprocessados', semestre: 7, preRequisitos: ['eletronica'], status: 'bloqueada' },
  { id: 'acion_elet', nome: 'Acionamentos Elétricos', semestre: 7, preRequisitos: ['circ_elet2'], status: 'bloqueada' },

  // SEMESTRE 8
  { id: 'form_ger', nome: 'Formação Gerencial', semestre: 8, preRequisitos: [], status: 'disponivel' },
  { id: 'prog_tempo_real', nome: 'Programação em Tempo Real', semestre: 8, preRequisitos: ['pac'], status: 'bloqueada' },
  { id: 'controle_sist', nome: 'Controle de Sistemas', semestre: 8, preRequisitos: ['sin_sist'], status: 'bloqueada' },
  { id: 'sist_comp', nome: 'Sistemas Complexos', semestre: 8, preRequisitos: ['sist_dinam'], status: 'bloqueada' },
  { id: 'teta', nome: 'Téc. Elaboração de Trabalhos Acadêmicos', semestre: 8, preRequisitos: [], status: 'disponivel' },
  { id: 'inst_ind', nome: 'Instrumentação Industrial', semestre: 8, preRequisitos: ['eletronica'], status: 'bloqueada' },

  // SEMESTRE 9
  { id: 'sist_dist', nome: 'Sistemas Distribuídos', semestre: 9, preRequisitos: ['com_dados2', 'aed3'], status: 'bloqueada' },
  { id: 'sist_esp', nome: 'Sistemas Especialistas', semestre: 9, preRequisitos: ['aed3'], status: 'bloqueada' },
  { id: 'tees2', nome: 'Tópicos Especiais em Eng. de Sistemas II', semestre: 9, preRequisitos: [], status: 'disponivel' },
  { id: 'proc_criad_emp', nome: 'Processos Criativos e Empreendedorismo', semestre: 9, preRequisitos: [], status: 'disponivel' },
  { id: 'teo_decisao', nome: 'Teoria da Decisão', semestre: 9, preRequisitos: ['pesq_op', 'estat_prob'], status: 'bloqueada' },

  // SEMESTRE 10
  { id: 'gest_qual', nome: 'Gestão da Qualidade', semestre: 10, preRequisitos: [], status: 'disponivel' },
  { id: 'tees3', nome: 'Tópicos Especiais em Eng. de Sistemas III', semestre: 10, preRequisitos: [], status: 'disponivel' },
  { id: 'gest_rh', nome: 'Gestão de Recursos Humanos', semestre: 10, preRequisitos: [], status: 'disponivel' },
  { id: 'libras', nome: 'Libras', semestre: 10, preRequisitos: [], status: 'disponivel' },
  { id: 'econ_eng', nome: 'Economia para Engenheiros', semestre: 10, preRequisitos: [], status: 'disponivel' }

  //Adicione mais disciplinas aqui seguindo o mesmo padrão:
  // { id: 'xxx', nome: 'Disciplina X', semestre: 4, preRequisitos: ['yyy'], status: 'bloqueada' },
];