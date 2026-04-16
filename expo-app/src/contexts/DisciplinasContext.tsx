import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Disciplina, DisciplinaNode, StatusDisciplina, AtividadesComplementares } from '../types';

// Importações das grades
import { disciplinasIniciais } from '../data/disciplinas';
import { disciplinasSI } from '../data/disciplinasSI'; 
import { disciplinasCivil } from '../data/disciplinasCivil'; 

const ACC_STORAGE_KEY = '@grade_curricular_acc_v2';
const COURSE_NAME_KEY = '@grade_curricular_nome_curso';

const getStorageKeyPorCurso = (curso: string) => {
  if (curso === 'Engenharia de Sistemas') {
    return '@grade_curricular_dados_v1';
  }
  return `@grade_curricular_dados_${curso.replace(/\s+/g, '_')}`;
};

interface DisciplinasContextData {
  disciplinas: Disciplina[];
  arvoresBase: DisciplinaNode[];
  toggleDisciplina: (id: string) => void;
  toggleSemestre: (semestre: number) => void;
  
  nomeCurso: string;
  setNomeCurso: (nome: string) => void;

  atividades: AtividadesComplementares;
  setAtividades: React.Dispatch<React.SetStateAction<AtividadesComplementares>>;

  totalDisciplinas: number;
  disciplinasConcluidas: number;
  disciplinasCursando: number;
  progressoPercentual: number;
  anoEstimadoFormatura: string;
  disciplinasDisponiveis: number;
  disciplinasBloqueadas: number;
  getDisciplinasPorSemestre: (semestre: number) => Disciplina[];
  semestres: number[];
  isLoading: boolean;
  importarGrade: (novaGrade: Disciplina[]) => void;
  resetarGrade: () => void;
}

const DisciplinasContext = createContext<DisciplinasContextData | undefined>(undefined);

