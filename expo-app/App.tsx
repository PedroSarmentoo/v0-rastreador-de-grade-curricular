import 'react-native-url-polyfill/auto';
import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DisciplinasProvider } from './src/contexts/DisciplinasContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { AtividadesScreen } from './src/screens/AtividadesScreen';
import { colors } from './src/theme/colors';

function MainNavigator() {
  const [activeTab, setActiveTab] = useState<'grade' | 'atividades'>('grade');

  return (
    <View style={styles.container}>
      {/* Content Area */}
      <View style={styles.content}>
        {activeTab === 'grade' ? <HomeScreen /> : <AtividadesScreen />}
      </View>

      {/* Custom Bottom Tab Bar */}
      <View style={styles.tabBar}>
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
    paddingBottom: 24, // Para suportar safe area de alguns dispositivos, idealmente usar insets.bottom
    paddingTop: 12,
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
