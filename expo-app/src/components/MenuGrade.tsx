import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useDisciplinas } from '../contexts/DisciplinasContext';
import { colors } from '../theme/colors';

const MODELO_JSON = `[
  {
    "id": "mat1",
    "nome": "Matemática Básica",
    "semestre": 1,
    "preRequisitos": []
  },
  {
    "id": "prog1",
    "nome": "Programação I",
    "semestre": 1,
    "preRequisitos": []
  },
  {
    "id": "prog2",
    "nome": "Programação Orientada a Objetos",
    "semestre": 2,
    "preRequisitos": ["prog1"]
  }
]`;

export function MenuGrade() {
  const { importarGrade, resetarGrade } = useDisciplinas();

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

  const handleDownloadModelo = async () => {
    try {
      if (Platform.OS === 'web') {
        const blob = new Blob([MODELO_JSON], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'modelo_grade.json';
        a.click();
        URL.revokeObjectURL(url);
      } else {
        // @ts-ignore
        const fileUri = FileSystem.documentDirectory + 'modelo_grade.json';
        // @ts-ignore
        await FileSystem.writeAsStringAsync(fileUri, MODELO_JSON, { encoding: FileSystem.EncodingType.UTF8 });
        
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(fileUri, {
            mimeType: 'application/json',
            dialogTitle: 'Baixar Modelo de Grade Curricular'
          });
        } else {
          Alert.alert('Aviso', 'O sistema não suporta o compartilhamento deste arquivo.');
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
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
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
          content = await FileSystem.readAsStringAsync(asset.uri, { encoding: FileSystem.EncodingType.UTF8 });
        }

        const gradeParseada = JSON.parse(content);
        
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
        
        <TouchableOpacity style={styles.buttonAction} onPress={handleDownloadModelo}>
          <Ionicons name="download-outline" size={20} color={colors.textMuted} />
          <Text style={[styles.buttonText, { color: colors.textMuted }]}>Baixar Exemplo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.buttonAction} onPress={handleResetGrade}>
          <Ionicons name="refresh-outline" size={20} color={colors.bloqueado} />
          <Text style={[styles.buttonText, { color: colors.bloqueado }]}>Restaurar Padrão</Text>
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