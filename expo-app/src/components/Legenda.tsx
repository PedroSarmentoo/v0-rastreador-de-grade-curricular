import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface LegendaItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  label: string;
}

function LegendaItem({ icon, color, label }: LegendaItemProps) {
  return (
    <View style={styles.item}>
      <Ionicons name={icon} size={16} color={color} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export function Legenda() {
  return (
    <View style={styles.container}>
      <LegendaItem 
        icon="checkmark-circle" 
        color={colors.concluida} 
        label="Concluida" 
      />
      <LegendaItem 
        icon="play-circle" 
        color={colors.cursando} 
        label="Cursando" 
      />
      <LegendaItem 
        icon="ellipse-outline" 
        color={colors.disponivel} 
        label="Disponivel" 
      />
      <LegendaItem 
        icon="lock-closed" 
        color={colors.bloqueada} 
        label="Não tem os pré-requisitos necessários" 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 24,
    paddingVertical: 16,
    marginBottom: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
