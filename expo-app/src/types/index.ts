export type StatusDisciplina = 'concluida' | 'disponivel' | 'bloqueada' | 'cursando';

export interface Reprovacao {
  id: string;
  motivo: 'nota' | 'falta' | 'ambos';
  nota?: number;
  periodo?: string; // ex: 2023.1
}

export interface Disciplina {
  id: string;
  nome: string;
  semestre: number;
  preRequisitos: string[];
  status: StatusDisciplina;
  notaFinal?: number;
  reprovacoes?: Reprovacao[];
  cargaHoraria?: number;
}

export interface DisciplinaNode extends Disciplina {
  dependentes: DisciplinaNode[]; // Disciplinas que ramificam a partir desta (que a exigem como pré-requisito)
}

export interface AtividadeItem {
  id: string;
  titulo: string;
  horas: number;
  nomeDocumento?: string;
  uriDocumento?: string;
  modalidadeId?: string;       // ID da regra de ACC, caso selecione da lista
  quantidadeOriginal?: number; // Para mostrar o valor antes da conversão
}

export type AvaliacaoTipo = 'Prova 1' | 'Prova 2' | 'Prova 3' | 'Extra Curricular' | 'Atividade em Sala' | 'Substitutiva' | 'Trabalho' | 'Outro';

export interface Avaliacao {
  id: string;
  tipo: AvaliacaoTipo;
  nota?: number; // Para compatibilidade
  peso?: number; // Para compatibilidade
  descricao?: string;
  semestre?: string;
  nomeProva?: string;
  arquivoUri?: string;
  arquivoNome?: string;
  dataCriacao: number;
}

export type AvaliacoesPorDisciplina = Record<string, Avaliacao[]>;

export interface Arquivo {
  id: string;
  disciplinaId: string;
  nome: string;
  uri: string;
  tipo?: string;
  tamanho?: number;
  dataAdicao: number;
}

export type ArquivosPorDisciplina = Record<string, Arquivo[]>;

export interface AtividadesComplementares {
  temAiex: boolean;
  listaAcc: AtividadeItem[];
  listaAiex: AtividadeItem[];
}
