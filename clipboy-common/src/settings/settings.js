import { loadSettings, saveSettings } from '@common/extendscript';

export class SettingsClass {
    constructor() {
        this.io = undefined;
    }

    save = async (settings, name) => {
        if (this.io) {
            return;
        }

        this.io = true;
        const result = await saveSettings(settings, name);
        this.io = false;
        return result;
    };

    load = async name => {
        if (this.io) {
            return;
        }

        this.io = true;
        const [settings = {}] = await loadSettings(name);
        this.io = false;

        // cast integers to type number
        return Object.entries(settings).reduce((prev, [key, value]) => {
            const numberValue = parseInt(value);
            const isNumber =
                !isNaN(numberValue) &&
                String(numberValue).length === value.length;
            prev[key] = isNumber ? numberValue : value;
            return prev;
        }, {});
    };
}

export const settings = new SettingsClass();
