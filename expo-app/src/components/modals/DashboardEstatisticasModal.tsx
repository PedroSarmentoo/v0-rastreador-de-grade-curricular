import React, { useMemo } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { X, BarChart2, Award, AlertTriangle, TrendingUp, TrendingDown, Frown, CheckCircle, PieChart, Activity } from 'lucide-react-native';
import { BarChart, ProgressChart } from 'react-native-chart-kit';
import { colors } from '../../theme/colors';
import { useDisciplinas } from '../../contexts/DisciplinasContext';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const screenWidth = Dimensions.get('window').width;

export function DashboardEstatisticasModal({ visible, onClose }: Props) {
  const { disciplinas } = useDisciplinas();

  const stats = useMemo(() => {
    let notaSum = 0;
    let countConcluidas = 0;
    let reprovNota = 0;
    let reprovFalta = 0;
    let reprovAmbos = 0;
    
    // Ranges for Histogram
    let range0to49 = 0;
    let range50to69 = 0;
    let range70to89 = 0;
    let range90to100 = 0;

    const notasList: {nome: string; nota: number}[] = [];

    disciplinas.forEach(d => {
      if (d.status === 'concluida') countConcluidas++;

      if (d.notaFinal !== undefined) {
        notasList.push({ nome: d.nome, nota: d.notaFinal });
        notaSum += d.notaFinal;
        
        if (d.notaFinal < 50) range0to49++;
        else if (d.notaFinal < 70) range50to69++;
        else if (d.notaFinal < 90) range70to89++;
        else range90to100++;
      }

      if (d.reprovacoes) {
        d.reprovacoes.forEach(r => {
          if (r.motivo === 'nota') reprovNota++;
          else if (r.motivo === 'falta') reprovFalta++;
          else if (r.motivo === 'ambos') reprovAmbos++;
        });
      }
    });

    const mediaGeral = notasList.length > 0 ? (notaSum / notasList.length) : 0;
    const totalReprovacoes = reprovNota + reprovFalta + reprovAmbos;
    
    // Sort pra melhores e piores
    const sorted = [...notasList].sort((a, b) => b.nota - a.nota);
    const melhores = sorted.slice(0, 3);
    const piores = [...sorted].reverse().slice(0, 3);

    // Taxa de sucesso (tentativas bem sucedidas vs totais)
    const tentativasTotais = countConcluidas + totalReprovacoes;
    const taxaSucesso = tentativasTotais > 0 ? countConcluidas / tentativasTotais : 0;

    return {
      mediaGeral: mediaGeral.toFixed(1),
      totalReprovacoes, 
      reprovNota, 
      reprovFalta, 
      reprovAmbos,
      melhores, 
      piores, 
      totalComNota: notasList.length,
      countConcluidas,
      taxaSucesso,
      tentativasTotais,
      histograma: [range0to49, range50to69, range70to89, range90to100]
    };
  }, [disciplinas]);

  const chartConfig = {
    backgroundGradientFrom: colors.background,
    backgroundGradientTo: colors.background,
    color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.6,
    fillShadowGradient: colors.primary,
    fillShadowGradientOpacity: 0.8,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <BarChart2 size={24} color={colors.primary} style={{ marginRight: 8 }} />
              <Text style={styles.title} numberOfLines={1}>Dashboard de Desempenho</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.scrollContent}
          >
            {/* CARD CR / MÉDIA GERAL */}
            <View style={styles.crCard}>
              <Text style={styles.crLabel}>Coeficiente de Rendimento (CR)</Text>
              <View style={styles.crValueContainer}>
                <Award size={32} color={parseFloat(stats.mediaGeral) >= 70 ? colors.concluida : parseFloat(stats.mediaGeral) > 0 ? colors.cursando : colors.textMuted} style={{marginRight: 8}} />
                <Text style={[ styles.crValue, { color: parseFloat(stats.mediaGeral) >= 70 ? colors.concluida : parseFloat(stats.mediaGeral) > 0 ? colors.cursando : colors.textMuted } ]}>
                  {stats.mediaGeral}
                </Text>
              </View>
              <Text style={styles.crSubtext}>
                Média baseada nas {stats.totalComNota} notas registradas.
              </Text>
            </View>

            {/* SEÇÃO GRÁFICO - TAXA DE SUCESSO (PROGRESS CHART) */}
            {stats.tentativasTotais > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <PieChart size={20} color={colors.disponivel} />
                  <Text style={styles.sectionTitle}>Taxa de Aprovação</Text>
                </View>
                
                <View style={styles.progressChartContainer}>
                  <ProgressChart
                    data={{
                      labels: ["Aprovação"],
                      data: [stats.taxaSucesso]
                    }}
                    width={screenWidth - 80}
                    height={160}
                    strokeWidth={16}
                    radius={54}
                    chartConfig={{
                      ...chartConfig,
                      color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                    }}
                    hideLegend={true}
                  />
                  <View style={styles.progressChartLabelContainer}>
                    <Text style={styles.progressChartPercentage}>
                      {Math.round(stats.taxaSucesso * 100)}%
                    </Text>
                    <Text style={styles.progressChartSubtext}>
                      {stats.countConcluidas} de {stats.tentativasTotais} concluídas
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* SEÇÃO GRÁFICO - DISTRIBUIÇÃO DAS NOTAS (BAR CHART) */}
            {stats.totalComNota > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Activity size={20} color={colors.cursando} />
                  <Text style={styles.sectionTitle}>Distribuição das Notas</Text>
                </View>
                
                <View style={styles.barChartWrapper}>
                  <BarChart
                    data={{
                      labels: ["0-49", "50-69", "70-89", "90-100"],
                      datasets: [{ data: stats.histograma }]
                    }}
                    width={screenWidth - 80}
                    height={220}
                    yAxisLabel=""
                    yAxisSuffix=""
                    chartConfig={{
                      ...chartConfig,
                      fillShadowGradient: colors.cursando,
                      color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
                    }}
                    withInnerLines={true}
                    showValuesOnTopOfBars={true}
                    fromZero={true}
                    style={styles.chartStyle}
                  />
                </View>
              </View>
            )}

            {/* SEÇÃO REPROVAÇÕES */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <AlertTriangle size={20} color={colors.error} />
                <Text style={styles.sectionTitle}>Histórico de Reprovações</Text>
              </View>
              
              <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                  <Text style={[styles.statBoxValue, { color: stats.totalReprovacoes === 0 ? colors.textMuted : colors.text }]}>{stats.totalReprovacoes}</Text>
                  <Text style={styles.statBoxLabel}>Total</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={[styles.statBoxValue, {color: stats.totalReprovacoes === 0 ? colors.textMuted : colors.cursando}]}>{stats.reprovNota}</Text>
                  <Text style={styles.statBoxLabel}>Por Nota</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={[styles.statBoxValue, {color: stats.totalReprovacoes === 0 ? colors.textMuted : colors.concluida}]}>{stats.reprovFalta}</Text>
                  <Text style={styles.statBoxLabel}>Frequência</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={[styles.statBoxValue, {color: stats.totalReprovacoes === 0 ? colors.textMuted : colors.error}]}>{stats.reprovAmbos}</Text>
                  <Text style={styles.statBoxLabel}>Ambos</Text>
                </View>
              </View>
            </View>

            {/* SEÇÃO MELHORES DISCIPLINAS */}
            {stats.melhores.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <TrendingUp size={20} color={colors.concluida} />
                  <Text style={styles.sectionTitle}>Top 3 Melhores Notas</Text>
                </View>
                {stats.melhores.map((item, index) => (
                  <View key={index} style={styles.rankingRow}>
                    <Text style={styles.rankingName} numberOfLines={1}>{item.nome}</Text>
                    <Text style={[ styles.rankingNota, {color: colors.concluida}]}>{item.nota.toFixed(1)}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* SEÇÃO PIORES DISCIPLINAS */}
            {stats.piores.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <TrendingDown size={20} color={colors.error} />
                  <Text style={styles.sectionTitle}>Maiores Dificuldades</Text>
                </View>
                {stats.piores.map((item, index) => (
                  <View key={index} style={styles.rankingRow}>
                    <Text style={styles.rankingName} numberOfLines={1}>{item.nome}</Text>
                    <Text style={[ styles.rankingNota, {color: colors.error}]}>{item.nota.toFixed(1)}</Text>
                  </View>
                ))}
              </View>
           )}

            {stats.totalComNota === 0 && stats.totalReprovacoes === 0 && (
              <View style={styles.emptyState}>
                <Frown size={48} color={colors.border} />
                <Text style={styles.emptyStateText}>
                  Ainda não há dados suficientes.{'\n'}Adicione notas nas disciplinas para desbloquear estas estatísticas.
                </Text>
              </View>
            )}
            
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '90%', paddingBottom: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  title: { fontSize: 18, fontWeight: 'bold', color: colors.text, flex: 1 },
  closeButton: { padding: 4 },
  scrollContent: { padding: 20, paddingBottom: 60 },
  
  crCard: { backgroundColor: colors.surfaceHover, padding: 20, borderRadius: 16, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: colors.border },
  crLabel: { fontSize: 14, color: colors.textMuted, fontWeight: '600', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 0.5, textAlign: 'center' },
  crValueContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  crValue: { fontSize: 48, fontWeight: 'bold' },
  crSubtext: { fontSize: 12, color: colors.text, textAlign: 'center', fontStyle: 'italic' },
  
  section: { marginBottom: 24, backgroundColor: colors.surfaceHover, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  
  statsGrid: { flexDirection: 'row', gap: 6, justifyContent: 'space-between' },
  statBox: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 8, paddingVertical: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  statBoxValue: { fontSize: 22, fontWeight: 'bold', color: colors.text, marginBottom: 6 },
  statBoxLabel: { fontSize: 10, color: colors.textMuted, fontWeight: '600', textAlign: 'center', lineHeight: 12 },
  
  rankingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  rankingName: { flex: 1, fontSize: 14, color: colors.text, paddingRight: 16 },
  rankingNota: { fontSize: 16, fontWeight: 'bold' },
  
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  emptyStateText: { marginTop: 16, color: colors.textMuted, textAlign: 'center', fontSize: 14, lineHeight: 22 },

  progressChartContainer: { alignItems: 'center', justifyContent: 'center', marginVertical: 8 },
  progressChartLabelContainer: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  progressChartPercentage: { fontSize: 32, fontWeight: 'bold', color: colors.concluida },
  progressChartSubtext: { fontSize: 11, color: colors.textMuted, marginTop: 4, fontWeight: '500' },
  barChartWrapper: { alignItems: 'center', marginTop: 8, marginLeft: -16 },
  chartStyle: { borderRadius: 12, paddingRight: 0 }
});