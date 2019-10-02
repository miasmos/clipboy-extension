import React from 'react';
import { ThemeProvider } from 'styled-components';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { Reset } from 'styled-reset';
import { Body } from './body.jsx';
import { getTheme } from '../theme';
import { GlobalStyle } from './styles/global';

const theme = getTheme();

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
