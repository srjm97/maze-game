import { AUDIO_CONFIG } from '../constants/gameConstants';
import type { AudioNote, GameState } from '../types/gameTypes';

export const createAudioContext = (): AudioContext | null => {
  try {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch {
    return null;
  }
};

export const playWallHitSound = (audioContext: AudioContext | null): void => {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(AUDIO_CONFIG.WALL_HIT_FREQUENCY, audioContext.currentTime);
  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + AUDIO_CONFIG.WALL_HIT_DURATION);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + AUDIO_CONFIG.WALL_HIT_DURATION);
};

export const playVictoryMusic = (audioContext: AudioContext | null): void => {
  if (!audioContext) return;

  let currentTime = audioContext.currentTime + 0.1;

  AUDIO_CONFIG.VICTORY_MELODY.forEach((note: AudioNote) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(note.freq, currentTime);

    gainNode.gain.setValueAtTime(0, currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(currentTime);
    oscillator.stop(currentTime + note.duration);

    currentTime += note.duration;
  });
};

export const playBeaconSound = (
  audioContext: AudioContext | null,
  gameState: GameState,
  distance: number
): void => {
  if (!audioContext || !gameState) return;

  const maxDistance = Math.sqrt(
    Math.pow(gameState.maze_layout[0].length, 2) + 
    Math.pow(gameState.maze_layout.length, 2)
  );

  const normalizedDistance = distance / maxDistance;
  const frequency = AUDIO_CONFIG.BEACON_BASE_FREQUENCY + (1 - normalizedDistance) * AUDIO_CONFIG.BEACON_RANGE;
  const volume = 0.05 + (1 - normalizedDistance) * 0.15;

  const xDiff = gameState.goal_position.x - gameState.player_position.x;
  const panValue = Math.max(-1, Math.min(1, xDiff / 5));

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const panner = audioContext.createStereoPanner();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  panner.pan.setValueAtTime(panValue, audioContext.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(panner);
  panner.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.3);
};