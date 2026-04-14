export interface Modalidade {
  id: string;
  nome: string;
  paridade: number;
  max: number;
}

export const modalidades: Modalidade[] = [
  { id: 'palestras', nome: 'Palestras ou similares', paridade: 1, max: 40 },
  { id: 'cursos', nome: 'Cursos ou similares', paridade: 1, max: 30 },
  { id: 'voluntaria', nome: 'Atividade voluntária (ação social)', paridade: 1, max: 20 },
  { id: 'projetos_univ', nome: 'Projetos de órgãos da Universidade', paridade: 1, max: 20 },
  { id: 'disciplina_nao_aproveitada', nome: 'Disciplina não aproveitada no curso', paridade: 0.5, max: 30 },
  { id: 'ministrante', nome: 'Ministrante/debatedor em eventos', paridade: 1, max: 15 },
  { id: 'linguas', nome: 'Curso de línguas estrangeiras', paridade: 1, max: 30 },
  { id: 'estagio', nome: 'Estágio não-obrigatório', paridade: 0.13, max: 40 },
  { id: 'ic', nome: 'Iniciação científica', paridade: 0.13, max: 40 },
  { id: 'monitoria', nome: 'Monitoria em disciplinas', paridade: 0.125, max: 40 },
  { id: 'resumo_anais', nome: 'Resumo em anais de evento (autor/co-autor)', paridade: 3, max: 40 },
  { id: 'apresentacao', nome: 'Apresentação de trabalho científico', paridade: 2, max: 40 },
  { id: 'premiacao', nome: 'Premiação em trabalho acadêmico', paridade: 5, max: 40 },
  { id: 'artigo_anais', nome: 'Artigo completo em anais de evento', paridade: 5, max: 40 },
  { id: 'artigo_periodico', nome: 'Artigo em periódico especializado', paridade: 15, max: 40 },
  { id: 'comissao', nome: 'Comissão organizadora de evento', paridade: 5, max: 40 },
];

export const META_HORAS_ACC = 200;
