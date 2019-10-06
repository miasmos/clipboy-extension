const pkg = require('../package.json');

export const DOMAIN = process.env.DOMAIN;
export const ENVIRONMENT = process.env.ENV;
export const LOCALES = process.env.LOCALES;
export const PROJECT_NAME = pkg.name;
