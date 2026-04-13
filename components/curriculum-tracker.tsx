'use client'

import { useDisciplinas } from '@/contexts/disciplinas-context'
import { EstatisticasHeader } from './estatisticas-header'
import { Legenda } from './legenda'
import { SemestreGrid } from './semestre-grid'

export function CurriculumTracker() {
  const { disciplinasPorSemestre } = useDisciplinas()

  // Ordena os semestres
  const semestresOrdenados = Array.from(disciplinasPorSemestre.entries()).sort(
    ([a], [b]) => a - b
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <EstatisticasHeader />
        
        <Legenda />

        <div className="space-y-8">
          {semestresOrdenados.map(([semestre, disciplinas]) => (
            <SemestreGrid
              key={semestre}
              semestre={semestre}
              disciplinas={disciplinas}
            />
          ))}
        </div>

        {semestresOrdenados.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Nenhuma disciplina cadastrada. Adicione disciplinas no arquivo{' '}
              <code className="px-1.5 py-0.5 bg-muted rounded text-sm">lib/disciplinas-data.ts</code>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
