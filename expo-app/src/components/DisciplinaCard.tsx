import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import { CheckSquare, PlaySquare, Square, Lock, GitBranch, ClipboardList, BookOpen } from 'lucide-react-native';
import { Disciplina } from '../types';
import { colors } from '../theme/colors';
import { useDisciplinas } from '../contexts/DisciplinasContext';
import { AvaliacoesModal } from './modals/AvaliacoesModal';
import { AproveitamentoModal } from './modals/AproveitamentoModal';
import { GraduationCap } from 'lucide-react-native';

interface Props {
  disciplina: Disciplina;
}

export function DisciplinaCard({ disciplina }: Props) {
  const { toggleDisciplina, disciplinas, avaliacoes } = useDisciplinas();
  const [modalVisible, setModalVisible] = useState(false);
  const [aproveitamentoVisible, setAproveitamentoVisible] = useState(false);
  const { id, nome, status, preRequisitos, notaFinal, reprovacoes, cargaHoraria } = disciplina;

  // Calculamos quantas provas temos no banco
  const qtdProvas = avaliacoes[id]?.length || 0;

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
  
  const StatusIcon = getIconComponent();

  return (
    <>
      <Pressable
        onPress={() => toggleDisciplina(id)}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.card, 
          getCardStyle(),
          pressed && !isDisabled && { opacity: 0.7 }
        ]}
      >
        <View style={styles.header}>
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
          <GitBranch size={12} color={colors.textMuted} />
          <Text style={styles.preRequisitosText} numberOfLines={1}>
            {preReqNomes}
          </Text>
        </View>
      )}

      <View style={styles.footerContainer}>
        <View style={styles.statusBadge}>
          <Text style={[styles.statusText, { color: getIconColor() }]}>
            {status === 'concluida' ? 'Concluída' : status === 'cursando' ? 'Cursando' : status === 'disponivel' ? 'Disponível' : 'Bloqueada'}
          </Text>
          {cargaHoraria && (
            <Text style={styles.cargaHorariaText}>{cargaHoraria}h</Text>
          )}
        </View>

        {status !== 'bloqueada' && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                setAproveitamentoVisible(true);
              }}
            >
              <GraduationCap size={16} color={getIconColor()} />
              {((reprovacoes && reprovacoes.length > 0) || notaFinal !== undefined) && (
                <View style={styles.badgeAproveitamento}>
                  <CheckSquare size={10} color={colors.background} />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                setModalVisible(true);
              }}
            >
              <BookOpen size={16} color={getIconColor()} />
              {qtdProvas > 0 && (
                <View style={styles.badgeProvas}>
                  <Text style={styles.badgeProvasText}>{qtdProvas}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
      </Pressable>

      <AvaliacoesModal
        visible={modalVisible}
        disciplinaId={id}
        disciplinaNome={nome}
        onClose={() => setModalVisible(false)}
      />

      <AproveitamentoModal
        visible={aproveitamentoVisible}
        disciplina={disciplina}
        onClose={() => setAproveitamentoVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, margin: 6, padding: 14, borderRadius: 12, borderWidth: 1, minHeight: 110 },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
  nome: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text, lineHeight: 20 },
  nomeRiscado: { textDecorationLine: 'line-through', opacity: 0.8 },
  nomeBloqueado: { opacity: 0.5 },
  preRequisitos: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 'auto', marginBottom: 8 },
  preRequisitosText: { flex: 1, fontSize: 11, color: colors.textMuted },
  footerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' },
  statusBadge: {},
  statusText: { fontSize: 11, fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.5 },
  cargaHorariaText: { fontSize: 11, color: colors.textMuted, marginTop: 2 },
  actionsContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  actionButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 6, paddingHorizontal: 8, borderRadius: 8, backgroundColor: colors.surfaceHover, minWidth: 32, minHeight: 32 },
  badgeProvas: { position: 'absolute', top: -6, right: -6, backgroundColor: colors.primary, borderRadius: 10, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' },
  badgeAproveitamento: { position: 'absolute', top: -4, right: -4, backgroundColor: colors.primary, borderRadius: 8, padding: 2 },
  badgeProvasText: { color: colors.background, fontSize: 9, fontWeight: 'bold' }
});
