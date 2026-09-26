import Constants from 'expo-constants';

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
const API_KEY = Constants.expoConfig?.extra?.anthropicKey
  || process.env.EXPO_PUBLIC_ANTHROPIC_KEY;

const callClaude = async (prompt, systemPrompt = '') => {
  const response = await fetch(ANTHROPIC_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
       model: 'claude-sonnet-4-5',
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
     if (!response.ok) {
    const body = await response.text();
    throw new Error(`API error ${response.status}: ${body}`);
  }
  const data = await response.json();
  return data.content?.[0]?.text?.trim() || '';
};

export const detectLanguage = async (text) => {
  return await callClaude(
    `What language is this text written in? Reply with ONLY the language name (e.g. "Swahili", "English", "Yoruba"). Text: "${text}"`,
    'You are a language detection expert. Reply with only the language name, nothing else.'
  );
};

export const translateText = async (text, fromLang, toLang) => {
  return await callClaude(
    `Translate the following text from ${fromLang} to ${toLang}. Return ONLY the translated text, no labels, no explanations, no quotes.\n\nText: ${text}`,
    'You are an expert translator. Return only the translated text.'
  );
};

export const getPronunciation = async (text, language) => {
  return await callClaude(
    `Give a simple pronunciation guide for this ${language} text: "${text}"\n\nFormat your response as:\nPhonetic: [phonetic spelling using simple English sounds]\nTips: [1-2 short pronunciation tips specific to ${language}]\n\nKeep it brief and practical for a beginner.`,
    'You are a language pronunciation expert. Be concise and practical.'
  );
};

export const getLanguageInfo = async (languageName) => {
  return await callClaude(
    `Give me a 2-sentence description of the ${languageName} language — where it's spoken, and one interesting cultural fact. Be concise.`,
    'You are a linguistics expert. Be brief and interesting.'
  );
};

export const translateImage = async (base64, mediaType, toLang) => {
  const raw = await callClaude(
    [
      {
        type: 'image',
        source: { type: 'base64', media_type: mediaType, data: base64 },
      },
      {
        type: 'text',
        text: `Read all the text in this image and translate it into ${toLang}. Respond with ONLY a JSON object, no markdown, in exactly this shape: {"detectedLanguage": "<language of the text>", "originalText": "<the text as it appears>", "translatedText": "<translation into ${toLang}>"}. If there is no readable text, use empty strings.`,
      },
    ],
    'You read text in images and translate it accurately. Respond with valid JSON only.'
  );
  const start = raw.indexOf('{');
  const end = raw.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error(`No JSON in response: ${raw.slice(0, 200)}`);
  return JSON.parse(raw.slice(start, end + 1));
};