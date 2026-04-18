import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Target, Clock, ChevronRight, TrendingUp, MapPin, CalendarDays } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { useDisciplinas } from '../contexts/DisciplinasContext';

const STORAGE_KEY_LEMBRETES = '@meus_lembretes_v1';
const STORAGE_KEY_AULAS = '@meus_horarios_v1';

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
            <Text style={styles.statValue}>{horasAcc}h</Text>
            <Text style={styles.statLabel}>Horas ACC</Text>
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
  
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 0, marginTop: 0 },
  seeAllText: { fontSize: 14, color: colors.disponivel, fontWeight: '600' },

  statsGrid: { flexDirection: 'row', gap: 12 },
  statCard: { flex: 1, backgroundColor: colors.surface, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border },
  statIconBox: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statValue: { fontSize: 24, fontWeight: '900', color: colors.text, marginBottom: 2 },
  statLabel: { fontSize: 13, color: colors.textMuted, fontWeight: '500' },

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
});