import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Disciplina, StatusDisciplina } from '../types';
import { disciplinasIniciais } from '../data/disciplinas';

// Chave única para salvar os dados no dispositivo
const STORAGE_KEY = '@grade_curricular_dados_v1';

interface DisciplinasContextData {
  disciplinas: Disciplina[];
  toggleDisciplina: (id: string) => void;
  totalDisciplinas: number;
  disciplinasConcluidas: number;
  progressoPercentual: number;
  semestresRestantes: number;
  disciplinasDisponiveis: number;
  disciplinasBloqueadas: number;
  getDisciplinasPorSemestre: (semestre: number) => Disciplina[];
  semestres: number[];
  isLoading: boolean; // Útil para mostrar um loading enquanto os dados carregam
}

const DisciplinasContext = createContext<DisciplinasContextData | undefined>(undefined);

export function DisciplinasProvider({ children }: { children: ReactNode }) {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>(disciplinasIniciais);
  const [isLoading, setIsLoading] = useState(true);

  // --- LÓGICA DE CÁLCULO DE STATUS ---
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

  // --- PERSISTÊNCIA: CARREGAR DADOS ---
  useEffect(() => {
    async function carregarDados() {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue !== null) {
          const dadosSalvos = JSON.parse(jsonValue);
          // Aplicamos os dados salvos e recalculamos os status (caso a grade tenha mudado)
          setDisciplinas(atualizarTodasDisciplinas(dadosSalvos));
        }
      } catch (e) {
        console.error('Erro ao carregar os dados do armazenamento local:', e);
      } finally {
        setIsLoading(false);
      }
    }
    carregarDados();
  }, [atualizarTodasDisciplinas]);

  // --- PERSISTÊNCIA: SALVAR DADOS ---
  useEffect(() => {
    async function salvarDados() {
      if (!isLoading) { // Evita salvar a lista inicial por cima dos dados reais durante o boot
        try {
          const jsonValue = JSON.stringify(disciplinas);
          await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        } catch (e) {
          console.error('Erro ao salvar os dados no dispositivo:', e);
        }
      }
    }
    salvarDados();
  }, [disciplinas, isLoading]);

  // --- AÇÃO DE INTERAÇÃO ---
  const toggleDisciplina = useCallback((id: string) => {
    setDisciplinas((prev) => {
      const disciplina = prev.find((d) => d.id === id);
      if (!disciplina) return prev;

      if (disciplina.status === 'bloqueada') return prev;

      const novoStatus: StatusDisciplina = 
        disciplina.status === 'concluida' ? 'disponivel' : 'concluida';

      const novaLista = prev.map((d) =>
        d.id === id ? { ...d, status: novoStatus } : d
      );

      return atualizarTodasDisciplinas(novaLista);
    });
  }, [atualizarTodasDisciplinas]);

  // --- ESTATÍSTICAS E MEMOIZAÇÕES ---
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

  const semestresRestantes = useMemo(() => {
    const disciplinasPendentes = disciplinas.filter((d) => d.status !== 'concluida');
    if (disciplinasPendentes.length === 0) return 0;
    
    const maxSemestre = Math.max(...disciplinas.map((d) => d.semestre));
    const minSemestrePendente = Math.min(...disciplinasPendentes.map((d) => d.semestre));
    
    return Math.max(0, maxSemestre - minSemestrePendente + 1);
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
        semestresRestantes,
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