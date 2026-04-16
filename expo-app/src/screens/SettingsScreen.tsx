import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Calculator, X, ChevronDown, BookOpen, Check } from 'lucide-react-native'; 
import { colors } from '../theme/colors';
import { MenuGrade } from '../components/MenuGrade';
import { useDisciplinas } from '../contexts/DisciplinasContext';

export function SettingsScreen() {
  const { nomeCurso, setNomeCurso } = useDisciplinas();

  // Estados para controlar a calculadora
  const [modalVisible, setModalVisible] = useState(false);
  const [tpsl, setTpsl] = useState('');

  // Estados para Modal de Seleção de Cursos
  const [modalCursosVisible, setModalCursosVisible] = useState(false);
  // Estado para armazenar a escolha ANTES de o usuário apertar "Confirmar"
  const [cursoTemporario, setCursoTemporario] = useState(nomeCurso);
  
  // Lista de cursos disponíveis no aplicativo
  const cursosDisponiveis = [
    'Engenharia de Sistemas',
    'Sistemas de Informação'
  ];

  const handleTpslChange = (text: string) => {
    const formattedText = text.replace(',', '.');
    
    if (formattedText === '') {
      setTpsl('');
      return;
    }

    const numericValue = parseFloat(formattedText);

    if (!isNaN(numericValue) && numericValue > 60) {
      setTpsl('60');
    } else {
      setTpsl(formattedText);
    }
  };

  // Função disparada ao clicar no botão "Confirmar Alteração"
  const salvarNovoCurso = () => {
    if (cursoTemporario !== nomeCurso) {
      setNomeCurso(cursoTemporario);
      
      // Feedback simples dependendo de onde o usuário está rodando
      if (Platform.OS === 'web') {
        window.alert(`Sucesso! Sua grade foi alterada para ${cursoTemporario}. Vá para a tela inicial para ver as disciplinas.`);
      }
    }
    setModalCursosVisible(false);
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

        {/* --- SEÇÃO: PERFIL ACADÊMICO --- */}
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
                setCursoTemporario(nomeCurso); // Garante que abre marcando o curso atual
                setModalCursosVisible(true);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.selectText, !nomeCurso && { color: colors.textMuted }]}>
                {nomeCurso || "Selecione o seu curso..."}
              </Text>
              <ChevronDown size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- SEÇÃO: FERRAMENTAS --- */}
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
        </View>

        <MenuGrade />
        
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutTitle}>Sobre o App</Text>
          <Text style={styles.aboutText}>Rastreador de Grade Curricular v1.2.1</Text>
        </View>
      </ScrollView>

      {/* --- MODAL DA CALCULADORA --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Calculadora</Text>
              <TouchableOpacity onPress={() => {
                setModalVisible(false);
                setTpsl('');
              }}>
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
              maxLength={5}
            />

            {atingiuMedia && (
              <View style={styles.resultContainer}>
                <Text style={[styles.resultText, { color: colors.concluida, fontWeight: 'bold' }]}>
                  Parabéns! Com 60 pontos você já está aprovado por média e não precisa de Prova Final. 🎉
                </Text>
              </View>
            )}

            {notaNecessaria !== null && !atingiuMedia && (
              <View style={styles.resultContainer}>
                {notaNecessaria > 100 ? (
                  <Text style={[styles.resultText, { color: colors.bloqueada }]}>
                    Infelizmente, você precisa de {notaNecessaria.toFixed(1)} pontos, o que ultrapassa o limite possível (100). 😔
                  </Text>
                ) : (
                  <Text style={styles.resultText}>
                    Você precisa tirar <Text style={{ color: colors.cursando, fontWeight: 'bold' }}>{notaNecessaria.toFixed(1)}</Text> na TPPF para ser aprovado.
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* --- MODAL SELEÇÃO DE CURSOS (REFORMULADO) --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalCursosVisible}
        onRequestClose={() => setModalCursosVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { minHeight: 400 }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecione seu Curso</Text>
              <TouchableOpacity onPress={() => setModalCursosVisible(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
              {cursosDisponiveis.map((curso, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[
                    styles.cursoOption, 
                    cursoTemporario === curso && styles.cursoOptionSelected
                  ]}
                  onPress={() => setCursoTemporario(curso)}
                  activeOpacity={0.7}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <BookOpen size={20} color={cursoTemporario === curso ? colors.disponivel : colors.textMuted} />
                    <Text style={[
                      styles.cursoOptionText, 
                      cursoTemporario === curso && { color: colors.disponivel, fontWeight: 'bold' }
                    ]}>
                      {curso}
                    </Text>
                  </View>
                  {/* Ícone de check se estiver selecionado */}
                  {cursoTemporario === curso && (
                    <Check size={20} color={colors.disponivel} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* BOTÃO DE CONFIRMAR */}
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[
                  styles.confirmButton, 
                  cursoTemporario === nomeCurso && { backgroundColor: colors.surfaceLight, borderColor: colors.border }
                ]}
                onPress={salvarNovoCurso}
                disabled={cursoTemporario === nomeCurso}
              >
                <Text style={[
                  styles.confirmButtonText,
                  cursoTemporario === nomeCurso && { color: colors.textMuted }
                ]}>
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: 12,
    color: colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  // --- ESTILOS DO SELETOR DE CURSOS ---
  selectInput: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '500',
  },
  cursoOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceLight,
    marginBottom: 8,
  },
  cursoOptionSelected: {
    borderColor: colors.disponivel,
    backgroundColor: colors.disponivelBg,
  },
  cursoOptionText: {
    color: colors.text,
    fontSize: 16,
  },
  modalFooter: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  confirmButton: {
    backgroundColor: colors.disponivel,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.disponivel,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // -------------------------------------

  helpText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 10,
    fontStyle: 'italic',
  },
  aboutContainer: {
    marginTop: 32,
    alignItems: 'center',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  aboutTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  actionButton: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  actionButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 320,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  resultContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultText: {
    color: colors.text,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});