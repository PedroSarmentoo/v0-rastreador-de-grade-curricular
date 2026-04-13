'use client'

import { GraduationCap, BookOpen, CheckCircle2, Clock } from 'lucide-react'
import { useDisciplinas } from '@/contexts/disciplinas-context'

export function EstatisticasHeader() {
  const { semestresRestantes, totalDisciplinas, disciplinasConcluidas, percentualConcluido } = useDisciplinas()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <GraduationCap className="size-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Grade Curricular</h1>
            <p className="text-sm text-muted-foreground">Engenharia de Sistemas</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Clock className="size-5" />}
          label="Semestres Restantes"
          value={semestresRestantes}
          sublabel="de 10 semestres"
          color="blue"
        />
        <StatCard
          icon={<BookOpen className="size-5" />}
          label="Total de Disciplinas"
          value={totalDisciplinas}
          sublabel="cadastradas"
          color="slate"
        />
        <StatCard
          icon={<CheckCircle2 className="size-5" />}
          label="Concluídas"
          value={disciplinasConcluidas}
          sublabel={`de ${totalDisciplinas}`}
          color="emerald"
        />
        <div className="flex flex-col justify-between p-4 rounded-xl border bg-card">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10">
              <GraduationCap className="size-5 text-amber-500" />
            </div>
            <span className="text-xs font-medium">Progresso Geral</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-foreground">{percentualConcluido}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${percentualConcluido}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: number
  sublabel: string
  color: 'blue' | 'slate' | 'emerald'
}

function StatCard({ icon, label, value, sublabel, color }: StatCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/10 text-blue-500',
    slate: 'bg-muted text-muted-foreground',
    emerald: 'bg-emerald-500/10 text-emerald-500',
  }

  return (
    <div className="flex flex-col justify-between p-4 rounded-xl border bg-card">
      <div className="flex items-center gap-2 text-muted-foreground mb-2">
        <div className={`p-1.5 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div>
        <span className="text-3xl font-bold text-foreground">{value}</span>
        <span className="text-xs text-muted-foreground ml-1">{sublabel}</span>
      </div>
    </div>
  )
}
