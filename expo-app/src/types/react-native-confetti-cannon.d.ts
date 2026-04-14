declare module 'react-native-confetti-cannon' {
    import { Component } from 'react';
    import { ViewStyle } from 'react-native';
  
    interface ConfettiCannonProps {
      count: number;
      origin: { x: number; y: number };
      autoStart?: boolean;
      fadeOut?: boolean;
      colors?: string[];
      fallSpeed?: number;
      explosionSpeed?: number;
      autoStartDelay?: number;
      onAnimationStart?: () => void;
      onAnimationEnd?: () => void;
      style?: ViewStyle;
    }
  
    export default class ConfettiCannon extends Component<ConfettiCannonProps> {
      start: () => void;
    }
  }