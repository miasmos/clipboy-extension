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

export const getTheme = () => {
    const { colors, type, fontSize, fontFamily } = getAppInfo();
    document.body.bgColor = colors.panel;

    return createMuiTheme({
        type,
        typography: {
            fontSize,
            fontFamily: `'Libre Franklin', ${fontFamily}, sans-serif;`
        },
        palette: {
            common: { black: '#000', white: '#fff' },
            background: { paper: '#fff', default: '#fafafa' },
            primary: {
                main: 'rgba(145, 71, 255, 1)',
                contrastText: '#fff'
            },
            secondary: {
                main: 'rgba(0, 0, 0, 0.05)',
                contrastText: 'rgba(0, 0, 0, 0)'
            },
            error: {
                main: 'rgba(233, 25, 22, 1)',
                contrastText: '#fff'
            },
            text: {
                primary: 'rgba(0, 0, 0, 0.87)',
                secondary: 'rgba(0, 0, 0, 0.54)',
                disabled: 'rgba(0, 0, 0, 0.38)',
                hint: 'rgba(0, 0, 0, 0.38)'
            }
        }
    });
};
