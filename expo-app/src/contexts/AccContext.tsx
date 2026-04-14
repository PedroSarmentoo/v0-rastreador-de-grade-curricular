import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { modalidades, META_HORAS_ACC, Modalidade } from '../data/atividades';

const STORAGE_KEY = '@acc_dados_v1';

export interface AccEntry {
  modalidadeId: string;
  valorBruto: number;
}

interface AccContextData {
  entries: AccEntry[];
  setValorBruto: (modalidadeId: string, valor: number) => void;
  getHorasCalculadas: (modalidadeId: string) => number;
  horasObtidasTotal: number;
  horasRestantes: number;
  progressoAcc: number;
  metaHoras: number;
  isLoading: boolean;
}

const AccContext = createContext<AccContextData | undefined>(undefined);

export function AccProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<AccEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados do AsyncStorage
  useEffect(() => {
    async function carregarDados() {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue !== null) {
          const dadosSalvos: AccEntry[] = JSON.parse(jsonValue);
          setEntries(dadosSalvos);
        }
      } catch (e) {
        console.error('Erro ao carregar dados ACC:', e);
      } finally {
        setIsLoading(false);
      }
    }
    carregarDados();
  }, []);

  // Salvar dados no AsyncStorage
  useEffect(() => {
    async function salvarDados() {
      if (!isLoading) {
        try {
          const jsonValue = JSON.stringify(entries);
          await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        } catch (e) {
          console.error('Erro ao salvar dados ACC:', e);
        }
      }
    }
    salvarDados();
  }, [entries, isLoading]);

  const setValorBruto = useCallback((modalidadeId: string, valor: number) => {
    setEntries((prev) => {
      const existing = prev.find((e) => e.modalidadeId === modalidadeId);
      if (existing) {
        return prev.map((e) =>
          e.modalidadeId === modalidadeId ? { ...e, valorBruto: valor } : e
        );
      }
      return [...prev, { modalidadeId, valorBruto: valor }];
    });
  }, []);

  const getHorasCalculadas = useCallback(
    (modalidadeId: string): number => {
      const entry = entries.find((e) => e.modalidadeId === modalidadeId);
      const modalidade = modalidades.find((m) => m.id === modalidadeId);
      
      if (!entry || !modalidade) return 0;
      
      const horasCalculadas = entry.valorBruto * modalidade.paridade;
      return Math.min(horasCalculadas, modalidade.max);
    },
    [entries]
  );

  const horasObtidasTotal = useMemo(() => {
    return modalidades.reduce((total, modalidade) => {
      const entry = entries.find((e) => e.modalidadeId === modalidade.id);
      if (!entry) return total;
      
      const horasCalculadas = entry.valorBruto * modalidade.paridade;
      const horasComTeto = Math.min(horasCalculadas, modalidade.max);
      return total + horasComTeto;
    }, 0);
  }, [entries]);

  const horasRestantes = useMemo(() => {
    return Math.max(0, META_HORAS_ACC - horasObtidasTotal);
  }, [horasObtidasTotal]);

  const progressoAcc = useMemo(() => {
    return Math.min(100, Math.round((horasObtidasTotal / META_HORAS_ACC) * 100));
  }, [horasObtidasTotal]);

  return (
    <AccContext.Provider
      value={{
        entries,
        setValorBruto,
        getHorasCalculadas,
        horasObtidasTotal,
        horasRestantes,
        progressoAcc,
        metaHoras: META_HORAS_ACC,
        isLoading,
      }}
    >
      {children}
    </AccContext.Provider>
  );
}

export function useAcc(): AccContextData {
  const context = useContext(AccContext);
  if (!context) {
    throw new Error('useAcc deve ser usado dentro de AccProvider');
  }
  return context;
}
