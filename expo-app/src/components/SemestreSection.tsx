import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useDisciplinas } from '../contexts/DisciplinasContext';
import { DisciplinaCard } from './DisciplinaCard';

interface Props {
  semestre: number;
}

export function SemestreSection({ semestre }: Props) {
  // 1. Obtemos a largura atual da tela
  const { width } = useWindowDimensions();
  const { getDisciplinasPorSemestre, toggleSemestre } = useDisciplinas();
  
  const disciplinas = getDisciplinasPorSemestre(semestre);
  const concluidas = disciplinas.filter((d) => d.status === 'concluida').length;
  const total = disciplinas.length;
  const todasConcluidas = concluidas === total && total > 0;

  // 2. Definimos se é um ecrã "largo" (Web/Tablet) ou "estreito" (Telemóvel)
  const isLargeScreen = width > 600;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>{semestre}º Semestre</Text>
        
        <View style={styles.headerAcoes}>
          <Text style={styles.contador}>
            {concluidas}/{total} concluídas
          </Text>
          <TouchableOpacity 
            style={[styles.botaoConcluirTudo, todasConcluidas && styles.botaoDesfazer]} 
            onPress={() => toggleSemestre(semestre)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={todasConcluidas ? "arrow-undo-outline" : "checkmark-done-outline"} 
              size={16} 
              color={todasConcluidas ? colors.textMuted : colors.concluida} 
            />
            <Text style={[styles.textoBotao, todasConcluidas && { color: colors.textMuted }]}>
              {todasConcluidas ? "Desmarcar Tudo" : "Concluir Todas"}
            </Text>
          </TouchableOpacity>
        </View>
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
  headerAcoes: {
    alignItems: 'flex-end',
    gap: 4,
  },
  contador: {
    fontSize: 13,
    color: colors.textMuted,
  },
  botaoConcluirTudo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.concluidaBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.concluidaBorder,
  },
  botaoDesfazer: {
    backgroundColor: colors.surfaceLight,
    borderColor: colors.border,
  },
  textoBotao: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.concluida,
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