import 'react-native-url-polyfill/auto';
import React, { useState } from 'react';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

// Importei o ícone CalendarDays para a nova aba
import { GraduationCap, FileText, Settings, CalendarDays } from 'lucide-react-native';

import { DisciplinasProvider } from './src/contexts/DisciplinasContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { AtividadesScreen } from './src/screens/AtividadesScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { HorariosScreen } from './src/screens/HorariosScreen'; // <-- IMPORTAÇÃO DA NOVA TELA
import { colors } from './src/theme/colors';

import { Analytics } from '@vercel/analytics/react';

function MainNavigator() {
  // Adicionei 'horarios' nas opções de abas permitidas
  const [activeTab, setActiveTab] = useState<'grade' | 'horarios' | 'atividades' | 'settings'>('grade');
  const insets = useSafeAreaInsets(); 

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {activeTab === 'grade' && <HomeScreen />}
        
        {/* Renderiza a tela de Horários quando a aba estiver ativa */}
        {activeTab === 'horarios' && <HorariosScreen />}
        
        {activeTab === 'atividades' && <AtividadesScreen />}
        {activeTab === 'settings' && <SettingsScreen onNavigateToGrade={() => setActiveTab('grade')} />}
      </View>

      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('grade')} activeOpacity={0.7}>
          <GraduationCap size={24} color={activeTab === 'grade' ? colors.disponivel : colors.textMuted} />
          <Text style={[styles.tabLabel, activeTab === 'grade' && styles.tabLabelActive]}>Grade</Text>
        </TouchableOpacity>

        {/* --- NOVO BOTÃO DA ABA DE HORÁRIOS --- */}
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('horarios')} activeOpacity={0.7}>
          <CalendarDays size={24} color={activeTab === 'horarios' ? colors.disponivel : colors.textMuted} />
          <Text style={[styles.tabLabel, activeTab === 'horarios' && styles.tabLabelActive]}>Horários</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('atividades')} activeOpacity={0.7}>
          <FileText size={24} color={activeTab === 'atividades' ? colors.disponivel : colors.textMuted} />
          <Text style={[styles.tabLabel, activeTab === 'atividades' && styles.tabLabelActive]}>Atividades</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('settings')} activeOpacity={0.7}>
          <Settings size={24} color={activeTab === 'settings' ? colors.disponivel : colors.textMuted} />
          <Text style={[styles.tabLabel, activeTab === 'settings' && styles.tabLabelActive]}>Config.</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <DisciplinasProvider>
        <MainNavigator />
      </DisciplinasProvider>
      <Analytics />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 },
  tabLabel: { fontSize: 12, color: colors.textMuted, fontWeight: '500' },
  tabLabelActive: { color: colors.disponivel, fontWeight: '700' }
});