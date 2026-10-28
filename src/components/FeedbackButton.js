import React from 'react';
import { TouchableOpacity, Text, Linking, Alert, Platform } from 'react-native';
import Constants from 'expo-constants';
import { COLORS } from './theme';

// TODO: replace with your support email (the one on your Play Store listing)
const FEEDBACK_EMAIL = 'prudence.dee.dev@gmail.com';

export default function FeedbackButton() {
  const openFeedback = async () => {
    const version = Constants.expoConfig?.version ?? '';
    const subject = encodeURIComponent(`Lugha Translator feedback (v${version})`);
    const body = encodeURIComponent(
      `Tell us what worked, what didn't, or a language you'd like added:\n\n\n` +
      `---\nApp version: ${version}\nDevice: ${Platform.OS} ${Platform.Version}`
    );
    try {
      await Linking.openURL(`mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`);
    } catch {
            Alert.alert('Send feedback', `No email app found. Email us at ${FEEDBACK_EMAIL}`);
    }
  };

  return (
    <TouchableOpacity
      onPress={openFeedback}
      style={{ paddingHorizontal: 16, paddingVertical: 6 }}
      accessibilityRole="button"
      accessibilityLabel="Send feedback"
    >
      <Text style={{ color: COLORS.accent, fontWeight: '600', fontSize: 15 }}>Feedback</Text>
    </TouchableOpacity>
  );
}
