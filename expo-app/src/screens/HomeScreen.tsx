import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Text, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart2, BookOpen } from 'lucide-react-native'; // <-- Adicionado o BookOpen
import { DashboardEstatisticasModal } from '../components/modals/DashboardEstatisticasModal';
import { colors } from '../theme/colors';
import { useDisciplinas } from '../contexts/DisciplinasContext';
import { EstatisticasHeader } from '../components/EstatisticasHeader';
import { Legenda } from '../components/Legenda';
import { SemestreSection } from '../components/SemestreSection';
import { Confetti } from '../components/Confetti';

export function HomeScreen() {
  const { semestres, progressoPercentual, disciplinas } = useDisciplinas(); // <-- Puxei disciplinas para contar as selecionadas
  
  // Estados dos Modais
  const [showDashboard, setShowDashboard] = useState(false);
  const [modalPlanejamentoVisible, setModalPlanejamentoVisible] = useState(false);

  // Responsividade
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Confetti isActive={progressoPercentual === 100} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <EstatisticasHeader />

        <TouchableOpacity 
          style={styles.dashboardBtn} 
          onPress={() => setShowDashboard(true)}
          activeOpacity={0.8}
        >
          <BarChart2 size={20} color={colors.background} />
          <Text style={styles.dashboardBtnText}>Análise de Desempenho do Curso</Text>
        </TouchableOpacity>

        {/* Removi a Legenda duplicada que estava aqui em cima solta */}
        
        <View style={[styles.actionContainer, !isDesktop && styles.actionContainerMobile]}>
          {isDesktop && <View style={styles.spacerLeft} />}
          
          <View style={styles.centerLegenda}>
            <Legenda />
          </View>
          
          <View style={[styles.rightAction, !isDesktop && styles.rightActionMobile]}>
          </View>
        </View>
        
        {semestres.map((semestre) => (
          <SemestreSection key={semestre} semestre={semestre} />
        ))}
      </ScrollView>

      <DashboardEstatisticasModal 
        visible={showDashboard} 
        onClose={() => setShowDashboard(false)} 
      />
    </SafeAreaView>
  );
}

// --- ESTILOS CORRIGIDOS E ADICIONADOS ---
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
  dashboardBtn: {
    backgroundColor: colors.primary, // Ajuste para a cor principal do seu tema se necessário
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  dashboardBtnText: {
    color: colors.background,
    fontWeight: 'bold',
    fontSize: 15,
  },
  
  // Estilos da barra de ações (Legenda + Botão Montar Semestre)
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 8,
  },
  actionContainerMobile: {
    flexDirection: 'column-reverse', // No celular, o botão fica em cima e a legenda embaixo
    gap: 16,
  },
  spacerLeft: {
    flex: 1,
  },
  centerLegenda: {
    flex: 2,
    alignItems: 'center',
  },
  rightAction: {
    flex: 1,
    alignItems: 'flex-end',
  },
  rightActionMobile: {
    alignItems: 'stretch',
    width: '100%',
  },
  inlinePlanButton: {
    backgroundColor: colors.disponivel,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  inlinePlanButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  inlineBadge: {
    backgroundColor: '#EF4444', // Vermelho para chamar atenção
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  inlineBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
  },
});