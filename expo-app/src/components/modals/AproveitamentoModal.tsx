import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput, ScrollView, Alert, Platform } from 'react-native';
import { X, Plus, Trash2, GraduationCap } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { useDisciplinas } from '../../contexts/DisciplinasContext';
import { Disciplina, Reprovacao } from '../../types';

interface Props {
  visible: boolean;
  disciplina: Disciplina;
  onClose: () => void;
}

export function AproveitamentoModal({ visible, disciplina, onClose }: Props) {
  const { updateDisciplinaData } = useDisciplinas();
  
  const [notaFinal, setNotaFinal] = useState('');
  const [reprovacoes, setReprovacoes] = useState<Reprovacao[]>([]);
  
  // States for new "reprovação" form
  const [mostrarFormReprovacao, setMostrarFormReprovacao] = useState(false);
  const [motivoReprovacao, setMotivoReprovacao] = useState<'nota' | 'falta' | 'ambos'>('nota');
  const [notaReprovacao, setNotaReprovacao] = useState('');
  const [periodoAno, setPeriodoAno] = useState('');
  const [periodoSemestre, setPeriodoSemestre] = useState<'1' | '2'>('1');

  useEffect(() => {
    if (visible) {
      setNotaFinal(disciplina.notaFinal !== undefined ? disciplina.notaFinal.toString() : '');
      setReprovacoes(disciplina.reprovacoes || []);
      setMostrarFormReprovacao(false);
      resetReprovacaoForm();
    }
  }, [visible, disciplina]);

  const resetReprovacaoForm = () => {
    setMotivoReprovacao('nota');
    setNotaReprovacao('');
    setPeriodoAno('');
    setPeriodoSemestre('1');
  };

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleSaveGlobal = () => {
    const updates: Partial<Pick<Disciplina, 'notaFinal' | 'reprovacoes'>> = {};
    
    if (notaFinal.trim() !== '') {
      const parsedNota = parseFloat(notaFinal.replace(',', '.'));
      if (isNaN(parsedNota) || parsedNota < 0 || parsedNota > 100) {
        showAlert('Erro', 'A nota final deve ser de 0 a 100.');
        return;
      }
      updates.notaFinal = parsedNota;
    } else {
      updates.notaFinal = undefined;
    }
    
    updates.reprovacoes = reprovacoes;
    
    updateDisciplinaData(disciplina.id, updates);
    onClose();
  };

  const handleAddReprovacao = () => {
    if (motivoReprovacao !== 'falta' && notaReprovacao.trim() !== '') {
      const parsedNota = parseFloat(notaReprovacao.replace(',', '.'));
      if (isNaN(parsedNota) || parsedNota < 0 || parsedNota > 100) {
        showAlert('Erro', 'A nota da reprovação deve ser de 0 a 100.');
        return;
      }
    }

    if (!periodoAno.trim()) {
      showAlert('Erro', 'Informe o ano (ex: 2023).');
      return;
    }

    const novaReprovacao: Reprovacao = {
      id: Math.random().toString(36).substring(2, 9),
      motivo: motivoReprovacao,
      nota: (motivoReprovacao !== 'falta' && notaReprovacao.trim()) ? parseFloat(notaReprovacao.replace(',', '.')) : undefined,
      periodo: `${periodoAno.trim()}.${periodoSemestre}`
    };

    setReprovacoes([...reprovacoes, novaReprovacao]);
    setMostrarFormReprovacao(false);
    resetReprovacaoForm();
  };

  const handleRemoveReprovacao = (id: string) => {
    setReprovacoes(reprovacoes.filter(r => r.id !== id));
  };

  const getMotivoLabel = (motivo: string) => {
    if (motivo === 'nota') return 'Nota';
    if (motivo === 'falta') return 'Falta';
    return 'Nota e Falta';
  };

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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <GraduationCap size={24} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={styles.title} numberOfLines={1}>Desempenho</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.disciplinaName}>{disciplina.nome}</Text>

            {/* MAIN GRADE */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nota Final / Atual</Text>
              <TextInput
                style={styles.input}
                value={notaFinal}
                onChangeText={setNotaFinal}
                placeholder="Ex: 85"
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
              />
              <Text style={styles.helpText}>A nota final que você tirou (ou está tirando) nesta disciplina.</Text>
            </View>

            {/* FAILED ATTEMPTS */}
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Histórico de Reprovações</Text>
                {!mostrarFormReprovacao && (
                  <TouchableOpacity style={styles.smallAddButton} onPress={() => setMostrarFormReprovacao(true)}>
                    <Plus size={16} color={colors.background} />
                  </TouchableOpacity>
                )}
              </View>

              {reprovacoes.length === 0 && !mostrarFormReprovacao && (
                <Text style={styles.emptyText}>Você não registrou reprovações para esta disciplina.</Text>
              )}

              {reprovacoes.map((rep) => (
                <View key={rep.id} style={styles.reprovacaoCard}>
                  <View style={styles.reprovacaoInfo}>
                    <Text style={styles.reprovacaoPeriodo}>{rep.periodo}</Text>
                    <Text style={styles.reprovacaoMotivo}>Por {getMotivoLabel(rep.motivo)}</Text>
                    {rep.nota !== undefined && (
                      <Text style={styles.reprovacaoNota}>Nota: {rep.nota}</Text>
                    )}
                  </View>
                  <TouchableOpacity onPress={() => handleRemoveReprovacao(rep.id)} style={styles.removeBtn}>
                    <Trash2 size={18} color={colors.error} />
                  </TouchableOpacity>
                </View>
              ))}

              {mostrarFormReprovacao && (
                <View style={styles.formReprovacao}>
                  <Text style={styles.formSubtitle}>Nova Reprovação</Text>
                  
                  <Text style={styles.inputLabel}>Motivo</Text>
                  <View style={styles.motivoRow}>
                    {(['nota', 'falta', 'ambos'] as const).map(motivo => (
                      <TouchableOpacity 
                        key={motivo} 
                        style={[styles.motivoBtn, motivoReprovacao === motivo && styles.motivoBtnActive]}
                        onPress={() => setMotivoReprovacao(motivo)}
                      >
                        <Text style={[styles.motivoBtnText, motivoReprovacao === motivo && styles.motivoBtnTextActive]}>
                          {getMotivoLabel(motivo)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {motivoReprovacao !== 'falta' && (
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>Nota tirada (0 a 100)</Text>
                      <TextInput
                        style={styles.input}
                        value={notaReprovacao}
                        onChangeText={setNotaReprovacao}
                        placeholder="Ex: 35"
                        keyboardType="numeric"
                        placeholderTextColor={colors.textMuted}
                      />
                    </View>
                  )}

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Período (Ano e Semestre)</Text>
                    <View style={styles.semestreRow}>
                      <TextInput
                        style={[styles.input, styles.semestreAnoInput]}
                        value={periodoAno}
                        onChangeText={setPeriodoAno}
                        placeholder="Ex: 2023"
                        keyboardType="numeric"
                        maxLength={4}
                        placeholderTextColor={colors.textMuted}
                      />
                      <View style={styles.semestrePeriodoContainer}>
                        <TouchableOpacity 
                          style={[styles.toggleButton, periodoSemestre === '1' && styles.toggleButtonActive]}
                          onPress={() => setPeriodoSemestre('1')}
                        >
                          <Text style={[styles.toggleButtonText, periodoSemestre === '1' && styles.toggleButtonTextActive]}>1º Sem</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.toggleButton, periodoSemestre === '2' && styles.toggleButtonActive]}
                          onPress={() => setPeriodoSemestre('2')}
                        >
                          <Text style={[styles.toggleButtonText, periodoSemestre === '2' && styles.toggleButtonTextActive]}>2º Sem</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  <View style={styles.formReprovacaoActions}>
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => setMostrarFormReprovacao(false)}>
                      <Text style={styles.cancelBtnText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveReprovacaoBtn} onPress={handleAddReprovacao}>
                      <Text style={styles.saveReprovacaoBtnText}>Adicionar Resumo</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveGlobal}>
                <Text style={styles.saveButtonText}>Salvar Desempenho</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%', minHeight: '50%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  closeButton: { padding: 4, borderRadius: 20, backgroundColor: colors.surfaceHover },
  scrollContent: { padding: 20, paddingBottom: 40 },
  disciplinaName: { fontSize: 18, color: colors.textMuted, marginBottom: 20, fontWeight: '500' },
  section: { marginBottom: 24 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8 },
  inputGroup: { marginBottom: 12 },
  inputLabel: { fontSize: 13, color: colors.textMuted, marginBottom: 4, fontWeight: '500' },
  input: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 12, color: colors.text, fontSize: 16 },
  helpText: { fontSize: 12, color: colors.textMuted, marginTop: 6, fontStyle: 'italic' },
  smallAddButton: { backgroundColor: colors.primary, borderRadius: 12, padding: 6 },
  emptyText: { fontSize: 14, color: colors.textMuted, fontStyle: 'italic', marginVertical: 8 },
  reprovacaoCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.background, padding: 14, borderRadius: 8, borderWidth: 1, borderColor: colors.border, marginBottom: 8 },
  reprovacaoInfo: { flex: 1 },
  reprovacaoPeriodo: { fontSize: 15, fontWeight: 'bold', color: colors.text },
  reprovacaoMotivo: { fontSize: 14, color: colors.textMuted, marginTop: 2 },
  reprovacaoNota: { fontSize: 14, color: colors.primary, fontWeight: '600', marginTop: 2 },
  removeBtn: { padding: 8, backgroundColor: colors.surfaceHover, borderRadius: 8 },
  formReprovacao: { backgroundColor: colors.surfaceHover, padding: 16, borderRadius: 12, marginTop: 10 },
  formSubtitle: { fontSize: 15, fontWeight: 'bold', color: colors.text, marginBottom: 12 },
  motivoRow: { flexDirection: 'row', gap: 6, marginBottom: 12 },
  motivoBtn: { flex: 1, paddingVertical: 8, borderRadius: 6, borderWidth: 1, borderColor: colors.border, alignItems: 'center', backgroundColor: colors.background },
  motivoBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  motivoBtnText: { fontSize: 12, color: colors.text, fontWeight: '500' },
  motivoBtnTextActive: { color: colors.background, fontWeight: 'bold' },
  semestreRow: { flexDirection: 'row', alignItems: 'center' },
  semestreAnoInput: { flex: 1, marginRight: 8 },
  semestrePeriodoContainer: { flexDirection: 'row', flex: 1, gap: 4 },
  toggleButton: { flex: 1, paddingVertical: 12, borderRadius: 8, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  toggleButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  toggleButtonText: { color: colors.text, fontWeight: '500', fontSize: 13 },
  toggleButtonTextActive: { color: colors.background, fontWeight: 'bold' },
  formReprovacaoActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 8 },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  cancelBtnText: { color: colors.text, fontWeight: '500' },
  saveReprovacaoBtn: { backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6 },
  saveReprovacaoBtnText: { color: colors.background, fontWeight: 'bold' },
  footer: { padding: 20, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
  saveButton: { backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center' },
  saveButtonText: { color: colors.background, fontWeight: 'bold', fontSize: 16 }
});