import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Adicionados os ícones Calculator e X
import { User, Calculator, X } from 'lucide-react-native'; 
import { colors } from '../theme/colors';
import { MenuGrade } from '../components/MenuGrade';
import { useDisciplinas } from '../contexts/DisciplinasContext';

export function SettingsScreen() {
  const { nomeCurso, setNomeCurso } = useDisciplinas();

  // Estados para controlar a calculadora
  const [modalVisible, setModalVisible] = useState(false);
  const [tpsl, setTpsl] = useState('');

  // Lógica matemática para TPPF
  const calcularTPPF = () => {
    if (!tpsl) return null;
    const notaTPSL = parseFloat(tpsl.replace(',', '.')); // Aceita vírgula ou ponto
    if (isNaN(notaTPSL)) return null;
    
    const notaNecessaria = (180 - notaTPSL) / 2;
    return notaNecessaria;
  };

  const notaNecessaria = calcularTPPF();

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
            <Text style={styles.label}>Nome do Curso</Text>
            <TextInput
              style={styles.input}
              value={nomeCurso}
              onChangeText={setNomeCurso}
              placeholder="Ex: Engenharia de Sistemas"
              placeholderTextColor={colors.textMuted}
            />
            <Text style={styles.helpText}>
              Este nome aparecerá no topo da sua grade curricular.
            </Text>
          </View>
        </View>

        {/* --- NOVA SEÇÃO: FERRAMENTAS --- */}
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
          <Text style={styles.aboutText}>Rastreador de Grade Curricular v1.1.0</Text>
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
              <Text style={styles.modalTitle}>Calculadora Unimontes</Text>
              <TouchableOpacity onPress={() => {
                setModalVisible(false);
                setTpsl(''); // Limpa o input ao fechar
              }}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Sua nota parcial:</Text>
            <TextInput
              style={styles.input}
              value={tpsl}
              onChangeText={setTpsl}
              placeholder="Ex: 45"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
            />

            {notaNecessaria !== null && (
              <View style={styles.resultContainer}>
                {notaNecessaria <= 0 ? (
                  <Text style={[styles.resultText, { color: colors.concluida, fontWeight: 'bold' }]}>
                    Você já atingiu a média! 🎉
                  </Text>
                ) : (
                  <Text style={styles.resultText}>
                    Você precisa tirar <Text style={{ color: colors.cursando, fontWeight: 'bold' }}>{notaNecessaria.toFixed(1)}</Text> na prova final para ser aprovado.
                  </Text>
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Estilos originais mantidos
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

  // --- NOVOS ESTILOS PARA A CALCULADORA E MODAL ---
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