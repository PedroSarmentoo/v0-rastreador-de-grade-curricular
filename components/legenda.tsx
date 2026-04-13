import { Check, Circle, Lock } from 'lucide-react'

export function Legenda() {
  return (
    <div className="flex flex-wrap items-center gap-4 p-3 rounded-lg bg-muted/50 border">
      <span className="text-xs font-medium text-muted-foreground">Legenda:</span>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/20 border border-emerald-500/50">
          <Check className="size-3.5 text-emerald-400" />
          <span className="text-xs font-medium text-emerald-400">Concluída</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-500/20 border border-blue-500/50">
          <Circle className="size-3.5 text-blue-400" />
          <span className="text-xs font-medium text-blue-400">Disponível</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted/50 border border-border opacity-60">
          <Lock className="size-3 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Bloqueada</span>
        </div>
      </div>
    </div>
  )
}
