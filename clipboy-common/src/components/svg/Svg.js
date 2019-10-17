import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const SvgStyle = styled.div`
    ${({ size }) => `
        width: ${size}rem;
        height: ${size}rem;
    `}

    .transparent {
        fill: none;
    }
`;

export const Svg = ({ className, css, size, color, children }) => (
    <SvgStyle className={className} css={css} size={size} color={color}>
        {children}
    </SvgStyle>
);

Svg.propTypes = {
    className: PropTypes.string,
    css: PropTypes.string,
    size: PropTypes.number,
    color: PropTypes.string,
    children: PropTypes.node
};
