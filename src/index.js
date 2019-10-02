import React from 'react';
import './i18n';
import { render } from 'react-dom';
import { App } from './components/app.jsx';

window.addEventListener('load', () => {
    render(<App />, document.getElementById('app'));
});
