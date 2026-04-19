import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, Text, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useDisciplinas } from '../contexts/DisciplinasContext';
import { EstatisticasHeader } from '../components/EstatisticasHeader';
import { Legenda } from '../components/Legenda';
import { SemestreSection } from '../components/SemestreSection';
import { Confetti } from '../components/Confetti';

export function HomeScreen() {
  const { semestres, progressoPercentual, disciplinas } = useDisciplinas();
  
  // Estados dos Modais
  const [modalPlanejamentoVisible, setModalPlanejamentoVisible] = useState(false);

  // Responsividade
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  // Lógica para contar as disciplinas selecionadas (Ajuste 'cursando' para o status correto que você deseja contar)
  const qtdSelecionadas = disciplinas.filter(d => d.status === 'cursando').length;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Confetti isActive={progressoPercentual === 100} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <EstatisticasHeader />

        <View style={[styles.actionContainer, !isDesktop && styles.actionContainerMobile]}>
          {isDesktop && <View style={styles.spacerLeft} />}
          
          <View style={styles.centerLegenda}>
            <Legenda />
          </View>
          
          <View style={[styles.rightAction, !isDesktop && styles.rightActionMobile]}>
            {/* O BOTÃO FOI ADICIONADO AQUI */}
            <TouchableOpacity 
              style={styles.inlinePlanButton}
              onPress={() => setModalPlanejamentoVisible(true)}
              activeOpacity={0.8}
            >
              <BookOpen size={20} color="#FFF" />
              <Text style={styles.inlinePlanButtonText}>Montar Semestre</Text>
              
              {/* Badge dinâmico: só aparece se houver disciplinas selecionadas */}
              {qtdSelecionadas > 0 && (
                <View style={styles.inlineBadge}>
                  <Text style={styles.inlineBadgeText}>{qtdSelecionadas}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
        
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
  
  // Estilos da barra de ações (Legenda + Botão Montar Semestre)
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 8,
  },
  actionContainerMobile: {
    flexDirection: 'column-reverse', 
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
    backgroundColor: '#EF4444', 
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