import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { Reset } from 'styled-reset';
import { Body } from './body.jsx';
import { getTheme } from '../theme';
import { GlobalStyle } from './styles/global';

export const App = () => {
    return (
        <ThemeProvider theme={getTheme()}>
            <>
                <Reset />
                <GlobalStyle />
                <Body />
            </>
        </ThemeProvider>
    );
};
