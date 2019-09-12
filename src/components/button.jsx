import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ButtonStyle = styled.div`
    width: 100%;
    margin-top: 0.625rem;
    opacity: ${({ enabled = true }) => (enabled ? 1 : 0.2)};
    transition: opacity 0.4s;

    button {
        width: 100%;
        cursor: ${({ enabled = true }) => (enabled ? 'pointer' : 'initial')};
    }
`;

export const Button = ({ title, onClick, enabled = true }) => (
    <ButtonStyle enabled={enabled}>
        <button onClick={() => enabled && onClick && onClick()}>{title}</button>
    </ButtonStyle>
);

Button.propTypes = {
    title: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    enabled: PropTypes.bool,
    style: PropTypes.object
};
