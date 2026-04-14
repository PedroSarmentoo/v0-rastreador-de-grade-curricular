import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GraduationCap, Book, CheckCircle, PlayCircle, Calendar, Unlock, Lock } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useDisciplinas } from '../contexts/DisciplinasContext';

export function EstatisticasHeader() {
  const { 
    totalDisciplinas, 
    disciplinasConcluidas, 
    disciplinasCursando,
    progressoPercentual,
    nomeCurso,
    anoEstimadoFormatura,
    disciplinasDisponiveis,
    disciplinasBloqueadas
  } = useDisciplinas();

  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        {/* Ícone de Capelo (Formatura) no título */}
        <GraduationCap size={28} color={colors.disponivel} />
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
          <Book size={20} color={colors.disponivel} />
          <Text style={styles.statValue}>{totalDisciplinas}</Text>
          <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit>Total</Text>
        </View>
        
        <View style={styles.statCard}>
          <CheckCircle size={20} color={colors.concluida} />
          <Text style={styles.statValue}>{disciplinasConcluidas}</Text>
          <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit>Concluídas</Text>
        </View>

        <View style={styles.statCard}>
          <PlayCircle size={20} color={colors.cursando} />
          <Text style={styles.statValue}>{disciplinasCursando}</Text>
          <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit>Cursando</Text>
        </View>
        
        <View style={styles.statCard}>
          <Calendar size={20} color={colors.text} />
          <Text style={styles.statValue}>{anoEstimadoFormatura}</Text>
          <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit>Formatura</Text>
        </View>

        <View style={styles.statCard}>
          <Unlock size={20} color={colors.disponivel} />
          <Text style={styles.statValue}>{disciplinasDisponiveis}</Text>
          <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit>Disponíveis</Text>
        </View>

        <View style={styles.statCard}>
          <Lock size={20} color={colors.textMuted} />
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
    paddingHorizontal: 4, 
    alignItems: 'center',
    gap: 6,
    overflow: 'hidden', 
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 10, 
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0, 
    textAlign: 'center',
    width: '100%', 
  },
});