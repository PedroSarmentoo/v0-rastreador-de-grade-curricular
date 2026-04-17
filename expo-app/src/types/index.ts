export type StatusDisciplina = 'concluida' | 'disponivel' | 'bloqueada' | 'cursando';

export interface Disciplina {
  id: string;
  nome: string;
  semestre: number;
  preRequisitos: string[];
  status: StatusDisciplina;
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

export interface AtividadesComplementares {
  temAiex: boolean;
  listaAcc: AtividadeItem[];
  listaAiex: AtividadeItem[];
}
