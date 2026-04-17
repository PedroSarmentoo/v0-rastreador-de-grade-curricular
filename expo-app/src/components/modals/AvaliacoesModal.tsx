import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList, TextInput, ScrollView } from 'react-native';
import { X, Plus, Trash2 } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { useDisciplinas } from '../../contexts/DisciplinasContext';
import { AvaliacaoTipo, Avaliacao } from '../../types';

interface Props {
  visible: boolean;
  disciplinaId: string;
  disciplinaNome: string;
  onClose: () => void;
}

const TIPOS_AVALIACAO: AvaliacaoTipo[] = ['P1', 'P2', 'P3', 'EC', 'AeS', 'Sub', 'Trabalho', 'Outro'];

export function AvaliacoesModal({ visible, disciplinaId, disciplinaNome, onClose }: Props) {
  const { avaliacoes, addAvaliacao, removeAvaliacao, obterNotaMedia } = useDisciplinas();
  
  const [tipo, setTipo] = useState<AvaliacaoTipo>('P1');
  const [notaStr, setNotaStr] = useState('');
  const [pesoStr, setPesoStr] = useState('1');
  const [descricao, setDescricao] = useState('');

  const avaliacoesDaDisciplina = avaliacoes[disciplinaId] || [];
  const media = obterNotaMedia(disciplinaId);

  const handleAdd = () => {
    const nota = parseFloat(notaStr.replace(',', '.'));
    const peso = parseFloat(pesoStr.replace(',', '.'));
    
    if (isNaN(nota)) return;

    addAvaliacao(disciplinaId, {
      tipo,
      nota,
      peso: isNaN(peso) ? 1 : peso,
      descricao: descricao.trim() || undefined
    });

    setNotaStr('');
    setPesoStr('1');
    setDescricao('');
  };

  const renderAvaliacao = ({ item }: { item: Avaliacao }) => (
    <View style={styles.avaliacaoItem}>
      <View style={styles.avaliacaoInfo}>
        <View style={styles.avaliacaoHeader}>
          <Text style={styles.avaliacaoTipo}>{item.tipo}</Text>
          <Text style={styles.avaliacaoNota}>Nota: {item.nota}</Text>
        </View>
        <Text style={styles.avaliacaoPeso}>Peso: {item.peso}</Text>
        {item.descricao && (
          <Text style={styles.avaliacaoDescricao}>{item.descricao}</Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeAvaliacao(disciplinaId, item.id)}
      >
        <Trash2 size={20} color={colors.error} />
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>{disciplinaNome}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.mediaContainer}>
            <Text style={styles.mediaLabel}>Média Atual:</Text>
            <Text style={[styles.mediaValue, { color: media && parseFloat(media) >= 6 ? colors.success : (media ? colors.warning : colors.textMuted) }]}>
              {media || '--'}
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>Nova Avaliação</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeSelector}>
              {TIPOS_AVALIACAO.map(t => (
                <TouchableOpacity 
                  key={t}
                  style={[styles.typeButton, tipo === t && styles.typeButtonActive]}
                  onPress={() => setTipo(t)}
                >
                  <Text style={[styles.typeText, tipo === t && styles.typeTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nota</Text>
                <TextInput
                  style={styles.input}
                  value={notaStr}
                  onChangeText={setNotaStr}
                  keyboardType="numeric"
                  placeholder="Ex: 8.5"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
              <View style={[styles.inputGroup, { marginLeft: 10 }]}>
                <Text style={styles.inputLabel}>Peso</Text>
                <TextInput
                  style={styles.input}
                  value={pesoStr}
                  onChangeText={setPesoStr}
                  keyboardType="numeric"
                  placeholder="Ex: 1"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Descrição (Opcional)</Text>
              <TextInput
                style={styles.input}
                value={descricao}
                onChangeText={setDescricao}
                placeholder="Ex: Prova de cálculo"
                placeholderTextColor={colors.textMuted}
              />
            </View>

            <TouchableOpacity 
              style={[styles.addButton, !notaStr.trim() && styles.addButtonDisabled]} 
              onPress={handleAdd}
              disabled={!notaStr.trim()}
            >
              <Plus size={20} color={colors.background} />
              <Text style={styles.addText}>Adicionar</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={avaliacoesDaDisciplina}
            keyExtractor={item => item.id}
            renderItem={renderAvaliacao}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhuma avaliação cadastrada ainda.</Text>
            }
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '90%',
    minHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.surfaceHover,
  },
  mediaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mediaLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  mediaValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surfaceHover,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeText: {
    color: colors.text,
    fontWeight: '500',
  },
  typeTextActive: {
    color: colors.background,
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  inputGroup: {
    flex: 1,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    color: colors.text,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  addButtonDisabled: {
    backgroundColor: colors.surfaceHover,
    opacity: 0.7,
  },
  addText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: 'center',
    marginVertical: 20,
    fontStyle: 'italic',
  },
  avaliacaoItem: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  avaliacaoInfo: {
    flex: 1,
  },
  avaliacaoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  avaliacaoTipo: {
    fontWeight: 'bold',
    color: colors.text,
    fontSize: 16,
    marginRight: 12,
    backgroundColor: colors.surfaceHover,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  avaliacaoNota: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 16,
  },
  avaliacaoPeso: {
    color: colors.textMuted,
    fontSize: 12,
  },
  avaliacaoDescricao: {
    color: colors.text,
    fontSize: 14,
    marginTop: 6,
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 10,
    backgroundColor: colors.surfaceHover,
    borderRadius: 10,
  }
});