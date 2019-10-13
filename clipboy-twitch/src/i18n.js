import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ENVIRONMENT, LOCALES } from './config';

i18n.use(initReactI18next).init({
    preload: ['en_US'],
    lang: new CSInterface().hostEnvironment.appUILocale || 'en_US',
    resources: LOCALES,
    fallbackLng: 'en_US',
    keySeparator: false,
    debug: ENVIRONMENT === 'development',
    interpolation: {
        escapeValue: false
    }
});

export default i18n;