export function DisciplinasProvider({ children }: { children: ReactNode }) {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [nomeCurso, setNomeCursoState] = useState('Engenharia de Sistemas'); 
  const [atividades, setAtividades] = useState<AtividadesComplementares>({
    temAiex: false,
    listaAcc: [],
    listaAiex: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const atualizarTodasDisciplinas = useCallback((disciplinasAtuais: Disciplina[]): Disciplina[] => {
    const mapa = new Map<string, Disciplina>();
    disciplinasAtuais.forEach(d => mapa.set(d.id, { ...d }));

    let cascataAcontecendo = true;
    while (cascataAcontecendo) {
      cascataAcontecendo = false;
      
      mapa.forEach((disciplina) => {
        const preReqAtendidos = disciplina.preRequisitos.every(
          reqId => mapa.get(reqId)?.status === 'concluida'
        );

        let novoStatus = disciplina.status;

        if (!preReqAtendidos) {
          novoStatus = 'bloqueada';
        } 
        else if (disciplina.status === 'bloqueada') {
          novoStatus = 'disponivel';
        }

        if (disciplina.status !== novoStatus) {
          disciplina.status = novoStatus;
          cascataAcontecendo = true;
        }
      });
    }

    return Array.from(mapa.values());
  }, []);

  // CARREGAR DADOS
  useEffect(() => {
    async function carregarDados() {
      try {
        let cursoAtual = 'Engenharia de Sistemas';
        const nomeSalvo = await AsyncStorage.getItem(COURSE_NAME_KEY);
        
        if (nomeSalvo !== null) {
          cursoAtual = nomeSalvo;
          setNomeCursoState(cursoAtual);
        }

        const storageKey = getStorageKeyPorCurso(cursoAtual);
        const jsonValue = await AsyncStorage.getItem(storageKey);
        
        if (jsonValue !== null) {
          const dadosSalvos = JSON.parse(jsonValue);
          setDisciplinas(atualizarTodasDisciplinas(dadosSalvos));
        } else {
          // 2. ATUALIZADO: Lógica de carga inicial com Engenharia Civil
          const gradeBase = 
            cursoAtual === 'Sistemas de Informação' ? disciplinasSI : 
            cursoAtual === 'Engenharia Civil' ? disciplinasCivil : 
            disciplinasIniciais;

          setDisciplinas(atualizarTodasDisciplinas(gradeBase));
        }
        
        const accValue = await AsyncStorage.getItem(ACC_STORAGE_KEY);
        if (accValue !== null) {
          setAtividades(JSON.parse(accValue));
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
      if (!isLoading && disciplinas.length > 0) {
        try {
          const storageKey = getStorageKeyPorCurso(nomeCurso);
          const jsonValue = JSON.stringify(disciplinas);
          await AsyncStorage.setItem(storageKey, jsonValue);
          
          const accValue = JSON.stringify(atividades);
          await AsyncStorage.setItem(ACC_STORAGE_KEY, accValue);
        } catch (e) {
          console.error('Erro ao salvar dados:', e);
        }
      }
    }
    salvarDados();
  }, [disciplinas, atividades, isLoading, nomeCurso]);

  // TROCAR CURSO
  const handleSetNomeCurso = useCallback(async (novoCurso: string) => {
    try {
      setIsLoading(true);
      setNomeCursoState(novoCurso); 
      await AsyncStorage.setItem(COURSE_NAME_KEY, novoCurso);

      const storageKey = getStorageKeyPorCurso(novoCurso);
      const jsonValue = await AsyncStorage.getItem(storageKey);

      if (jsonValue !== null) {
        setDisciplinas(atualizarTodasDisciplinas(JSON.parse(jsonValue)));
      } else {
        // 3. ATUALIZADO: Lógica de troca de curso com Engenharia Civil
        const gradeBase = 
          novoCurso === 'Sistemas de Informação' ? disciplinasSI : 
          novoCurso === 'Engenharia Civil' ? disciplinasCivil : 
          disciplinasIniciais;

        setDisciplinas(atualizarTodasDisciplinas(gradeBase));
      }
    } catch (e) {
      console.error('Erro ao trocar curso:', e);
    } finally {
      setIsLoading(false);
    }
  }, [atualizarTodasDisciplinas]);

  const toggleDisciplina = useCallback((id: string) => {
    setDisciplinas((prev) => {
      const disciplina = prev.find((d) => d.id === id);
      if (!disciplina || disciplina.status === 'bloqueada') return prev;

      let novoStatus: StatusDisciplina;
      if (disciplina.status === 'disponivel') {
        novoStatus = 'cursando';
      } else if (disciplina.status === 'cursando') {
        novoStatus = 'concluida';
      } else {
        novoStatus = 'disponivel';
      }

      const novaLista = prev.map((d) =>
        d.id === id ? { ...d, status: novoStatus } : d
      );

      return atualizarTodasDisciplinas(novaLista);
    });
  }, [atualizarTodasDisciplinas]);

  const toggleSemestre = useCallback((semestre: number) => {
    setDisciplinas((prev) => {
      const discSemestre = prev.filter(d => d.semestre === semestre);
      if (discSemestre.length === 0) return prev;

      const todasConcluidas = discSemestre.every(d => d.status === 'concluida');
      
      const novaLista = prev.map(d => {
        if (d.semestre === semestre) {
          return { ...d, status: (todasConcluidas ? 'disponivel' : 'concluida') as StatusDisciplina };
        }
        return d;
      });

      return atualizarTodasDisciplinas(novaLista);
    });
  }, [atualizarTodasDisciplinas]);

  const importarGrade = useCallback((novaGrade: Partial<Disciplina>[]) => {
    try {
      if (!Array.isArray(novaGrade)) throw new Error('Grade deve ser um array');
      
      const gradeMapeada: Disciplina[] = novaGrade.map((d, index) => {
        if (!d.id || !d.nome || d.semestre === undefined) {
          throw new Error(`Disciplina inválida no índice ${index}`);
        }
        const preReqs = Array.isArray(d.preRequisitos) ? d.preRequisitos : [];
        return {
          id: d.id,
          nome: d.nome,
          semestre: d.semestre,
          preRequisitos: preReqs,
          status: d.status || (preReqs.length === 0 ? 'disponivel' : 'bloqueada')
        };
      });

      setDisciplinas(atualizarTodasDisciplinas(gradeMapeada));
    } catch (error) {
      console.error('Erro ao importar grade:', error);
      throw error;
    }
  }, [atualizarTodasDisciplinas]);

  // RESETAR GRADE
  const resetarGrade = useCallback(() => {
    // 4. ATUALIZADO: Lógica de reset com Engenharia Civil
    const gradeBase = 
      nomeCurso === 'Sistemas de Informação' ? disciplinasSI : 
      nomeCurso === 'Engenharia Civil' ? disciplinasCivil : 
      disciplinasIniciais;

    setDisciplinas(atualizarTodasDisciplinas(gradeBase));
  }, [atualizarTodasDisciplinas, nomeCurso]);

  const totalDisciplinas = disciplinas.length;
  
  const arvoresBase = useMemo(() => {
    const mapa = new Map<string, DisciplinaNode>();
    
    disciplinas.forEach((d) => {
      mapa.set(d.id, { ...d, dependentes: [] });
    });

    disciplinas.forEach((d) => {
      d.preRequisitos.forEach((preReqId) => {
        const preReqNode = mapa.get(preReqId);
        const atualNode = mapa.get(d.id);

        if (preReqNode && atualNode) {
          preReqNode.dependentes.push(atualNode);
        }
      });
    });

    const raizes: DisciplinaNode[] = [];
    mapa.forEach((node) => {
      if (node.preRequisitos.length === 0) {
        raizes.push(node);
      }
    });

    return raizes;
  }, [disciplinas]);

  const disciplinasConcluidas = useMemo(
    () => disciplinas.filter((d) => d.status === 'concluida').length,
    [disciplinas]
  );

  const disciplinasCursando = useMemo(
    () => disciplinas.filter((d) => d.status === 'cursando').length,
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

  const anoEstimadoFormatura = useMemo(() => {
    const pendentes = disciplinas.filter((d) => d.status !== 'concluida');
    if (pendentes.length === 0) return "Formado!";

    const agora = new Date();
    const anoAtual = agora.getFullYear();
    const mesAtual = agora.getMonth(); 
    const semestreCivilAtual = mesAtual <= 5 ? 1 : 2;

    const pendentesFuturas = disciplinas.filter((d) => d.status === 'disponivel' || d.status === 'bloqueada');

    if (pendentesFuturas.length === 0) {
      return `${anoAtual}.${semestreCivilAtual}`;
    }

    const semestresOfertaDois = [1, 3, 5, 6, 8, 10];
    
    const isOferecidaNesteSemestre = (semestreDaMatriz: number, civilSem: number) => {
      const eSegundoSemestre = semestresOfertaDois.includes(semestreDaMatriz);
      return (eSegundoSemestre && civilSem === 2) || (!eSegundoSemestre && civilSem === 1);
    };

    const semesterPlan = new Map<string, number>();

    disciplinas.filter(d => d.status === 'cursando').forEach(d => {
      semesterPlan.set(d.id, 0);
    });

    let semestreIndex = 1; 
    let poolParaPlanejar = [...pendentesFuturas];
    const MAX_MATERIAS_POR_SEMESTRE = 6;
    let safelock = 100;

    while (poolParaPlanejar.length > 0 && safelock > 0) {
      safelock--;
      const semCivilDaRodada = (semestreCivilAtual + semestreIndex - 1) % 2 + 1;

      const disciplinasLiberadas = poolParaPlanejar.filter(d => {
        if (!isOferecidaNesteSemestre(d.semestre, semCivilDaRodada)) return false;

        const preReqResolvido = d.preRequisitos.every(prId => {
          const pr = disciplinas.find(x => x.id === prId);
          if (pr?.status === 'concluida') return true;
          
          const indexEscalonadoDoPai = semesterPlan.get(prId);
          return indexEscalonadoDoPai !== undefined && indexEscalonadoDoPai < semestreIndex;
        });

        return preReqResolvido;
      });

      disciplinasLiberadas.sort((a, b) => a.semestre - b.semestre);
      const limitadasAoMaximo = disciplinasLiberadas.slice(0, MAX_MATERIAS_POR_SEMESTRE);

      if (limitadasAoMaximo.length > 0) {
        limitadasAoMaximo.forEach(d => semesterPlan.set(d.id, semestreIndex));
        poolParaPlanejar = poolParaPlanejar.filter(d => !limitadasAoMaximo.includes(d));
      }

      if (poolParaPlanejar.length > 0) {
        semestreIndex++;
      }
    }

    const semestresTotaisNoFuturo = semestreCivilAtual + semestreIndex;
    const anoCalculado = anoAtual + Math.floor((semestresTotaisNoFuturo - 1) / 2);
    const semestreCalculado = semestresTotaisNoFuturo % 2 === 0 ? 2 : 1;

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
        arvoresBase,
        toggleDisciplina,
        toggleSemestre,
        nomeCurso,
        setNomeCurso: handleSetNomeCurso,
        atividades,
        setAtividades,
        totalDisciplinas,
        disciplinasConcluidas,
        disciplinasCursando,
        progressoPercentual,
        anoEstimadoFormatura,
        disciplinasDisponiveis,
        disciplinasBloqueadas,
        getDisciplinasPorSemestre,
        semestres,
        isLoading,
        importarGrade,
        resetarGrade
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