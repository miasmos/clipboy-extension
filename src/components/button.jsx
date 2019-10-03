import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import MaterialButton from '@material-ui/core/Button';

const ButtonStyle = styled(MaterialButton)``;

export const Button = ({ className, css, label, onClick, enabled = true }) => (
    <ButtonStyle
        css={css}
        variant="contained"
        color="primary"
        onClick={onClick}
        disabled={!enabled}
        className={className}
    >
        {label}
    </ButtonStyle>
);

Button.propTypes = {
    label: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    enabled: PropTypes.bool,
    style: PropTypes.object,
    className: PropTypes.string,
    css: PropTypes.object
};
