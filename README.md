# 🌍 Lugha Translator

<p align="center">
  <img 
    src="https://github.com/user-attachments/assets/96ce11b9-bac6-483b-aa8f-8f1d37aa2431"
    alt="Lugha Translator"
    width="650"
  />
</p>


**Lugha** means "language" in Swahili. This app is a mobile-first, AI-powered translator focused on African languages, helping bridge communication gaps across the continent and beyond.

> **Status:** In closed testing on Google Play. Public release coming soon.

## Why This App?

Most translation tools treat African languages as an afterthought. Lugha puts them front and center, with 15 African languages including Swahili, Yoruba, Zulu, Amharic, Hausa, and more. Built for real users, not just as a demo.

## Features

- 🔄 **AI Translation** — Powered by Claude (Anthropic) for high-quality, context-aware translations
- 📷 **Photo Translation** — Snap a photo or pick an image of a sign, menu, or document, and Lugha reads the text and translates it
- 🔍 **Auto Language Detection** — Paste any text and the app identifies the language automatically
- 🔤 **Pronunciation Guide** — Get phonetic guides and pronunciation tips for any translated text
- 🔊 **Text-to-Speech** — Listen to translations using native device TTS
- 📖 **Translation History** — All translations saved locally, swipeable and deletable
- 🌍 **Language Explorer** — Browse all 22 languages with speaker counts and AI-generated cultural info
- ↗ **Share Translations** — Share directly to any app

## Languages Supported

### African Languages (15)

| Language | Region | Speakers |
|---|---|---|
| Swahili | East Africa | 200M |
| Hausa | West Africa | 70M |
| Amharic | Ethiopia | 57M |
| Yoruba | Nigeria/West Africa | 50M |
| Igbo | Nigeria | 44M |
| Somali | Horn of Africa | 21M |
| Lingala | Congo/DRC | 20M |
| Shona | Zimbabwe | 15M |
| Zulu | South Africa | 12M |
| Kinyarwanda | Rwanda | 12M |
| Wolof | Senegal | 12M |
| Xhosa | South Africa | 10M |
| Twi | Ghana | 9M |
| Sesotho | Lesotho/SA | 8M |
| Afrikaans | South Africa | 7M |

### International Languages (7)

English, French, Arabic, Portuguese, Spanish, Mandarin, Hindi

## Tech Stack

- **React Native (Expo SDK 54)** — cross-platform iOS & Android
- **Claude API (Anthropic)** — translation, detection, pronunciation, language info, and reading text in images (vision)
- **expo-image-picker** — camera and photo library access for photo translation
- **expo-speech** — text-to-speech
- **AsyncStorage** — local translation history
- **React Navigation** — bottom tab navigation
- **EAS Build** — production Android builds for Google Play

## Getting Started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com)
- Expo Go on an Android device, or the iOS Simulator / Android Emulator (the project uses Expo SDK 54, so Expo Go must support SDK 54)

### Installation

```bash
git clone https://github.com/prudence-dera/lugha-translator
cd lugha-translator
npm install
```

### Add your API key

Create a `.env` file in the project root:

```
EXPO_PUBLIC_ANTHROPIC_KEY=your_key_here
```

`app.config.js` passes this key to the app, and `src/utils/api.js` reads it automatically. No code changes are needed.

> **Note:** Variables prefixed with `EXPO_PUBLIC_` are bundled into the app and can be extracted. That's acceptable for development and closed testing, but a production release should route requests through a backend proxy so the key never ships in the client.

### Run the app

```bash
npx expo start
```

Press `i` to open the iOS Simulator, `a` for the Android Emulator, or scan the QR code with Expo Go.

### Build for Android

```bash
eas build --platform android --profile production
```

For EAS cloud builds, store the key as an EAS environment variable instead of relying on `.env`:

```bash
eas env:create --name EXPO_PUBLIC_ANTHROPIC_KEY --environment production --visibility sensitive
```

## Project Structure

```
lugha-translator/
├── App.js                       # Root with navigation
├── app.config.js                # Expo config (package name, permissions, plugins)
├── eas.json                     # EAS Build profiles
├── docs/
│   └── privacy-policy.html      # Privacy policy (hosted on GitHub Pages)
├── src/
│   ├── screens/
│   │   ├── TranslatorScreen.js  # Main translation UI, including photo translation
│   │   ├── HistoryScreen.js     # Saved translations
│   │   └── LanguagesScreen.js   # Language explorer
│   ├── components/
│   │   ├── LanguagePicker.js    # Modal language selector
│   │   └── theme.js             # Colors, typography
│   ├── utils/
│   │   ├── api.js               # Claude API calls (text and image)
│   │   └── storage.js           # AsyncStorage helpers
│   └── data/
│       └── languages.js         # Language metadata
```

## Privacy

Lugha has no accounts, ads, or analytics. Text and photos you translate are sent to Anthropic's Claude API to produce results, and translation history stays on your device. Read the full [privacy policy](https://prudence-dera.github.io/lugha-translator/privacy-policy.html).

## Future Improvements

- [x] Camera translation (point camera at text)
- [ ] Offline mode for common phrases
- [ ] Voice input (speech-to-text)
- [ ] Dark mode
- [ ] Favorite/starred translations
- [ ] Backend proxy for API key security

## About

Built by Prudence Dera as part of an AI portfolio project, and published on Google Play under PDTech Labs. Made with React Native, Expo, and the Claude API by Anthropic.

## License

MIT
