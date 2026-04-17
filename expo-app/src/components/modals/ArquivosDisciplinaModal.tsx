import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList, Platform } from 'react-native';
import { X, Plus, File, Trash2, ExternalLink } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { useDisciplinas } from '../../contexts/DisciplinasContext';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

interface Props {
  visible: boolean;
  disciplinaId: string;
  disciplinaNome: string;
  onClose: () => void;
}

export function ArquivosDisciplinaModal({ visible, disciplinaId, disciplinaNome, onClose }: Props) {
  const { arquivos, addArquivo, removeArquivo } = useDisciplinas();

  const arquivosDaDisciplina = arquivos[disciplinaId] || [];

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: false, // Pode ser útil dependendo
        multiple: false
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        let uriToStore = file.uri;
        let size = file.size;

        if (Platform.OS !== 'web') {
           // Mover arquivo para FileSystem permanente do Expo para evitar que evapore do cache
           const newPath = FileSystem.documentDirectory + 'docs_' + file.name.replace(/\\s+/g, '_');
           await FileSystem.copyAsync({
             from: file.uri,
             to: newPath
           });
           uriToStore = newPath;
        }

        addArquivo(disciplinaId, {
          nome: file.name,
          uri: uriToStore,
          tipo: file.mimeType,
          tamanho: size
        });
      }
    } catch (e) {
      console.error('Erro ao escolher documento:', e);
    }
  };

  const handleAbrirArquivo = async (uri: string) => {
    if (Platform.OS === 'web') {
      window.open(uri, '_blank');
      return;
    }
    
    try {
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri);
      }
    } catch (e) {
      console.error('Erro ao abrir arquivo:', e);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.arquivoItem}>
      <View style={styles.arquivoIcon}>
        <File size={24} color={colors.primary} />
      </View>
      <View style={styles.arquivoInfo}>
        <Text style={styles.arquivoNome} numberOfLines={1}>{item.nome}</Text>
        <Text style={styles.arquivoDesc}>{new Date(item.dataAdicao).toLocaleDateString()}</Text>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleAbrirArquivo(item.uri)}
        >
          <ExternalLink size={20} color={colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => removeArquivo(disciplinaId, item.id)}
        >
          <Trash2 size={20} color={colors.error} />
        </TouchableOpacity>
      </View>
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

          <TouchableOpacity style={styles.addButton} onPress={handleDocumentPick}>
            <Plus size={20} color={colors.background} />
            <Text style={styles.addText}>Adicionar Arquivo</Text>
          </TouchableOpacity>

          <View style={styles.content}>
            {arquivosDaDisciplina.length === 0 ? (
               <Text style={styles.emptyText}>Nenhum arquivo anexado a esta disciplina.</Text>
            ) : (
                <FlatList
                  data={arquivosDaDisciplina.sort((a, b) => b.dataAdicao - a.dataAdicao)}
                  keyExtractor={item => item.id}
                  renderItem={renderItem}
                  contentContainerStyle={styles.listContainer}
                />
            )}
           </View>
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
  content: {
    flex: 1,
    marginTop: 10,
  },
  addButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
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
    marginTop: 20,
    fontStyle: 'italic',
  },
  arquivoItem: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  arquivoIcon: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.surfaceHover,
    marginRight: 12,
  },
  arquivoInfo: {
    flex: 1,
  },
  arquivoNome: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  arquivoDesc: {
    color: colors.textMuted,
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 10,
    backgroundColor: colors.surfaceHover,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  }
});