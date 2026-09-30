import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, Alert, Animated,
  KeyboardAvoidingView, Platform, Share,
} from 'react-native';
import * as Speech from 'expo-speech';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, TYPOGRAPHY, SHADOWS } from '../components/theme';
import LanguagePicker from '../components/LanguagePicker';
import { detectLanguage, translateText, getPronunciation, translateImage } from '../utils/api';
import { saveTranslation } from '../utils/storage';
import { LANGUAGES } from '../data/languages';

const QUICK_PHRASES = [
  'Hello, how are you?',
  'Thank you very much',
  'Where is the hospital?',
  'I love you',
  'What is your name?',
  'Good morning',
  'Please help me',
];

// Identify the image format from its data (Claude rejects mismatched types)
const detectMediaType = (base64) => {
  if (base64.startsWith('iVBORw0KGgo')) return 'image/png';
  if (base64.startsWith('R0lGOD')) return 'image/gif';
  if (base64.startsWith('UklGR')) return 'image/webp';
  return 'image/jpeg';
};
// Stay under the API's 5 MB per-image limit (base64 string length)
const MAX_BASE64_LENGTH = 4.5 * 1024 * 1024;

export default function TranslatorScreen({ navigation }) {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [pronunciation, setPronunciation] = useState('');
  const [fromLang, setFromLang] = useState(LANGUAGES.find(l => l.code === 'en'));
  const [toLang, setToLang] = useState(LANGUAGES.find(l => l.code === 'sw'));
  const [isTranslating, setIsTranslating] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isLoadingPronunciation, setIsLoadingPronunciation] = useState(false);
  const [showPronunciation, setShowPronunciation] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(null); // 'from' | 'to'
  const [isSpeaking, setIsSpeaking] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const isBusy = isTranslating || isScanning;

  const fadeIn = () => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  };

  const handleDetect = async () => {
    if (!inputText.trim()) return;
    setIsDetecting(true);
    try {
      const detected = await detectLanguage(inputText);
      const match = LANGUAGES.find(l => l.name.toLowerCase() === detected.toLowerCase());
      if (match) setFromLang(match);
      else Alert.alert('Detection', `Detected: ${detected}`);
    } catch (e) {
      Alert.alert('Error', 'Could not detect language.');
    }
    setIsDetecting(false);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    if (fromLang.code === toLang.code) {
      Alert.alert('Same language', 'Please select two different languages.');
      return;
    }
    setIsTranslating(true);
    setTranslatedText('');
    setPronunciation('');
    setShowPronunciation(false);
    try {
      const result = await translateText(inputText, fromLang.name, toLang.name);
      setTranslatedText(result);
      fadeIn();
      await saveTranslation({
        inputText,
        translatedText: result,
        fromLang: fromLang.name,
        toLang: toLang.name,
        fromFlag: fromLang.flag,
        toFlag: toLang.flag,
      });
    } catch (e) {
      Alert.alert('Error', `Translation failed: ${e.message}`);
    }
    setIsTranslating(false);
  };

  // ---------- Camera / photo translation ----------

  const handleCameraPress = () => {
    Alert.alert('Translate text in a photo', 'Choose a source', [
      { text: 'Take photo', onPress: () => pickImage('camera') },
      { text: 'Choose from library', onPress: () => pickImage('library') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const pickImage = async (source) => {
    try {
      const permission = source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permission needed',
          source === 'camera'
            ? 'Allow camera access in Settings to translate photos.'
            : 'Allow photo access in Settings to translate images.'
        );
        return;
      }

      const options = {
        mediaTypes: ['images'],
        allowsEditing: true, // lets the user crop to just the text
        quality: 0.4,
        base64: true,
      };

      const result = source === 'camera'
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);

      if (result.canceled || !result.assets?.length) return;

      const asset = result.assets[0];
      if (!asset.base64) {
        Alert.alert('Error', 'Could not read the image. Try another photo.');
        return;
      }
      if (asset.base64.length > MAX_BASE64_LENGTH) {
        Alert.alert('Image too large', 'Crop closer to the text and try again.');
        return;
      }

      const mediaType = detectMediaType(asset.base64);
      await runImageTranslation(asset.base64, mediaType);
    } catch (e) {
      if (source === 'camera') {
        Alert.alert('Camera unavailable', 'Use "Choose from library" instead.');
      } else {
        Alert.alert('Error', 'Could not open your photos.');
      }
    }
  };

  const runImageTranslation = async (base64, mediaType) => {
    setIsScanning(true);
    setTranslatedText('');
    setPronunciation('');
    setShowPronunciation(false);
    try {
      const { detectedLanguage, originalText, translatedText: result } =
        await translateImage(base64, mediaType, toLang.name);

      if (!originalText?.trim()) {
        Alert.alert('No text found', 'Try a clearer photo with the text in focus.');
        setIsScanning(false);
        return;
      }

      const match = LANGUAGES.find(
        l => l.name.toLowerCase() === (detectedLanguage || '').toLowerCase()
      );
      if (match) setFromLang(match);

      setInputText(originalText);
      setTranslatedText(result);
      fadeIn();

      await saveTranslation({
        inputText: originalText,
        translatedText: result,
        fromLang: match ? match.name : (detectedLanguage || 'Unknown'),
        toLang: toLang.name,
        fromFlag: match ? match.flag : '🌐',
        toFlag: toLang.flag,
      });
      } catch (e) {
      console.log('Image translation error:', e?.message || e);
      Alert.alert('Error', 'Could not translate this image. Please try again.');
      }
    setIsScanning(false);
  };

  // ---------- Output actions ----------

  const handlePronunciation = async () => {
    if (!translatedText) return;
    if (showPronunciation && pronunciation) {
      setShowPronunciation(!showPronunciation);
      return;
    }
    setIsLoadingPronunciation(true);
    try {
      const result = await getPronunciation(translatedText, toLang.name);
      setPronunciation(result);
      setShowPronunciation(true);
    } catch (e) {
      Alert.alert('Error', 'Could not get pronunciation guide.');
    }
    setIsLoadingPronunciation(false);
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      Speech.stop();
      setIsSpeaking(false);
      return;
    }
    if (!translatedText) return;
    setIsSpeaking(true);
    Speech.speak(translatedText, {
      language: toLang.code,
      onDone: () => setIsSpeaking(false),
      onError: () => {
        setIsSpeaking(false);
        Alert.alert('TTS unavailable', `Text-to-speech may not be available for ${toLang.name} on this device.`);
      },
    });
  };

  const handleSwap = () => {
    const prevFrom = fromLang;
    const prevTo = toLang;
    setFromLang(prevTo);
    setToLang(prevFrom);
    if (translatedText) {
      setInputText(translatedText);
      setTranslatedText('');
      setPronunciation('');
      setShowPronunciation(false);
    }
  };

  const handleShare = async () => {
    if (!translatedText) return;
    await Share.share({
      message: `${fromLang.flag} ${inputText}\n${toLang.flag} ${translatedText}\n\nTranslated with Lugha`,
    });
  };

  const handleClear = () => {
    setInputText('');
    setTranslatedText('');
    setPronunciation('');
    setShowPronunciation(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* Language Selector Bar */}
        <View style={styles.langBar}>
          <TouchableOpacity style={styles.langBtn} onPress={() => setPickerOpen('from')}>
            <Text style={styles.langFlag}>{fromLang.flag}</Text>
            <Text style={styles.langName}>{fromLang.name}</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.swapBtn} onPress={handleSwap}>
            <Text style={styles.swapIcon}>⇄</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.langBtn} onPress={() => setPickerOpen('to')}>
            <Text style={styles.langFlag}>{toLang.flag}</Text>
            <Text style={styles.langName}>{toLang.name}</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Phrases */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.phrasesScroll}>
          {QUICK_PHRASES.map(phrase => (
            <TouchableOpacity
              key={phrase}
              style={styles.phraseChip}
              onPress={() => setInputText(phrase)}
            >
              <Text style={styles.phraseText}>{phrase}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Input Card */}
        <View style={[styles.card, styles.inputCard]}>
          <View style={styles.cardHeader}>
            <View style={styles.langBadge}>
              <Text style={styles.langBadgeText}>{fromLang.flag} {fromLang.name}</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.cameraBtn}
                onPress={handleCameraPress}
                disabled={isBusy}
                accessibilityLabel="Translate text in a photo"
              >
                {isScanning
                  ? <ActivityIndicator size="small" color={COLORS.accent} />
                  : <Text style={styles.cameraIcon}>📷</Text>
                }
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.detectBtn}
                onPress={handleDetect}
                disabled={!inputText.trim() || isDetecting}
              >
                {isDetecting
                  ? <ActivityIndicator size="small" color={COLORS.accent} />
                  : <Text style={styles.detectText}>Auto-detect</Text>
                }
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            style={styles.input}
            multiline
            placeholder="Type, paste, or tap 📷 to translate a photo..."
            placeholderTextColor={COLORS.textTertiary}
            value={inputText}
            onChangeText={setInputText}
            textAlignVertical="top"
          />

          <View style={styles.inputFooter}>
            <Text style={styles.charCount}>{inputText.length} chars</Text>
            {inputText.length > 0 && (
              <TouchableOpacity onPress={handleClear}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Translate Button */}
        <TouchableOpacity
          style={[styles.translateBtn, (!inputText.trim() || isBusy) && styles.translateBtnDisabled]}
          onPress={handleTranslate}
          disabled={!inputText.trim() || isBusy}
        >
          {isTranslating
            ? <ActivityIndicator color={COLORS.white} />
            : <Text style={styles.translateBtnText}>Translate</Text>
          }
        </TouchableOpacity>

        {/* Output Card */}
        {(translatedText || isBusy) && (
          <Animated.View style={[styles.card, styles.outputCard, { opacity: translatedText ? fadeAnim : 1 }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.langBadge, styles.langBadgeAccent]}>
                <Text style={styles.langBadgeTextAccent}>{toLang.flag} {toLang.name}</Text>
              </View>
              {translatedText ? (
                <View style={styles.outputActions}>
                  <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
                    <Text style={styles.actionIcon}>↗</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn} onPress={handleSpeak}>
                    <Text style={styles.actionIcon}>{isSpeaking ? '⏹' : '▶'}</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>

            {isBusy && !translatedText ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={COLORS.accent} />
                {isScanning && <Text style={styles.loadingText}>Reading the photo...</Text>}
              </View>
            ) : (
              <Text style={styles.outputText} selectable>{translatedText}</Text>
            )}

            {/* Pronunciation Section */}
            {translatedText ? (
              <TouchableOpacity
                style={styles.pronBtn}
                onPress={handlePronunciation}
                disabled={isLoadingPronunciation}
              >
                {isLoadingPronunciation
                  ? <ActivityIndicator size="small" color={COLORS.accent} />
                  : <Text style={styles.pronBtnText}>
                      {showPronunciation ? '▲ Hide pronunciation' : '🔤 Show pronunciation guide'}
                    </Text>
                }
              </TouchableOpacity>
            ) : null}

            {showPronunciation && pronunciation ? (
              <View style={styles.pronCard}>
                <Text style={styles.pronText}>{pronunciation}</Text>
              </View>
            ) : null}
          </Animated.View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      <LanguagePicker
        visible={pickerOpen === 'from'}
        title="Translate from"
        onSelect={setFromLang}
        onClose={() => setPickerOpen(null)}
      />
      <LanguagePicker
        visible={pickerOpen === 'to'}
        title="Translate to"
        onSelect={setToLang}
        onClose={() => setPickerOpen(null)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: 16 },

  langBar: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 14,
    backgroundColor: COLORS.white, borderRadius: 14, padding: 6,
    borderWidth: 0.5, borderColor: COLORS.border, ...SHADOWS.small,
  },
  langBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8, paddingVertical: 6,
  },
  langFlag: { fontSize: 20, marginRight: 6 },
  langName: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.text },
  chevron: { fontSize: 18, color: COLORS.textTertiary },
  swapBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.accentLight,
    justifyContent: 'center', alignItems: 'center', marginHorizontal: 4,
  },
  swapIcon: { fontSize: 16, color: COLORS.accent },

  phrasesScroll: { marginBottom: 14 },
  phraseChip: {
    backgroundColor: COLORS.white, borderRadius: 20, paddingHorizontal: 14,
    paddingVertical: 7, marginRight: 8, borderWidth: 0.5, borderColor: COLORS.border,
  },
  phraseText: { fontSize: 13, color: COLORS.textSecondary },

  card: {
    backgroundColor: COLORS.white, borderRadius: 16, marginBottom: 12,
    borderWidth: 0.5, borderColor: COLORS.border, ...SHADOWS.small, overflow: 'hidden',
  },
  inputCard: {},
  outputCard: { borderColor: COLORS.accent + '33' },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 14, paddingTop: 12, paddingBottom: 8,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  langBadge: {
    backgroundColor: COLORS.surface, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4,
  },
  langBadgeText: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },
  langBadgeAccent: { backgroundColor: COLORS.accentLight },
  langBadgeTextAccent: { fontSize: 13, color: COLORS.accentText, fontWeight: '500' },

  cameraBtn: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.accentLight,
    justifyContent: 'center', alignItems: 'center',
  },
  cameraIcon: { fontSize: 15 },
  detectBtn: { paddingHorizontal: 10, paddingVertical: 4 },
  detectText: { fontSize: 13, color: COLORS.accent, fontWeight: '500' },

  input: {
    fontSize: 16, color: COLORS.text, padding: 14, minHeight: 110,
    lineHeight: 24,
  },
  inputFooter: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingBottom: 10,
  },
  charCount: { fontSize: 12, color: COLORS.textTertiary },
  clearText: { fontSize: 12, color: COLORS.danger },

  translateBtn: {
    backgroundColor: COLORS.accent, borderRadius: 14, paddingVertical: 14,
    alignItems: 'center', marginBottom: 12, ...SHADOWS.small,
  },
  translateBtnDisabled: { backgroundColor: COLORS.textTertiary },
  translateBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.white, letterSpacing: 0.3 },

  loadingRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    padding: 20, gap: 10,
  },
  loadingText: { fontSize: 14, color: COLORS.textSecondary },

  outputText: { fontSize: 17, color: COLORS.text, padding: 14, lineHeight: 26 },
  outputActions: { flexDirection: 'row', gap: 6 },
  actionBtn: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.surface,
    justifyContent: 'center', alignItems: 'center',
  },
  actionIcon: { fontSize: 14, color: COLORS.accent },

  pronBtn: {
    borderTopWidth: 0.5, borderTopColor: COLORS.border,
    paddingVertical: 10, paddingHorizontal: 14,
  },
  pronBtnText: { fontSize: 13, color: COLORS.accent, fontWeight: '500' },
  pronCard: {
    backgroundColor: COLORS.accentLight, margin: 10, borderRadius: 10, padding: 12,
  },
  pronText: { fontSize: 13, color: COLORS.accentText, lineHeight: 20 },
});
