import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useDisciplinas } from '../contexts/DisciplinasContext';
import { EstatisticasHeader } from '../components/EstatisticasHeader';
import { Legenda } from '../components/Legenda';
import { SemestreSection } from '../components/SemestreSection';
import { Confetti } from '../components/Confetti';

export function HomeScreen() {
  const { semestres, progressoPercentual } = useDisciplinas();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Confetti isActive={progressoPercentual === 100} />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <EstatisticasHeader />
        <Legenda />
        
        {semestres.map((semestre) => (
          <SemestreSection key={semestre} semestre={semestre} />
        ))}
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
});
