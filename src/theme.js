import { getHostEnvironment } from './extendscript/util/cep';
import { createMuiTheme } from '@material-ui/core/styles';

var color = require('color');

const isDark = color => {
    const average = color.blue + color.green + color.red / 3;
    return average < 255 / 2;
};

const getAppInfo = () => {
    const host = getHostEnvironment();
    const {
        panelBackgroundColor: panel,
        baseFontSize,
        baseFontFamily
    } = host.appSkinInfo;

    return {
        type: isDark(panel.color) ? 'dark' : 'light',
        fontSize: baseFontSize,
        fontFamily: baseFontFamily,
        colors: {
            panel: color
                .rgb(panel.color.red, panel.color.green, panel.color.blue)
                .hex()
        }
    };
};

const light = {
    palette: {
        common: { black: '#000', white: '#fff' },
        primary: {
            main: 'rgba(145, 71, 255, 1)'
        },
        secondary: {
            main: 'rgba(0,0,0,1)'
        },
        error: {
            main: 'rgba(233, 25, 22, 1)'
        },
        text: {
            primary: 'rgba(0, 0, 0, 0.87)',
            secondary: 'rgba(0, 0, 0, 0.54)',
            disabled: 'rgba(0, 0, 0, 0.38)',
            hint: 'rgba(0, 0, 0, 0.38)'
        }
    }
};

const dark = {
    palette: {
        common: { black: '#000', white: '#fff' },
        primary: {
            main: 'rgba(145, 71, 255, 1)'
        },
        secondary: {
            main: 'rgba(255,255,255,1)'
        },
        error: {
            main: 'rgba(233, 25, 22, 1)'
        },
        text: {
            primary: 'rgba(255, 255, 255, 0.87)',
            secondary: 'rgba(255, 255, 255, 0.54)',
            disabled: 'rgba(255, 255, 255, 0.38)',
            hint: 'rgba(255, 255, 255, 0.38)'
        }
    }
};

export const getTheme = () => {
    const { colors, type, fontSize, fontFamily } = getAppInfo();
    document.body.bgColor = colors.panel;
    console.log(type);

    return createMuiTheme({
        type,
        palette: {
            background: { default: colors.panel },
            ...(type === 'dark' ? dark.palette : light.palette)
        },
        typography: {
            fontSize: fontSize,
            fontFamily: `'Ubuntu', ${fontFamily}, sans-serif;`
        },
        secondary: {
            main: 'rgba(0, 0, 0, 0.05)'
        }
    });
};
