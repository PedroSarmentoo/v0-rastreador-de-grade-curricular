import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity } from 'react-native';
// 1. Nova importação dos ícones do Lucide
import { Undo2, CheckCheck } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useDisciplinas } from '../contexts/DisciplinasContext';
import { DisciplinaCard } from './DisciplinaCard';

interface Props {
  semestre: number;
}

export function SemestreSection({ semestre }: Props) {
  // Obtemos a largura atual da tela
  const { width } = useWindowDimensions();
  const { getDisciplinasPorSemestre, toggleSemestre } = useDisciplinas();
  
  const disciplinas = getDisciplinasPorSemestre(semestre);
  const concluidas = disciplinas.filter((d) => d.status === 'concluida').length;
  const total = disciplinas.length;
  const todasConcluidas = concluidas === total && total > 0;

  // Definimos se é um ecrã "largo" (Web/Tablet) ou "estreito" (Telemóvel)
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
            {/* 2. Lógica atualizada para os novos ícones */}
            {todasConcluidas ? (
              <Undo2 size={16} color={colors.textMuted} />
            ) : (
              <CheckCheck size={16} color={colors.concluida} />
            )}
            
            <Text style={[styles.textoBotao, todasConcluidas && { color: colors.textMuted }]}>
              {todasConcluidas ? "Desmarcar Tudo" : "Concluir Todas"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* O estilo da lista agora muda dinamicamente */}
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
    gap: 6, // Aumentei levemente o gap para ficar mais bonito com o Lucide
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