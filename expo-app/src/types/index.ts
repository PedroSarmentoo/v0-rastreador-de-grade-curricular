export type StatusDisciplina = 'concluida' | 'disponivel' | 'bloqueada' | 'cursando';

export interface Disciplina {
  id: string;
  nome: string;
  semestre: number;
  preRequisitos: string[];
  status: StatusDisciplina;
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

export type AvaliacaoTipo = 'P1' | 'P2' | 'P3' | 'EC' | 'AeS' | 'Sub' | 'Trabalho' | 'Outro';

export interface Avaliacao {
  id: string;
  tipo: AvaliacaoTipo;
  nota: number;
  peso?: number; // Para ditar impacto da nota (ex: peso 1, peso 2). Padrão = 1.
  descricao?: string;
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
