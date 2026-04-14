import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Disciplina, StatusDisciplina } from '../types';
import { disciplinasIniciais } from '../data/disciplinas';

const STORAGE_KEY = '@grade_curricular_dados_v1';

interface DisciplinasContextData {
  disciplinas: Disciplina[];
  toggleDisciplina: (id: string) => void;
  totalDisciplinas: number;
  disciplinasConcluidas: number;
  progressoPercentual: number;
  anoEstimadoFormatura: string; // Nova estatística
  disciplinasDisponiveis: number;
  disciplinasBloqueadas: number;
  getDisciplinasPorSemestre: (semestre: number) => Disciplina[];
  semestres: number[];
  isLoading: boolean;
}

const DisciplinasContext = createContext<DisciplinasContextData | undefined>(undefined);

export function DisciplinasProvider({ children }: { children: ReactNode }) {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>(disciplinasIniciais);
  const [isLoading, setIsLoading] = useState(true);

  const calcularStatus = useCallback((
    disciplina: Disciplina,
    todasDisciplinas: Disciplina[]
  ): StatusDisciplina => {
    if (disciplina.status === 'concluida') return 'concluida';
    
    const preRequisitosAtendidos = disciplina.preRequisitos.every((preReqId) => {
      const preReq = todasDisciplinas.find((d) => d.id === preReqId);
      return preReq?.status === 'concluida';
    });
    
    return preRequisitosAtendidos ? 'disponivel' : 'bloqueada';
  }, []);

  const atualizarTodasDisciplinas = useCallback((disciplinasAtuais: Disciplina[]): Disciplina[] => {
    return disciplinasAtuais.map((disciplina) => ({
      ...disciplina,
      status: calcularStatus(disciplina, disciplinasAtuais),
    }));
  }, [calcularStatus]);

  // CARREGAR DADOS
  useEffect(() => {
    async function carregarDados() {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue !== null) {
          const dadosSalvos = JSON.parse(jsonValue);
          setDisciplinas(atualizarTodasDisciplinas(dadosSalvos));
        }
      } catch (e) {
        console.error('Erro ao carregar dados:', e);
      } finally {
        setIsLoading(false);
      }
    }
    carregarDados();
  }, [atualizarTodasDisciplinas]);

  // SALVAR DADOS
  useEffect(() => {
    async function salvarDados() {
      if (!isLoading) {
        try {
          const jsonValue = JSON.stringify(disciplinas);
          await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        } catch (e) {
          console.error('Erro ao salvar dados:', e);
        }
      }
    }
    salvarDados();
  }, [disciplinas, isLoading]);

  const toggleDisciplina = useCallback((id: string) => {
    setDisciplinas((prev) => {
      const disciplina = prev.find((d) => d.id === id);
      if (!disciplina || disciplina.status === 'bloqueada') return prev;

      const novoStatus: StatusDisciplina = 
        disciplina.status === 'concluida' ? 'disponivel' : 'concluida';

      const novaLista = prev.map((d) =>
        d.id === id ? { ...d, status: novoStatus } : d
      );

      return atualizarTodasDisciplinas(novaLista);
    });
  }, [atualizarTodasDisciplinas]);

  // ESTATÍSTICAS
  const totalDisciplinas = disciplinas.length;
  
  const disciplinasConcluidas = useMemo(
    () => disciplinas.filter((d) => d.status === 'concluida').length,
    [disciplinas]
  );

  const disciplinasDisponiveis = useMemo(
    () => disciplinas.filter((d) => d.status === 'disponivel').length,
    [disciplinas]
  );

  const disciplinasBloqueadas = useMemo(
    () => disciplinas.filter((d) => d.status === 'bloqueada').length,
    [disciplinas]
  );

  const progressoPercentual = useMemo(
    () => totalDisciplinas > 0 ? Math.round((disciplinasConcluidas / totalDisciplinas) * 100) : 0,
    [disciplinasConcluidas, totalDisciplinas]
  );

  // CÁLCULO DE FORMATURA ESTIMADA
const anoEstimadoFormatura = useMemo(() => {
    const pendentes = disciplinas.filter((d) => d.status !== 'concluida');
    if (pendentes.length === 0) return "Formado!";

    const agora = new Date();
    const anoAtual = agora.getFullYear();
    const mesAtual = agora.getMonth(); 
    const semestreCivilAtual = mesAtual <= 5 ? 1 : 2;

    // 1. Identificar qual o semestre de oferta de cada disciplina pendente
    // Baseado na sua regra: 
    // Oferta no 2º Semestre: 1, 3, 5, 6, 8, 10
    // Oferta no 1º Semestre: 2, 4, 7, 9 (assumindo que 7 e 9 seguem a lógica oposta)
    
    const semestresOfertaDois = [1, 3, 5, 6, 8, 10];

    // Encontrar a disciplina pendente que pertence ao "último semestre de curso"
    const ultimoSemestrePendente = Math.max(...pendentes.map(d => d.semestre));
    
    // Determinar em qual período civil (1 ou 2) esse último semestre é ofertado
    const periodoOfertaFinal = semestresOfertaDois.includes(ultimoSemestrePendente) ? 2 : 1;

    // 2. Calcular o ano
    // Se a última matéria é do 10º semestre, ela só abre no 2º semestre do ano.
    // Precisamos calcular quantos anos faltam para chegar nesse período.
    
    // Estimativa baseada em volume (6 por semestre) para saber se a pessoa
    // vai demorar mais do que o tempo "natural" da grade devido a reprovações
    const MEDIA_DISC = 6;
    const semestresPorVolume = Math.ceil(pendentes.length / MEDIA_DISC);
    
    let anoCalculado = anoAtual + Math.floor((semestreCivilAtual + semestresPorVolume - 1) / 2);
    let semestreCalculado = (semestreCivilAtual + semestresPorVolume - 1) % 2 === 0 ? 2 : 1;

    // 3. Ajuste de Safra (Sincronização com a Unimontes)
    // Se o cálculo por volume diz que você forma em 2028.1, mas a sua última matéria 
    // pendente só oferta no semestre 2, o app joga para 2028.2.
    if (semestreCalculado === 1 && periodoOfertaFinal === 2) {
      semestreCalculado = 2;
    } else if (semestreCalculado === 2 && periodoOfertaFinal === 1) {
      anoCalculado += 1;
      semestreCalculado = 1;
    }

    return `${anoCalculado}.${semestreCalculado}`;
  }, [disciplinas]);

  const semestres = useMemo(
    () => [...new Set(disciplinas.map((d) => d.semestre))].sort((a, b) => a - b),
    [disciplinas]
  );

  const getDisciplinasPorSemestre = useCallback(
    (semestre: number) => disciplinas.filter((d) => d.semestre === semestre),
    [disciplinas]
  );

  return (
    <DisciplinasContext.Provider
      value={{
        disciplinas,
        toggleDisciplina,
        totalDisciplinas,
        disciplinasConcluidas,
        progressoPercentual,
        anoEstimadoFormatura,
        disciplinasDisponiveis,
        disciplinasBloqueadas,
        getDisciplinasPorSemestre,
        semestres,
        isLoading,
      }}
    >
      {children}
    </DisciplinasContext.Provider>
  );
}

export function useDisciplinas(): DisciplinasContextData {
  const context = useContext(DisciplinasContext);
  if (!context) {
    throw new Error('useDisciplinas deve ser usado dentro de DisciplinasProvider');
  }
  return context;
}