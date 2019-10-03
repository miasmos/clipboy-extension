import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ENVIRONMENT } from './constants';

const en = require('../static/locales/en/translations.json');

i18n.use(new CSInterface().hostEnvironment.appUILocale || 'en')
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en }
        },
        fallbackLng: 'en',
        keySeparator: '|',
        debug: ENVIRONMENT === 'development',
        interpolation: {
            escapeValue: false
        },
        react: {
            wait: true
        }
    });

export default i18n;
