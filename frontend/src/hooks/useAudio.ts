import { useState, useCallback } from 'react';
import { createAudioContext, playWallHitSound, playVictoryMusic, playBeaconSound } from '../utils/audioUtils';
import type { GameState } from '../types/gameTypes';

export const useAudio = () => {
  const [audioContext] = useState<AudioContext | null>(() => createAudioContext());

  const playWallHit = useCallback(() => {
    playWallHitSound(audioContext);
  }, [audioContext]);

  const playVictory = useCallback(() => {
    playVictoryMusic(audioContext);
  }, [audioContext]);

  const playBeacon = useCallback((gameState: GameState, distance: number) => {
    playBeaconSound(audioContext, gameState, distance);
  }, [audioContext]);

  return { playWallHit, playVictory, playBeacon };
};