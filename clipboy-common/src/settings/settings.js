import { loadSettings, saveSettings } from '@common/extendscript';

export class SettingsClass {
    constructor() {
        this.io = undefined;
    }

    save = async settings => {
        if (this.io) {
            return;
        }

        this.io = true;
        const result = await saveSettings(settings);
        this.io = false;
        return result;
    };

    load = async () => {
        if (this.io) {
            return;
        }

        this.io = true;
        const [settings] = await loadSettings();
        this.io = false;
        return settings;
    };
}

export const settings = new SettingsClass();
