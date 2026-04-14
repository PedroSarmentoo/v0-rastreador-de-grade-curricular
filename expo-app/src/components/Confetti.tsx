import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

interface Props {
  isActive: boolean;
}

export function Confetti({ isActive }: Props) {
  const [show, setShow] = useState(false);
  const previousIsActive = useRef(isActive);
  const { width } = Dimensions.get('window');

  useEffect(() => {
    // Só estoura se NÃO estava ativo antes e e AGORA está ativo (bater 100% no meio da sessão)
    if (isActive && !previousIsActive.current) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 6000);
      
      // Atualiza a referência pra não estourar de novo até que ele regrida o valor
      previousIsActive.current = true;
      return () => clearTimeout(timer);
    } 
    
    if (!isActive) {
      previousIsActive.current = false;
      setShow(false);
    }
  }, [isActive]);

  if (!show || Platform.OS === 'web') return null;


  return (
    <View style={styles.container} pointerEvents="none">
      <ConfettiCannon
        count={200}
        origin={{ x: width / 2, y: -20 }}
        autoStart={true}
        fadeOut={true}
        explosionSpeed={350}
        fallSpeed={3000}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    elevation: 999,
  }
});
