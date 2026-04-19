import 'react-native-url-polyfill/auto';
import React, { useState } from 'react';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { GraduationCap, FileText, Settings, CalendarDays, Home } from 'lucide-react-native';

import { DisciplinasProvider } from './src/contexts/DisciplinasContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { AtividadesScreen } from './src/screens/AtividadesScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { HorariosScreen } from './src/screens/HorariosScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { colors } from './src/theme/colors';

import { Platform } from 'react-native';
import { Analytics } from '@vercel/analytics/react';

// Renderizando de forma segura a Analytics apenas se estiver rodando na web
const SafeAnalytics = () => {
  if (Platform.OS === 'web') {
    return <Analytics />;
  }
  return null;
};

function MainNavigator() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'grade' | 'horarios' | 'atividades' | 'settings'>('dashboard');
  const insets = useSafeAreaInsets(); 

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {activeTab === 'dashboard' && <DashboardScreen onChangeTab={setActiveTab} />}
        {activeTab === 'grade' && <HomeScreen />}
        {activeTab === 'horarios' && <HorariosScreen />}
        {activeTab === 'atividades' && <AtividadesScreen />}
        {activeTab === 'settings' && <SettingsScreen onNavigateToGrade={() => setActiveTab('grade')} />}
      </View>

      <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('grade')} activeOpacity={0.7}>
          <GraduationCap size={24} color={activeTab === 'grade' ? colors.disponivel : colors.textMuted} />
          <Text style={[styles.tabLabel, activeTab === 'grade' && styles.tabLabelActive]}>Grade</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('horarios')} activeOpacity={0.7}>
          <CalendarDays size={24} color={activeTab === 'horarios' ? colors.disponivel : colors.textMuted} />
          <Text style={[styles.tabLabel, activeTab === 'horarios' && styles.tabLabelActive]}>Agenda</Text>
        </TouchableOpacity>

        {/* --- INÍCIO NO CENTRO --- */}
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('dashboard')} activeOpacity={0.7}>
          <Home size={24} color={activeTab === 'dashboard' ? colors.disponivel : colors.textMuted} />
          <Text style={[styles.tabLabel, activeTab === 'dashboard' && styles.tabLabelActive]}>Início</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('atividades')} activeOpacity={0.7}>
          <FileText size={24} color={activeTab === 'atividades' ? colors.disponivel : colors.textMuted} />
          <Text style={[styles.tabLabel, activeTab === 'atividades' && styles.tabLabelActive]}>ACC</Text>
        </TouchableOpacity>

        {/* --- CONFIGURAÇÕES DE VOLTA --- */}
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
      <SafeAnalytics />
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