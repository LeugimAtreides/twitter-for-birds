// For Later Reference : https://www.codeandweb.com/babeledit/tutorials/how-to-translate-your-react-app-with-react-i18next
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './locales';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'english',
    lng: 'english',
    resources,

    debug: false,

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    react: {
      wait: true,
    },
  });


export default i18n;
