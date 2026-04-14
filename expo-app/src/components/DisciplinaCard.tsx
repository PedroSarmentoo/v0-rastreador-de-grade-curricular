import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { Disciplina } from '../types';
import { useDisciplinas } from '../contexts/DisciplinasContext';

interface Props {
  disciplina: Disciplina;
}

export function DisciplinaCard({ disciplina }: Props) {
  const { toggleDisciplina } = useDisciplinas();

  const getStatusConfig = () => {
    switch (disciplina.status) {
      case 'concluida':
        return {
          icon: 'checkmark-circle' as const,
          color: colors.concluida, // Verde
          label: 'CONCLUÍDA',
          opacity: 1
        };
      case 'cursando':
        return {
          icon: 'time' as const, 
          color: '#F1C40F', // Amarelo vibrante
          label: 'CURSANDO',
          opacity: 1
        };
      case 'bloqueada':
        return {
          icon: 'lock-closed' as const,
          color: colors.textMuted,
          label: 'BLOQUEADA',
          opacity: 0.5
        };
      default: // disponivel
        return {
          icon: 'radio-button-off' as const,
          color: colors.disponivel, // Azul claro/Borda
          label: 'DISPONÍVEL',
          opacity: 1
        };
    }
  };

  const config = getStatusConfig();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { 
          borderColor: config.color,
          opacity: config.opacity,
          // Efeito de "preenchimento" leve quando concluída ou cursando
          backgroundColor: disciplina.status === 'concluida' ? `${colors.concluida}10` : 
                           disciplina.status === 'cursando' ? '#F1C40F10' : 
                           colors.surfaceLight
        }
      ]}
      onPress={() => toggleDisciplina(disciplina.id)}
      disabled={disciplina.status === 'bloqueada'}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: `${config.color}20` }]}>
          <Ionicons name={config.icon} size={22} color={config.color} />
        </View>
        
        <View style={styles.textContainer}>
          <Text 
            style={[
              styles.nome, 
              disciplina.status === 'concluida' && { color: colors.textMuted, textDecorationLine: 'line-through' }
            ]} 
            numberOfLines={2} 
            adjustsFontSizeToFit
          >
            {disciplina.nome}
          </Text>
          <Text style={[styles.statusLabel, { color: config.color }]}>
            {config.label}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    marginBottom: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  nome: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});