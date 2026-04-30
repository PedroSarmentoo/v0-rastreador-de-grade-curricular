import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  CalendarDays, MapPin, Plus, X, Trash2, BookOpen, Edit2, Clock, 
  PartyPopper, ChevronLeft, ChevronRight, ClipboardList, Target, Mic, FileText, AlertCircle
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '../theme/colors';
import { useDisciplinas } from '../contexts/DisciplinasContext';

// --- TIPAGENS ---
interface AulaAgendada {
  id: string;
  disciplinaId: string;
  diaSemana: number;
  horarioInicio: string;
  horarioFim: string;
  local: string;
}

type CategoriaLembrete = 'Prova' | 'Trabalho' | 'Apresentação' | 'Atividade' | 'Outros';

interface Lembrete {
  id: string;
  titulo: string;
  descricao: string;
  dataCompleta: string;
  categoria: CategoriaLembrete;
  concluido: boolean;
}

const DIAS_SEMANA = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira'];
const STORAGE_KEY_AULAS = '@meus_horarios_v1';
const STORAGE_KEY_LEMBRETES = '@meus_lembretes_v1';

const CATEGORIAS: { label: CategoriaLembrete; icon: any; color: string }[] = [
  { label: 'Prova', icon: Target, color: '#EF4444' },
  { label: 'Trabalho', icon: FileText, color: '#3B82F6' },
  { label: 'Apresentação', icon: Mic, color: '#8B5CF6' },
  { label: 'Atividade', icon: ClipboardList, color: '#10B981' },
  { label: 'Outros', icon: Clock, color: colors.textMuted },
];

const FERIADOS: Record<string, string> = {
  '01-01': 'Ano Novo', '04-21': 'Tiradentes', '05-01': 'Dia do Trabalhador', 
  '09-07': 'Independência', '10-12': 'Nossa Sra. Aparecida', '11-02': 'Finados', 
  '11-15': 'Proclamação da República', '12-25': 'Natal',
};

const timeToMinutes = (timeStr: string) => {
  const [h, m] = timeStr.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};

