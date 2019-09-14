import { loadSettings, saveSettings } from './extendscript/Premiere';

export class SettingsClass {
    io;

    save = async settings => {
        if (this.io) {
            return;
        }

        const { start, end, oauth, game, count } = settings;
        this.io = true;
        const result = await saveSettings({ start, end, oauth, game, count });
        this.io = false;
        return result;
    };

    load = async () => {
        if (this.io) {
            return;
        }

        this.io = true;
        const [{ start, end, oauth, game, count } = {}] = await loadSettings();
        this.io = false;
        return { start, end, oauth, game, count };
    };
}

export const settings = new SettingsClass();
