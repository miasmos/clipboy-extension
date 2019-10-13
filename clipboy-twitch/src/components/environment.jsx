import React from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { ENVIRONMENT } from '../config';

const EnvironmentStyle = styled(Typography)`
    position: absolute;
    right: 1.25rem;
    top: 1.25rem;
    text-align: right;
    text-transform: uppercase;
`;
export const Environment = () =>
    ENVIRONMENT !== 'production' && (
        <EnvironmentStyle component="h1">{ENVIRONMENT}</EnvironmentStyle>
    );
