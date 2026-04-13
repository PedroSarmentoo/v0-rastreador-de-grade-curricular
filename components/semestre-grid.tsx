'use client'

import { DisciplinaCard } from './disciplina-card'
import type { DisciplinaComStatus } from '@/lib/types'

interface SemestreGridProps {
  semestre: number
  disciplinas: DisciplinaComStatus[]
}

export function SemestreGrid({ semestre, disciplinas }: SemestreGridProps) {
  const concluidas = disciplinas.filter((d) => d.status === 'concluida').length
  const total = disciplinas.length
  const percentual = total > 0 ? Math.round((concluidas / total) * 100) : 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary font-bold">
            {semestre}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{semestre}º Semestre</h3>
            <p className="text-xs text-muted-foreground">
              {concluidas} de {total} disciplinas
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${percentual}%` }}
            />
          </div>
          <span className="text-xs font-medium text-muted-foreground w-10">{percentual}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {disciplinas.map((disciplina) => (
          <DisciplinaCard key={disciplina.id} disciplina={disciplina} />
        ))}
      </div>
    </div>
  )
}
