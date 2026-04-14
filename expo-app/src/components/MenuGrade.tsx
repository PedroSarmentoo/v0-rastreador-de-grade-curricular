import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { useDisciplinas } from '../contexts/DisciplinasContext';
import { colors } from '../theme/colors';

const MODELO_CSV = `id;nome;semestre;preRequisitos
mat1;Matemática Básica;1;
prog1;Programação I;1;
prog2;Programação Orientada a Objetos;2;prog1
prog3;Programação Avançada;3;prog1,prog2`;

const parseCSV = (csvText: string): any[] => {
  // Remove o BOM (Byte Order Mark) invisível caso o Excel tenha incluído ao salvar
  let cleanText = csvText.trim();
  if (cleanText.charCodeAt(0) === 0xFEFF) {
    cleanText = cleanText.substring(1);
  }
  const lines = cleanText.split('\n');
  if (lines.length < 2) throw new Error('O CSV está vazio ou sem dados.');
  
  const headers = lines[0].split(';').map(h => h.trim());
  const result = [];
  
  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(';');
    if (currentLine.length < headers.length) continue; // Pula linhas vazias
    
    const obj: any = {};
    headers.forEach((header, index) => {
      const val = currentLine[index].trim();
      if (header === 'semestre') {
        obj[header] = parseInt(val, 10);
      } else if (header === 'preRequisitos') {
        obj[header] = val ? val.split(',').map(p => p.trim()) : [];
      } else {
        obj[header] = val;
      }
    });
    result.push(obj);
  }
  return result;
};

const gerarCSV = (disciplinas: any[]): string => {
  const header = 'id;nome;semestre;preRequisitos';
  const lines = disciplinas.map(d => {
    const preReqs = (d.preRequisitos || []).join(',');
    return `${d.id};${d.nome};${d.semestre};${preReqs}`;
  });
  return [header, ...lines].join('\n');
};