export function HorariosScreen() {
  const { disciplinas } = useDisciplinas();
  
  const [aulas, setAulas] = useState<AulaAgendada[]>([]);
  const [lembretes, setLembretes] = useState<Lembrete[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'aula' | 'lembrete'>('aula');
  const [editandoAulaId, setEditandoAulaId] = useState<string | null>(null);

  const [now, setNow] = useState(new Date());
  const [weekOffset, setWeekOffset] = useState(0);

  const [formDisciplinaId, setFormDisciplinaId] = useState('');
  const [formDiaSemana, setFormDiaSemana] = useState(0);
  const [formInicio, setFormInicio] = useState('');
  const [formFim, setFormFim] = useState('');
  const [formLocal, setFormLocal] = useState('');

  const [formLembreteTitulo, setFormLembreteTitulo] = useState('');
  const [formLembreteData, setFormLembreteData] = useState('');
  const [formLembreteCategoria, setFormLembreteCategoria] = useState<CategoriaLembrete>('Prova');
  const [formLembreteDescricao, setFormLembreteDescricao] = useState('');

  // Só matérias em curso
  const materiasCursando = useMemo(() => disciplinas.filter(d => d.status === 'cursando'), [disciplinas]);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function carregar() {
      try {
        const dadosAulas = await AsyncStorage.getItem(STORAGE_KEY_AULAS);
        const dadosLembretes = await AsyncStorage.getItem(STORAGE_KEY_LEMBRETES);
        if (dadosAulas) setAulas(JSON.parse(dadosAulas));
        if (dadosLembretes) setLembretes(JSON.parse(dadosLembretes));
      } catch (e) { 
        console.error(e); 
      } finally {
        setIsLoading(false);
      }
    }
    carregar();
  }, []);

  useEffect(() => { 
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEY_AULAS, JSON.stringify(aulas)).catch(console.error); 
    }
  }, [aulas, isLoading]);

  useEffect(() => { 
    if (!isLoading) {
      AsyncStorage.setItem(STORAGE_KEY_LEMBRETES, JSON.stringify(lembretes)).catch(console.error); 
    }
  }, [lembretes, isLoading]);

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const jsDay = now.getDay(); 
  const currentDayIndex = jsDay === 0 ? -1 : jsDay - 1; 

  const diasDaSemanaVisualizada = useMemo(() => {
    const dias = [];
    const dataReferencia = new Date(now);
    const diaAtualDaSemana = dataReferencia.getDay();
    const diffParaSegunda = diaAtualDaSemana === 0 ? -6 : 1 - diaAtualDaSemana;

    const segundaFeira = new Date(dataReferencia);
    segundaFeira.setDate(dataReferencia.getDate() + diffParaSegunda + (weekOffset * 7));

    for (let i = 0; i < 5; i++) { 
      const dataDoDia = new Date(segundaFeira);
      dataDoDia.setDate(segundaFeira.getDate() + i);
      
      const anoFormatado = dataDoDia.getFullYear();
      const mesFormatado = String(dataDoDia.getMonth() + 1).padStart(2, '0');
      const diaFormatado = String(dataDoDia.getDate()).padStart(2, '0');
      
      const dataStrBr = `${diaFormatado}/${mesFormatado}`;
      const dataCompletaISO = `${anoFormatado}-${mesFormatado}-${diaFormatado}`;
      const chaveFeriado = `${mesFormatado}-${diaFormatado}`; 
      
      dias.push({
        nome: DIAS_SEMANA[i],
        dataStr: dataStrBr,
        dataCompleta: dataCompletaISO, 
        feriado: FERIADOS[chaveFeriado] || null,
        isHoje: weekOffset === 0 && currentDayIndex === i
      });
    }
    return dias;
  }, [now, weekOffset, currentDayIndex]);

  const getNomeDisciplina = (id: string) => disciplinas.find(d => d.id === id)?.nome || 'Materia';

  const abrirModalNovaAula = () => {
    if (materiasCursando.length === 0) {
      Alert.alert(
        "Ação Bloqueada", 
        "Você precisa ter pelo menos uma disciplina 'Em curso' na aba Grade para poder adicioná-la à agenda."
      );
      return;
    }
    setModalMode('aula');
    setEditandoAulaId(null);
    setFormDiaSemana(0);
    setFormDisciplinaId(materiasCursando[0].id);
    setFormInicio('');
    setFormFim('');
    setFormLocal('');
    setModalVisible(true);
  };

  const abrirModalLembreteContextual = (disciplinaId: string, dataIso: string) => {
    setModalMode('lembrete');
    setFormLembreteData(dataIso); 
    setFormLembreteTitulo(getNomeDisciplina(disciplinaId)); 
    setFormLembreteCategoria('Prova');
    setFormLembreteDescricao('');
    setModalVisible(true);
  };

  const handleSalvarAula = () => {
    if (!formInicio.includes(':') || !formFim.includes(':')) {
      return Alert.alert('Erro', 'Use o formato HH:MM (Ex: 07:10)');
    }
    const novoInicioMin = timeToMinutes(formInicio);
    const novoFimMin = timeToMinutes(formFim);

    if (novoInicioMin >= novoFimMin) return Alert.alert('Aviso', 'Início deve ser menor que o término.');

    const temConflito = aulas.some(a => 
      a.diaSemana === formDiaSemana && 
      (!editandoAulaId || a.id !== editandoAulaId) &&
      (novoInicioMin < timeToMinutes(a.horarioFim) && novoFimMin > timeToMinutes(a.horarioInicio))
    );

    if (temConflito) return Alert.alert('Choque! ⚠️', 'Você já tem aula nesse horário.');

    const aulaSalva: AulaAgendada = {
      id: editandoAulaId || Date.now().toString(),
      disciplinaId: formDisciplinaId, diaSemana: formDiaSemana,
      horarioInicio: formInicio, horarioFim: formFim, local: formLocal || 'A definir',
    };

    if (editandoAulaId) {
      setAulas(prev => prev.map(a => a.id === editandoAulaId ? aulaSalva : a));
      setModalVisible(false);
    } else {
      setAulas(prev => [...prev, aulaSalva]);
      setFormInicio(''); setFormFim(''); setFormLocal('');
      Alert.alert('Sucesso!', 'Aula salva. Continue adicionando ou feche no "X".');
    }
  };

  const handleSalvarLembrete = () => {
    if (!formLembreteTitulo || !formLembreteData.includes('-')) {
      return Alert.alert('Erro', 'Preencha o título e a data no formato AAAA-MM-DD.');
    }

    const novoLembrete: Lembrete = {
      id: Date.now().toString(),
      titulo: formLembreteTitulo,
      descricao: formLembreteDescricao,
      dataCompleta: formLembreteData,
      categoria: formLembreteCategoria,
      concluido: false,
    };

    setLembretes(prev => [...prev, novoLembrete]);
    setModalVisible(false);
  };

  const toggleLembreteConcluido = (id: string) => {
    setLembretes(prev => prev.map(l => l.id === id ? { ...l, concluido: !l.concluido } : l));
  };

  const handleRemoverItem = (id: string, tipo: 'aula' | 'lembrete') => {
    const action = () => {
      if (tipo === 'aula') setAulas(prev => prev.filter(a => a.id !== id));
      else setLembretes(prev => prev.filter(l => l.id !== id));
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Deseja excluir este item?')) action();
    } else {
      Alert.alert('Excluir', 'Deseja remover este item?', [
        { text: 'Cancelar', style: 'cancel' }, { text: 'Remover', style: 'destructive', onPress: action }
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <CalendarDays size={28} color={colors.disponivel} />
          <Text style={styles.title}>Agenda & Prazos</Text>
        </View>

        <View style={styles.weekNav}>
          <TouchableOpacity style={styles.navBtn} onPress={() => setWeekOffset(prev => prev - 1)}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.navCenterBtn} onPress={() => setWeekOffset(0)} disabled={weekOffset === 0}>
            <Text style={[styles.navText, weekOffset !== 0 && { color: colors.disponivel, fontWeight: 'bold' }]}>
              {diasDaSemanaVisualizada[0].dataStr} a {diasDaSemanaVisualizada[4].dataStr}
            </Text>
            <Text style={styles.navSubText}>{weekOffset === 0 ? 'Semana Atual' : 'Tocar para voltar a hoje'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navBtn} onPress={() => setWeekOffset(prev => prev + 1)}>
            <ChevronRight size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* --- NOVO: BANNER DE AVISO DE SEMESTRE VAZIO --- */}
      {materiasCursando.length === 0 && (
        <View style={styles.avisoBanner}>
          <AlertCircle size={20} color="#F59E0B" />
          <Text style={styles.avisoText}>
            Para montar sua agenda, primeiro vá na aba Grade e coloque as disciplinas que voce está fazendo como "cursando".
          </Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {diasDaSemanaVisualizada.map((infoDia, index) => {
          
          const aulasDoDia = aulas
            .filter(a => a.diaSemana === index)
            .sort((a, b) => a.horarioInicio.localeCompare(b.horarioInicio));

          const lembretesDoDia = lembretes
            .filter(l => l.dataCompleta === infoDia.dataCompleta)
            .sort((a, b) => (a.concluido === b.concluido ? 0 : a.concluido ? 1 : -1));

          return (
            <View key={index} style={styles.daySection}>
              <View style={[styles.dayHeader, infoDia.isHoje && { borderLeftColor: colors.concluida }]}>
                <Text style={styles.dayTitle}>
                  {infoDia.nome} <Text style={styles.dayDate}>({infoDia.dataStr})</Text>
                  {infoDia.isHoje && <Text style={{color: colors.concluida, fontSize: 14}}> Hoje</Text>}
                </Text>
              </View>

              {lembretesDoDia.map(lembrete => {
                const catInfo = CATEGORIAS.find(c => c.label === lembrete.categoria);
                return (
                  <TouchableOpacity 
                    key={lembrete.id} 
                    style={[styles.lembreteCard, lembrete.concluido && styles.lembreteCardConcluido]}
                    onPress={() => toggleLembreteConcluido(lembrete.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.lembreteIconBox, { backgroundColor: lembrete.concluido ? colors.border : catInfo?.color }]}>
                      {catInfo && <catInfo.icon size={16} color="#FFF" />}
                    </View>
                    <View style={styles.lembreteInfo}>
                      <Text style={[styles.lembreteTitle, lembrete.concluido && styles.textStrikethrough]}>
                        {lembrete.titulo}
                      </Text>
                      {lembrete.descricao ? <Text style={styles.lembreteDesc} numberOfLines={1}>{lembrete.descricao}</Text> : null}
                    </View>
                    
                    <TouchableOpacity style={styles.actionBtn} onPress={() => handleRemoverItem(lembrete.id, 'lembrete')}>
                      <Trash2 size={18} color={colors.textMuted} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}

              {infoDia.feriado ? (
                <View style={styles.feriadoCard}>
                  <PartyPopper size={32} color="#F59E0B" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.feriadoTitle}>Feriado Nacional</Text>
                    <Text style={styles.feriadoName}>{infoDia.feriado}</Text>
                  </View>
                </View>
              ) : aulasDoDia.length === 0 ? (
                lembretesDoDia.length === 0 && <Text style={styles.freeDayText}>Dia livre 🍃</Text>
              ) : (
                aulasDoDia.map(aula => {
                  const inicioMin = timeToMinutes(aula.horarioInicio);
                  const fimMin = timeToMinutes(aula.horarioFim);
                  const isAcontecendoAgora = infoDia.isHoje && (currentMinutes >= inicioMin && currentMinutes <= fimMin);

                  return (
                    <TouchableOpacity 
                      key={aula.id} 
                      style={[styles.aulaCard, isAcontecendoAgora && styles.aulaCardAgora]}
                      activeOpacity={0.6}
                      onPress={() => abrirModalLembreteContextual(aula.disciplinaId, infoDia.dataCompleta)}
                    >
                      <View style={styles.aulaTimeColumn}>
                        <Text style={styles.timeTextBold}>{aula.horarioInicio}</Text>
                        <View style={styles.timeLine} />
                        <Text style={styles.timeTextMuted}>{aula.horarioFim}</Text>
                      </View>
                      
                      <View style={styles.aulaInfoColumn}>
                        {isAcontecendoAgora && (
                          <View style={styles.badgeAgora}>
                            <Clock size={12} color="#EF4444" style={{marginRight: 4}} />
                            <Text style={styles.badgeAgoraText}>AGORA</Text>
                          </View>
                        )}
                        <Text style={styles.aulaNome}>{getNomeDisciplina(aula.disciplinaId)}</Text>
                        
                        <View style={styles.aulaDetalhesRow}>
                          <MapPin size={14} color={colors.textMuted} />
                          <Text style={styles.aulaLocal}>{aula.local}</Text>
                        </View>

                        <Text style={styles.hintText}>👆 Toque aqui para adicionar um lembrete</Text>
                      </View>

                      <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.actionBtn} onPress={() => { setModalMode('aula'); setEditandoAulaId(aula.id); setFormDisciplinaId(aula.disciplinaId); setFormDiaSemana(aula.diaSemana); setFormInicio(aula.horarioInicio); setFormFim(aula.horarioFim); setFormLocal(aula.local); setModalVisible(true); }}>
                          <Edit2 size={18} color={colors.textMuted} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionBtn} onPress={() => handleRemoverItem(aula.id, 'aula')}>
                          <Trash2 size={18} color="#EF4444" />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  )
                })
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Ao clicar no botão, se estiver vazio, agora ele bloqueia com um alerta amigável */}
      <TouchableOpacity 
        style={[styles.fab, materiasCursando.length === 0 && { backgroundColor: colors.textMuted }]} 
        activeOpacity={0.8} 
        onPress={abrirModalNovaAula}
      >
        <Plus size={24} color="#FFF" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>
                {modalMode === 'lembrete' ? 'Novo Lembrete / Prazo' : (editandoAulaId ? 'Editar Aula Fixa' : 'Nova Aula Fixa')}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ padding: 4 }}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.formContainer}>
              
              {/* === FORMULÁRIO DE LEMBRETE === */}
              {modalMode === 'lembrete' && (
                <>
                  <Text style={styles.label}>O que você precisa lembrar?</Text>
                  <TextInput style={styles.input} placeholder="Ex: Prova 1" placeholderTextColor={colors.textMuted} value={formLembreteTitulo} onChangeText={setFormLembreteTitulo} />

                  <Text style={styles.label}>Data do Evento</Text>
                  <TextInput style={[styles.input, {backgroundColor: colors.surface}]} placeholder="AAAA-MM-DD" placeholderTextColor={colors.textMuted} value={formLembreteData} onChangeText={setFormLembreteData} editable={false} />

                  <Text style={styles.label}>Categoria</Text>
                  <View style={styles.catGrid}>
                    {CATEGORIAS.map(c => (
                      <TouchableOpacity key={c.label} style={[styles.catPill, formLembreteCategoria === c.label && { backgroundColor: c.color, borderColor: c.color }]} onPress={() => setFormLembreteCategoria(c.label)}>
                        <Text style={[styles.catText, formLembreteCategoria === c.label && { color: '#FFF' }]}>{c.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.label}>Detalhes (Opcional)</Text>
                  <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} placeholder="Assuntos da prova, grupo..." placeholderTextColor={colors.textMuted} multiline value={formLembreteDescricao} onChangeText={setFormLembreteDescricao} />

                  <TouchableOpacity style={styles.salvarBtn} onPress={handleSalvarLembrete} activeOpacity={0.8}>
                    <Text style={styles.salvarBtnText}>Salvar Lembrete na Agenda</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* === FORMULÁRIO DE AULA === */}
              {modalMode === 'aula' && (
                <>
                  <Text style={styles.label}>Disciplina</Text>
                  <View style={styles.pickerContainer}>
                    <BookOpen size={18} color={colors.textMuted} />
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
                      {materiasCursando.length === 0 ? <Text style={{color: colors.textMuted, marginLeft: 8}}>Inicie o semestre na aba Grade.</Text> : materiasCursando.map(mat => (
                        <TouchableOpacity key={mat.id} style={[styles.materiaSelectPill, formDisciplinaId === mat.id && styles.materiaSelectPillActive]} onPress={() => setFormDisciplinaId(mat.id)}>
                          <Text style={[styles.materiaSelectText, formDisciplinaId === mat.id && { color: '#FFF' }]}>{mat.nome}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>

                  <Text style={styles.label}>Dia da Semana</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                    {DIAS_SEMANA.map((dia, idx) => (
                      <TouchableOpacity key={idx} style={[styles.diaFormPill, formDiaSemana === idx && styles.diaFormPillActive]} onPress={() => setFormDiaSemana(idx)}>
                        <Text style={[styles.diaFormText, formDiaSemana === idx && { color: '#FFF' }]}>{dia.slice(0, 3)}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <View style={styles.rowForm}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>Início</Text>
                      <TextInput style={styles.input} placeholder="07:10" placeholderTextColor={colors.textMuted} value={formInicio} onChangeText={setFormInicio} maxLength={5} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.label}>Término</Text>
                      <TextInput style={styles.input} placeholder="08:50" placeholderTextColor={colors.textMuted} value={formFim} onChangeText={setFormFim} maxLength={5} />
                    </View>
                  </View>

                  <Text style={styles.label}>Local / Sala</Text>
                  <TextInput style={styles.input} placeholder="Ex: Prédio 2 - Sala 402" placeholderTextColor={colors.textMuted} value={formLocal} onChangeText={setFormLocal} />

                  <TouchableOpacity style={styles.salvarBtn} onPress={handleSalvarAula} activeOpacity={0.8}>
                    <Text style={styles.salvarBtnText}>Salvar Aula Fixa</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  
  weekNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surfaceLight, borderRadius: 12, paddingHorizontal: 4, paddingVertical: 4 },
  navBtn: { padding: 8 },
  navCenterBtn: { alignItems: 'center', flex: 1, paddingVertical: 8 },
  navText: { color: colors.text, fontSize: 15, fontWeight: '600' },
  navSubText: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  
  // --- BANNER DE AVISO ---
  avisoBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: 14, marginHorizontal: 16, marginTop: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.3)', gap: 12 },
  avisoText: { flex: 1, color: '#F59E0B', fontSize: 13, fontWeight: '600', lineHeight: 20 },

  content: { padding: 16, paddingBottom: 100 },
  daySection: { marginBottom: 28 },
  dayHeader: { borderLeftWidth: 4, borderLeftColor: colors.disponivel, paddingLeft: 12, marginBottom: 12 },
  dayTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text },
  dayDate: { fontSize: 14, color: colors.textMuted, fontWeight: 'normal' },
  freeDayText: { color: colors.textMuted, fontSize: 14, fontStyle: 'italic', marginLeft: 16 },

  lembreteCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: 12, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: colors.border },
  lembreteCardConcluido: { opacity: 0.4 },
  lembreteIconBox: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  lembreteInfo: { flex: 1 },
  lembreteTitle: { color: colors.text, fontSize: 15, fontWeight: 'bold' },
  lembreteDesc: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  textStrikethrough: { textDecorationLine: 'line-through' },

  feriadoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.3)', borderRadius: 12, padding: 16, gap: 16 },
  feriadoTitle: { fontSize: 12, fontWeight: 'bold', color: '#F59E0B', textTransform: 'uppercase', letterSpacing: 1 },
  feriadoName: { fontSize: 18, fontWeight: 'bold', color: colors.text },

  aulaCard: { flexDirection: 'row', backgroundColor: colors.surfaceLight, borderRadius: 12, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: colors.border, borderLeftWidth: 4, borderLeftColor: colors.disponivel },
  aulaCardAgora: { borderColor: '#EF4444', borderWidth: 2, backgroundColor: 'rgba(239, 68, 68, 0.05)', borderLeftColor: '#EF4444' },
  aulaTimeColumn: { alignItems: 'center', width: 50, marginRight: 16 },
  timeTextBold: { color: colors.text, fontWeight: 'bold', fontSize: 14 },
  timeTextMuted: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  timeLine: { flex: 1, width: 2, backgroundColor: colors.border, marginVertical: 6, borderRadius: 1 },
  aulaInfoColumn: { flex: 1, justifyContent: 'center' },
  badgeAgora: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(239, 68, 68, 0.15)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginBottom: 6 },
  badgeAgoraText: { color: '#EF4444', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },
  aulaNome: { fontSize: 16, fontWeight: '800', marginBottom: 8, color: colors.text },
  aulaDetalhesRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  aulaLocal: { color: colors.textMuted, fontSize: 13 },
  hintText: { fontSize: 11, color: colors.textMuted, fontStyle: 'italic', marginTop: 6, opacity: 0.8 },

  actionButtons: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 8 },
  actionBtn: { padding: 6, alignItems: 'center', justifyContent: 'center' },

  fab: { position: 'absolute', bottom: 30, right: 24, backgroundColor: colors.disponivel, width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', elevation: 8, zIndex: 10 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, height: '85%' },
  
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: colors.border },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },

  formContainer: { padding: 20 },
  label: { color: colors.text, fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: colors.background, color: colors.text, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, borderWidth: 1, borderColor: colors.border },
  rowForm: { flexDirection: 'row', gap: 12, marginTop: 8 },
  
  pickerContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: colors.border, gap: 10 },
  materiaSelectPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, marginRight: 8 },
  materiaSelectPillActive: { backgroundColor: colors.cursando, borderColor: colors.cursando },
  materiaSelectText: { color: colors.text, fontSize: 13, fontWeight: '500' },
  
  diaFormPill: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, marginRight: 8 },
  diaFormPillActive: { backgroundColor: colors.disponivel, borderColor: colors.disponivel },
  diaFormText: { color: colors.text, fontSize: 14, fontWeight: '500', textTransform: 'capitalize' },

  catGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  catPill: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.background },
  catText: { color: colors.text, fontSize: 12, fontWeight: '600' },

  salvarBtn: { backgroundColor: colors.disponivel, paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 30, marginBottom: 40 },
  salvarBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});