import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ENVIRONMENT, LOCALES } from './config';

i18n.use(new CSInterface().hostEnvironment.appUILocale || 'en_US')
    .use(initReactI18next)
    .init({
        resources: LOCALES,
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
