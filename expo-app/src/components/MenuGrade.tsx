import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { UploadCloud, Share, Download, RefreshCw, Info, Files } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import { useDisciplinas } from '../contexts/DisciplinasContext';
import { colors } from '../theme/colors';
import { BancoArquivosModal } from './modals/BancoArquivosModal';

const MODELO_XLSX_DATA = [
  { id: 'mat1', nome: 'Matemática Básica', semestre: 1, preRequisitos: '' },
  { id: 'prog1', nome: 'Programação I', semestre: 1, preRequisitos: '' },
  { id: 'prog2', nome: 'Programação Orientada a Objetos', semestre: 2, preRequisitos: 'prog1' },
  { id: 'prog3', nome: 'Programação Avançada', semestre: 3, preRequisitos: 'prog1,prog2' }
];

const exportarArquivoXlsx = async (dados: any[], nomeArquivo: string, mensagemSucesso: string) => {
  try {
    const ws = XLSX.utils.json_to_sheet(dados);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Grade');

    if (Platform.OS === 'web') {
      const wbout = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nomeArquivo;
      a.click();
      URL.revokeObjectURL(url);
    } else if (Platform.OS === 'android') {
      const base64 = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          nomeArquivo,
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
        Alert.alert('Sucesso', mensagemSucesso);
      }
    } else {
      const base64 = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
      const fileUri = FileSystem.cacheDirectory + nomeArquivo;
      await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          dialogTitle: 'Exportar Grade',
          UTI: 'com.microsoft.excel.xlsx'
        });
      }
    }
  } catch (error) {
    if (Platform.OS === 'web') window.alert('Não foi possível exportar a grade.');
    else Alert.alert('Erro', 'Não foi possível exportar a grade.');
  }
};

