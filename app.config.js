export default {
  expo: {
    name: "Lugha Translator",
    slug: "lugha-translator",
    owner: "pdera",
    version: "1.0.0",
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
      infoPlist: {
        NSSpeechRecognitionUsageDescription: "Used for text-to-speech playback",
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#FAFAF8",
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
    ],
    extra: {
      anthropicKey: process.env.EXPO_PUBLIC_ANTHROPIC_KEY,
      eas: {
        projectId: "95c3d347-7877-4212-a267-c8359f59e2ed"
      },
    },
  },
};