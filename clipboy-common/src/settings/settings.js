import { loadSettings, saveSettings } from '@common/extendscript';

export class SettingsClass {
    constructor() {
        this.io = undefined;
    }

    save = async settings => {
        if (this.io) {
            return;
        }

        const { start, end, target, count, mode } = settings;
        this.io = true;
        const result = await saveSettings({ start, end, target, count, mode });
        this.io = false;
        return result;
    };

    load = async () => {
        if (this.io) {
            return;
        }

        this.io = true;
        const [{ start, end, target, count, mode } = {}] = await loadSettings();
        this.io = false;
        return {
            start: start ? new Date(start) : new Date(),
            end: end ? new Date(end) : new Date(),
            target,
            count: Number(count),
            mode
        };
    };
}

export const settings = new SettingsClass();
