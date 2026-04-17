import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, FlatList, ScrollView, Platform } from 'react-native';
import { X, File, Download, Search, ExternalLink } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { useDisciplinas } from '../../contexts/DisciplinasContext';
import { Arquivo } from '../../types';
import * as Sharing from 'expo-sharing';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function BancoArquivosModal({ visible, onClose }: Props) {
  const { arquivos, disciplinas } = useDisciplinas();

  // Achatar (flatten) os arquivos e adicionar o nome da disciplina correspondente
  const todosArquivos = Object.entries(arquivos).flatMap(([disciplinaId, listaArquivos]) => {
    const disciplina = disciplinas.find(d => d.id === disciplinaId);
    return listaArquivos.map(arquivo => ({
      ...arquivo,
      disciplinaNome: disciplina?.nome || 'Disciplina Desconhecida'
    }));
  }).sort((a, b) => b.dataAdicao - a.dataAdicao);

  const [filtro, setFiltro] = useState('');

  const arquivosFiltrados = todosArquivos.filter(
    (arq) => 
      arq.nome.toLowerCase().includes(filtro.toLowerCase()) || 
      arq.disciplinaNome.toLowerCase().includes(filtro.toLowerCase())
  );

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

  const getTamanhoFormatado = (tamanho?: number) => {
    if (!tamanho) return '--';
    if (tamanho < 1024) return `${tamanho} B`;
    if (tamanho < 1024 * 1024) return `${(tamanho / 1024).toFixed(1)} KB`;
    return `${(tamanho / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderItem = ({ item }: { item: Arquivo & { disciplinaNome: string } }) => (
    <View style={styles.arquivoItem}>
      <View style={styles.arquivoIcon}>
        <File size={24} color={colors.primary} />
      </View>
      <View style={styles.arquivoInfo}>
        <Text style={styles.arquivoNome} numberOfLines={1}>{item.nome}</Text>
        <Text style={styles.arquivoDisciplina} numberOfLines={1}>{item.disciplinaNome}</Text>
        <View style={styles.arquivoDetalhes}>
          <Text style={styles.arquivoMeta}>
            Adicionado em: {new Date(item.dataAdicao).toLocaleDateString()}
          </Text>
          <Text style={styles.arquivoTamanho}>
            {getTamanhoFormatado(item.tamanho)}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.openButton}
        onPress={() => handleAbrirArquivo(item.uri)}
      >
        <ExternalLink size={20} color={colors.text} />
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
            <Text style={styles.title}>Banco de Arquivos Centralizado</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {todosArquivos.length === 0 ? (
              <View style={styles.emptyContainer}>
                <File size={48} color={colors.textMuted} />
                <Text style={styles.emptyTitle}>Nenhum arquivo salvo</Text>
                <Text style={styles.emptyText}>Salva materiais em suas disciplinas para que fiquem visíveis aqui.</Text>
              </View>
            ) : (
              <FlatList
                data={arquivosFiltrados}
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
    justifyContent: 'flex-start',
  },
  modalContent: {
    flex: 1,
    marginTop: 40,
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: 'center',
  },
  arquivoItem: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  arquivoIcon: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: colors.surfaceHover,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  arquivoInfo: {
    flex: 1,
  },
  arquivoNome: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  arquivoDisciplina: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: 6,
  },
  arquivoDetalhes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  arquivoMeta: {
    color: colors.textMuted,
    fontSize: 12,
  },
  arquivoTamanho: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  openButton: {
    padding: 10,
    backgroundColor: colors.surfaceHover,
    borderRadius: 10,
    marginLeft: 12,
  }
});