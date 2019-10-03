import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    html, body {
        box-sizing: border-box;
    }

    h1,h2 {
        font-weight: 700;
    }
    h3,h4,h5,h6 {
        font-weight: 500;
    }
    button {
        font-weight: 500;
    }
`;
