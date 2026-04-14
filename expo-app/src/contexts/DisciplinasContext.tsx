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
  anoEstimadoFormatura: string;
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

  // CORREÇÃO: Adicionado o check para 'cursando' no cálculo automático
  const calcularStatus = useCallback((
    disciplina: Disciplina,
    todasDisciplinas: Disciplina[]
  ): StatusDisciplina => {
    if (disciplina.status === 'concluida') return 'concluida';
    if (disciplina.status === 'cursando') return 'cursando'; // <- ESSENCIAL: Mantém o estado azul
    
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

      let novoStatus: StatusDisciplina;
      
      if (disciplina.status === 'disponivel') novoStatus = 'cursando';
      else if (disciplina.status === 'cursando') novoStatus = 'concluida';
      else novoStatus = 'disponivel';

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

  // CÁLCULO DE FORMATURA COM AJUSTE DE SAFRA UNIMONTES
  const anoEstimadoFormatura = useMemo(() => {
    const pendentesVerdadeiras = disciplinas.filter((d) => 
      d.status !== 'concluida' && d.status !== 'cursando'
    );

    if (pendentesVerdadeiras.length === 0 && disciplinas.some(d => d.status === 'cursando')) {
       const agora = new Date();
       const semestreCivilAtual = agora.getMonth() <= 5 ? 1 : 2;
       return `${agora.getFullYear()}.${semestreCivilAtual}`;
    }
    
    if (pendentesVerdadeiras.length === 0) return "Formado!";

    const MEDIA_DISC = 6;
    const semestresFaltantesPosAtual = Math.ceil(pendentesVerdadeiras.length / MEDIA_DISC);
    
    const agora = new Date();
    const anoAtual = agora.getFullYear();
    const mesAtual = agora.getMonth();
    const semestreCivilAtual = mesAtual <= 5 ? 1 : 2;
    
    // O semestre atual conta como 1
    const totalSemestres = semestresFaltantesPosAtual + 1;

    let anoCalculado = anoAtual + Math.floor((semestreCivilAtual + totalSemestres - 2) / 2);
    let semestreCalculado = (semestreCivilAtual + totalSemestres - 1) % 2 === 0 ? 2 : 1;

    // AJUSTE DE OFERTA UNIMONTES
    const semestresOfertaDois = [1, 3, 5, 6, 8, 10];
    const ultimoSemestrePendente = Math.max(...pendentesVerdadeiras.map(d => d.semestre));
    const periodoOfertaFinal = semestresOfertaDois.includes(ultimoSemestrePendente) ? 2 : 1;

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