export function MenuGrade() {
  const { disciplinas, importarGrade, resetarGrade } = useDisciplinas();

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
      if (confirmou) {
        executarReset();
      }
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
    try {
      const csvContent = gerarCSV(disciplinas);
      const csvComBOM = String.fromCharCode(0xFEFF) + csvContent;

      if (Platform.OS === 'web') {
        const blob = new Blob([csvComBOM], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'minha_grade_atual.csv';
        a.click();
        URL.revokeObjectURL(url);
      } else if (Platform.OS === 'android') {
        // @ts-ignore
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted) {
          // @ts-ignore
          const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            'minha_grade_atual.csv',
            'text/csv'
          );
          // @ts-ignore
          await FileSystem.writeAsStringAsync(fileUri, csvComBOM);
          Alert.alert('Sucesso', 'A grade atual foi exportada com sucesso!');
        }
      } else {
        // @ts-ignore
        const fileUri = FileSystem.cacheDirectory + 'minha_grade_atual.csv';
        // @ts-ignore
        await FileSystem.writeAsStringAsync(fileUri, csvComBOM);
        
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'text/csv',
            dialogTitle: 'Exportar Grade Atual',
            UTI: 'public.comma-separated-values-text'
          });
        } else {
          Alert.alert('Aviso', 'O sistema não suporta manipular este arquivo.');
        }
      }
    } catch (error) {
      console.error('Erro ao exportar grade:', error);
      Alert.alert('Erro', 'Não foi possível exportar a grade atual.');
    }
  };

  const handleDownloadModelo = async () => {
    try {
      // BOM convertido em Hex para evitar problemas de escape de caractere literal no arquivo ou parser (\uFEFF)
      const CsvComBOM = String.fromCharCode(0xFEFF) + MODELO_CSV;
      
      if (Platform.OS === 'web') {
        const blob = new Blob([CsvComBOM], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'modelo_grade.csv';
        a.click();
        URL.revokeObjectURL(url);
      } else if (Platform.OS === 'android') {
        // @ts-ignore
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted) {
          // @ts-ignore
          const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            'modelo_grade.csv',
            'text/csv'
          );
          // @ts-ignore
          await FileSystem.writeAsStringAsync(fileUri, CsvComBOM);
          Alert.alert('Sucesso', 'O modelo foi salvo no seu dispositivo!');
        }
      } else {
        // @ts-ignore
        const fileUri = FileSystem.cacheDirectory + 'modelo_grade.csv';
        // @ts-ignore
        await FileSystem.writeAsStringAsync(fileUri, CsvComBOM);
        
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'text/csv',
            dialogTitle: 'Salvar Modelo na pasta Arquivos',
            UTI: 'public.comma-separated-values-text'
          });
        } else {
          Alert.alert('Aviso', 'O sistema não suporta manipular este arquivo.');
        }
      }
    } catch (error) {
      console.error('Erro ao baixar modelo:', error);
      Alert.alert('Erro', 'Não foi possível baixar o modelo.');
    }
  };

  const handleImportGrade = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        
        if (asset.name && !asset.name.toLowerCase().endsWith('.csv')) {
          throw new Error('Por favor, selecione um arquivo válido no formato .csv');
        }

        let content = '';

        if (Platform.OS === 'web') {
          if (asset.file) {
            content = await asset.file.text();
          } else {
            const response = await fetch(asset.uri);
            content = await response.text();
          }
        } else {
          // @ts-ignore
          content = await FileSystem.readAsStringAsync(asset.uri);
        }

        const gradeParseada = parseCSV(content);
        
        const executarImportacao = () => {
          try {
            importarGrade(gradeParseada);
            if (Platform.OS === 'web') {
              window.alert('A nova grade foi importada com sucesso!');
            } else {
              Alert.alert('Sucesso', 'A nova grade foi importada com sucesso!');
            }
          } catch (e: any) {
            const msg = 'Grade com propriedades inválidas. ' + (e.message || '');
            if (Platform.OS === 'web') window.alert(msg);
            else Alert.alert('Erro', msg);
          }
        };

        if (Platform.OS === 'web') {
          const confirmou = window.confirm('Tem certeza que deseja substituir sua grade atual? Essa ação limpará seu progresso e mudará a base curricular.');
          if (confirmou) {
            executarImportacao();
          }
        } else {
          Alert.alert(
            'Importar Grade',
            'Tem certeza que deseja substituir sua grade atual? Essa ação limpará seu progresso e mudará a base curricular.',
            [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Importar', style: 'destructive', onPress: executarImportacao }
            ]
          );
        }
      }
    } catch (err: any) {
      console.error('Erro ao importar grade:', err);
      if (Platform.OS === 'web') {
        window.alert('Falha ao processar o arquivo: ' + (err.message || String(err)));
      } else {
        Alert.alert('Erro no arquivo', 'Falha ao processar o arquivo: ' + (err.message || String(err)));
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Opções da Grade Curricular</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.buttonAction} onPress={handleImportGrade}>
          <Ionicons name="cloud-upload-outline" size={20} color={colors.disponivel} />
          <Text style={styles.buttonText}>Importar Grade</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.buttonAction} onPress={handleExportGradeAtual}>
          <Ionicons name="share-outline" size={20} color={colors.text} />
          <Text style={[styles.buttonText, { color: colors.text }]}>Exportar Atual</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonAction} onPress={handleDownloadModelo}>
          <Ionicons name="download-outline" size={20} color={colors.textMuted} />
          <Text style={[styles.buttonText, { color: colors.textMuted }]}>Baixar Exemplo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.buttonAction} onPress={handleResetGrade}>
          <Ionicons name="refresh-outline" size={20} color={colors.bloqueada} />
          <Text style={[styles.buttonText, { color: colors.bloqueada }]}>Restaurar Padrão</Text>
        </TouchableOpacity>
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
  }
});