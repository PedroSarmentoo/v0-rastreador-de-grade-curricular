import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
// 1. Importamos os ícones quadrados do Lucide que combinam com as caixas de seleção
import { CheckSquare, PlaySquare, Square, Lock } from 'lucide-react-native';
import { colors } from '../theme/colors';

// 2. Atualizamos a interface para receber um Componente React em vez de um texto
interface LegendaItemProps {
  IconComponent: React.ElementType;
  color: string;
  label: string;
}

// 3. Renderizamos o IconComponent dinamicamente
function LegendaItem({ IconComponent, color, label }: LegendaItemProps) {
  return (
    <View style={styles.item}>
      <IconComponent size={16} color={color} />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export function Legenda() {
  return (
    <View style={styles.container}>
      <LegendaItem 
        IconComponent={CheckSquare} 
        color={colors.concluida} 
        label="Concluída" 
      />
      <LegendaItem 
        IconComponent={PlaySquare} 
        color={colors.cursando} 
        label="Cursando" 
      />
      <LegendaItem 
        IconComponent={Square} 
        color={colors.disponivel} 
        label="Disponível" 
      />
      <LegendaItem 
        IconComponent={Lock} 
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