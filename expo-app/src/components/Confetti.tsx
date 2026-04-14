import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';

interface Props {
  isActive: boolean;
}

export function Confetti({ isActive }: Props) {
  const [show, setShow] = useState(false);
  const previousIsActive = useRef(isActive);
  const { width } = Dimensions.get('window');

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isActive && !previousIsActive.current) {
      setShow(true);
      
      if (Platform.OS === 'web') {
        const confetti = require('canvas-confetti');
        const end = Date.now() + 6 * 1000;
        
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
      }

      timer = setTimeout(() => setShow(false), 6000);
      previousIsActive.current = true;
    } 
    
    if (!isActive) {
      previousIsActive.current = false;
      setShow(false);
    }

    return () => clearTimeout(timer);
  }, [isActive]);

  if (!show || Platform.OS === 'web') return null;

  const ConfettiCannon = require('react-native-confetti-cannon').default;

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
