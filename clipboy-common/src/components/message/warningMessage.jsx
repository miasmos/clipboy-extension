import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import WarningIcon from '@material-ui/icons/Warning';
import { MessageWithIcon } from './messageWithIcon.jsx';

const WarningMessageStyle = styled(MessageWithIcon)`
    color: ${({ theme }) => theme.palette.warning.main};
`;

const WarningIconStyle = styled(WarningIcon)`
    color: ${({ theme }) => theme.palette.warning.main};
`;

export const WarningMessage = ({ className, children, show = false }) => (
    <WarningMessageStyle
        className={className}
        show={show}
        icon={WarningIconStyle}
    >
        {children}
    </WarningMessageStyle>
);

WarningMessage.propTypes = {
    label: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    show: PropTypes.bool
};
