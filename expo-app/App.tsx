import 'react-native-url-polyfill/auto';
import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { DisciplinasProvider } from './src/contexts/DisciplinasContext';
import { AccProvider } from './src/contexts/AccContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { AccSection } from './src/components/AccSection';
import { colors } from './src/theme/colors';

type Tab = 'grade' | 'acc';

function TabBar({ activeTab, onChangeTab }: { activeTab: Tab; onChangeTab: (tab: Tab) => void }) {
  return (
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'grade' && styles.tabButtonActive]}
        onPress={() => onChangeTab('grade')}
      >
        <Text style={[styles.tabButtonText, activeTab === 'grade' && styles.tabButtonTextActive]}>
          Grade Curricular
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tabButton, activeTab === 'acc' && styles.tabButtonActive]}
        onPress={() => onChangeTab('acc')}
      >
        <Text style={[styles.tabButtonText, activeTab === 'acc' && styles.tabButtonTextActive]}>
          Horas ACC
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('grade');

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <DisciplinasProvider>
        <AccProvider>
          <SafeAreaView style={styles.container} edges={['top']}>
            <TabBar activeTab={activeTab} onChangeTab={setActiveTab} />
            {activeTab === 'grade' ? <HomeScreen /> : <AccSection />}
          </SafeAreaView>
        </AccProvider>
      </DisciplinasProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabButtonActive: {
    backgroundColor: colors.surfaceLight,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tabButtonTextActive: {
    color: colors.text,
  },
});
