import React, { useState, useMemo } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Modal, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, X, CheckCircle, Info, Sparkles } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useDisciplinas } from '../contexts/DisciplinasContext';
import { EstatisticasHeader } from '../components/EstatisticasHeader';
import { Legenda } from '../components/Legenda';
import { SemestreSection } from '../components/SemestreSection';
import { Confetti } from '../components/Confetti';

export function HomeScreen() {
  const { semestres, progressoPercentual, disciplinas, matricular } = useDisciplinas();

  const [modalPlanejamentoVisible, setModalPlanejamentoVisible] = useState(false);
  const [materiasSelecionadas, setMateriasSelecionadas] = useState<string[]>([]);

  const materiasDisponiveis = useMemo(() => {
    return disciplinas.filter(d => d.status === 'disponivel');
  }, [disciplinas]);

  // --- O CÉREBRO DA SUGESTÃO INTELIGENTE (VERSÃO 2.0) ---
  const sugerirGradeIdeal = () => {
    // Função auxiliar que conta quantas matérias dependem de uma matéria específica
    const contarDependentes = (idMateria: string) => {
      return disciplinas.filter(d => d.preRequisitos.includes(idMateria)).length;
    };

    // 1. Organiza as matérias usando os novos critérios
    const materiasOrdenadas = [...materiasDisponiveis].sort((a, b) => {
      const pesoA = contarDependentes(a.id);
      const pesoB = contarDependentes(b.id);

      // CRITÉRIO 1: As que "travam" mais disciplinas (peso maior primeiro)
      if (pesoB !== pesoA) {
        return pesoB - pesoA;
      }
      
      // CRITÉRIO 2: Desempate pelas mais antigas (semestre menor primeiro)
      return a.semestre - b.semestre;
    });

    let horasAcumuladas = 0;
    const novaSelecao: string[] = [];

    // CRITÉRIO 3: Respeitar a saúde mental (Limite Ideal de ~360h)
    for (const materia of materiasOrdenadas) {
      const ch = materia.cargaHoraria || 60; // Se não tiver CH, assume 60h
      
      if (horasAcumuladas + ch <= 360) {
        novaSelecao.push(materia.id);
        horasAcumuladas += ch;
      }
    }

    setMateriasSelecionadas(novaSelecao);
  };

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
        <Legenda />
        
        {semestres.map((semestre) => (
          <SemestreSection key={semestre} semestre={semestre} />
        ))}
      </ScrollView>

      {/* BOTÃO FLUTUANTE */}
      <TouchableOpacity 
        style={styles.floatingPlanButton}
        onPress={() => setModalPlanejamentoVisible(true)}
        activeOpacity={0.8}
      >
        <BookOpen size={24} color="#FFF" />
        {materiasSelecionadas.length > 0 && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{materiasSelecionadas.length}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* --- MODAL DO SIMULADOR --- */}
      <Modal visible={modalPlanejamentoVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <BookOpen size={20} color={colors.text} />
                <Text style={styles.modalTitle}>Montar Semestre</Text>
              </View>
              <TouchableOpacity onPress={() => setModalPlanejamentoVisible(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {materiasDisponiveis.length === 0 ? (
              <View style={styles.emptyState}>
                <Info size={40} color={colors.textMuted} />
                <Text style={styles.emptyText}>Nenhuma matéria disponível no momento. Conclua seus pré-requisitos!</Text>
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                
                {/* BOTÃO DE SUGESTÃO INTELIGENTE */}
                <TouchableOpacity 
                  style={styles.sugestaoButton}
                  onPress={sugerirGradeIdeal}
                  activeOpacity={0.7}
                >
                  <Sparkles size={20} color="#F59E0B" />
                  <View>
                    <Text style={styles.sugestaoTitle}>Sugestão Inteligente</Text>
                  </View>
                </TouchableOpacity>

                <Text style={styles.helperText}>Ou selecione manualmente as matérias:</Text>
                
                {materiasDisponiveis.map(materia => {
                  const isSelected = materiasSelecionadas.includes(materia.id);
                  return (
                    <TouchableOpacity 
                      key={materia.id}
                      style={[styles.materiaItem, isSelected && styles.materiaItemSelected]}
                      onPress={() => toggleMateriaNoPlanejamento(materia.id)}
                      activeOpacity={0.7}
                    >
                      <View style={{ flex: 1, paddingRight: 10 }}>
                        <Text style={[styles.materiaNomeCarrinho, isSelected && { color: '#FFF' }]}>{materia.nome}</Text>
                        <Text style={[styles.materiaDetalhe, isSelected && { color: 'rgba(255,255,255,0.8)' }]}>
                          Do {materia.semestre}º Semestre • {materia.cargaHoraria ? `${materia.cargaHoraria}h` : 'CH não informada'}
                        </Text>
                      </View>
                      {isSelected ? (
                        <CheckCircle size={24} color="#FFF" />
                      ) : (
                        <View style={styles.unselectedCircle} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            {/* PAINEL INFERIOR COM TERMÔMETRO */}
            <View style={styles.resumoContainer}>
              <View style={styles.termometroContainer}>
                <View style={styles.termometroTextos}>
                  <Text style={[styles.termometroStatus, { color: resumoPlanejamento.statusCor }]}>
                    {resumoPlanejamento.statusTexto}
                  </Text>
                  <Text style={styles.resumoHoras}>Total: <Text style={{fontWeight: 'bold', color: colors.text}}>{resumoPlanejamento.totalHoras}h</Text></Text>
                </View>
                <View style={styles.barraFundo}>
                  <View style={[styles.barraProgresso, { width: `${resumoPlanejamento.porcentagem}%`, backgroundColor: resumoPlanejamento.statusCor }]} />
                </View>
              </View>

              <TouchableOpacity 
                style={[styles.confirmarButton, materiasSelecionadas.length === 0 && { opacity: 0.5, backgroundColor: colors.textMuted }]}
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
  container: { flex: 1, backgroundColor: colors.background },
  scrollView: { flex: 1 },
  content: { padding: 16, paddingBottom: 100 },
  floatingPlanButton: { position: 'absolute', bottom: 30, right: 24, backgroundColor: colors.disponivel, width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65, zIndex: 10 },
  badgeContainer: { position: 'absolute', top: -4, right: -4, backgroundColor: '#EF4444', minWidth: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.background, paddingHorizontal: 4 },
  badgeText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '85%', minHeight: '50%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  helperText: { fontSize: 14, color: colors.textMuted, marginBottom: 12, marginTop: 8 },
  sugestaoButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(245, 158, 11, 0.3)', gap: 12, marginBottom: 8 },
  sugestaoTitle: { fontSize: 16, fontWeight: 'bold', color: '#F59E0B' },
  sugestaoSubtitle: { fontSize: 13, color: colors.textMuted },
  materiaItem: { padding: 16, borderRadius: 12, backgroundColor: colors.surfaceLight, borderWidth: 1, borderColor: colors.border, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  materiaItemSelected: { backgroundColor: colors.cursando, borderColor: colors.cursando },
  materiaNomeCarrinho: { fontSize: 15, fontWeight: '600', color: colors.text, marginBottom: 4 },
  materiaDetalhe: { fontSize: 13, color: colors.textMuted },
  unselectedCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.border },
  resumoContainer: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.border, gap: 16 },
  termometroContainer: { gap: 8 },
  termometroTextos: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  termometroStatus: { fontSize: 15, fontWeight: 'bold' },
  resumoHoras: { fontSize: 14, color: colors.textMuted },
  barraFundo: { height: 8, backgroundColor: colors.surfaceLight, borderRadius: 4, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  barraProgresso: { height: '100%', borderRadius: 4 },
  confirmarButton: { backgroundColor: colors.concluida, padding: 16, borderRadius: 12, alignItems: 'center' },
  confirmarButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40, gap: 16 },
  emptyText: { textAlign: 'center', color: colors.textMuted, fontSize: 15, paddingHorizontal: 20 },
});