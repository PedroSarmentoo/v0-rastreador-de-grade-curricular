import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useDisciplinas } from '../contexts/DisciplinasContext';

export function EstatisticasHeader() {
  const { 
    totalDisciplinas, 
    disciplinasConcluidas, 
    disciplinasCursando,
    progressoPercentual,
    nomeCurso, // Variável do nome do curso extraída do contexto
    anoEstimadoFormatura,
    disciplinasDisponiveis,
    disciplinasBloqueadas
  } = useDisciplinas();

  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Ionicons name="school-outline" size={28} color={colors.disponivel} />
        <Text style={styles.title}>Grade Curricular</Text>
      </View>
      
      {/* TÍTULO DINÂMICO APLICADO AQUI */}
      <Text style={styles.subtitle}>{nomeCurso}</Text>
      
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${progressoPercentual}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>{progressoPercentual}% concluído</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="book-outline" size={20} color={colors.disponivel} />
          <Text style={styles.statValue}>{totalDisciplinas}</Text>
          <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit>Total</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle-outline" size={20} color={colors.concluida} />
          <Text style={styles.statValue}>{disciplinasConcluidas}</Text>
          <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit>Concluídas</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="play-circle-outline" size={20} color={colors.cursando} />
          <Text style={styles.statValue}>{disciplinasCursando}</Text>
          <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit>Cursando</Text>
        </View>
        
        <View style={styles.statCard}>
          <Ionicons name="calendar-outline" size={20} color={colors.text} />
          <Text style={styles.statValue}>{anoEstimadoFormatura}</Text>
          <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit>Formatura</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="lock-open-outline" size={20} color={colors.disponivel} />
          <Text style={styles.statValue}>{disciplinasDisponiveis}</Text>
          <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit>Disponíveis</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />
          <Text style={styles.statValue}>{disciplinasBloqueadas}</Text>
          <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit>Bloqueadas</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 20,
    marginLeft: 40,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.concluida,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'right',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flexGrow: 1,
    flexBasis: '28%',
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 4, // Padding lateral reduzido para caber mais texto
    alignItems: 'center',
    gap: 6,
    overflow: 'hidden', // Evita que elementos saiam do card
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 10, // Fonte base ligeiramente menor
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0, // Removido o espaçamento extra entre letras
    textAlign: 'center',
    width: '100%', // Usa 100% da largura para o auto-ajuste funcionar bem
  },
});