import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, TouchableOpacity, ScrollView, Alert, Platform, Linking, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import { colors } from '../theme/colors';
import { useDisciplinas } from '../contexts/DisciplinasContext';
import { AtividadeItem } from '../types';
import { accRules, AccRule } from '../data/accs';

export function AtividadesScreen() {
  const { atividades, setAtividades } = useDisciplinas();

  // Modal para escolher a regra de ACC
  const [modalVisible, setModalVisible] = useState(false);
  const [regraAccSelecionada, setRegraAccSelecionada] = useState<AccRule | null>(null);

  // Inputs para nova ACC
  const [novaAccQuantidade, setNovaAccQuantidade] = useState('');
  const [novaAccDoc, setNovaAccDoc] = useState<{ name: string; uri: string } | null>(null);

  // Inputs para nova AIEX
  const [novaAiexTitulo, setNovaAiexTitulo] = useState('');
  const [novaAiexHoras, setNovaAiexHoras] = useState('');
  const [novaAiexDoc, setNovaAiexDoc] = useState<{ name: string; uri: string } | null>(null);

  const horasTotaisAcc = (atividades.listaAcc || []).reduce((acc, item) => acc + item.horas, 0);
  const horasTotaisAiex = (atividades.listaAiex || []).reduce((acc, item) => acc + item.horas, 0);

  const pickDocument = async (setter: React.Dispatch<React.SetStateAction<{name: string; uri: string} | null>>) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setter({ name: result.assets[0].name, uri: result.assets[0].uri });
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Erro', 'Tente novamente.');
    }
  };

  const handleAddAcc = () => {
    if (!regraAccSelecionada || !novaAccQuantidade) {
      Alert.alert('Erro', 'Por favor, selecione o tipo de ACC e preencha a quantidade/horas.');
      return;
    }
    const qtdDigitada = parseFloat(novaAccQuantidade) || 0;
    
    if (qtdDigitada <= 0) return;

    // Calcula horas provisórias, a regra de negócio do curso aplica ch_maxima.
    let horasCalculadas = qtdDigitada * regraAccSelecionada.multiplicador;
    
    // Validar se o total gerado para essa modalidade não ultrapassa a ch_maxima (considerando as já lançadas)
    const horasJaLancadasNestaRegra = (atividades.listaAcc || [])
      .filter(a => a.modalidadeId === regraAccSelecionada.id)
      .reduce((soma, item) => soma + item.horas, 0);
      
    if (horasJaLancadasNestaRegra >= regraAccSelecionada.ch_maxima) {
      Alert.alert('Aviso', `Você já atingiu a carga horária máxima (${regraAccSelecionada.ch_maxima} horas) permitida para esta modalidade.`);
      return;
    }
    
    if (horasJaLancadasNestaRegra + horasCalculadas > regraAccSelecionada.ch_maxima) {
      const margemDisponivel = regraAccSelecionada.ch_maxima - horasJaLancadasNestaRegra;
      horasCalculadas = margemDisponivel; // Cap no limite maximo restante
      Alert.alert('Informação', `Foram computadas apenas ${margemDisponivel} horas para respeitar o limite máximo da modalidade de ${regraAccSelecionada.ch_maxima} horas.`);
    }

    const nova: AtividadeItem = {
      id: Date.now().toString(),
      titulo: regraAccSelecionada.modalidade,
      horas: parseFloat(horasCalculadas.toFixed(2)),
      nomeDocumento: novaAccDoc?.name,
      uriDocumento: novaAccDoc?.uri,
      modalidadeId: regraAccSelecionada.id,
      quantidadeOriginal: qtdDigitada,
    };

    setAtividades(prev => ({ ...prev, listaAcc: [...(prev.listaAcc || []), nova] }));
    setRegraAccSelecionada(null);
    setNovaAccQuantidade('');
    setNovaAccDoc(null);
  };

  const handleAddAiex = () => {
    if (!novaAiexTitulo || !novaAiexHoras) {
      Alert.alert('Erro', 'Por favor, preencha o título e as horas.');
      return;
    }
    const hrs = parseInt(novaAiexHoras) || 0;
    if (hrs <= 0) return;

    const nova: AtividadeItem = {
      id: (Date.now() + 1).toString(),
      titulo: novaAiexTitulo,
      horas: hrs,
      nomeDocumento: novaAiexDoc?.name,
      uriDocumento: novaAiexDoc?.uri,
    };

    setAtividades(prev => ({ ...prev, listaAiex: [...(prev.listaAiex || []), nova] }));
    setNovaAiexTitulo('');
    setNovaAiexHoras('');
    setNovaAiexDoc(null);
  };

  const handleDeleteAcc = (id: string) => {
    setAtividades(prev => ({ ...prev, listaAcc: (prev.listaAcc || []).filter(a => a.id !== id) }));
  };

  const handleDeleteAiex = (id: string) => {
    setAtividades(prev => ({ ...prev, listaAiex: (prev.listaAiex || []).filter(a => a.id !== id) }));
  };

  const handleOpenDocument = async (uri: string | undefined) => {
    if (!uri) {
      Alert.alert('Erro', 'Documento não encontrado.');
      return;
    }
    try {
      if (Platform.OS === 'web') {
        // Na web, podemos tentar abrir a URI diretamente (se for blob, base64 ou URL online)
        window.open(uri, '_blank');
        return;
      }

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri);
      } else {
        // Fallback pro Linking caso o sharing falhe e seja ambiente mobile nativo suportado ou url online
        const supported = await Linking.canOpenURL(uri);
        if (supported) {
          await Linking.openURL(uri);
        } else {
          Alert.alert('Aviso', 'O sistema não suporta abrir este arquivo diretamente.');
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível acessar o documento.');
    }
  };

  const renderItem = (item: AtividadeItem, onRemover: () => void) => (
    <View key={item.id} style={styles.atividadeItemCard}>
      <View style={styles.atividadeItemInfo}>
        <Text style={styles.atividadeItemTitulo}>{item.titulo}</Text>
        <View style={styles.atividadeSubInfo}>
          <Text style={styles.atividadeItemHoras}>{item.horas} horas</Text>
          {item.nomeDocumento && item.uriDocumento && (
            <TouchableOpacity 
              style={styles.docBadge}
              onPress={() => handleOpenDocument(item.uriDocumento)}
            >
              <Ionicons name="document-text-outline" size={14} color={colors.disponivel} />
              <Text style={styles.docName} numberOfLines={1}>Ver Anexo</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <TouchableOpacity onPress={onRemover} style={styles.delButton}>
        <Ionicons name="trash-outline" size={20} color={'#ff4444'} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Ionicons name="documents-outline" size={28} color={colors.disponivel} />
          <Text style={styles.title}>Atividades Complementares</Text>
        </View>

        {/* ===================== ACC ===================== */}
        <View style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>ACC (Máximo 200h)</Text>
            <Text style={styles.sectionProgress}>{horasTotaisAcc}/200h</Text>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={[styles.progressFill, { width: `${Math.min((horasTotaisAcc / 200) * 100, 100)}%` }]} />
          </View>

          {/* Form Create */}
          <View style={styles.formCard}>
            <TouchableOpacity 
              style={styles.selectBtn} 
              onPress={() => setModalVisible(true)}
            >
              <Text 
                style={[styles.selectBtnText, !regraAccSelecionada && { color: colors.textMuted }]}
                numberOfLines={1}
              >
                {regraAccSelecionada ? regraAccSelecionada.modalidade : 'Selecione o Tipo de ACC...'}
              </Text>
              <Ionicons name="chevron-down" size={20} color={colors.textMuted} />
            </TouchableOpacity>
            
            <View style={styles.rowForm}>
              <TextInput 
                style={[styles.input, { flex: 1, marginBottom: 0 }]} 
                placeholder={regraAccSelecionada?.unidadeEntrada === 'quantidade' ? 'Quantidade (Ex: 2)' : 'Horas (Ex: 20)'} 
                placeholderTextColor={colors.textMuted}
                keyboardType="numeric"
                value={novaAccQuantidade}
                onChangeText={setNovaAccQuantidade}
                maxLength={4}
              />
              <TouchableOpacity 
                style={[styles.fileBtn, novaAccDoc && { borderColor: colors.concluida }]} 
                onPress={() => pickDocument(setNovaAccDoc)}
              >
                <Ionicons name={novaAccDoc ? "checkmark-circle" : "attach"} size={20} color={novaAccDoc ? colors.concluida : colors.text} />
                <Text style={[styles.fileBtnText, novaAccDoc && { color: colors.concluida }]}>
                  {novaAccDoc ? 'Anexado' : 'Anexar'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {regraAccSelecionada && (
              <Text style={styles.ruleInfoText}>
                Regra: {regraAccSelecionada.paridadeDescricao} {' | '} Máx: {regraAccSelecionada.ch_maxima_descricao}
              </Text>
            )}

            <TouchableOpacity style={styles.addBtn} onPress={handleAddAcc}>
              <Text style={styles.addBtnText}>Cadastrar ACC</Text>
            </TouchableOpacity>
          </View>

          {/* List */}
          <View style={styles.listContainer}>
            {(!atividades.listaAcc || atividades.listaAcc.length === 0) && (
              <Text style={styles.emptyText}>Nenhuma ACC lançada até o momento.</Text>
            )}
            {(atividades.listaAcc || []).map(a => renderItem(a, () => handleDeleteAcc(a.id)))}
          </View>
        </View>

        {/* ===================== AIEX ===================== */}
        <View style={[styles.sectionBlock, { marginTop: 24 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>AIEX</Text>
            <Switch 
              value={atividades.temAiex}
              onValueChange={(val) => setAtividades(prev => ({ ...prev, temAiex: val }))}
              trackColor={{ false: colors.border, true: colors.disponivelBg }}
              thumbColor={atividades.temAiex ? colors.disponivel : colors.textMuted}
            />
          </View>

          {atividades.temAiex ? (
            <>
              <View style={styles.sectionHeader}>
                 <Text style={styles.sectionProgress}>{horasTotaisAiex}/400h</Text>
              </View>
              <View style={styles.progressContainer}>
                <View style={[styles.progressFill, { backgroundColor: colors.disponivel, width: `${Math.min((horasTotaisAiex / 400) * 100, 100)}%` }]} />
              </View>

              {/* Form Create */}
              <View style={styles.formCard}>
                <TextInput 
                  style={styles.input} 
                  placeholder="Ex: Monitoria de Iniciação" 
                  placeholderTextColor={colors.textMuted}
                  value={novaAiexTitulo}
                  onChangeText={setNovaAiexTitulo}
                />
                <View style={styles.rowForm}>
                  <TextInput 
                    style={[styles.input, { flex: 1 }]} 
                    placeholder="Horas (Ex: 80)" 
                    placeholderTextColor={colors.textMuted}
                    keyboardType="numeric"
                    value={novaAiexHoras}
                    onChangeText={setNovaAiexHoras}
                    maxLength={3}
                  />
                  <TouchableOpacity 
                    style={[styles.fileBtn, novaAiexDoc && { borderColor: colors.concluida }]} 
                    onPress={() => pickDocument(setNovaAiexDoc)}
                  >
                    <Ionicons name={novaAiexDoc ? "checkmark-circle" : "attach"} size={20} color={novaAiexDoc ? colors.concluida : colors.text} />
                    <Text style={[styles.fileBtnText, novaAiexDoc && { color: colors.concluida }]}>
                       {novaAiexDoc ? 'Documento Anexo' : 'Anexar'}
                    </Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.addBtn} onPress={handleAddAiex}>
                  <Text style={styles.addBtnText}>Cadastrar AIEX</Text>
                </TouchableOpacity>
              </View>

              {/* List */}
              <View style={styles.listContainer}>
                {(!atividades.listaAiex || atividades.listaAiex.length === 0) && (
                  <Text style={styles.emptyText}>Nenhuma AIEX lançada até o momento.</Text>
                )}
                {(atividades.listaAiex || []).map(a => renderItem(a, () => handleDeleteAiex(a.id)))}
              </View>
            </>
          ) : (
             <Text style={styles.emptyText}>Você indicou que não participa de AIEX.</Text>
          )}
        </View>

      </ScrollView>

      {/* Modal de Seleção de Regra ACC */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione a Modalidade</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 4 }}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 12 }}>
              {accRules.map(rule => (
                <TouchableOpacity
                  key={rule.id}
                  style={[
                    styles.ruleOptionBtn,
                    regraAccSelecionada?.id === rule.id && { borderColor: colors.disponivel, backgroundColor: colors.disponivelBg }
                  ]}
                  onPress={() => {
                    setRegraAccSelecionada(rule);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.ruleOptionTitle, regraAccSelecionada?.id === rule.id && { color: colors.disponivel }]}>
                    {rule.modalidade}
                  </Text>
                  <Text style={styles.ruleOptionDesc}>
                    {rule.paridadeDescricao} • Máx: {rule.ch_maxima_descricao}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 16,
    paddingBottom: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  sectionBlock: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  sectionProgress: {
    fontSize: 14,
    color: colors.textMuted,
    fontWeight: '600',
  },
  progressContainer: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.cursando,
    borderRadius: 4,
  },
  formCard: {
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    backgroundColor: colors.background,
    color: colors.text,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  rowForm: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  fileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  fileBtnText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '500',
  },
  addBtn: {
    backgroundColor: colors.disponivelBg,
    borderColor: colors.disponivelBorder,
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addBtnText: {
    color: colors.disponivel,
    fontWeight: '600',
    fontSize: 15,
  },
  listContainer: {
    gap: 8,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 10,
  },
  atividadeItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  atividadeItemInfo: {
    flex: 1,
  },
  atividadeItemTitulo: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  atividadeSubInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  atividadeItemHoras: {
    color: colors.cursando,
    fontWeight: '700',
    fontSize: 13,
  },
  docBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    maxWidth: 150,
  },
  docName: {
    color: colors.disponivel,
    fontSize: 11,
    flexShrink: 1,
  },
  delButton: {
    padding: 8,
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  selectBtnText: {
    color: colors.text,
    fontSize: 14,
    flex: 1,
  },
  ruleInfoText: {
    fontSize: 12,
    color: colors.textBody,
    marginTop: 4,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  ruleOptionBtn: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
  },
  ruleOptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  ruleOptionDesc: {
    fontSize: 13,
    color: colors.textMuted,
  }
});