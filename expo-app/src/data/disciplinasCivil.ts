import { Disciplina } from '../types';

export const disciplinasCivil: Disciplina[] = [
  // --- 1º SEMESTRE ---
  { id: 'calc1', nome: 'Cálculo Diferencial e Integral I', semestre: 1, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'quim_tec', nome: 'Química Geral Tecnológica I', semestre: 1, preRequisitos: [], status: 'disponivel', cargaHoraria: 75 },
  { id: 'gaal', nome: 'Geometria Analítica e Álgebra Linear', semestre: 1, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'intro_comp', nome: 'Introdução à Computação', semestre: 1, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'intro_civil', nome: 'Introdução à Engenharia Civil', semestre: 1, preRequisitos: [], status: 'disponivel', cargaHoraria: 30 },
  { id: 'intro_amb', nome: 'Introdução às Ciências do Ambiente', semestre: 1, preRequisitos: [], status: 'disponivel', cargaHoraria: 45 },
  { id: 'filo', nome: 'Iniciação Filosófica', semestre: 1, preRequisitos: [], status: 'disponivel', cargaHoraria: 30 },

  // --- 2º SEMESTRE ---
  { id: 'calc2', nome: 'Cálculo Diferencial e Integral II', semestre: 2, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'fis1', nome: 'Física I', semestre: 2, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'calc_num', nome: 'Cálculo Numérico', semestre: 2, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'estatistica', nome: 'Estatística para Engenharia Civil', semestre: 2, preRequisitos: [], status: 'disponivel', cargaHoraria: 75 },
  { id: 'geo_desc', nome: 'Geometria Descritiva', semestre: 2, preRequisitos: [], status: 'disponivel', cargaHoraria: 45 },
  { id: 'leitura_txt', nome: 'Leitura e Produção de Textos', semestre: 2, preRequisitos: [], status: 'disponivel', cargaHoraria: 30 },

  // --- 3º SEMESTRE ---
  { id: 'calc3', nome: 'Cálculo Diferencial e Integral III', semestre: 3, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'fis2', nome: 'Física II', semestre: 3, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'fund_mec', nome: 'Fundamentos de Mecânica', semestre: 3, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'topografia', nome: 'Topografia aplicada à Engenharia Civil', semestre: 3, preRequisitos: [], status: 'disponivel', cargaHoraria: 75 },
  { id: 'geologia', nome: 'Geologia aplicada à Engenharia', semestre: 3, preRequisitos: [], status: 'disponivel', cargaHoraria: 45 },
  { id: 'exp_grafica', nome: 'Linguagem e Expressão Gráfica', semestre: 3, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },

  // --- 4º SEMESTRE ---
  { id: 'fis3', nome: 'Física III', semestre: 4, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'fen_transp', nome: 'Fenômenos de Transportes', semestre: 4, preRequisitos: [], status: 'disponivel', cargaHoraria: 75 },
  { id: 'res_mat1', nome: 'Resistência dos Materiais I', semestre: 4, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'analise_est1', nome: 'Análise Estrutural I', semestre: 4, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'gestao_amb', nome: 'Controle e Gestão Ambiental', semestre: 4, preRequisitos: [], status: 'disponivel', cargaHoraria: 45 },
  { id: 'socio_ind', nome: 'Sociologia da Indústria e do Trabalho', semestre: 4, preRequisitos: [], status: 'disponivel', cargaHoraria: 45 },
  { id: 'eq_dif', nome: 'Equações Diferenciais Ordinárias', semestre: 4, preRequisitos: [], status: 'disponivel', cargaHoraria: 45 },

  // --- 5º SEMESTRE ---
  { id: 'analise_est2', nome: 'Análise Estrutural II', semestre: 5, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'res_mat2', nome: 'Resistência dos Materiais II', semestre: 5, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'eletrotec', nome: 'Eletrotécnica Geral e Instalações Prediais', semestre: 5, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'mec_solos', nome: 'Mecânica dos Solos', semestre: 5, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'mat_const1', nome: 'Materiais de Construção I', semestre: 5, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'hidraulica', nome: 'Hidráulica', semestre: 5, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },

  // --- 6º SEMESTRE ---
  { id: 'arq_urb', nome: 'Arquitetura e Urbanismo', semestre: 6, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'mat_const2', nome: 'Materiais de Construção II', semestre: 6, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'conc_armado1', nome: 'Estruturas de Concreto Armado I', semestre: 6, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'san_amb', nome: 'Saneamento Ambiental', semestre: 6, preRequisitos: [], status: 'disponivel', cargaHoraria: 45 },
  { id: 'sist_transp', nome: 'Análise de Sistema de Transporte', semestre: 6, preRequisitos: [], status: 'disponivel', cargaHoraria: 45 },
  { id: 'inst_hidro', nome: 'Instalações Hidráulicas e Sanitárias Prediais', semestre: 6, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },

  // --- 7º SEMESTRE ---
  { id: 'plan_urbano', nome: 'Planejamento Urbano Regional e de Transportes', semestre: 7, preRequisitos: [], status: 'disponivel', cargaHoraria: 45 },
  { id: 'conc_armado2', nome: 'Estruturas de Concreto Armado II', semestre: 7, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'proj_estradas', nome: 'Projeto de Estradas e Vias Urbanas', semestre: 7, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'sist_abast_agua', nome: 'Sistemas de Abastecimento de Água', semestre: 7, preRequisitos: [], status: 'disponivel', cargaHoraria: 75 },
  { id: 'hidrologia', nome: 'Hidrologia Aplicada', semestre: 7, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'fundacoes', nome: 'Fundações e Estruturas de Contenções', semestre: 7, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },

  // --- 8º SEMESTRE ---
  { id: 'tec_edificacoes', nome: 'Tecnologia das Edificações', semestre: 8, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'ger_residuos', nome: 'Gerenciamento de Resíduos Sólidos', semestre: 8, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'est_metalicas', nome: 'Estruturas Metálicas', semestre: 8, preRequisitos: [], status: 'disponivel', cargaHoraria: 45 },
  { id: 'sist_esgoto', nome: 'Sistema de Esgotamento Sanitário', semestre: 8, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'proj_arq', nome: 'Projeto Arquitetônico e Representação Gráfica', semestre: 8, preRequisitos: [], status: 'disponivel', cargaHoraria: 75 },
  { id: 'alvenaria_est', nome: 'Alvenaria Estrutural', semestre: 8, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'leg_pericias', nome: 'Legislação, Avaliações e Perícias', semestre: 8, preRequisitos: [], status: 'disponivel', cargaHoraria: 45 },

  // --- 9º SEMESTRE ---
  { id: 'proj_orientado1', nome: 'Projeto Orientado I', semestre: 9, preRequisitos: [], status: 'disponivel', cargaHoraria: 30 },
  { id: 'custos_orc', nome: 'Custos e Orçamentos', semestre: 9, preRequisitos: [], status: 'disponivel', cargaHoraria: 45 },
  { id: 'pavimentacao', nome: 'Pavimentação', semestre: 9, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'ger_projetos', nome: 'Gerenciamento de Projetos', semestre: 9, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'est_madeira', nome: 'Estruturas de Madeira', semestre: 9, preRequisitos: [], status: 'disponivel', cargaHoraria: 45 },
  { id: 'seg_higiene', nome: 'Segurança e Higiene do Trabalho', semestre: 9, preRequisitos: [], status: 'disponivel', cargaHoraria: 30 },
  { id: 'dren_urbana', nome: 'Drenagem Urbana', semestre: 9, preRequisitos: [], status: 'disponivel', cargaHoraria: 45 },
  { id: 'opt1', nome: 'Optativa I', semestre: 9, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'estagio1', nome: 'Estágio Supervisionado I', semestre: 9, preRequisitos: [], status: 'disponivel', cargaHoraria: 125 },
  { id: 'ori_estagio1', nome: 'Orientação de Estágio Supervisionado I', semestre: 9, preRequisitos: [], status: 'disponivel', cargaHoraria: 30 },

  // --- 10º SEMESTRE ---
  { id: 'proj_orientado2', nome: 'Projeto Orientado II', semestre: 10, preRequisitos: [], status: 'disponivel', cargaHoraria: 30 },
  { id: 'opt2', nome: 'Optativa II', semestre: 10, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'pontes', nome: 'Pontes em Concreto', semestre: 10, preRequisitos: [], status: 'disponivel', cargaHoraria: 45 },
  { id: 'opt3', nome: 'Optativa III', semestre: 10, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'eco_empresas', nome: 'Economia para empresas de Engenharia', semestre: 10, preRequisitos: [], status: 'disponivel', cargaHoraria: 45 },
  { id: 'opt4', nome: 'Optativa IV', semestre: 10, preRequisitos: [], status: 'disponivel', cargaHoraria: 60 },
  { id: 'etica_prof', nome: 'Ética e Exercício Profissional', semestre: 10, preRequisitos: [], status: 'disponivel', cargaHoraria: 30 },
  { id: 'estagio2', nome: 'Estágio Supervisionado II', semestre: 10, preRequisitos: [], status: 'disponivel', cargaHoraria: 125 },
  { id: 'ori_estagio2', nome: 'Orientação de Estágio Supervisionado II', semestre: 10, preRequisitos: [], status: 'disponivel', cargaHoraria: 30 }
];