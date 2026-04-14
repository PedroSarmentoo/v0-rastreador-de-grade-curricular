import 'react-native-url-polyfill/auto';
import React, { useState } from 'react';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'; // <-- Importei o useSafeAreaInsets aqui
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DisciplinasProvider } from './src/contexts/DisciplinasContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { AtividadesScreen } from './src/screens/AtividadesScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { colors } from './src/theme/colors';

function MainNavigator() {
  const [activeTab, setActiveTab] = useState<'grade' | 'atividades' | 'settings'>('grade');
  
  // 1. Chamamos o hook para ler o tamanho da barra do celular
  const insets = useSafeAreaInsets(); 

  return (
    <View style={styles.container}>
      {/* Content Area */}
      <View style={styles.content}>
        {activeTab === 'grade' && <HomeScreen />}
        {activeTab === 'atividades' && <AtividadesScreen />}
        {activeTab === 'settings' && <SettingsScreen />}
      </View>

      {/* Custom Bottom Tab Bar */}
      <View 
        style={[
          styles.tabBar, 
          // 2. Aplicamos o paddingBottom dinâmico direto no estilo inline
          { paddingBottom: Math.max(insets.bottom, 16) }
        ]}
      >
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('grade')}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="school" 
            size={24} 
            color={activeTab === 'grade' ? colors.disponivel : colors.textMuted} 
          />
          <Text style={[styles.tabLabel, activeTab === 'grade' && styles.tabLabelActive]}>
            Grade
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('atividades')}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="documents" 
            size={24} 
            color={activeTab === 'atividades' ? colors.disponivel : colors.textMuted} 
          />
          <Text style={[styles.tabLabel, activeTab === 'atividades' && styles.tabLabelActive]}>
            Atividades
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('settings')}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="settings" 
            size={24} 
            color={activeTab === 'settings' ? colors.disponivel : colors.textMuted} 
          />
          <Text style={[styles.tabLabel, activeTab === 'settings' && styles.tabLabelActive]}>
            Config.
          </Text>
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
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    // Removi o paddingBottom daqui, pois agora é controlado pelo insets no JSX
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: colors.disponivel,
    fontWeight: '700',
  }
});