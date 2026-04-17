import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart2 } from 'lucide-react-native';
import { DashboardEstatisticasModal } from '../components/modals/DashboardEstatisticasModal';
import { colors } from '../theme/colors';
import { useDisciplinas } from '../contexts/DisciplinasContext';
import { EstatisticasHeader } from '../components/EstatisticasHeader';
import { Legenda } from '../components/Legenda';
import { SemestreSection } from '../components/SemestreSection';
import { Confetti } from '../components/Confetti';

export function HomeScreen() {
  const { semestres, progressoPercentual } = useDisciplinas();
  const [showDashboard, setShowDashboard] = useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* O Confetti só dispara quando você atinge 100% do curso! */}
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

        <Legenda />
        
        {/* Renderiza cada semestre dinamicamente */}
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
    backgroundColor: colors.primary,
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
  }
});