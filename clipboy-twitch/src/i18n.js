import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ENVIRONMENT, LOCALES } from './config';
import { getLocale } from '@common/extendscript';

(async () => {
    const [locale] = await getLocale();
    i18n.use(initReactI18next).init({
        preload: [locale, 'en_US'],
        lng: locale || 'en_US',
        resources: LOCALES,
        fallbackLng: 'en_US',
        keySeparator: false,
        debug: ENVIRONMENT === 'development',
        interpolation: {
            escapeValue: false
        }
    });
})();

export default i18n;
