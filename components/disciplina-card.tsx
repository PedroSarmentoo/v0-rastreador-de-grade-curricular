'use client'

import { Check, Lock, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DisciplinaComStatus } from '@/lib/types'
import { useDisciplinas } from '@/contexts/disciplinas-context'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface DisciplinaCardProps {
  disciplina: DisciplinaComStatus
}

export function DisciplinaCard({ disciplina }: DisciplinaCardProps) {
  const { toggleDisciplina, disciplinas } = useDisciplinas()

  const handleClick = () => {
    if (disciplina.status !== 'bloqueada') {
      toggleDisciplina(disciplina.id)
    }
  }

  const prerequisitosNomes = disciplina.prerequisitos
    .map((preReqId) => {
      const preReq = disciplinas.find((d) => d.id === preReqId)
      return preReq?.nome || preReqId
    })
    .join(', ')

  const getStatusStyles = () => {
    switch (disciplina.status) {
      case 'concluida':
        return 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30'
      case 'disponivel':
        return 'bg-blue-500/20 border-blue-500/50 text-blue-400 hover:bg-blue-500/30 cursor-pointer'
      case 'bloqueada':
        return 'bg-muted/50 border-border text-muted-foreground cursor-not-allowed opacity-60'
    }
  }

  const getStatusIcon = () => {
    switch (disciplina.status) {
      case 'concluida':
        return <Check className="size-4 shrink-0" />
      case 'disponivel':
        return <Circle className="size-4 shrink-0" />
      case 'bloqueada':
        return <Lock className="size-3.5 shrink-0" />
    }
  }

  const getStatusLabel = () => {
    switch (disciplina.status) {
      case 'concluida':
        return 'Concluída'
      case 'disponivel':
        return 'Disponível'
      case 'bloqueada':
        return 'Bloqueada'
    }
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <button
            onClick={handleClick}
            disabled={disciplina.status === 'bloqueada'}
            className={cn(
              'flex items-center gap-3 w-full p-3 rounded-lg border transition-all duration-200 text-left',
              getStatusStyles(),
              disciplina.status === 'concluida' && 'cursor-pointer hover:bg-emerald-500/30'
            )}
          >
            {getStatusIcon()}
            <span className="text-sm font-medium leading-tight line-clamp-2">{disciplina.nome}</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="space-y-1.5">
            <p className="font-semibold">{disciplina.nome}</p>
            <p className="text-xs text-muted-foreground">
              Status: <span className="font-medium">{getStatusLabel()}</span>
            </p>
            {disciplina.prerequisitos.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Pré-requisitos: <span className="font-medium">{prerequisitosNomes}</span>
              </p>
            )}
            {disciplina.status === 'disponivel' && (
              <p className="text-xs text-blue-400">Clique para marcar como concluída</p>
            )}
            {disciplina.status === 'concluida' && (
              <p className="text-xs text-emerald-400">Clique para desmarcar</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
