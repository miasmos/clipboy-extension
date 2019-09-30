import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import MaterialButton from '@material-ui/core/Button';

const ButtonStyle = styled.div`
    width: 100%;
    margin-top: 0.625rem;
`;

export const Button = ({ label, onClick, enabled = true }) => (
    <ButtonStyle>
        <MaterialButton
            variant="contained"
            color="primary"
            onClick={onClick}
            disabled={!enabled}
        >
            {label}
        </MaterialButton>
    </ButtonStyle>
);

Button.propTypes = {
    label: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    enabled: PropTypes.bool,
    style: PropTypes.object
};
