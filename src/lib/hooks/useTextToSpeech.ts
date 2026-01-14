import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTextToSpeechReturn {
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isSpeaking: boolean;
  isPaused: boolean;
  isBrowserSupported: boolean;
  voices: SpeechSynthesisVoice[];
  setVoice: (voice: SpeechSynthesisVoice) => void;
  setRate: (rate: number) => void;
  setPitch: (pitch: number) => void;
}

export function useTextToSpeech(): UseTextToSpeechReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [rate, setRateState] = useState(0.9); // Slightly slower for clarity
  const [pitch, setPitchState] = useState(1);
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const isBrowserSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (!isBrowserSupported) return;

    synthRef.current = window.speechSynthesis;

    // Load available voices
    const loadVoices = () => {
      const availableVoices = synthRef.current?.getVoices() || [];
      setVoices(availableVoices);
      
      // Select a good English voice by default
      const preferredVoice = availableVoices.find(
        voice => voice.lang === 'en-US' && voice.name.includes('Google')
      ) || availableVoices.find(
        voice => voice.lang === 'en-US'
      ) || availableVoices[0];
      
      setSelectedVoice(preferredVoice);
    };

    loadVoices();
    
    // Some browsers load voices asynchronously
    if (synthRef.current?.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = loadVoices;
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [isBrowserSupported]);

  const speak = useCallback((text: string) => {
    if (!synthRef.current || !text) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.lang = 'en-US';

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  }, [selectedVoice, rate, pitch]);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, []);

  const pause = useCallback(() => {
    if (synthRef.current && isSpeaking) {
      synthRef.current.pause();
    }
  }, [isSpeaking]);

  const resume = useCallback(() => {
    if (synthRef.current && isPaused) {
      synthRef.current.resume();
    }
  }, [isPaused]);

  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
  }, []);

  const setRate = useCallback((newRate: number) => {
    setRateState(Math.max(0.1, Math.min(10, newRate)));
  }, []);

  const setPitch = useCallback((newPitch: number) => {
    setPitchState(Math.max(0, Math.min(2, newPitch)));
  }, []);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
    isBrowserSupported,
    voices,
    setVoice,
    setRate,
    setPitch,
  };
}