export function MenuGrade() {
  const { disciplinas, importarGrade, resetarGrade } = useDisciplinas();
  const [modalArquivosVisible, setModalArquivosVisible] = useState(false);

  const handleResetGrade = () => {
    const executarReset = () => {
      try {
        resetarGrade();
        if (Platform.OS === 'web') {
          window.alert('Sua grade foi restaurada para Engenharia de Sistemas!');
        } else {
          Alert.alert('Sucesso', 'Sua grade foi restaurada para Engenharia de Sistemas!');
        }
      } catch (e: any) {
        if (Platform.OS === 'web') window.alert('Erro ao resetar: ' + (e.message || ''));
        else Alert.alert('Erro', 'Erro ao resetar: ' + (e.message || ''));
      }
    };

    if (Platform.OS === 'web') {
      const confirmou = window.confirm('Tem certeza que deseja restaurar a grade de Engenharia de Sistemas? Seu progresso e estrutura atual serão apagados.');
      if (confirmou) executarReset();
    } else {
      Alert.alert(
        'Restaurar Grade Padrão',
        'Tem certeza que deseja restaurar a grade de Engenharia de Sistemas? Seu progresso e estrutura atual serão apagados.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Restaurar', style: 'destructive', onPress: executarReset }
        ]
      );
    }
  };

  const handleExportGradeAtual = async () => {
    const dadosExportacao = disciplinas.map(d => ({
      id: d.id,
      nome: d.nome,
      semestre: d.semestre,
      preRequisitos: (d.preRequisitos || []).join(',')
    }));
    await exportarArquivoXlsx(dadosExportacao, 'minha_grade_atual.xlsx', 'A grade atual foi exportada com sucesso!');
  };

  const handleDownloadModelo = async () => {
    await exportarArquivoXlsx(MODELO_XLSX_DATA, 'modelo_grade.xlsx', 'O modelo foi salvo no seu dispositivo!');
  };

  const parseWorkbook = (wb: XLSX.WorkBook): any[] => {
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json<any>(ws);
    
    if (!data || data.length === 0) {
      throw new Error('A planilha está vazia ou sem dados válidos.');
    }

    return data.map(row => {
      const pReqs = row.preRequisitos ? String(row.preRequisitos).split(',').map(p => p.trim()).filter(Boolean) : [];
      return {
        id: String(row.id || '').trim(),
        nome: String(row.nome || '').trim(),
        semestre: parseInt(row.semestre, 10) || 1,
        preRequisitos: pReqs
      };
    }).filter(d => d.id && d.nome);
  };

  const handleImportGrade = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel'
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset.name && !asset.name.toLowerCase().endsWith('.xlsx') && !asset.name.toLowerCase().endsWith('.xls')) {
          throw new Error('Por favor, selecione um arquivo válido no formato Excel (.xlsx ou .xls)');
        }

        let wb: XLSX.WorkBook;

        if (Platform.OS === 'web') {
          let buffer: ArrayBuffer;
          if (asset.file) {
            buffer = await asset.file.arrayBuffer();
          } else {
            const resp = await fetch(asset.uri);
            buffer = await resp.arrayBuffer();
          }
          wb = XLSX.read(buffer, { type: 'array' });
        } else {
          const base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.Base64 });
          wb = XLSX.read(base64, { type: 'base64' });
        }

        const gradeParseada = parseWorkbook(wb);
        
        const executarImportacao = () => {
          try {
            importarGrade(gradeParseada);
            if (Platform.OS === 'web') window.alert('A nova grade foi importada com sucesso!');
            else Alert.alert('Sucesso', 'A nova grade foi importada com sucesso!');
          } catch (e: any) {
            const msg = 'Grade com propriedades inválidas. ' + (e.message || '');
            if (Platform.OS === 'web') window.alert(msg);
            else Alert.alert('Erro', msg);
          }
        };

        if (Platform.OS === 'web') {
          if (window.confirm('Tem certeza que deseja substituir sua grade atual? Essa ação limpará seu progresso e mudará a base curricular.')) {
            executarImportacao();
          }
        } else {
          Alert.alert('Importar Grade', 'Tem certeza que deseja substituir sua grade atual?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Importar', style: 'destructive', onPress: executarImportacao }
          ]);
        }
      }
    } catch (err: any) {
      if (Platform.OS === 'web') {
        window.alert('Falha ao processar o arquivo. ' + (err.message || ''));
      } else {
        Alert.alert('Erro no arquivo', 'Falha ao processar o arquivo. ' + (err.message || ''));
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Opções da Grade Curricular</Text>
      <View style={styles.actions}>
        
        <TouchableOpacity style={styles.buttonAction} onPress={() => setModalArquivosVisible(true)}>
          <Files size={20} color={colors.primary} />
          <Text style={styles.buttonText}>Banco de Arquivos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonAction} onPress={handleImportGrade}>
          <UploadCloud size={20} color={colors.disponivel} />
          <Text style={styles.buttonText}>Importar Grade</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.buttonAction} onPress={handleExportGradeAtual}>
          <Share size={20} color={colors.text} />
          <Text style={[styles.buttonText, { color: colors.text }]}>Exportar Atual</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonAction} onPress={handleDownloadModelo}>
          <Download size={20} color={colors.textMuted} />
          <Text style={[styles.buttonText, { color: colors.textMuted }]}>Baixar Exemplo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.buttonAction} onPress={handleResetGrade}>
          <RefreshCw size={20} color={colors.bloqueada} />
          <Text style={[styles.buttonText, { color: colors.bloqueada }]}>Restaurar Padrão</Text>
        </TouchableOpacity>

      </View>
      <View style={styles.tutorialContainer}>
        <View style={styles.tutorialHeader}>
          <Info size={16} color={colors.textMuted} />
          <Text style={styles.tutorialTitle}>Como preencher a tabela Excel (.xlsx)</Text>
        </View>
        <View style={{ gap: 6 }}>
          <Text style={styles.tutorialText}>
            A primeira linha da planilha deve conter os cabeçalhos exatos: <Text style={styles.tutorialBold}>id, nome, semestre, preRequisitos</Text>.
          </Text>
          <Text style={styles.tutorialText}>
            <Text style={styles.tutorialBold}>id</Text>: Identificador único, curto e sem espaços (ex: mat1).
          </Text>
          <Text style={styles.tutorialText}>
            <Text style={styles.tutorialBold}>nome</Text>: Nome completo da disciplina (ex: Cálculo I).
          </Text>
          <Text style={styles.tutorialText}>
            <Text style={styles.tutorialBold}>semestre</Text>: Número indicando o período (ex: 1, 2).
          </Text>
          <Text style={styles.tutorialText}>
            <Text style={styles.tutorialBold}>preRequisitos</Text>: IDs separados apenas por vírgula (ex: mat1,calc2). Deixe em branco se não houver.
          </Text>
          <Text style={[styles.tutorialText, { marginTop: 6 }]}>
            <Text style={{ fontStyle: 'italic', fontWeight: 'bold' }}>Dica:</Text> Clique em "Baixar Exemplo" para usar o modelo já formatado corretamente.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  buttonAction: {
    flexGrow: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.disponivel,
  },
  tutorialContainer: {
    marginTop: 20,
    padding: 12,
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tutorialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  tutorialTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tutorialText: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 20,
  },
  tutorialBold: {
    fontWeight: '700',
    color: colors.text,
  }

});
