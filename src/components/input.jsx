import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const InputStyle = styled.div`
    width: 100%;

    label {
        display: block;
        margin-bottom: 0.1875rem;
    }

    input {
        width: 100%;
        margin-bottom: 0.5rem;
        opacity: ${({ enabled = true }) => (enabled ? 1 : 0.2)};
        transition: opacity 0.4s;
    }
`;

export const Input = ({ title, name, value, onChange, enabled = true }) => (
    <InputStyle enabled={enabled}>
        <>
            <label htmlFor={name}>{title}</label>
            <input
                type="text"
                name={name}
                value={value}
                onChange={event => onChange(event.target.value)}
                disabled={!enabled}
            />
        </>
    </InputStyle>
);

Input.propTypes = {
    title: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    enabled: PropTypes.bool
};
