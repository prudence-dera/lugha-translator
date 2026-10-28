export const LANGUAGES = [
  // African Languages
  { code: 'sw', name: 'Swahili', region: 'East Africa', speakers: '200M', flag: '🇹🇿', group: 'african' },
  { code: 'zu', name: 'Zulu', region: 'South Africa', speakers: '12M', flag: '🇿🇦', group: 'african' },
  { code: 'xh', name: 'Xhosa', region: 'South Africa', speakers: '10M', flag: '🇿🇦', group: 'african' },
  { code: 'yo', name: 'Yoruba', region: 'West Africa', speakers: '50M', flag: '🇳🇬', group: 'african' },
  { code: 'ha', name: 'Hausa', region: 'West Africa', speakers: '70M', flag: '🇳🇬', group: 'african' },
  { code: 'ig', name: 'Igbo', region: 'Nigeria', speakers: '44M', flag: '🇳🇬', group: 'african' },
  { code: 'am', name: 'Amharic', region: 'Ethiopia', speakers: '57M', flag: '🇪🇹', group: 'african' },
  { code: 'sn', name: 'Shona', region: 'Zimbabwe', speakers: '15M', flag: '🇿🇼', group: 'african' },
  { code: 'st', name: 'Sesotho', region: 'Lesotho / South Africa', speakers: '8M', flag: '🇱🇸', group: 'african' },
  { code: 'tw', name: 'Twi', region: 'Ghana', speakers: '9M', flag: '🇬🇭', group: 'african' },
  { code: 'wo', name: 'Wolof', region: 'Senegal', speakers: '12M', flag: '🇸🇳', group: 'african' },
  { code: 'so', name: 'Somali', region: 'Somalia / Horn of Africa', speakers: '21M', flag: '🇸🇴', group: 'african' },
  { code: 'rw', name: 'Kinyarwanda', region: 'Rwanda', speakers: '12M', flag: '🇷🇼', group: 'african' },
  { code: 'ln', name: 'Lingala', region: 'Congo / DRC', speakers: '20M', flag: '🇨🇩', group: 'african' },
  { code: 'af', name: 'Afrikaans', region: 'South Africa', speakers: '7M', flag: '🇿🇦', group: 'african' },
  { code: 'nd', name: 'Ndebele', region: 'Zimbabwe / South Africa', speakers: '2M', flag: '🇿🇼', group: 'african' },
  { code: 'ny', name: 'Chichewa', region: 'Malawi / Zambia', speakers: '12M', flag: '🇲🇼', group: 'african' },
  // Added after closed-test feedback
  { code: 'om', name: 'Oromo', region: 'Ethiopia / Kenya', speakers: '45M', flag: '🇪🇹', group: 'african' },
  { code: 'ti', name: 'Tigrinya', region: 'Eritrea / Ethiopia', speakers: '9M', flag: '🇪🇷', group: 'african' },
  { code: 'ki', name: 'Kikuyu', region: 'Kenya', speakers: '8M', flag: '🇰🇪', group: 'african' },
  { code: 'lg', name: 'Luganda', region: 'Uganda', speakers: '11M', flag: '🇺🇬', group: 'african' },
  { code: 'ff', name: 'Fula', region: 'West & Central Africa', speakers: '40M', flag: '🇬🇳', group: 'african' },
  { code: 'tn', name: 'Setswana', region: 'Botswana / South Africa', speakers: '8M', flag: '🇧🇼', group: 'african' },
  { code: 'rn', name: 'Kirundi', region: 'Burundi', speakers: '12M', flag: '🇧🇮', group: 'african' },
  { code: 'mg', name: 'Malagasy', region: 'Madagascar', speakers: '25M', flag: '🇲🇬', group: 'african' },
  { code: 'bem', name: 'Bemba', region: 'Zambia', speakers: '4M', flag: '🇿🇲', group: 'african' },
  { code: 'bm', name: 'Bambara', region: 'Mali', speakers: '15M', flag: '🇲🇱', group: 'african' },
  { code: 'ts', name: 'Tsonga', region: 'South Africa / Mozambique', speakers: '7M', flag: '🇿🇦', group: 'african' },
  { code: 'fan', name: 'Fang', region: 'Gabon / Equatorial Guinea / Cameroon', speakers: '1M', flag: '🇬🇦', group: 'african' },
  { code: 'pcm', name: 'Nigerian Pidgin', region: 'Nigeria / West Africa', speakers: '100M+', flag: '🇳🇬', group: 'african' },
  { code: 'wes', name: 'Cameroonian Pidgin', region: 'Cameroon', speakers: '12M', flag: '🇨🇲', group: 'african' },

  // International
  { code: 'en', name: 'English', region: 'Global', speakers: '1.5B', flag: '🌍', group: 'international' },
  { code: 'fr', name: 'French', region: 'Global', speakers: '300M', flag: '🇫🇷', group: 'international' },
  { code: 'ar', name: 'Arabic', region: 'Middle East / Africa', speakers: '420M', flag: '🇸🇦', group: 'international' },
  { code: 'pt', name: 'Portuguese', region: 'Global', speakers: '250M', flag: '🇧🇷', group: 'international' },
  { code: 'es', name: 'Spanish', region: 'Global', speakers: '500M', flag: '🇪🇸', group: 'international' },
  { code: 'zh', name: 'Mandarin', region: 'China', speakers: '1.1B', flag: '🇨🇳', group: 'international' },
  { code: 'hi', name: 'Hindi', region: 'India', speakers: '600M', flag: '🇮🇳', group: 'international' },
  // Added after closed-test feedback
  { code: 'de', name: 'German', region: 'Europe', speakers: '130M', flag: '🇩🇪', group: 'international' },
  { code: 'it', name: 'Italian', region: 'Europe', speakers: '65M', flag: '🇮🇹', group: 'international' },
  { code: 'ru', name: 'Russian', region: 'Europe / Asia', speakers: '255M', flag: '🇷🇺', group: 'international' },
  { code: 'tr', name: 'Turkish', region: 'Turkey', speakers: '90M', flag: '🇹🇷', group: 'international' },
  { code: 'ja', name: 'Japanese', region: 'Japan', speakers: '125M', flag: '🇯🇵', group: 'international' },
  { code: 'ko', name: 'Korean', region: 'Korea', speakers: '80M', flag: '🇰🇷', group: 'international' },
];

export const getLanguageByCode = (code) => LANGUAGES.find(l => l.code === code);
export const getLanguageByName = (name) => LANGUAGES.find(l => l.name === name);
