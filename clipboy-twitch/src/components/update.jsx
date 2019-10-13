import React from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';
import { DOMAIN, PROJECT_NAME } from '../config';

const UpdateStyle = styled.div``;

const openInBrowser = (event, url) => {
    event.preventDefault();
    new CSInterface().openURLInDefaultBrowser(url);
};

const UpdateComponent = ({ t }) => (
    <UpdateStyle>
        <p>{t('update.message')}</p>
        <a
            href="# "
            onClick={event =>
                openInBrowser(event, `${DOMAIN}/project/${PROJECT_NAME}/latest`)
            }
        >
            {t('update.link')}
        </a>
    </UpdateStyle>
);

export const Update = withTranslation()(UpdateComponent);
