import React from 'react';
import { ThemeProvider } from 'styled-components';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { Reset } from 'styled-reset';
import { Body } from './body.jsx';
import { getTheme } from '@common/theme';
import { GlobalStyle } from '@common/styles';

const pkg = require('../../package.json');
const theme = getTheme(pkg.name);

export const App = () => {
    return (
        <MuiThemeProvider theme={theme}>
            <ThemeProvider theme={theme}>
                <>
                    <Reset />
                    <GlobalStyle />
                    <Body />
                </>
            </ThemeProvider>
        </MuiThemeProvider>
    );
};
