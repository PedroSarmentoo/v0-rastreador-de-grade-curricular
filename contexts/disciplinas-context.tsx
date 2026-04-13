'use client'

import { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react'
import type { Disciplina, DisciplinaComStatus, StatusDisciplina } from '@/lib/types'
import { disciplinasIniciais } from '@/lib/disciplinas-data'

interface DisciplinasContextType {
  disciplinas: DisciplinaComStatus[]
  disciplinasPorSemestre: Map<number, DisciplinaComStatus[]>
  toggleDisciplina: (id: string) => void
  semestresRestantes: number
  totalDisciplinas: number
  disciplinasConcluidas: number
  percentualConcluido: number
}

const DisciplinasContext = createContext<DisciplinasContextType | undefined>(undefined)

function calcularStatus(disciplina: Disciplina, todasDisciplinas: Disciplina[]): StatusDisciplina {
  if (disciplina.concluida) {
    return 'concluida'
  }

  // Se não tem pré-requisitos, está disponível
  if (disciplina.prerequisitos.length === 0) {
    return 'disponivel'
  }

  // Verifica se todos os pré-requisitos foram concluídos
  const todosPrerequisitosCompletos = disciplina.prerequisitos.every((preReqId) => {
    const preReq = todasDisciplinas.find((d) => d.id === preReqId)
    return preReq?.concluida === true
  })

  return todosPrerequisitosCompletos ? 'disponivel' : 'bloqueada'
}

function calcularSemestresRestantes(disciplinas: Disciplina[]): number {
  const TOTAL_SEMESTRES = 10

  // Encontra o semestre mais baixo que ainda tem disciplinas pendentes
  const semestresPendentes = disciplinas
    .filter((d) => !d.concluida)
    .map((d) => d.semestre)

  if (semestresPendentes.length === 0) {
    return 0 // Curso concluído!
  }

  const semestreMaisBaixoPendente = Math.min(...semestresPendentes)
  return TOTAL_SEMESTRES - semestreMaisBaixoPendente + 1
}

export function DisciplinasProvider({ children }: { children: ReactNode }) {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>(disciplinasIniciais)

  const toggleDisciplina = useCallback((id: string) => {
    setDisciplinas((prev) => {
      const disciplina = prev.find((d) => d.id === id)
      if (!disciplina) return prev

      // Se está tentando marcar como concluída, verifica se está disponível
      if (!disciplina.concluida) {
        const status = calcularStatus(disciplina, prev)
        if (status === 'bloqueada') {
          return prev // Não permite marcar disciplina bloqueada
        }
      }

      // Atualiza o estado da disciplina
      return prev.map((d) => (d.id === id ? { ...d, concluida: !d.concluida } : d))
    })
  }, [])

  const disciplinasComStatus = useMemo(() => {
    return disciplinas.map((d) => ({
      ...d,
      status: calcularStatus(d, disciplinas),
    }))
  }, [disciplinas])

  const disciplinasPorSemestre = useMemo(() => {
    const mapa = new Map<number, DisciplinaComStatus[]>()
    disciplinasComStatus.forEach((d) => {
      const lista = mapa.get(d.semestre) || []
      lista.push(d)
      mapa.set(d.semestre, lista)
    })
    return mapa
  }, [disciplinasComStatus])

  const semestresRestantes = useMemo(() => calcularSemestresRestantes(disciplinas), [disciplinas])

  const totalDisciplinas = disciplinas.length
  const disciplinasConcluidas = disciplinas.filter((d) => d.concluida).length
  const percentualConcluido = totalDisciplinas > 0 ? Math.round((disciplinasConcluidas / totalDisciplinas) * 100) : 0

  const value = useMemo(
    () => ({
      disciplinas: disciplinasComStatus,
      disciplinasPorSemestre,
      toggleDisciplina,
      semestresRestantes,
      totalDisciplinas,
      disciplinasConcluidas,
      percentualConcluido,
    }),
    [disciplinasComStatus, disciplinasPorSemestre, toggleDisciplina, semestresRestantes, totalDisciplinas, disciplinasConcluidas, percentualConcluido]
  )

  return <DisciplinasContext.Provider value={value}>{children}</DisciplinasContext.Provider>
}

export function useDisciplinas() {
  const context = useContext(DisciplinasContext)
  if (context === undefined) {
    throw new Error('useDisciplinas deve ser usado dentro de um DisciplinasProvider')
  }
  return context
}
