import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useAcc } from '../contexts/AccContext';
import { modalidades, Modalidade } from '../data/atividades';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

function AccHeader() {
  const { horasObtidasTotal, horasRestantes, progressoAcc, metaHoras } = useAcc();

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Atividades Complementares</Text>
      <Text style={styles.headerSubtitle}>
        Meta: {metaHoras} horas
      </Text>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{horasObtidasTotal.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Obtidas</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: horasRestantes === 0 ? colors.concluida : colors.cursando }]}>
            {horasRestantes.toFixed(1)}
          </Text>
          <Text style={styles.statLabel}>Restantes</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: progressoAcc >= 100 ? colors.concluida : colors.disponivel }]}>
            {progressoAcc}%
          </Text>
          <Text style={styles.statLabel}>Progresso</Text>
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${Math.min(progressoAcc, 100)}%` }]} />
      </View>
    </View>
  );
}

interface ModalidadeCardProps {
  modalidade: Modalidade;
}

function ModalidadeCard({ modalidade }: ModalidadeCardProps) {
  const { entries, setValorBruto, getHorasCalculadas } = useAcc();
  const [inputValue, setInputValue] = useState<string>(() => {
    const entry = entries.find((e) => e.modalidadeId === modalidade.id);
    return entry ? String(entry.valorBruto) : '';
  });

  const horasCalculadas = getHorasCalculadas(modalidade.id);
  const atingiuMaximo = horasCalculadas >= modalidade.max;

  const handleChangeText = (text: string) => {
    // Permite apenas numeros e ponto decimal
    const cleaned = text.replace(/[^0-9.]/g, '');
    setInputValue(cleaned);
    
    const valor = parseFloat(cleaned) || 0;
    setValorBruto(modalidade.id, valor);
  };

  return (
    <View style={[styles.card, atingiuMaximo && styles.cardMaximo]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {modalidade.nome}
        </Text>
        {atingiuMaximo && (
          <View style={styles.badgeMaximo}>
            <Text style={styles.badgeMaximoText}>MAX</Text>
          </View>
        )}
      </View>

      <View style={styles.cardRules}>
        <Text style={styles.ruleText}>
          Paridade: <Text style={styles.ruleValue}>{modalidade.paridade}x</Text>
        </Text>
        <Text style={styles.ruleText}>
          Maximo: <Text style={styles.ruleValue}>{modalidade.max}h</Text>
        </Text>
      </View>

      <View style={styles.cardInputRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Horas brutas:</Text>
          <TextInput
            style={styles.input}
            value={inputValue}
            onChangeText={handleChangeText}
            keyboardType="decimal-pad"
            placeholder="0"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Resultado:</Text>
          <Text style={[styles.resultValue, atingiuMaximo && styles.resultValueMaximo]}>
            {horasCalculadas.toFixed(1)}h
          </Text>
        </View>
      </View>
    </View>
  );
}

export function AccSection() {
  const { isLoading } = useAcc();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <AccHeader />
      
      <View style={styles.cardsContainer}>
        {modalidades.map((modalidade) => (
          <ModalidadeCard key={modalidade.id} modalidade={modalidade} />
        ))}
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    color: colors.textMuted,
    fontSize: 16,
  },
  headerContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.concluida,
    borderRadius: 4,
  },
  cardsContainer: {
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardMaximo: {
    borderColor: colors.concluidaBorder,
    backgroundColor: colors.concluidaBg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  badgeMaximo: {
    backgroundColor: colors.concluida,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeMaximoText: {
    color: colors.background,
    fontSize: 10,
    fontWeight: '700',
  },
  cardRules: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 16,
  },
  ruleText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  ruleValue: {
    color: colors.disponivel,
    fontWeight: '600',
  },
  cardInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    marginRight: 16,
  },
  inputLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultContainer: {
    alignItems: 'flex-end',
  },
  resultLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 6,
  },
  resultValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  resultValueMaximo: {
    color: colors.concluida,
  },
  bottomSpacer: {
    height: 40,
  },
});
