import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Target, Clock, ChevronRight, TrendingUp, MapPin, CalendarDays, Award, PieChart, Activity, AlertTriangle, TrendingDown, Frown } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { useDisciplinas } from '../contexts/DisciplinasContext';
import { BarChart, ProgressChart } from 'react-native-chart-kit';

const STORAGE_KEY_LEMBRETES = '@meus_lembretes_v1';
const STORAGE_KEY_AULAS = '@meus_horarios_v1';
const screenWidth = Dimensions.get('window').width;

export function DashboardScreen({ onChangeTab }: { onChangeTab: (tab: any) => void }) {
  const { disciplinas, atividades } = useDisciplinas();
  const [proximosLembretes, setProximosLembretes] = useState<any[]>([]);
  const [aulasHoje, setAulasHoje] = useState<any[]>([]);

  // Inteligência do Dia Atual
  const now = new Date();
  const jsDay = now.getDay(); 
  const currentDayIndex = jsDay === 0 ? -1 : jsDay - 1; 
  const isWeekend = currentDayIndex < 0 || currentDayIndex > 4;

  // --- CÁLCULO DE ESTATÍSTICAS ---
  const totalDisciplinas = disciplinas.length || 1; 
  const disciplinasConcluidas = disciplinas.filter(d => d.status === 'concluida').length;
  const progressoCurso = Math.round((disciplinasConcluidas / totalDisciplinas) * 100) || 0;

  const horasAcc = (atividades.listaAcc || []).reduce((acc, item) => acc + item.horas, 0);

  const getNomeDisciplina = (id: string) => disciplinas.find(d => d.id === id)?.nome || 'Materia';

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

  // --- CARREGAMENTO DE DADOS ---
  const carregarDados = async () => {
    try {
      // 1. Carrega os Lembretes
      const dadosLembretes = await AsyncStorage.getItem(STORAGE_KEY_LEMBRETES);
      if (dadosLembretes) {
        const todos = JSON.parse(dadosLembretes);
        const hoje = now.toISOString().split('T')[0];
        const pendentes = todos.filter((l: any) => !l.concluido && l.dataCompleta >= hoje);
        pendentes.sort((a: any, b: any) => a.dataCompleta.localeCompare(b.dataCompleta));
        setProximosLembretes(pendentes.slice(0, 3));
      }

      // 2. Carrega as Aulas de Hoje
      if (!isWeekend) {
        const dadosAulas = await AsyncStorage.getItem(STORAGE_KEY_AULAS);
        if (dadosAulas) {
          const todasAulas = JSON.parse(dadosAulas);
          const filtradas = todasAulas
            .filter((a: any) => a.diaSemana === currentDayIndex)
            .sort((a: any, b: any) => a.horarioInicio.localeCompare(b.horarioInicio));
          setAulasHoje(filtradas);
        }
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const formatarData = (dataStr: string) => {
    const [_, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Olá, Estudante! 👋</Text>
          <Text style={styles.subtitle}>Aqui está o seu resumo acadêmico</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* --- ESTATÍSTICAS --- */}
        <Text style={styles.sectionTitle}>Visão Geral</Text>
        <View style={styles.statsGrid}>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
              <TrendingUp size={20} color="#3B82F6" />
            </View>
            <Text style={styles.statValue}>{progressoCurso}%</Text>
            <Text style={styles.statLabel}>Curso Concluído</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
              <Target size={20} color="#F59E0B" />
            </View>
            <Text style={styles.statValue}>{Math.max(0, 200 - horasAcc)}h</Text>
            <Text style={styles.statLabel}>Horas Faltantes</Text>
            <Text style={styles.statSubValueRight}>Total: {horasAcc}h</Text>
          </View>

        </View>

        {/* --- AULAS DE HOJE --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Aulas de Hoje</Text>
          <TouchableOpacity onPress={() => onChangeTab('horarios')}>
            <Text style={styles.seeAllText}>Agenda Completa</Text>
          </TouchableOpacity>
        </View>

        {isWeekend ? (
          <View style={styles.emptyState}>
            <CalendarDays size={32} color={colors.disponivel} />
            <Text style={styles.emptyText}>Fim de semana! Aproveite para descansar ou adiantar os projetos.</Text>
          </View>
        ) : aulasHoje.length === 0 ? (
          <View style={styles.emptyState}>
            <CalendarDays size={32} color={colors.border} />
            <Text style={styles.emptyText}>Nenhuma aula agendada para hoje. Dia livre! 🍃</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => onChangeTab('horarios')}>
              <Text style={styles.addBtnText}>Adicionar Aula</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.aulasList}>
            {aulasHoje.map(aula => (
              <TouchableOpacity key={aula.id} style={styles.aulaDashboardCard} onPress={() => onChangeTab('horarios')} activeOpacity={0.7}>
                <View style={styles.aulaTimeBox}>
                  <Text style={styles.aulaTimeText}>{aula.horarioInicio}</Text>
                  <Text style={styles.aulaTimeSub}>{aula.horarioFim}</Text>
                </View>
                <View style={styles.aulaInfoBox}>
                  <Text style={styles.aulaTitle} numberOfLines={1}>{getNomeDisciplina(aula.disciplinaId)}</Text>
                  <View style={styles.aulaLocalRow}>
                    <MapPin size={12} color={colors.textMuted} />
                    <Text style={styles.aulaLocalText} numberOfLines={1}>{aula.local}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* --- PRÓXIMOS PRAZOS --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Próximos Prazos</Text>
        </View>

        {proximosLembretes.length === 0 ? (
          <View style={styles.emptyState}>
            <Clock size={32} color={colors.border} />
            <Text style={styles.emptyText}>Tudo tranquilo por enquanto! Nenhum prazo próximo.</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => onChangeTab('horarios')}>
              <Text style={styles.addBtnText}>Adicionar Lembrete</Text>
            </TouchableOpacity>
          </View>
        ) : (
          proximosLembretes.map(lembrete => (
            <TouchableOpacity key={lembrete.id} style={styles.lembreteCard} onPress={() => onChangeTab('horarios')} activeOpacity={0.7}>
              <View style={styles.lembreteInfo}>
                <Text style={styles.lembreteTitle} numberOfLines={1}>{lembrete.titulo}</Text>
                <Text style={styles.lembreteCat}>{lembrete.categoria}</Text>
              </View>
              <View style={styles.lembreteDateBox}>
                <Text style={styles.lembreteDate}>{formatarData(lembrete.dataCompleta)}</Text>
              </View>
              <ChevronRight size={20} color={colors.textMuted} />
            </TouchableOpacity>
          ))
        )}

        {/* --- ANÁLISE DE DESEMPENHO --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Análise de Desempenho</Text>
        </View>

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

        {/* SEÇÃO GRÁFICO - TAXA DE SUCESSO */}
        {stats.tentativasTotais > 0 && (
          <View style={styles.dashboardSection}>
            <View style={styles.dashboardSectionHeader}>
              <PieChart size={20} color={colors.disponivel} />
              <Text style={styles.dashboardSectionTitle}>Taxa de Aprovação</Text>
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

        {/* SEÇÃO GRÁFICO - DISTRIBUIÇÃO DAS NOTAS */}
        {stats.totalComNota > 0 && (
          <View style={styles.dashboardSection}>
            <View style={styles.dashboardSectionHeader}>
              <Activity size={20} color={colors.cursando} />
              <Text style={styles.dashboardSectionTitle}>Distribuição das Notas</Text>
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
        <View style={styles.dashboardSection}>
          <View style={styles.dashboardSectionHeader}>
            <AlertTriangle size={20} color={colors.error} />
            <Text style={styles.dashboardSectionTitle}>Histórico de Reprovações</Text>
          </View>
          
          <View style={styles.statsGridRow}>
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
          <View style={styles.dashboardSection}>
            <View style={styles.dashboardSectionHeader}>
              <TrendingUp size={20} color={colors.concluida} />
              <Text style={styles.dashboardSectionTitle}>Top 3 Melhores Notas</Text>
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
          <View style={styles.dashboardSection}>
            <View style={styles.dashboardSectionHeader}>
              <TrendingDown size={20} color={colors.error} />
              <Text style={styles.dashboardSectionTitle}>Maiores Dificuldades</Text>
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
          <View style={styles.emptyStateStats}>
            <Frown size={48} color={colors.border} />
            <Text style={styles.emptyStateText}>
              Ainda não há dados suficientes.{'\n'}Adicione notas nas disciplinas para desbloquear estas estatísticas.
            </Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  greeting: { fontSize: 26, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 15, color: colors.textMuted },
  
  content: { padding: 16, paddingBottom: 100 },
  
  dashboardBtn: {
    backgroundColor: colors.primary, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
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

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 0, marginTop: 0 },
  seeAllText: { fontSize: 14, color: colors.disponivel, fontWeight: '600' },

  statsGrid: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, backgroundColor: colors.surface, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  statIconBox: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statValue: { fontSize: 24, fontWeight: '900', color: colors.text, marginBottom: 2 },
  statLabel: { fontSize: 13, color: colors.textMuted, fontWeight: '500' },
  statSubValueRight: { position: 'absolute', bottom: 12, right: 16, fontSize: 11, color: colors.textMuted, fontWeight: '600' },

  aulasList: { gap: 8 },
  aulaDashboardCard: { flexDirection: 'row', backgroundColor: colors.surfaceLight, borderRadius: 12, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  aulaTimeBox: { backgroundColor: 'rgba(59, 130, 246, 0.1)', paddingVertical: 12, paddingHorizontal: 16, justifyContent: 'center', alignItems: 'center', borderRightWidth: 1, borderRightColor: colors.border },
  aulaTimeText: { color: colors.disponivel, fontWeight: 'bold', fontSize: 14 },
  aulaTimeSub: { color: colors.disponivel, fontSize: 11, opacity: 0.8 },
  aulaInfoBox: { flex: 1, padding: 12, justifyContent: 'center' },
  aulaTitle: { color: colors.text, fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  aulaLocalRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  aulaLocalText: { color: colors.textMuted, fontSize: 12 },

  lembreteCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceLight, padding: 16, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  lembreteInfo: { flex: 1, marginRight: 12 },
  lembreteTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  lembreteCat: { fontSize: 13, color: colors.textMuted },
  lembreteDateBox: { backgroundColor: colors.background, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: colors.border, marginRight: 12 },
  lembreteDate: { fontSize: 14, fontWeight: 'bold', color: colors.disponivel },

  emptyState: { alignItems: 'center', backgroundColor: colors.surface, padding: 24, borderRadius: 16, borderWidth: 1, borderColor: colors.border, borderStyle: 'dashed' },
  emptyText: { color: colors.textMuted, textAlign: 'center', marginTop: 12, marginBottom: 16, fontSize: 14, lineHeight: 20 },
  addBtn: { backgroundColor: colors.surfaceLight, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  addBtnText: { color: colors.text, fontWeight: '600', fontSize: 13 },

  /* --- STYLES DAS ESTATISTICAS --- */
  crCard: { backgroundColor: colors.surfaceHover, padding: 20, borderRadius: 16, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: colors.border },
  crLabel: { fontSize: 14, color: colors.textMuted, fontWeight: '600', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 0.5, textAlign: 'center' },
  crValueContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  crValue: { fontSize: 48, fontWeight: 'bold' },
  crSubtext: { fontSize: 12, color: colors.text, textAlign: 'center', fontStyle: 'italic' },
  
  dashboardSection: { marginBottom: 24, backgroundColor: colors.surfaceHover, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: colors.border },
  dashboardSectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 8 },
  dashboardSectionTitle: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  
  statsGridRow: { flexDirection: 'row', gap: 6, justifyContent: 'space-between' },
  statBox: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 8, paddingVertical: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  statBoxValue: { fontSize: 22, fontWeight: 'bold', color: colors.text, marginBottom: 6 },
  statBoxLabel: { fontSize: 10, color: colors.textMuted, fontWeight: '600', textAlign: 'center', lineHeight: 12 },
  
  rankingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  rankingName: { flex: 1, fontSize: 14, color: colors.text, paddingRight: 16 },
  rankingNota: { fontSize: 16, fontWeight: 'bold' },
  
  emptyStateStats: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  emptyStateText: { marginTop: 16, color: colors.textMuted, textAlign: 'center', fontSize: 14, lineHeight: 22 },

  progressChartContainer: { alignItems: 'center', justifyContent: 'center', marginVertical: 8 },
  progressChartLabelContainer: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  progressChartPercentage: { fontSize: 32, fontWeight: 'bold', color: colors.concluida },
  progressChartSubtext: { fontSize: 11, color: colors.textMuted, marginTop: 4, fontWeight: '500' },
  barChartWrapper: { alignItems: 'center', marginTop: 8, marginLeft: -16 },
  chartStyle: { borderRadius: 12, paddingRight: 0 }
});