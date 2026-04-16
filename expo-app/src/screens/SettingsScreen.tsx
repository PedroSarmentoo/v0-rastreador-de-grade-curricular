import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Calculator, X, ChevronDown, BookOpen, Check, RotateCcw } from 'lucide-react-native'; 
import { colors } from '../theme/colors';
import { MenuGrade } from '../components/MenuGrade';
import { useDisciplinas } from '../contexts/DisciplinasContext';

// 1. Interface que avisa que podemos receber a função do App.tsx
interface SettingsScreenProps {
  onNavigateToGrade?: () => void;
}

// 2. Recebemos a função aqui (e sem nenhum useNavigation!)
export function SettingsScreen({ onNavigateToGrade }: SettingsScreenProps) {
  const { nomeCurso, setNomeCurso, resetarGrade } = useDisciplinas();

  const [modalVisible, setModalVisible] = useState(false);
  const [tpsl, setTpsl] = useState('');
  const [modalCursosVisible, setModalCursosVisible] = useState(false);
  const [cursoTemporario, setCursoTemporario] = useState(nomeCurso);
  
  const cursosDisponiveis = [
    'Engenharia de Sistemas',
    'Sistemas de Informação',
    'Engenharia Civil',
    'Engenharia Elétrica'
  ];

  const salvarNovoCurso = () => {
    if (cursoTemporario !== nomeCurso) {
      setNomeCurso(cursoTemporario);
      
      // Muda a aba para 'grade' usando a função do App.tsx
      if (onNavigateToGrade) onNavigateToGrade();

      if (Platform.OS === 'web') {
        window.alert(`Sucesso! Sua grade foi alterada para ${cursoTemporario}.`);
      }
    }
    setModalCursosVisible(false);
  };

  const confirmarReiniciar = () => {
    resetarGrade();
    
    // Muda a aba para 'grade' usando a função do App.tsx
    if (onNavigateToGrade) onNavigateToGrade();

    if (Platform.OS === 'web') {
      window.alert('Grade reiniciada com sucesso!');
    }
  };

  const handleTpslChange = (text: string) => {
    const formattedText = text.replace(',', '.');
    if (formattedText === '') { setTpsl(''); return; }
    const numericValue = parseFloat(formattedText);
    if (!isNaN(numericValue) && numericValue > 60) {
      setTpsl('60');
    } else {
      setTpsl(formattedText);
    }
  };

  const notaTPSL = parseFloat(tpsl);
  const isValida = !isNaN(notaTPSL);
  const atingiuMedia = isValida && notaTPSL >= 60;
  const notaNecessaria = isValida && notaTPSL < 60 ? (180 - notaTPSL) / 2 : null;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Configurações</Text>
          <Text style={styles.headerSubtitle}>Gerencie os dados da sua aplicação</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <User size={20} color={colors.disponivel} />
            <Text style={styles.sectionTitle}>Perfil Acadêmico</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Curso Selecionado</Text>
            <TouchableOpacity 
              style={styles.selectInput}
              onPress={() => {
                setCursoTemporario(nomeCurso);
                setModalCursosVisible(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.selectText}>{nomeCurso}</Text>
              <ChevronDown size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calculator size={20} color={colors.cursando} />
            <Text style={styles.sectionTitle}>Ferramentas</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>Calcular Nota da Prova Final</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.resetButton}
            onPress={() => {
              if (Platform.OS === 'web') {
                const confirma = window.confirm(`Tem certeza que deseja apagar seu progresso e reiniciar a grade de ${nomeCurso}?`);
                if (confirma) confirmarReiniciar();
              } else {
                Alert.alert(
                  "Reiniciar Grade",
                  `Tem certeza que deseja apagar seu progresso e reiniciar a grade de ${nomeCurso}?`,
                  [
                    { text: "Cancelar", style: "cancel" },
                    { text: "Reiniciar", style: "destructive", onPress: confirmarReiniciar }
                  ]
                );
              }
            }}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <RotateCcw size={18} color={colors.bloqueada} />
              <Text style={styles.resetButtonText}>Reiniciar Grade Curricular</Text>
            </View>
          </TouchableOpacity>
        </View>

        <MenuGrade />
        
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutTitle}>Sobre o App</Text>
          <Text style={styles.aboutText}>UniGrade v1.2.4</Text>
        </View>
      </ScrollView>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Calculadora</Text>
              <TouchableOpacity onPress={() => { setModalVisible(false); setTpsl(''); }}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Sua nota parcial:</Text>
            <TextInput
              style={styles.input}
              value={tpsl}
              onChangeText={handleTpslChange}
              placeholder="Ex: 45"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
            />
            {atingiuMedia && (
              <View style={styles.resultContainer}>
                <Text style={[styles.resultText, { color: colors.concluida, fontWeight: 'bold' }]}>
                  Aprovado por média! 🎉
                </Text>
              </View>
            )}
            {notaNecessaria !== null && !atingiuMedia && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultText}>
                  Você precisa de <Text style={{ color: colors.cursando, fontWeight: 'bold' }}>{notaNecessaria.toFixed(1)}</Text> na Final.
                </Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={modalCursosVisible}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { minHeight: 400 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione seu Curso</Text>
              <TouchableOpacity onPress={() => setModalCursosVisible(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {cursosDisponiveis.map((curso, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[styles.cursoOption, cursoTemporario === curso && styles.cursoOptionSelected]}
                  onPress={() => setCursoTemporario(curso)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <BookOpen size={20} color={cursoTemporario === curso ? colors.disponivel : colors.textMuted} />
                    <Text style={[styles.cursoOptionText, cursoTemporario === curso && { color: colors.disponivel, fontWeight: 'bold' }]}>{curso}</Text>
                  </View>
                  {cursoTemporario === curso && <Check size={20} color={colors.disponivel} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.confirmButton, cursoTemporario === nomeCurso && { backgroundColor: colors.surfaceLight, borderColor: colors.border }]}
                onPress={salvarNovoCurso}
                disabled={cursoTemporario === nomeCurso}
              >
                <Text style={[styles.confirmButtonText, cursoTemporario === nomeCurso && { color: colors.textMuted }]}>
                  {cursoTemporario === nomeCurso ? 'Feito' : 'Confirmar Alteração'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollView: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 24, marginTop: 8 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: colors.text },
  headerSubtitle: { fontSize: 14, color: colors.textMuted },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.textMuted, textTransform: 'uppercase' },
  card: { backgroundColor: colors.surface, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border },
  label: { fontSize: 14, color: colors.text, marginBottom: 8, fontWeight: '500' },
  input: { backgroundColor: colors.surfaceLight, borderRadius: 10, padding: 12, color: colors.text, fontSize: 16, borderWidth: 1, borderColor: colors.border },
  selectInput: { backgroundColor: colors.surfaceLight, borderRadius: 10, padding: 16, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  selectText: { color: colors.text, fontSize: 15, fontWeight: '500' },
  cursoOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surfaceLight, marginBottom: 8 },
  cursoOptionSelected: { borderColor: colors.disponivel, backgroundColor: colors.disponivelBg },
  cursoOptionText: { color: colors.text, fontSize: 16 },
  modalFooter: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border },
  confirmButton: { backgroundColor: colors.disponivel, paddingVertical: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: colors.disponivel },
  confirmButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  aboutContainer: { marginTop: 32, alignItems: 'center', paddingTop: 24, borderTopWidth: 1, borderTopColor: colors.border },
  aboutTitle: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 8 },
  aboutText: { fontSize: 14, color: colors.textMuted },
  actionButton: { backgroundColor: colors.surface, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  actionButtonText: { color: colors.text, fontSize: 16, fontWeight: '500' },
  resetButton: { backgroundColor: 'rgba(239, 68, 68, 0.08)', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)', alignItems: 'center', marginTop: 12 },
  resetButtonText: { color: colors.bloqueada, fontSize: 15, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, borderColor: colors.border },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  resultContainer: { marginTop: 24, padding: 16, backgroundColor: colors.surfaceLight, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  resultText: { color: colors.text, fontSize: 16, textAlign: 'center' },
});