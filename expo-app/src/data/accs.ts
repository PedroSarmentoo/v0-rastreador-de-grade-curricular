export interface AccRule {
  id: string;
  modalidade: string;
  paridadeDescricao: string;
  ch_maxima_descricao: string;
  ch_maxima: number;
  unidadeEntrada: 'horas' | 'quantidade';
  multiplicador: number;
}

export const accRules: AccRule[] = [
  {
    id: 'acc1',
    modalidade: "Participação em palestras ou similares, mediante aceite da Coordenação de Curso",
    paridadeDescricao: "1h = 1h",
    ch_maxima_descricao: "40 horas",
    ch_maxima: 40,
    unidadeEntrada: 'horas',
    multiplicador: 1
  },
  {
    id: 'acc2',
    modalidade: "Participação em cursos ou similares, reconhecidos pela Coordenação de Curso",
    paridadeDescricao: "1h = 1h",
    ch_maxima_descricao: "30 horas",
    ch_maxima: 30,
    unidadeEntrada: 'horas',
    multiplicador: 1
  },
  {
    id: 'acc3',
    modalidade: "Realização de atividade voluntária em projetos de ação social",
    paridadeDescricao: "1h = 1h",
    ch_maxima_descricao: "20 horas",
    ch_maxima: 20,
    unidadeEntrada: 'horas',
    multiplicador: 1
  },
  {
    id: 'acc4',
    modalidade: "Desenvolvimento de atividades vinculadas a projetos conduzidos por órgãos da Universidade",
    paridadeDescricao: "1h = 1h",
    ch_maxima_descricao: "20 horas",
    ch_maxima: 20,
    unidadeEntrada: 'horas',
    multiplicador: 1
  },
  {
    id: 'acc5',
    modalidade: "Aprovação em atividade acadêmica não aproveitada como créditos curriculares em seu curso",
    paridadeDescricao: "1h = 0.5h",
    ch_maxima_descricao: "30 horas",
    ch_maxima: 30,
    unidadeEntrada: 'horas',
    multiplicador: 0.5
  },
  {
    id: 'acc6',
    modalidade: "Desenvolvimento de atividades como ministrante em curso de extensão, palestra ou como debatedor em mesa redonda ou painel, mediante aceite da Coordenação de Curso",
    paridadeDescricao: "1h = 1h",
    ch_maxima_descricao: "15 horas",
    ch_maxima: 15,
    unidadeEntrada: 'horas',
    multiplicador: 1
  },
  {
    id: 'acc7',
    modalidade: "Realização de curso de línguas estrangeiras",
    paridadeDescricao: "1h = 1h",
    ch_maxima_descricao: "30 horas",
    ch_maxima: 30,
    unidadeEntrada: 'horas',
    multiplicador: 1
  },
  {
    id: 'acc8',
    modalidade: "Realização de estágios de interesse curricular (não-obrigatórios) de acordo com os critérios definidos pela Coordenação de Curso",
    paridadeDescricao: "300 h = 40 h",
    ch_maxima_descricao: "40 horas",
    ch_maxima: 40,
    unidadeEntrada: 'horas',
    multiplicador: 40 / 300
  },
  {
    id: 'acc9',
    modalidade: "Desenvolvimento de atividades de iniciação científica reconhecidas pela Coordenação de Curso",
    paridadeDescricao: "300 h = 40 h",
    ch_maxima_descricao: "40 horas",
    ch_maxima: 40,
    unidadeEntrada: 'horas',
    multiplicador: 40 / 300
  },
  {
    id: 'acc10',
    modalidade: "Realização de atividades de monitoria em disciplinas reconhecidas pela Coordenação de Curso",
    paridadeDescricao: "160 h = 20 h",
    ch_maxima_descricao: "40 horas",
    ch_maxima: 40,
    unidadeEntrada: 'horas',
    multiplicador: 20 / 160
  },
  {
    id: 'acc11',
    modalidade: "Autoria ou co-autoria de resumo em anais de evento",
    paridadeDescricao: "1 = 3 h",
    ch_maxima_descricao: "40 horas",
    ch_maxima: 40,
    unidadeEntrada: 'quantidade',
    multiplicador: 3
  },
  {
    id: 'acc12',
    modalidade: "Apresentação de trabalho científico como autor",
    paridadeDescricao: "1 = 2 h",
    ch_maxima_descricao: "40 horas",
    ch_maxima: 40,
    unidadeEntrada: 'quantidade',
    multiplicador: 2
  },
  {
    id: 'acc13',
    modalidade: "Premiação em trabalho acadêmico apresentado em evento ou julgado em concurso",
    paridadeDescricao: "1 = 5 h",
    ch_maxima_descricao: "40 horas",
    ch_maxima: 40,
    unidadeEntrada: 'quantidade',
    multiplicador: 5
  },
  {
    id: 'acc14',
    modalidade: "Autoria ou co-autoria de artigo completo em anais de evento",
    paridadeDescricao: "1 = 5 h",
    ch_maxima_descricao: "40 horas",
    ch_maxima: 40,
    unidadeEntrada: 'quantidade',
    multiplicador: 5
  },
  {
    id: 'acc15',
    modalidade: "Autoria ou co-autoria de artigo científico completo em periódico especializado",
    paridadeDescricao: "1 = 15 h",
    ch_maxima_descricao: "40 horas",
    ch_maxima: 40,
    unidadeEntrada: 'quantidade',
    multiplicador: 15
  },
  {
    id: 'acc16',
    modalidade: "Participação como membro de comissão organizadora de evento científico",
    paridadeDescricao: "1 = 5 h",
    ch_maxima_descricao: "40 horas",
    ch_maxima: 40,
    unidadeEntrada: 'quantidade',
    multiplicador: 5
  }
];
