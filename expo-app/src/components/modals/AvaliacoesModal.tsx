import React, { useState, useMemo } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList, TextInput, ScrollView, Alert, Platform } from 'react-native';
import { X, Plus, Trash2, Pencil, Check, Paperclip, Download } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import { colors } from '../../theme/colors';
import { useDisciplinas } from '../../contexts/DisciplinasContext';
import { AvaliacaoTipo, Avaliacao } from '../../types';

interface Props {
  visible: boolean;
  disciplinaId: string;
  disciplinaNome: string;
  onClose: () => void;
}

const TIPOS_AVALIACAO: AvaliacaoTipo[] = ['Prova 1', 'Prova 2', 'Prova 3', 'Extra Curricular', 'Atividade em Sala', 'Substitutiva', 'Trabalho', 'Outro'];

export function AvaliacoesModal({ visible, disciplinaId, disciplinaNome, onClose }: Props) {
  const { avaliacoes, addAvaliacao, removeAvaliacao, editAvaliacao } = useDisciplinas();
  
  const [tipo, setTipo] = useState<AvaliacaoTipo>('Prova 1');
  const [nomeProva, setNomeProva] = useState('');
  const [semestreAno, setSemestreAno] = useState('');
  const [semestrePeriodo, setSemestrePeriodo] = useState<'' | '1' | '2'>('');
  const [descricao, setDescricao] = useState('');
  const [arquivoUri, setArquivoUri] = useState<string | undefined>(undefined);
  const [arquivoNome, setArquivoNome] = useState<string | undefined>(undefined);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [filtroSemestre, setFiltroSemestre] = useState<string>('Todos');

  const avaliacoesDaDisciplina = avaliacoes[disciplinaId] || [];

  const semestresDisponiveis = useMemo(() => {
    const s = new Set<string>();
    avaliacoesDaDisciplina.forEach(a => {
      if (a.semestre) s.add(a.semestre);
    });
    return ['Todos', ...Array.from(s).sort((a, b) => b.localeCompare(a))];
  }, [avaliacoesDaDisciplina]);

  const avaliacoesFiltradas = useMemo(() => {
    if (filtroSemestre === 'Todos') return avaliacoesDaDisciplina;
    return avaliacoesDaDisciplina.filter(a => a.semestre === filtroSemestre);
  }, [avaliacoesDaDisciplina, filtroSemestre]);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setArquivoUri(result.assets[0].uri);
        setArquivoNome(result.assets[0].name);
      }
    } catch (err) {
      console.log('Erro ao anexar arquivo', err);
    }
  };

  const resetForm = () => {
    setTipo('Prova 1');
    setNomeProva('');
    setSemestreAno('');
    setSemestrePeriodo('');
    setDescricao('');
    setArquivoUri(undefined);
    setArquivoNome(undefined);
    setEditingId(null);
  };

  const handleSave = () => {
    if (!arquivoUri) {
      Alert.alert('Erro', 'Por favor, anexe um arquivo para salvar.');
      return;
    }
    
    if (!semestreAno.trim() || !semestrePeriodo) {
      Alert.alert('Erro', 'Por favor, preencha o ano e o período do semestre.');
      return;
    }

    const nomeBase = nomeProva.trim() ? nomeProva.trim() : tipo;
    const semestreFormatado = `${semestreAno.trim()}.${semestrePeriodo}`;
    
    if (editingId) {
      editAvaliacao(disciplinaId, editingId, {
        tipo,
        nomeProva: nomeBase,
        semestre: semestreFormatado,
        descricao: descricao.trim() || undefined,
        arquivoUri,
        arquivoNome
      });
    } else {
      addAvaliacao(disciplinaId, {
        tipo,
        nomeProva: nomeBase,
        semestre: semestreFormatado,
        descricao: descricao.trim() || undefined,
        arquivoUri,
        arquivoNome
      });
    }

    resetForm();
  };

  const handleEditClick = (item: Avaliacao) => {
    setEditingId(item.id);
    setTipo(item.tipo);
    setNomeProva(item.nomeProva || '');
    
    if (item.semestre) {
      if (item.semestre.includes('.')) {
        const parts = item.semestre.split('.');
        setSemestreAno(parts[0]);
        setSemestrePeriodo(parts[1] as '' | '1' | '2');
      } else {
        setSemestreAno(item.semestre);
        setSemestrePeriodo('');
      }
    } else {
      setSemestreAno('');
      setSemestrePeriodo('');
    }
    
    setDescricao(item.descricao || '');
    setArquivoUri(item.arquivoUri);
    setArquivoNome(item.arquivoNome);
  };

  const handleDownload = async (uri: string, nome: string) => {
    try {
      if (Platform.OS === 'web') {
        const response = await fetch(uri);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.download = nome || 'download';
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }, 100);
        return;
      }

      if (Platform.OS === 'android') {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted) {
          try {
            const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
            const createdUri = await FileSystem.StorageAccessFramework.createFileAsync(permissions.directoryUri, nome, '*/*');
            await FileSystem.writeAsStringAsync(createdUri, base64, { encoding: FileSystem.EncodingType.Base64 });
            Alert.alert('Sucesso', 'Arquivo salvo com sucesso!');
          } catch (e) {
            console.error('Erro ao ler/escrever arquivo:', e);
            Alert.alert('Erro', 'Ocorreu um erro ao salvar o arquivo no diretório selecionado.');
          }
        }
      } else {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(uri, { dialogTitle: 'Salvar ' + nome });
        } else {
          Alert.alert('Aviso', 'Compartilhamento não disponível no dispositivo.');
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível baixar ou salvar o arquivo.');
    }
  };

  const renderAvaliacao = ({ item }: { item: Avaliacao }) => (
    <View style={styles.avaliacaoItem}>
      <View style={styles.avaliacaoInfo}>
        <View style={styles.avaliacaoHeader}>
          <Text style={styles.avaliacaoTipo}>{item.tipo}</Text>
          {item.semestre ? <Text style={styles.semestreBadge}>{item.semestre}</Text> : null}
        </View>
        <Text style={styles.avaliacaoNota}>{item.nomeProva || item.tipo}</Text>
        {item.arquivoNome && item.arquivoUri && (
          <TouchableOpacity 
            style={styles.downloadButtonWrapper}
            onPress={() => handleDownload(item.arquivoUri!, item.arquivoNome!)}
          >
            <Download size={14} color={colors.primary} style={{ marginRight: 4 }} />
            <Text style={styles.arquivoText}>Anexo: {item.arquivoNome}</Text>
          </TouchableOpacity>
        )}
        {item.descricao && (
          <Text style={styles.avaliacaoDescricao}>{item.descricao}</Text>
        )}
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditClick(item)}
        >
          <Pencil size={20} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => removeAvaliacao(disciplinaId, item.id)}
        >
          <Trash2 size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <FlatList
            ListHeaderComponent={
              <>
                <View style={styles.header}>
                  <Text style={styles.title} numberOfLines={1}>Banco de Provas: {disciplinaNome}</Text>
                  <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                    <X size={24} color={colors.text} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.formContainer}>
                  <Text style={styles.label}>{editingId ? 'Editar Prova' : 'Adicionar ao Banco de Provas'}</Text>
                  
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

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Nome (Opcional)</Text>
                    <TextInput
                      style={styles.input}
                      value={nomeProva}
                      onChangeText={setNomeProva}
                      placeholder="Ex: P1_Professor_Fulano"
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Ano e Semestre *</Text>
                    <View style={styles.semestreRow}>
                      <TextInput
                        style={[styles.input, styles.semestreAnoInput]}
                        value={semestreAno}
                        onChangeText={setSemestreAno}
                        placeholder="Ex: 2024"
                        placeholderTextColor={colors.textMuted}
                        keyboardType="numeric"
                        maxLength={4}
                      />
                      <View style={styles.semestrePeriodoContainer}>
                        <TouchableOpacity 
                          style={[styles.toggleButton, semestrePeriodo === '1' && styles.toggleButtonActive]}
                          onPress={() => setSemestrePeriodo(semestrePeriodo === '1' ? '' : '1')}
                        >
                          <Text style={[styles.toggleButtonText, semestrePeriodo === '1' && styles.toggleButtonTextActive]}>1º Sem</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={[styles.toggleButton, semestrePeriodo === '2' && styles.toggleButtonActive]}
                          onPress={() => setSemestrePeriodo(semestrePeriodo === '2' ? '' : '2')}
                        >
                          <Text style={[styles.toggleButtonText, semestrePeriodo === '2' && styles.toggleButtonTextActive]}>2º Sem</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Descrição (Opcional)</Text>
                    <TextInput
                      style={styles.input}
                      value={descricao}
                      onChangeText={setDescricao}
                      placeholder="Ex: Material da primeira unidade..."
                      placeholderTextColor={colors.textMuted}
                    />
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.attachButton} 
                    onPress={handlePickDocument}
                  >
                    <Paperclip size={20} color={colors.primary} />
                    <Text style={styles.attachText}>
                      {arquivoNome ? arquivoNome : 'Anexar Arquivo'}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.formActions}>
                    {editingId && (
                      <TouchableOpacity 
                        style={[styles.cancelButton, styles.formActionButton]} 
                        onPress={resetForm}
                      >
                        <X size={20} color={colors.text} />
                        <Text style={styles.cancelText}>Cancelar</Text>
                      </TouchableOpacity>
                    )}
                    
                    <TouchableOpacity 
                      style={[styles.addButton, styles.formActionButton, { marginLeft: editingId ? 8 : 0 }]} 
                      onPress={handleSave}
                    >
                      {editingId ? <Check size={20} color={colors.background} /> : <Plus size={20} color={colors.background} />}
                      <Text style={styles.addText}>{editingId ? 'Atualizar' : 'Adicionar'}</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {semestresDisponiveis.length > 1 && (
                  <View style={styles.tabsContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
                      {semestresDisponiveis.map(s => (
                        <TouchableOpacity
                          key={s}
                          style={[styles.tabButton, filtroSemestre === s && styles.tabButtonActive]}
                          onPress={() => setFiltroSemestre(s)}
                        >
                          <Text style={[styles.tabText, filtroSemestre === s && styles.tabTextActive]}>{s}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </>
            }
            data={avaliacoesFiltradas}
            keyExtractor={item => item.id}
            renderItem={renderAvaliacao}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhuma prova salva no banco.</Text>
            }
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%', minHeight: '60%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text, flex: 1, marginRight: 10 },
  closeButton: { padding: 8, borderRadius: 20, backgroundColor: colors.surfaceHover },
  formContainer: { backgroundColor: colors.background, padding: 16, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: colors.border },
  label: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 12 },
  typeSelector: { marginBottom: 16 },
  typeButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.surfaceHover, marginRight: 8, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  typeButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  typeText: { color: colors.text, fontWeight: '500', textAlign: 'center' },
  typeTextActive: { color: colors.background, fontWeight: 'bold', textAlign: 'center' },
  inputGroup: { marginBottom: 12 },
  inputLabel: { fontSize: 12, color: colors.textMuted, marginBottom: 4, fontWeight: '500' },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 8, padding: 10, color: colors.text, fontSize: 16 },
  semestreRow: { flexDirection: 'row', alignItems: 'center' },
  semestreAnoInput: { flex: 1, marginRight: 8 },
  semestrePeriodoContainer: { flexDirection: 'row', flex: 1 },
  toggleButton: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginHorizontal: 2 },
  toggleButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  toggleButtonText: { color: colors.text, fontWeight: '500', fontSize: 14 },
  toggleButtonTextActive: { color: colors.background, fontWeight: 'bold' },
  attachButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceHover, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.border, marginBottom: 12 },
  attachText: { color: colors.primary, fontWeight: '600', marginLeft: 8 },
  formActions: { flexDirection: 'row', marginTop: 8 },
  formActionButton: { flex: 1 },
  cancelButton: { backgroundColor: colors.surfaceHover, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12, borderRadius: 8 },
  cancelText: { color: colors.text, fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  addButton: { backgroundColor: colors.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12, borderRadius: 8 },
  addText: { color: colors.background, fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  listContainer: { paddingTop: 24, paddingHorizontal: 20, paddingBottom: 40 },
  tabsContainer: { marginBottom: 16 },
  tabsScroll: { paddingRight: 20 },
  tabButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.surfaceHover, marginRight: 8, borderWidth: 1, borderColor: colors.border },
  tabButtonActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { color: colors.text, fontWeight: '500', fontSize: 14 },
  tabTextActive: { color: colors.background, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', color: colors.textMuted, marginTop: 20, fontSize: 16 },
  avaliacaoItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: colors.border },
  avaliacaoInfo: { flex: 1 },
  avaliacaoHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  avaliacaoTipo: { fontWeight: 'bold', color: colors.text, fontSize: 16, marginRight: 8, backgroundColor: colors.surfaceHover, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, overflow: 'hidden', textAlign: 'center', textAlignVertical: 'center' },
  semestreBadge: { backgroundColor: colors.primary, color: colors.background, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, fontSize: 12, fontWeight: 'bold', overflow: 'hidden' },
  avaliacaoNota: { color: colors.text, fontWeight: '600', fontSize: 16, marginBottom: 2 },
  downloadButtonWrapper: { flexDirection: 'row', alignItems: 'center', marginTop: 4, paddingVertical: 4 },
  arquivoText: { color: colors.primary, fontSize: 12, fontWeight: '500', textDecorationLine: 'underline' },
  avaliacaoDescricao: { color: colors.text, fontSize: 14, marginTop: 6, fontStyle: 'italic' },
  actionButtons: { flexDirection: 'row' },
  editButton: { padding: 10, backgroundColor: colors.surfaceHover, borderRadius: 10, marginRight: 8 },
  deleteButton: { padding: 10, backgroundColor: colors.surfaceHover, borderRadius: 10 }
});
