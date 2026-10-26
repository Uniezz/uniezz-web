export default {
  locales: ['en', 'pl', 'uk', 'ru'],
  extract: {
    primaryLanguage: 'en',
    input: 'src/**/*.{js,jsx,ts,tsx}',
    output: 'src/locales/{{language}}/{{namespace}}.json',
  },
};
