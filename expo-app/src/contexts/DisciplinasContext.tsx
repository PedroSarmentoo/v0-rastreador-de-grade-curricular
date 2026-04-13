import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { Disciplina, StatusDisciplina } from '../types';
import { disciplinasIniciais } from '../data/disciplinas';

interface DisciplinasContextData {
  disciplinas: Disciplina[];
  toggleDisciplina: (id: string) => void;
  totalDisciplinas: number;
  disciplinasConcluidas: number;
  progressoPercentual: number;
  semestresRestantes: number;
  getDisciplinasPorSemestre: (semestre: number) => Disciplina[];
  semestres: number[];
}

const DisciplinasContext = createContext<DisciplinasContextData | undefined>(undefined);

export function DisciplinasProvider({ children }: { children: ReactNode }) {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>(disciplinasIniciais);

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

  const toggleDisciplina = useCallback((id: string) => {
    setDisciplinas((prev) => {
      const disciplina = prev.find((d) => d.id === id);
      if (!disciplina) return prev;

      // Se estiver bloqueada, nao pode alterar
      if (disciplina.status === 'bloqueada') return prev;

      // Toggle entre concluida e disponivel
      const novoStatus: StatusDisciplina = 
        disciplina.status === 'concluida' ? 'disponivel' : 'concluida';

      const novaLista = prev.map((d) =>
        d.id === id ? { ...d, status: novoStatus } : d
      );

      // Recalcular status de todas as disciplinas
      return atualizarTodasDisciplinas(novaLista);
    });
  }, [atualizarTodasDisciplinas]);

  const totalDisciplinas = disciplinas.length;
  
  const disciplinasConcluidas = useMemo(
    () => disciplinas.filter((d) => d.status === 'concluida').length,
    [disciplinas]
  );

  const progressoPercentual = useMemo(
    () => Math.round((disciplinasConcluidas / totalDisciplinas) * 100),
    [disciplinasConcluidas, totalDisciplinas]
  );

  const semestresRestantes = useMemo(() => {
    const disciplinasPendentes = disciplinas.filter((d) => d.status !== 'concluida');
    if (disciplinasPendentes.length === 0) return 0;
    
    const maxSemestre = Math.max(...disciplinas.map((d) => d.semestre));
    const minSemestrePendente = Math.min(...disciplinasPendentes.map((d) => d.semestre));
    
    return maxSemestre - minSemestrePendente + 1;
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
        getDisciplinasPorSemestre,
        semestres,
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
