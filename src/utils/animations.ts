// utils/animations.ts
import { keyframes } from "@emotion/react";

// Animasyon keyframes
export const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
  70% { transform: scale(1.05); box-shadow: 0 0 20px 10px rgba(255, 255, 255, 0.2); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
`;

export const flip = keyframes`
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(180deg); }
`;

export const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-20px); }
  60% { transform: translateY(-10px); }
`;

export const glowingWin = keyframes`
  0% { box-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #00a1ff, 0 0 20px #00a1ff; }
  100% { box-shadow: 0 0 10px #fff, 0 0 20px #fff, 0 0 30px #00a1ff, 0 0 40px #00a1ff; }
`;

// Taş etkileri
export const tileClick = keyframes`
  0% { transform: scale(1); }
  30% { transform: scale(0.94); }
  60% { transform: scale(1.04); }
  100% { transform: scale(1); }
`;

export const tileShadow = keyframes`
  0% { box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
  50% { box-shadow: 0 15px 30px rgba(0,0,0,0.1); }
  100% { box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
`;
