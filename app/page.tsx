import { DisciplinasProvider } from '@/contexts/disciplinas-context'
import { CurriculumTracker } from '@/components/curriculum-tracker'

export default function Home() {
  return (
    <DisciplinasProvider>
      <CurriculumTracker />
    </DisciplinasProvider>
  )
}
