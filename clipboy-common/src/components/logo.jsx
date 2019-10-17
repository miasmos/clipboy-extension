import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Logo as LogoSvg } from './svg';

const LogoStyle = styled.div`
    position: absolute;
    overflow: hidden;
    top: 0;
    left: 0;

    .background {
        transition: fill 0.3s;
    }

    ${({ size }) => `
        width: ${size}rem;
        height: ${size}rem;
    `}
`;

const LogoSvgStyle = styled(LogoSvg)`
    position: absolute;
    transition: transform 0.3s;

    ${({ size }) => `
        transform: translate(-${size * 0.1}rem,-${size * 0.1}rem);
    `}

    &:hover {
        transform: translate(0, 0);
    }
`;

export const Logo = ({ className, css, size = 5 }) => (
    <LogoStyle className={className} css={css} size={size}>
        <LogoSvgStyle size={size} />
    </LogoStyle>
);

Logo.propTypes = {
    className: PropTypes.string,
    css: PropTypes.object,
    size: PropTypes.number
};
