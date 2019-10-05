import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ENVIRONMENT } from './constants';

const en = require('../static/locales/en/translations.json');

i18n.use(new CSInterface().hostEnvironment.appUILocale || 'en_US')
    .use(initReactI18next)
    .init({
        resources: {
            en_US: { translation: en }
        },
        fallbackLng: 'en_US',
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
