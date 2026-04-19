import React, { useState, useMemo, useCallback } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Modal, Alert, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, X, CheckCircle, Info, Sparkles, Flame } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useDisciplinas } from '../contexts/DisciplinasContext';
import { EstatisticasHeader } from '../components/EstatisticasHeader';
import { Legenda } from '../components/Legenda';
import { SemestreSection } from '../components/SemestreSection';
import { Confetti } from '../components/Confetti';

export function HomeScreen() {
  const { semestres, progressoPercentual, disciplinas, matricular } = useDisciplinas();

  const { width } = useWindowDimensions();
  const isDesktop = width > 800; 

  const [modalPlanejamentoVisible, setModalPlanejamentoVisible] = useState(false);
  const [materiasSelecionadas, setMateriasSelecionadas] = useState<string[]>([]);

  // Filtra apenas as matérias que o aluno já tem os pré-requisitos concluídos
  const materiasDisponiveis = useMemo(() => {
    return disciplinas.filter(d => d.status === 'disponivel');
  }, [disciplinas]);

  // --- O RADAR DE GARGALOS ---
  // Conta quantas matérias no curso dependem desta disciplina
  const contarDependentes = useCallback((idMateria: string) => {
    return disciplinas.filter(d => d.preRequisitos.includes(idMateria)).length;
  }, [disciplinas]);

  // Algoritmo de sugestão de grade
  const sugerirGradeIdeal = () => {
    const materiasOrdenadas = [...materiasDisponiveis].sort((a, b) => {
      const pesoA = contarDependentes(a.id);
      const pesoB = contarDependentes(b.id);

      // Prioriza as que destrancam mais matérias (gargalos)
      if (pesoB !== pesoA) return pesoB - pesoA;
      // Se empatar, prioriza as de semestres mais antigos (que ficaram para trás)
      return a.semestre - b.semestre;
    });

    let horasAcumuladas = 0;
    const novaSelecao: string[] = [];

    for (const materia of materiasOrdenadas) {
      const ch = materia.cargaHoraria || 60; // Assume 60h se não houver carga cadastrada
      
      if (horasAcumuladas + ch <= 360) {
        novaSelecao.push(materia.id);
        horasAcumuladas += ch;
      }
    }

    setMateriasSelecionadas(novaSelecao);
  };

  // Calcula o status dinâmico do planejamento
  const resumoPlanejamento = useMemo(() => {
    const selecionadas = disciplinas.filter(d => materiasSelecionadas.includes(d.id));
    const totalHoras = selecionadas.reduce((acc, curr) => acc + (curr.cargaHoraria || 0), 0);
    
    let statusTexto = 'Selecione matérias';
    let statusCor = colors.textMuted;
    let porcentagem = 0; 

    if (totalHoras > 0) {
      porcentagem = Math.min((totalHoras / 400) * 100, 100); 

      if (totalHoras <= 180) {
        statusTexto = 'Semestre Leve 🍃';
        statusCor = '#10B981'; 
      } else if (totalHoras <= 360) {
        statusTexto = 'Semestre Ideal ⚖️';
        statusCor = '#3B82F6'; 
      } else {
        statusTexto = 'Semestre Pesado ⚠️';
        statusCor = '#EF4444'; 
      }
    }

    return { quantidade: selecionadas.length, totalHoras, statusTexto, statusCor, porcentagem };
  }, [materiasSelecionadas, disciplinas]);

  const toggleMateriaNoPlanejamento = (id: string) => {
    setMateriasSelecionadas(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const confirmarMatricula = () => {
    if (materiasSelecionadas.length === 0) return;
    
    const avisoExtra = resumoPlanejamento.totalHoras > 360 ? "\n\nAviso: Esta é uma carga horária alta. Tem certeza que deseja prosseguir?" : "";
    const mensagem = `Deseja iniciar o semestre com ${resumoPlanejamento.quantidade} matérias (${resumoPlanejamento.totalHoras}h totais)?${avisoExtra}`;

    if (Platform.OS === 'web') {
      const confirma = window.confirm(mensagem);
      if (confirma) {
        matricular(materiasSelecionadas);
        setModalPlanejamentoVisible(false);
        setMateriasSelecionadas([]);
      }
    } else {
      Alert.alert(
        "Confirmar Matrícula",
        mensagem,
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Confirmar", 
            style: resumoPlanejamento.totalHoras > 360 ? "destructive" : "default",
            onPress: () => {
              matricular(materiasSelecionadas);
              setModalPlanejamentoVisible(false);
              setMateriasSelecionadas([]);
            }
          }
        ]
      );
    }
  };

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
            <TouchableOpacity 
              style={styles.inlinePlanButton}
              onPress={() => setModalPlanejamentoVisible(true)}
              activeOpacity={0.8}
            >
              <BookOpen size={20} color="#FFF" />
              <Text style={styles.inlinePlanButtonText}>Montar Semestre</Text>
              
              {materiasSelecionadas.length > 0 && (
                <View style={styles.inlineBadge}>
                  <Text style={styles.inlineBadgeText}>{materiasSelecionadas.length}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        {semestres.map((semestre) => (
          <SemestreSection key={semestre} semestre={semestre} />
        ))}
      </ScrollView>

      {/* --- MODAL DO SIMULADOR --- */}
      <Modal visible={modalPlanejamentoVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDesktop && styles.modalContentDesktop]}>
            
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <BookOpen size={20} color={colors.text} />
                <Text style={styles.modalTitle}>Montar Semestre</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setModalPlanejamentoVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {materiasDisponiveis.length === 0 ? (
              <View style={styles.emptyState}>
                <Info size={40} color={colors.textMuted} />
                <Text style={styles.emptyText}>Nenhuma matéria disponível no momento. Conclua seus pré-requisitos!</Text>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollPadding}>
                
                <TouchableOpacity 
                  style={styles.sugestaoButton}
                  onPress={sugerirGradeIdeal}
                  activeOpacity={0.7}
                >
                  <Sparkles size={24} color="#F59E0B" />
                  <View style={styles.textFlex}>
                    <Text style={styles.sugestaoTitle}>Sugestão Inteligente</Text>
                    <Text style={styles.sugestaoSubtitle}>Prioriza matérias-gargalo no limite ideal de horas</Text>
                  </View>
                </TouchableOpacity>

                <Text style={styles.helperText}>Ou selecione manualmente as matérias:</Text>
                
                {materiasDisponiveis.map(materia => {
                  const isSelected = materiasSelecionadas.includes(materia.id);
                  const qtdDependentes = contarDependentes(materia.id);
                  const isGargalo = qtdDependentes >= 2;

                  return (
                    <TouchableOpacity 
                      key={materia.id}
                      style={[styles.materiaItem, isSelected && styles.materiaItemSelected]}
                      onPress={() => toggleMateriaNoPlanejamento(materia.id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.textFlex}>
                        <View style={styles.nomeContainer}>
                          <Text style={[styles.materiaNomeCarrinho, isSelected && { color: '#FFF' }]}>
                            {materia.nome}
                          </Text>
                          {isGargalo && (
                            <View style={styles.badgeGargalo}>
                              <Flame size={12} color="#EF4444" />
                              <Text style={styles.badgeGargaloText}>GARGALO</Text>
                            </View>
                          )}
                        </View>

                        <Text style={[styles.materiaDetalhe, isSelected && { color: 'rgba(255,255,255,0.8)' }]}>
                          Do {materia.semestre}º Semestre • {materia.cargaHoraria ? `${materia.cargaHoraria}h` : 'CH não informada'} • Tranca {qtdDependentes} matérias
                        </Text>
                      </View>
                      
                      <View style={styles.checkboxContainer}>
                        {isSelected ? (
                          <CheckCircle size={24} color="#FFF" />
                        ) : (
                          <View style={styles.unselectedCircle} />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            <View style={styles.resumoContainer}>
              <View style={styles.termometroContainer}>
                <View style={styles.termometroTextos}>
                  <Text style={[styles.termometroStatus, { color: resumoPlanejamento.statusCor }]}>
                    {resumoPlanejamento.statusTexto}
                  </Text>
                  <Text style={styles.resumoHoras}>Total: <Text style={styles.resumoHorasBold}>{resumoPlanejamento.totalHoras}h</Text></Text>
                </View>
                <View style={styles.barraFundo}>
                  <View style={[styles.barraProgresso, { width: `${resumoPlanejamento.porcentagem}%`, backgroundColor: resumoPlanejamento.statusCor }]} />
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.confirmarButton, materiasSelecionadas.length === 0 && styles.confirmarButtonDisabled]}
                disabled={materiasSelecionadas.length === 0}
                onPress={confirmarMatricula}
              >
                <Text style={styles.confirmarButtonText}>Iniciar Semestre</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // --- ESTRUTURA BASE ---
  container: { flex: 1, backgroundColor: colors.background },
  scrollView: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  textFlex: { flex: 1, paddingRight: 8 }, 
  
  // --- HEADER DE AÇÕES ---
  actionContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 20, width: '100%', paddingHorizontal: 8 },
  actionContainerMobile: { flexDirection: 'column', justifyContent: 'center', gap: 16 },
  spacerLeft: { flex: 1, minWidth: 150 },
  centerLegenda: { flex: 2, alignItems: 'center', justifyContent: 'center' },
  rightAction: { flex: 1, alignItems: 'flex-end', minWidth: 150 },
  rightActionMobile: { alignItems: 'center', width: '100%' },
  
  // --- BOTÃO MONTAR SEMESTRE ---
  inlinePlanButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.disponivel, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, gap: 8, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2, width: Platform.OS === 'web' ? 'auto' : '100%' },
  inlinePlanButtonText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  inlineBadge: { backgroundColor: '#EF4444', borderRadius: 12, minWidth: 24, height: 24, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, marginLeft: 4 },
  inlineBadgeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },

  // --- MODAL: ESTRUTURA ---
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '90%', minHeight: '50%', width: '100%', paddingBottom: Platform.OS === 'ios' ? 40 : 20 },
  modalContentDesktop: { alignSelf: 'center', width: '100%', maxWidth: 600, height: '80%', borderRadius: 24, marginBottom: 'auto', marginTop: 'auto', paddingBottom: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  scrollPadding: { paddingBottom: 20 },

  // --- MODAL: BOTÃO SUGESTÃO E ITENS ---
  helperText: { fontSize: 14, color: colors.textMuted, marginBottom: 12, marginTop: 8 },
  sugestaoButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.3)', gap: 12, marginBottom: 8 },
  sugestaoTitle: { fontSize: 16, fontWeight: 'bold', color: '#F59E0B', marginBottom: 2 },
  sugestaoSubtitle: { fontSize: 13, color: colors.textMuted, flexWrap: 'wrap' },
  
  materiaItem: { padding: 16, borderRadius: 12, backgroundColor: colors.surfaceLight, borderWidth: 1, borderColor: colors.border, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  materiaItemSelected: { backgroundColor: colors.cursando, borderColor: colors.cursando },
  
  nomeContainer: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: 4, gap: 6 },
  materiaNomeCarrinho: { fontSize: 15, fontWeight: '600', color: colors.text },
  badgeGargalo: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(239, 68, 68, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, gap: 4, marginTop: 2 },
  badgeGargaloText: { fontSize: 10, color: '#EF4444', fontWeight: 'bold' },
  materiaDetalhe: { fontSize: 13, color: colors.textMuted, flexWrap: 'wrap', marginTop: 2 },
  
  checkboxContainer: { paddingLeft: 8, justifyContent: 'center', alignItems: 'center' },
  unselectedCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.border },
  
  // --- MODAL: RESUMO E BOTÃO FINAL ---
  resumoContainer: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border, gap: 16 },
  termometroContainer: { gap: 8 },
  termometroTextos: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  termometroStatus: { fontSize: 15, fontWeight: 'bold' },
  resumoHoras: { fontSize: 14, color: colors.textMuted },
  resumoHorasBold: { fontWeight: 'bold', color: colors.text },
  barraFundo: { height: 8, backgroundColor: colors.surfaceLight, borderRadius: 4, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  barraProgresso: { height: '100%', borderRadius: 4 },
  
  confirmarButton: { backgroundColor: colors.concluida, padding: 16, borderRadius: 12, alignItems: 'center' },
  confirmarButtonDisabled: { opacity: 0.5, backgroundColor: colors.textMuted },
  confirmarButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, gap: 16 },
  emptyText: { textAlign: 'center', color: colors.textMuted, fontSize: 15, paddingHorizontal: 20 },
});