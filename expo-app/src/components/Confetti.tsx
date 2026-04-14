import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';

interface Props {
  isActive: boolean;
}

export function Confetti({ isActive }: Props) {
  const [show, setShow] = useState(false);
  const previousIsActive = useRef(isActive);
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isActive && !previousIsActive.current) {
      setShow(true);
      
      if (Platform.OS === 'web') {
        try {
          const confettiModule = require('canvas-confetti');
          const confetti = confettiModule.default || confettiModule;
          
          const end = Date.now() + 1500;
          
          const frame = () => {
            confetti({
              particleCount: 5,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
              colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'],
              zIndex: 9999
            });
            confetti({
              particleCount: 5,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
              colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'],
              zIndex: 9999
            });

            if (Date.now() < end) {
              requestAnimationFrame(frame);
            }
          };
          frame();
        } catch(e) {
          console.error("Erro ao carregar canvas-confetti web", e);
        }
      }

      timer = setTimeout(() => setShow(false), Platform.OS === 'web' ? 2500 : 4500);
      previousIsActive.current = true;
    } 
    
    if (!isActive) {
      previousIsActive.current = false;
      setShow(false);
    }

    return () => clearTimeout(timer);
  }, [isActive]);

  if (!show || Platform.OS === 'web') return null;

  // Require condicional para não quebrar a web durante render
  let ConfettiCannon;
  try {
    ConfettiCannon = require('react-native-confetti-cannon').default;
  } catch(e) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Confete do Lado Esquerdo */}
      <ConfettiCannon
        count={150}
        origin={{ x: 0, y: -20 }}
        autoStart={true}
        fadeOut={true}
        explosionSpeed={500}
        fallSpeed={3500}
      />
      {/* Confete do Lado Direito */}
      <ConfettiCannon
        count={150}
        origin={{ x: width, y: -20 }}
        autoStart={true}
        fadeOut={true}
        explosionSpeed={500}
        fallSpeed={3500}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    elevation: 999,
    pointerEvents: 'none'
  }
});
