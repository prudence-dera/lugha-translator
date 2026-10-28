export default {
  expo: {
    name: "Lugha Translator",
    slug: "lugha-translator",
    owner: "pdera",
    version: "1.2.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      resizeMode: "contain",
      backgroundColor: "#FAFAF8",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.prudencedera.lugha",
      
    },
       android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundImage: "./assets/adaptive-icon-background.png",
        backgroundColor: "#B8411C",
      },
      package: "com.prudencedera.lugha",
    },
      plugins: [
    [
      "expo-image-picker",
      {
        cameraPermission: "Lugha uses your camera to translate text in photos.",
        photosPermission: "Lugha uses your photos to translate text in images.",
      },
    ],
    [
      "expo-speech-recognition",
      {
        microphonePermission: "Lugha uses your microphone so you can speak text to translate.",
        speechRecognitionPermission: "Lugha uses speech recognition to turn your voice into text.",
        androidSpeechServicePackages: ["com.google.android.googlequicksearchbox"],
      },
    ],
  ],
    extra: {
      anthropicKey: process.env.EXPO_PUBLIC_ANTHROPIC_KEY,
      eas: {
        projectId: "95c3d347-7877-4212-a267-c8359f59e2ed"
      },
    },
  },
};