import { Disciplina } from '../types';

export const disciplinasMatematica: Disciplina[] = [
  // --- 1º SEMESTRE (Adicione as disciplinas reais aqui) ---
  { id: 'mat_1_1', nome: 'Disciplina Exemplo 1 (Substitua)', semestre: 1, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_1_2', nome: 'Disciplina Exemplo 2 (Substitua)', semestre: 1, preRequisitos: [], status: 'disponivel' },

  // --- 2º SEMESTRE (Adicione as disciplinas reais aqui) ---
  { id: 'mat_2_1', nome: 'Disciplina Exemplo 3 (Substitua)', semestre: 2, preRequisitos: [], status: 'disponivel' },

  // --- 3º SEMESTRE ---
  { id: 'mat_3_1', nome: 'Álgebra Linear II', semestre: 3, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_3_2', nome: 'Cálculo Diferencial e Integral II', semestre: 3, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_3_3', nome: 'Estrutura e Funcionamento do Ensino Fundamental e Médio', semestre: 3, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_3_4', nome: 'Física I', semestre: 3, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_3_5', nome: 'Informática na Matemática Básica e Vice-Versa I', semestre: 3, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_3_6', nome: 'Seminários de Educação, Sociedade e Meio Ambiente', semestre: 3, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_3_7', nome: 'Desenho Geométrico e Geometria Descritiva', semestre: 3, preRequisitos: [], status: 'disponivel' },

  // --- 4º SEMESTRE ---
  { id: 'mat_4_1', nome: 'Cálculo Diferencial e Integral III', semestre: 4, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_4_2', nome: 'Estatística I', semestre: 4, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_4_3', nome: 'Seminário de Educação, Cidadania e Direitos Humanos', semestre: 4, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_4_4', nome: 'Informática na Matemática Básica e Vice-Versa II', semestre: 4, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_4_5', nome: 'Matemática Financeira', semestre: 4, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_4_6', nome: 'Teoria dos Números', semestre: 4, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_4_7', nome: 'Sujeito e Educação Matemática', semestre: 4, preRequisitos: [], status: 'disponivel' },

  // --- 5º SEMESTRE ---
  { id: 'mat_5_1', nome: 'Espaços Métricos', semestre: 5, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_5_2', nome: 'Física II', semestre: 5, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_5_3', nome: 'Estatística II', semestre: 5, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_5_4', nome: 'Didática Geral', semestre: 5, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_5_5', nome: 'Planejamento e Práticas para o Ensino da Matemática', semestre: 5, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_5_6', nome: 'Investigação em Educação Matemática', semestre: 5, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_5_7', nome: 'Fundamentos e Orientação de Estágio Sup. em Matemática I', semestre: 5, preRequisitos: [], status: 'disponivel' },

  // --- 6º SEMESTRE ---
  { id: 'mat_6_1', nome: 'Cálculo Numérico', semestre: 6, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_6_2', nome: 'Eletiva', semestre: 6, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_6_3', nome: 'Estruturas Algébricas', semestre: 6, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_6_4', nome: 'Física III', semestre: 6, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_6_5', nome: 'Funções de Uma Variável Complexa', semestre: 6, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_6_6', nome: 'Produção de Módulos Didáticos e Resolução de Problemas', semestre: 6, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_6_7', nome: 'Fundamentos e Orientação de Estágio Sup. em Matemática II', semestre: 6, preRequisitos: [], status: 'disponivel' },

  // --- 7º SEMESTRE ---
  { id: 'mat_7_1', nome: 'Análise Real', semestre: 7, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_7_2', nome: 'Optativa Grupo I/III/IV', semestre: 7, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_7_3', nome: 'Introdução às Equações Diferenciais Ordinárias (Optativa II)', semestre: 7, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_7_4', nome: 'Atividades Cooperativas para o Ensino e a Aprend. da Matemática', semestre: 7, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_7_5', nome: 'Fundamentos e Orientação de Estágio Sup. em Matemática III', semestre: 7, preRequisitos: [], status: 'disponivel' },

  // --- 8º SEMESTRE ---
  { id: 'mat_8_1', nome: 'Análise no R', semestre: 8, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_8_2', nome: 'Fundamentos da Língua Brasileira de Sinais', semestre: 8, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_8_3', nome: 'Optativa Grupo I/II/III e IV', semestre: 8, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_8_4', nome: 'Optativa Grupo III (Obrigatória)', semestre: 8, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_8_5', nome: 'História da Matemática', semestre: 8, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_8_6', nome: 'A Prática de Aulas em Sala de Aula', semestre: 8, preRequisitos: [], status: 'disponivel' },
  { id: 'mat_8_7', nome: 'Fundamentos e Orientação de Estágio Sup. em Matemática IV', semestre: 8, preRequisitos: [], status: 'disponivel' },
];