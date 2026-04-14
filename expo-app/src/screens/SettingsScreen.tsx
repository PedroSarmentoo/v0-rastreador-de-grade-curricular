import React from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// 1. Trocamos Ionicons por User do Lucide
import { User } from 'lucide-react-native'; 
import { colors } from '../theme/colors';
import { MenuGrade } from '../components/MenuGrade';
import { useDisciplinas } from '../contexts/DisciplinasContext';

export function SettingsScreen() {
  const { nomeCurso, setNomeCurso } = useDisciplinas();

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

        {/* --- SEÇÃO: PERFIL ACADÊMICO (ATUALIZADA) --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            {/* 2. Renderizando o ícone vetorial */}
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

        <MenuGrade />
        
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutTitle}>Sobre o App</Text>
          <Text style={styles.aboutText}>Rastreador de Grade Curricular v1.0.0</Text>
        </View>
      </ScrollView>
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
});