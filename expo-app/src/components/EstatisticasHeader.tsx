import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GraduationCap, Book, CheckCircle, PlayCircle, Calendar, Unlock, Lock, Eye, EyeOff } from 'lucide-react-native';
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

  // Estado para controlar a visibilidade da formatura
  const [mostrarFormatura, setMostrarFormatura] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <GraduationCap size={28} color={colors.disponivel} />
        <Text style={styles.title}>Grade Curricular</Text>
      </View>
      
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
        
        {/* --- CARD DA FORMATURA COM OLHO NO CANTO INFERIOR DIREITO --- */}
        <View style={[styles.statCard, styles.formaturaCard]}>
          <Calendar size={20} color={colors.text} />
          <Text style={[styles.statValue, !mostrarFormatura && { letterSpacing: 2, fontSize: 16 }]}>
            {mostrarFormatura ? anoEstimadoFormatura : '••••'}
          </Text>
          <Text style={styles.statLabel} numberOfLines={1} adjustsFontSizeToFit>Formatura</Text>
          
          <TouchableOpacity 
            style={styles.eyeButtonFormatura}
            onPress={() => setMostrarFormatura(!mostrarFormatura)}
            activeOpacity={0.6}
          >
            {mostrarFormatura ? (
              <Eye size={12} color={colors.textMuted} />
            ) : (
              <EyeOff size={12} color={colors.textMuted} />
            )}
          </TouchableOpacity>
        </View>
        {/* ----------------------------------------------------------- */}

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
  // ESTILOS NOVOS PARA O OLHO NO CANTO
formaturaCard: {
    position: 'relative', 
  },
  eyeButtonFormatura: {
    position: 'absolute',
    top: 6,   // <-- MUDOU AQUI: de 'bottom' para 'top'
    right: 6,
    padding: 4,
    zIndex: 10, // Garante que o clique funcione bem
  }
});