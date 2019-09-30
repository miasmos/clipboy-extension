import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ProgressStyle = styled.div`
    position: fixed;
    width: 100%;
    height: 1.875rem;
    left: 0;
    bottom: 0;
    z-index: 2;
    transition: opacity 0.5s;
    opacity: ${({ show }) => (show ? 1 : 0)};

    .foreground {
        position: absolute;
        /* background-color: ${({ theme }) => theme.colors.input}; */
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        transition: width 0.2s linear;
        width: 100%;
    }

    .status {
        position: absolute;
        left: 0.3125rem;
        top: 50%;
        transform: translateY(-50%);
        z-index: 3;
    }
`;

export const Progress = ({ caption, show }) => (
    <ProgressStyle caption={caption} show={show}>
        <div className="status">{caption}</div>
        <div className="foreground"></div>
    </ProgressStyle>
);

Progress.propTypes = {
    captions: PropTypes.array,
    progress: PropTypes.number,
    show: PropTypes.bool
};
