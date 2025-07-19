export const speakMessage = (message: string) => {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech to prevent overlaps
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    utterance.volume = 0.8;

    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice =>
      voice.name.includes('Google') ||
      voice.name.includes('Microsoft') ||
      voice.lang.startsWith('en')
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    speechSynthesis.speak(utterance);
  }
};