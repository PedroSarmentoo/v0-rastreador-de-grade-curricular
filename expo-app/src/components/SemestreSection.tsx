import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { colors } from '../theme/colors';
import { useDisciplinas } from '../contexts/DisciplinasContext';
import { DisciplinaCard } from './DisciplinaCard';

interface Props {
  semestre: number;
}

export function SemestreSection({ semestre }: Props) {
  // 1. Obtemos a largura atual da tela
  const { width } = useWindowDimensions();
  const { getDisciplinasPorSemestre } = useDisciplinas();
  
  const disciplinas = getDisciplinasPorSemestre(semestre);
  const concluidas = disciplinas.filter((d) => d.status === 'concluida').length;
  const total = disciplinas.length;

  // 2. Definimos se é um ecrã "largo" (Web/Tablet) ou "estreito" (Telemóvel)
  const isLargeScreen = width > 600;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>{semestre}º Semestre</Text>
        <Text style={styles.contador}>
          {concluidas}/{total} concluídas
        </Text>
      </View>
      
      {/* 3. O estilo da lista agora muda dinamicamente */}
      <View style={[
        styles.list, 
        isLargeScreen ? styles.gridRow : styles.gridColumn
      ]}>
        {disciplinas.map((disciplina) => (
          <View 
            key={disciplina.id} 
            style={{ 
              // Se for ecrã largo, cada card ocupa ~48% (para caberem 2). 
              // Se for estreito, ocupa 100%.
              width: isLargeScreen ? '48.5%' : '100%' 
            }}
          >
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
  list: {
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridColumn: {
    flexDirection: 'column',
  },
});