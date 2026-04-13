import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { useDisciplinas } from '../contexts/DisciplinasContext';
import { DisciplinaCard } from './DisciplinaCard';

interface Props {
  semestre: number;
}

export function SemestreSection({ semestre }: Props) {
  const { getDisciplinasPorSemestre } = useDisciplinas();
  const disciplinas = getDisciplinasPorSemestre(semestre);

  const concluidas = disciplinas.filter((d) => d.status === 'concluida').length;
  const total = disciplinas.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>{semestre}o Semestre</Text>
        <Text style={styles.contador}>
          {concluidas}/{total} concluidas
        </Text>
      </View>
      
      <View style={styles.grid}>
        {disciplinas.map((disciplina) => (
          <View key={disciplina.id} style={styles.cardWrapper}>
            <DisciplinaCard disciplina={disciplina} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 6,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  contador: {
    fontSize: 13,
    color: colors.textMuted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  cardWrapper: {
    width: '50%',
  },
});
