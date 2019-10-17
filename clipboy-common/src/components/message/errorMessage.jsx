import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ErrorIcon from '@material-ui/icons/Error';
import { MessageWithIcon } from './messageWithIcon.jsx';

const ErrorMessageStyle = styled(MessageWithIcon)`
    color: ${({ theme }) => theme.palette.error.main};
`;

const ErrorIconStyle = styled(ErrorIcon)`
    color: ${({ theme }) => theme.palette.error.main};
`;

export const ErrorMessage = ({ className, children, show = false }) => (
    <ErrorMessageStyle className={className} show={show} icon={ErrorIconStyle}>
        {children}
    </ErrorMessageStyle>
);

ErrorMessage.propTypes = {
    label: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    show: PropTypes.bool
};
