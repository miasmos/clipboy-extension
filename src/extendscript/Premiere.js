// this file exports the methods in Premiere.jsx

import { evalJsxScript } from './util/cep';
export const {
    getVersionInfo,
    getProjectPath,
    importTwitchClips,
    addTwitchMetaData,
    loadSettings,
    saveSettings,
    log,
    clearLog,
    getSep
} = evalJsxScript;
