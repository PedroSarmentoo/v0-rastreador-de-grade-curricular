import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// 1. Importamos os ícones do Lucide (incluindo o GitBranch para os pré-requisitos)
import { CheckSquare, PlaySquare, Square, Lock, GitBranch } from 'lucide-react-native';
import { Disciplina } from '../types';
import { colors } from '../theme/colors';
import { useDisciplinas } from '../contexts/DisciplinasContext';

interface Props {
  disciplina: Disciplina;
}

export function DisciplinaCard({ disciplina }: Props) {
  const { toggleDisciplina, disciplinas } = useDisciplinas();
  const { id, nome, status, preRequisitos } = disciplina;

  const getCardStyle = () => {
    switch (status) {
      case 'concluida':
        return {
          backgroundColor: colors.concluidaBg,
          borderColor: colors.concluidaBorder,
        };
      case 'cursando':
        return {
          backgroundColor: colors.cursandoBg,
          borderColor: colors.cursandoBorder,
        };
      case 'disponivel':
        return {
          backgroundColor: colors.disponivelBg,
          borderColor: colors.disponivelBorder,
        };
      default:
        return {
          backgroundColor: colors.bloqueadaBg,
          borderColor: colors.bloqueadaBorder,
        };
    }
  };

  // 2. Agora retornamos o componente do Lucide diretamente, em vez de um texto
  const getIconComponent = () => {
    switch (status) {
      case 'concluida':
        return CheckSquare;
      case 'cursando':
        return PlaySquare;
      case 'disponivel':
        return Square;
      default:
        return Lock;
    }
  };

  const getIconColor = () => {
    switch (status) {
      case 'concluida':
        return colors.concluida;
      case 'cursando':
        return colors.cursando;
      case 'disponivel':
        return colors.disponivel;
      default:
        return colors.bloqueada;
    }
  };

  const getPreRequisitosNomes = () => {
    if (preRequisitos.length === 0) return null;
    
    const nomes = preRequisitos
      .map((preReqId) => disciplinas.find((d) => d.id === preReqId)?.nome)
      .filter(Boolean)
      .join(', ');
    
    return nomes;
  };

  const preReqNomes = getPreRequisitosNomes();
  const isDisabled = status === 'bloqueada';
  
  // Extraímos o componente escolhido para usá-lo no JSX
  const StatusIcon = getIconComponent();

  return (
    <TouchableOpacity
      onPress={() => toggleDisciplina(id)}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[styles.card, getCardStyle()]}
    >
      <View style={styles.header}>
        {/* 3. Renderizamos o ícone do Lucide */}
        <StatusIcon size={22} color={getIconColor()} />
        <Text 
          style={[
            styles.nome,
            status === 'concluida' && styles.nomeRiscado,
            status === 'bloqueada' && styles.nomeBloqueado,
          ]}
          numberOfLines={2}
        >
          {nome}
        </Text>
      </View>
      
      {preReqNomes && (
        <View style={styles.preRequisitos}>
          {/* 4. Ícone de ramificação atualizado */}
          <GitBranch size={12} color={colors.textMuted} />
          <Text style={styles.preRequisitosText} numberOfLines={1}>
            {preReqNomes}
          </Text>
        </View>
      )}

      <View style={styles.statusBadge}>
        <Text style={[styles.statusText, { color: getIconColor() }]}>
          {status === 'concluida' ? 'Concluída' : status === 'cursando' ? 'Cursando' : status === 'disponivel' ? 'Disponível' : 'Bloqueada'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 6,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 110,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  nome: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 20,
  },
  nomeRiscado: {
    textDecorationLine: 'line-through',
    opacity: 0.8,
  },
  nomeBloqueado: {
    opacity: 0.5,
  },
  preRequisitos: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 'auto',
    marginBottom: 8,
  },
  preRequisitosText: {
    flex: 1,
    fontSize: 11,
    color: colors.textMuted,
  },
  statusBadge: {
    marginTop: 'auto',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});