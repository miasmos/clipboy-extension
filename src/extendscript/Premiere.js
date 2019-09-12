// this file exports the methods in Premiere.jsx

import { evalJsxScript } from './util/cep';

export const getVersionInfo = () => evalJsxScript('getVersionInfo');

export const updateEventPanel = message =>
    evalJsxScript('updateEventPanel', message);

export const getProjectPath = () => evalJsxScript('getProjectPath');

export const importTwitchClips = fullPath =>
    evalJsxScript('importTwitchClips', fullPath);

export const addTwitchMetaData = data =>
    evalJsxScript('addTwitchMetaData', data);
