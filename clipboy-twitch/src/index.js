import React from 'react';
import { render } from 'react-dom';
import { i18nInit } from './i18n';
import { App } from './components/app.jsx';

window.addEventListener('load', async () => {
    await i18nInit();
    render(<App />, document.getElementById('app'));
});
