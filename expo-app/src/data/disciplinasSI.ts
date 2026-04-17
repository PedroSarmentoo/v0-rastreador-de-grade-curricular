import { Disciplina } from '../types';

export const disciplinasSI: Disciplina[] = [
  // --- 1º SEMESTRE ---
  { id: 'adm', nome: 'Administração', semestre: 1, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'aed1', nome: 'Algoritmos e Estruturas de Dados I', semestre: 1, preRequisitos: [], status: 'disponivel', cargaHoraria: 90 },
  { id: 'comp_soc', nome: 'Computação e Sociedade', semestre: 1, preRequisitos: [], status: 'disponivel', cargaHoraria: 30 },
  { id: 'fsi', nome: 'Fundamentos de Sistemas de Informação', semestre: 1, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'ing1', nome: 'Inglês Instrumental I', semestre: 1, preRequisitos: [], status: 'disponivel', cargaHoraria: 30 },
  { id: 'intro_comp', nome: 'Introdução à Computação', semestre: 1, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'mat_comp', nome: 'Matemática Computacional', semestre: 1, preRequisitos: [], status: 'disponivel', cargaHoraria: 90 },
  { id: 'port_inst', nome: 'Português Instrumental', semestre: 1, preRequisitos: [], status: 'disponivel', cargaHoraria: 30 },

  // --- 2º SEMESTRE ---
  { id: 'aed2', nome: 'Algoritmos e Estruturas de Dados II', semestre: 2, preRequisitos: ['aed1'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'arq_comp', nome: 'Arquitetura de Computadores', semestre: 2, preRequisitos: ['intro_comp'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'calc1', nome: 'Cálculo Diferencial e Integral', semestre: 2, preRequisitos: [], status: 'disponivel', cargaHoraria: 90 },
  { id: 'gaal', nome: 'Geometria Analítica e Álgebra Linear', semestre: 2, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'ing2', nome: 'Inglês Instrumental II', semestre: 2, preRequisitos: ['ing1'], status: 'bloqueada', cargaHoraria: 30 },
  { id: 'met_cient', nome: 'Metodologia Científica', semestre: 2, preRequisitos: [], status: 'disponivel', cargaHoraria: 30 },
  { id: 'prob_estat', nome: 'Probabilidade e Estatística', semestre: 2, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'tgs', nome: 'Teoria Geral dos Sistemas', semestre: 2, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },

  // --- 3º SEMESTRE ---
  { id: 'bd1', nome: 'Banco de Dados I', semestre: 3, preRequisitos: ['aed2', 'mat_comp'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'calc_num', nome: 'Cálculo Numérico', semestre: 3, preRequisitos: ['calc1', 'gaal'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'eng_soft1', nome: 'Engenharia de Software I', semestre: 3, preRequisitos: ['aed1'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'gest_info', nome: 'Gestão da Informação e do Conhecimento', semestre: 3, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'grafos', nome: 'Grafos Computacionais', semestre: 3, preRequisitos: ['aed2', 'mat_comp'], status: 'bloqueada', cargaHoraria: 30 },
  { id: 'prog1', nome: 'Programação I', semestre: 3, preRequisitos: ['aed2'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'sig', nome: 'Sistemas de Informação Gerencial', semestre: 3, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'teoria_comp', nome: 'Teoria da Computação', semestre: 3, preRequisitos: ['mat_comp'], status: 'bloqueada', cargaHoraria: 60 },

  // --- 4º SEMESTRE ---
  { id: 'bd2', nome: 'Banco de Dados II', semestre: 4, preRequisitos: ['bd1'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'eng_soft2', nome: 'Engenharia de Software II', semestre: 4, preRequisitos: ['eng_soft1'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'gest_fin', nome: 'Gestão Financeira e Contábil', semestre: 4, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'ihc', nome: 'Interação Humano-Computador', semestre: 4, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'mkt_info', nome: 'Marketing em Informática', semestre: 4, preRequisitos: [], status: 'disponivel', cargaHoraria: 30 },
  { id: 'prog2', nome: 'Programação II', semestre: 4, preRequisitos: ['prog1'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'redes', nome: 'Redes de Computadores', semestre: 4, preRequisitos: ['intro_comp'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'sis_op', nome: 'Sistemas Operacionais', semestre: 4, preRequisitos: ['arq_comp', 'aed1'], status: 'bloqueada', cargaHoraria: 60 },

  // --- 5º SEMESTRE ---
  { id: 'comp_graf', nome: 'Computação Gráfica', semestre: 5, preRequisitos: ['gaal'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'com_dados', nome: 'Comunicação de Dados', semestre: 5, preRequisitos: ['redes'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'desenv_web', nome: 'Desenvolvimento Web', semestre: 5, preRequisitos: ['prog1'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'pesq_op', nome: 'Pesquisa Operacional', semestre: 5, preRequisitos: ['calc1', 'gaal'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'qual_soft', nome: 'Qualidade de Software', semestre: 5, preRequisitos: ['eng_soft2'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'sis_dist1', nome: 'Sistemas Distribuídos I', semestre: 5, preRequisitos: ['sis_op'], status: 'bloqueada', cargaHoraria: 60 },

  // --- 6º SEMESTRE ---
  { id: 'ger_proj_soft', nome: 'Gerência de Projetos de Software', semestre: 6, preRequisitos: ['qual_soft'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'ia', nome: 'Inteligência Artificial', semestre: 6, preRequisitos: ['aed2', 'calc1'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'opt1', nome: 'Optativa I', semestre: 6, preRequisitos: ['prog1'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'proj_tcc', nome: 'Projeto de TCC', semestre: 6, preRequisitos: ['met_cient'], status: 'bloqueada', cargaHoraria: 30 },
  { id: 'psico_org', nome: 'Psicologia Organizacional', semestre: 6, preRequisitos: [], status: 'disponivel', cargaHoraria: 30 },
  { id: 'sis_dist2', nome: 'Sistemas Distribuídos II', semestre: 6, preRequisitos: ['sis_dist1', 'redes'], status: 'bloqueada', cargaHoraria: 60 },

  // --- 7º SEMESTRE ---
  { id: 'eco_fin', nome: 'Economia e Finanças', semestre: 7, preRequisitos: [], status: 'disponivel', cargaHoraria: 30 },
  { id: 'emp_info', nome: 'Empreendedorismo em Informática', semestre: 7, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'gest_proc', nome: 'Gestão de Processos', semestre: 7, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'opt2', nome: 'Optativa II', semestre: 7, preRequisitos: ['ia'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'sad', nome: 'Sistemas de Apoio à Decisão', semestre: 7, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'tcc1', nome: 'TCC I', semestre: 7, preRequisitos: ['proj_tcc'], status: 'bloqueada', cargaHoraria: 30 },

  // --- 8º SEMESTRE ---
  { id: 'filo_etica', nome: 'Filosofia e Ética', semestre: 8, preRequisitos: [], status: 'disponivel', cargaHoraria: 30 },
  { id: 'socio', nome: 'Sociologia', semestre: 8, preRequisitos: [], status: 'disponivel', cargaHoraria: 30 },
  { id: 'leg_etica', nome: 'Legislação e Ética da Profissão', semestre: 8, preRequisitos: [], status: 'disponivel', cargaHoraria: 30 },
  { id: 'opt3', nome: 'Optativa III', semestre: 8, preRequisitos: ['redes'], status: 'bloqueada', cargaHoraria: 60 },
  { id: 'opt4', nome: 'Optativa IV', semestre: 8, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'seg_aud', nome: 'Segurança e Auditoria de Sistemas', semestre: 8, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'tcc2', nome: 'TCC II', semestre: 8, preRequisitos: ['tcc1'], status: 'bloqueada', cargaHoraria: 30 }
];