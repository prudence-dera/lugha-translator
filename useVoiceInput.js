// src/hooks/useVoiceInput.js
// Talk-to-text for Lugha using on-device / Android system speech recognition.
// The mic button only appears when the selected source language is supported.

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';

// Preferred regional variant when a language has several.
const PREFERRED_LOCALES = {
  en: 'en-US', sw: 'sw-KE', fr: 'fr-FR', ar: 'ar-SA', pt: 'pt-BR',
  es: 'es-ES', zh: 'zh-CN', hi: 'hi-IN', zu: 'zu-ZA', af: 'af-ZA', am: 'am-ET',
};

// Lugha code -> code used by speech recognizers (Twi is covered by Akan).
const CODE_ALIASES = { tw: 'ak' };

// Used only if the device can't report its supported locales (older Android).
const FALLBACK_LANGS = new Set(['en', 'sw', 'zu', 'af', 'am', 'fr', 'ar', 'pt', 'es', 'zh', 'hi']);

const normalize = (locale) => locale.replace('_', '-');

const resolveLocale = (code, supportedLocales) => {
  const base = CODE_ALIASES[code] || code;

  // Recognition isn't available on this device at all.
  if (supportedLocales && supportedLocales.length === 0) return null;

  // Languages Google's recognizer is known to handle. The device's reported
  // list can omit them, so we still offer the mic and let start() report an
  // error if it truly fails.
  const fallback = FALLBACK_LANGS.has(code) ? PREFERRED_LOCALES[code] || null : null;

  // Device couldn't tell us what it supports.
  if (!supportedLocales) return fallback;

  const matches = supportedLocales.filter(
    (l) => l.toLowerCase().startsWith(`${base.toLowerCase()}-`) || l.toLowerCase() === base.toLowerCase()
  );
  if (!matches.length) return fallback;

  const preferred = PREFERRED_LOCALES[code];
  return matches.find((l) => l === preferred) || matches[0];
};

export default function useVoiceInput({ language, onTranscript }) {
  const [supportedLocales, setSupportedLocales] = useState(null); // null = unknown
  const [isListening, setIsListening] = useState(false);
  const [interim, setInterim] = useState('');

  // Keep the latest callback without re-subscribing to events.
  const onTranscriptRef = useRef(onTranscript);
  onTranscriptRef.current = onTranscript;

  // Ask the device which languages it can recognize.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!ExpoSpeechRecognitionModule.isRecognitionAvailable()) {
          if (!cancelled) setSupportedLocales([]);
          return;
        }
        const { locales } = await ExpoSpeechRecognitionModule.getSupportedLocales({});
        if (!cancelled) setSupportedLocales((locales || []).map(normalize));
      } catch (e) {
        if (!cancelled) setSupportedLocales(null);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const locale = useMemo(
    () => resolveLocale(language.code, supportedLocales),
    [language.code, supportedLocales]
  );

  // Stop listening if the user switches the source language mid-recording.
  useEffect(() => {
    return () => {
      try { ExpoSpeechRecognitionModule.abort(); } catch (e) { /* not running */ }
    };
  }, [locale]);

  useSpeechRecognitionEvent('start', () => setIsListening(true));

  useSpeechRecognitionEvent('end', () => {
    setIsListening(false);
    setInterim('');
  });

  useSpeechRecognitionEvent('result', (event) => {
    const text = event.results?.[0]?.transcript || '';
    if (event.isFinal) {
      setInterim('');
      if (text.trim()) onTranscriptRef.current(text.trim());
    } else {
      setInterim(text);
    }
  });

  useSpeechRecognitionEvent('error', (event) => {
    setIsListening(false);
    setInterim('');
    switch (event.error) {
      case 'aborted':
        break; // user stopped it
      case 'no-speech':
        Alert.alert("Didn't catch that", 'Tap the mic and try speaking again.');
        break;
      case 'not-allowed':
        Alert.alert('Microphone needed', 'Allow microphone access in Settings to use voice input.');
        break;
      case 'language-not-supported':
        Alert.alert('Language not supported', `Voice input isn't available for ${language.name} on this device.`);
        break;
      case 'service-not-allowed':
      case 'network':
        Alert.alert('Voice input unavailable', 'Check your connection or that the Google app is installed and up to date.');
        break;
      default:
        Alert.alert('Voice input error', event.message || 'Something went wrong. Please try again.');
    }
  });

  const toggle = useCallback(async () => {
    if (isListening) {
      ExpoSpeechRecognitionModule.stop();
      return;
    }
    if (!locale) return;

    const permission = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow microphone access in Settings to use voice input.');
      return;
    }

    ExpoSpeechRecognitionModule.start({
      lang: locale,
      interimResults: true,
      continuous: false,
      addsPunctuation: true,
    });
  }, [isListening, locale]);

  return {
    isSupported: !!locale,
    isListening,
    interim,
    toggle,
  };
}
