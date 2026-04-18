import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, TouchableOpacity, ScrollView, Alert, Platform, Linking, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Files, ChevronDown, CheckCircle, Paperclip, FileText, Trash2, X, Edit2, Plus, Save, Search } from 'lucide-react-native';
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

  // Estados de Edição e Busca (Separados para ACC e AIEX)
  const [editandoAccId, setEditandoAccId] = useState<string | null>(null);
  const [editandoAiexId, setEditandoAiexId] = useState<string | null>(null);
  const [searchQueryAcc, setSearchQueryAcc] = useState('');
  const [searchQueryAiex, setSearchQueryAiex] = useState('');

  // Inputs para ACC
  const [novaAccTitulo, setNovaAccTitulo] = useState('');
  const [novaAccQuantidade, setNovaAccQuantidade] = useState('');
  const [novaAccDoc, setNovaAccDoc] = useState<{ name: string; uri: string } | null>(null);

  // Inputs para AIEX
  const [novaAiexTitulo, setNovaAiexTitulo] = useState('');
  const [novaAiexHoras, setNovaAiexHoras] = useState('');
  const [novaAiexDoc, setNovaAiexDoc] = useState<{ name: string; uri: string } | null>(null);

  // Lógica de cálculo de horas totais
  const horasTotaisAcc = (atividades.listaAcc || []).reduce((acc, item) => acc + item.horas, 0);
  const horasTotaisAiex = (atividades.listaAiex || []).reduce((acc, item) => acc + item.horas, 0);

  // LÓGICA DE FILTRAGEM (Busca Independente)
  const accFiltradas = (atividades.listaAcc || []).filter(a => 
    a.titulo.toLowerCase().includes(searchQueryAcc.toLowerCase())
  );
  const aiexFiltradas = (atividades.listaAiex || []).filter(a => 
    a.titulo.toLowerCase().includes(searchQueryAiex.toLowerCase())
  );

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

  const cancelarEdicaoAcc = () => {
    setEditandoAccId(null);
    setRegraAccSelecionada(null);
    setNovaAccTitulo('');
    setNovaAccQuantidade('');
    setNovaAccDoc(null);
  };

  const cancelarEdicaoAiex = () => {
    setEditandoAiexId(null);
    setNovaAiexTitulo('');
    setNovaAiexHoras('');
    setNovaAiexDoc(null);
  };

  const iniciarEdicaoAcc = (item: AtividadeItem) => {
    setEditandoAccId(item.id);
    setNovaAccTitulo(item.titulo);
    setNovaAccQuantidade(item.quantidadeOriginal ? item.quantidadeOriginal.toString() : '');
    
    if (item.nomeDocumento && item.uriDocumento) {
      setNovaAccDoc({ name: item.nomeDocumento, uri: item.uriDocumento });
    } else {
      setNovaAccDoc(null);
    }
    
    const rule = accRules.find(r => r.id === item.modalidadeId) || null;
    setRegraAccSelecionada(rule);
  };

  const iniciarEdicaoAiex = (item: AtividadeItem) => {
    setEditandoAiexId(item.id);
    setNovaAiexTitulo(item.titulo);
    setNovaAiexHoras(item.horas.toString());
    
    if (item.nomeDocumento && item.uriDocumento) {
      setNovaAiexDoc({ name: item.nomeDocumento, uri: item.uriDocumento });
    } else {
      setNovaAiexDoc(null);
    }
  };

  const handleAddAcc = () => {
    if (!regraAccSelecionada || !novaAccQuantidade || !novaAccTitulo) {
      Alert.alert('Erro', 'Por favor, selecione o tipo de ACC, preencha o nome do certificado e a quantidade/horas.');
      return;
    }
    const qtdDigitada = parseFloat(novaAccQuantidade.replace(',', '.')) || 0;
    
    if (qtdDigitada <= 0) return;

    let horasCalculadas = qtdDigitada * regraAccSelecionada.multiplicador;
    
    const horasJaLancadasNestaRegra = (atividades.listaAcc || [])
      .filter(a => a.modalidadeId === regraAccSelecionada.id && a.id !== editandoAccId)
      .reduce((soma, item) => soma + item.horas, 0);
      
    if (horasJaLancadasNestaRegra >= regraAccSelecionada.ch_maxima) {
      Alert.alert('Aviso', `Você já atingiu a carga horária máxima (${regraAccSelecionada.ch_maxima} horas) permitida para esta modalidade.`);
      return;
    }
    
    if (horasJaLancadasNestaRegra + horasCalculadas > regraAccSelecionada.ch_maxima) {
      const margemDisponivel = regraAccSelecionada.ch_maxima - horasJaLancadasNestaRegra;
      horasCalculadas = margemDisponivel;
      Alert.alert('Informação', `Foram computadas apenas ${margemDisponivel} horas para respeitar o limite máximo da modalidade de ${regraAccSelecionada.ch_maxima} horas.`);
    }

    const nova: AtividadeItem = {
      id: editandoAccId ? editandoAccId : Date.now().toString(),
      titulo: novaAccTitulo, 
      horas: parseFloat(horasCalculadas.toFixed(2)),
      nomeDocumento: novaAccDoc?.name,
      uriDocumento: novaAccDoc?.uri,
      modalidadeId: regraAccSelecionada.id,
      quantidadeOriginal: qtdDigitada,
    };

    if (editandoAccId) {
      setAtividades(prev => ({ 
        ...prev, 
        listaAcc: prev.listaAcc.map(a => a.id === editandoAccId ? nova : a) 
      }));
    } else {
      setAtividades(prev => ({ ...prev, listaAcc: [...(prev.listaAcc || []), nova] }));
    }
    
    cancelarEdicaoAcc();
  };

  const getHorasRestantesRegra = (ruleId: string, chMaxima: number, ignorarId?: string) => {
    const horasJaLancadas = (atividades.listaAcc || [])
      .filter(a => a.modalidadeId === ruleId && a.id !== ignorarId)
      .reduce((soma, item) => soma + item.horas, 0);
    return Math.max(0, chMaxima - horasJaLancadas);
  };

  const handleAddAiex = () => {
    if (!novaAiexTitulo || !novaAiexHoras) {
      Alert.alert('Erro', 'Por favor, preencha o título e as horas.');
      return;
    }
    const hrs = parseInt(novaAiexHoras) || 0;
    if (hrs <= 0) return;

    const nova: AtividadeItem = {
      id: editandoAiexId ? editandoAiexId : (Date.now() + 1).toString(),
      titulo: novaAiexTitulo,
      horas: hrs,
      nomeDocumento: novaAiexDoc?.name,
      uriDocumento: novaAiexDoc?.uri,
    };

    if (editandoAiexId) {
      setAtividades(prev => ({ 
        ...prev, 
        listaAiex: prev.listaAiex.map(a => a.id === editandoAiexId ? nova : a) 
      }));
    } else {
      setAtividades(prev => ({ ...prev, listaAiex: [...(prev.listaAiex || []), nova] }));
    }
    
    cancelarEdicaoAiex();
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
        window.open(uri, '_blank');
        return;
      }
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri);
      } else {
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

  const renderItem = (item: AtividadeItem, onEdit: () => void, onRemover: () => void) => (
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
              <FileText size={14} color={colors.disponivel} />
              <Text style={styles.docName} numberOfLines={1}>Ver Anexo</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
          <Edit2 size={20} color={colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onRemover} style={styles.actionButton}>
          <Trash2 size={20} color={'#ff4444'} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Files size={28} color={colors.disponivel} />
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

          <View style={[styles.formCard, editandoAccId && { borderColor: colors.cursando }]}>
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
              <ChevronDown size={20} color={colors.textMuted} />
            </TouchableOpacity>

            <TextInput 
              style={styles.input} 
              placeholder="Nome do Certificado (Ex: Minicurso de Python)" 
              placeholderTextColor={colors.textMuted}
              value={novaAccTitulo}
              onChangeText={setNovaAccTitulo}
            />
            
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
                {novaAccDoc ? (
                  <CheckCircle size={20} color={colors.concluida} />
                ) : (
                  <Paperclip size={20} color={colors.text} />
                )}
                <Text style={[styles.fileBtnText, novaAccDoc && { color: colors.concluida }]}>
                  {novaAccDoc ? 'Anexado' : 'Anexar'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {regraAccSelecionada && (
              <Text style={styles.ruleInfoText}>
                Regra: {regraAccSelecionada.paridadeDescricao} {' | '} Máx: {regraAccSelecionada.ch_maxima_descricao} {' | '} Restam: <Text style={{fontWeight: '700', color: getHorasRestantesRegra(regraAccSelecionada.id, regraAccSelecionada.ch_maxima, editandoAccId || undefined) > 0 ? colors.disponivel : colors.textMuted}}>{getHorasRestantesRegra(regraAccSelecionada.id, regraAccSelecionada.ch_maxima, editandoAccId || undefined)}h</Text>
              </Text>
            )}

            <View style={styles.formActionButtons}>
              {editandoAccId && (
                <TouchableOpacity style={styles.cancelBtn} onPress={cancelarEdicaoAcc} activeOpacity={0.7}>
                  <X size={18} color={colors.textMuted} />
                  <Text style={styles.cancelBtnText}>Cancelar</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={[styles.addBtnPrimary, editandoAccId && styles.editBtnPrimary]} 
                onPress={handleAddAcc}
                activeOpacity={0.8}
              >
                {editandoAccId ? <Save size={18} color="#FFF" /> : <Plus size={18} color="#FFF" />}
                <Text style={styles.addBtnPrimaryText}>
                  {editandoAccId ? 'Salvar Edição' : 'Cadastrar ACC'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ================= BARRA DE BUSCA ACC ================= */}
          <View style={styles.searchContainer}>
            <Search size={20} color={colors.textMuted} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar nas ACCs..."
              placeholderTextColor={colors.textMuted}
              value={searchQueryAcc}
              onChangeText={setSearchQueryAcc}
            />
            {searchQueryAcc.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQueryAcc('')} style={styles.clearSearchBtn}>
                <X size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.listContainer}>
            {(!atividades.listaAcc || atividades.listaAcc.length === 0) && !searchQueryAcc && (
              <Text style={styles.emptyText}>Nenhuma ACC lançada até o momento.</Text>
            )}
            {searchQueryAcc && accFiltradas.length === 0 && atividades.listaAcc?.length > 0 && (
              <Text style={styles.emptyText}>Nenhuma ACC encontrada com "{searchQueryAcc}".</Text>
            )}
            {accFiltradas.map(a => renderItem(
              a, 
              () => iniciarEdicaoAcc(a), 
              () => handleDeleteAcc(a.id)
            ))}
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

              <View style={[styles.formCard, editandoAiexId && { borderColor: colors.cursando }]}>
                <TextInput 
                  style={styles.input} 
                  placeholder="Ex: Monitoria de Iniciação" 
                  placeholderTextColor={colors.textMuted}
                  value={novaAiexTitulo}
                  onChangeText={setNovaAiexTitulo}
                />
                <View style={styles.rowForm}>
                  <TextInput 
                    style={[styles.input, { flex: 1, marginBottom: 0 }]} 
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
                    {novaAiexDoc ? (
                      <CheckCircle size={20} color={colors.concluida} />
                    ) : (
                      <Paperclip size={20} color={colors.text} />
                    )}
                    <Text style={[styles.fileBtnText, novaAiexDoc && { color: colors.concluida }]}>
                       {novaAiexDoc ? 'Anexado' : 'Anexar'}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.formActionButtons}>
                  {editandoAiexId && (
                    <TouchableOpacity style={styles.cancelBtn} onPress={cancelarEdicaoAiex} activeOpacity={0.7}>
                      <X size={18} color={colors.textMuted} />
                      <Text style={styles.cancelBtnText}>Cancelar</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity 
                    style={[styles.addBtnPrimary, editandoAiexId && styles.editBtnPrimary]} 
                    onPress={handleAddAiex}
                    activeOpacity={0.8}
                  >
                    {editandoAiexId ? <Save size={18} color="#FFF" /> : <Plus size={18} color="#FFF" />}
                    <Text style={styles.addBtnPrimaryText}>
                      {editandoAiexId ? 'Salvar Edição' : 'Cadastrar AIEX'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* ================= BARRA DE BUSCA AIEX ================= */}
              <View style={styles.searchContainer}>
                <Search size={20} color={colors.textMuted} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Buscar nas AIEX..."
                  placeholderTextColor={colors.textMuted}
                  value={searchQueryAiex}
                  onChangeText={setSearchQueryAiex}
                />
                {searchQueryAiex.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQueryAiex('')} style={styles.clearSearchBtn}>
                    <X size={18} color={colors.textMuted} />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.listContainer}>
                {(!atividades.listaAiex || atividades.listaAiex.length === 0) && !searchQueryAiex && (
                  <Text style={styles.emptyText}>Nenhuma AIEX lançada até o momento.</Text>
                )}
                {searchQueryAiex && aiexFiltradas.length === 0 && atividades.listaAiex?.length > 0 && (
                  <Text style={styles.emptyText}>Nenhuma AIEX encontrada com "{searchQueryAiex}".</Text>
                )}
                {aiexFiltradas.map(a => renderItem(
                  a, 
                  () => iniciarEdicaoAiex(a), 
                  () => handleDeleteAiex(a.id)
                ))}
              </View>
            </>
          ) : (
             <Text style={styles.emptyText}>Você indicou que não participa de AIEX.</Text>
          )}
        </View>

      </ScrollView>

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
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 12 }}>
              {accRules.map(rule => {
                const restam = getHorasRestantesRegra(rule.id, rule.ch_maxima, editandoAccId || undefined);
                return (
                  <TouchableOpacity
                    key={rule.id}
                    style={[
                      styles.ruleOptionBtn,
                      regraAccSelecionada?.id === rule.id && { borderColor: colors.disponivel, backgroundColor: colors.disponivelBg },
                      restam <= 0 && { opacity: 0.6 }
                    ]}
                    onPress={() => {
                      if (restam > 0) {
                        setRegraAccSelecionada(rule);
                        setModalVisible(false);
                      } else {
                        Alert.alert('Limite Atingido', `Você já alcançou as ${rule.ch_maxima}h permitidas para esta modalidade.`);
                      }
                    }}
                  >
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                      <Text style={[styles.ruleOptionTitle, regraAccSelecionada?.id === rule.id && { color: colors.disponivel }, { flex: 1, paddingRight: 8 }]}>
                        {rule.modalidade}
                      </Text>
                      <View style={{alignItems: 'flex-end'}}>
                        <Text style={[styles.ruleOptionDesc, {fontWeight: '600', color: restam > 0 ? colors.disponivel : colors.textMuted}]}>
                          Restam: {restam}h
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.ruleOptionDesc}>
                      {rule.paridadeDescricao} • Máx: {rule.ch_maxima_descricao}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { padding: 16, paddingBottom: 60 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }, 
  title: { fontSize: 22, fontWeight: '700', color: colors.text },
  
  // --- ESTILOS DA BARRA DE BUSCA ---
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    marginBottom: 16, 
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 15,
  },
  clearSearchBtn: {
    padding: 6,
  },
  // ---------------------------------

  sectionBlock: { backgroundColor: colors.surface, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  sectionProgress: { fontSize: 14, color: colors.textMuted, fontWeight: '600' },
  progressContainer: { height: 8, backgroundColor: colors.background, borderRadius: 4, marginBottom: 16 },
  progressFill: { height: '100%', backgroundColor: colors.cursando, borderRadius: 4 },
  formCard: { backgroundColor: colors.surfaceLight, padding: 12, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: colors.border },
  input: { backgroundColor: colors.background, color: colors.text, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 8 },
  
  // --- A MÁGICA DA RESPONSIVIDADE AQUI ---
  rowForm: { 
    flexDirection: 'row', 
    alignItems: 'stretch', 
    gap: 8, 
    marginBottom: 8 
  },
fileBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 6, 
    paddingHorizontal: 16, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: colors.border, 
    backgroundColor: colors.background 
  },
  fileBtnText: { color: colors.text, fontSize: 13, fontWeight: '500' }, // <--- ADICIONE ESTA LINHA AQUI!
  
  listContainer: { gap: 8 },
  emptyText: { color: colors.textMuted, fontSize: 13, textAlign: 'center', paddingVertical: 10 },
  atividadeItemCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceLight, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: colors.border },
  atividadeItemInfo: { flex: 1 },
  atividadeItemTitulo: { color: colors.text, fontSize: 15, fontWeight: '600' },
  atividadeSubInfo: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  atividadeItemHoras: { color: colors.cursando, fontWeight: '700', fontSize: 13 },
  docBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.background, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, maxWidth: 150 },
  docName: { color: colors.disponivel, fontSize: 11, flexShrink: 1 },
  selectBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.background, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: colors.border, marginBottom: 8 },
  selectBtnText: { color: colors.text, fontSize: 14, flex: 1 },
  ruleInfoText: { fontSize: 12, color: colors.text, marginTop: 4, marginBottom: 12, fontStyle: 'italic' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: colors.border },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  ruleOptionBtn: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 14 },
  ruleOptionTitle: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 4 },
  ruleOptionDesc: { fontSize: 13, color: colors.textMuted },
  actionButtonsContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionButton: { padding: 8 },
  formActionButtons: { flexDirection: 'row', gap: 12, marginTop: 8 },
  addBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.disponivel, 
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: colors.disponivel,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5, 
  },
  editBtnPrimary: {
    backgroundColor: colors.cursando, 
    shadowColor: colors.cursando,
  },
  addBtnPrimaryText: {
    color: '#FFFFFF', 
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  cancelBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.background, 
    borderColor: colors.border,
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 12,
  },
  cancelBtnText: {
    color: colors.textMuted,
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
});