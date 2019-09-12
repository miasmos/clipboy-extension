import React from 'react';
import styled from 'styled-components';

const ReloadStyled = styled.button`
    position: fixed;
    bottom: 0.9375rem;
    right: 0.9375rem;
    width: 20px;
    height: 20px;
    padding: 0;
    border: none;

    &:highlight {
        border: none;
    }
`;

export const Reload = () => (
    <ReloadStyled onClick={() => history.go(0)}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 496 496"
            preserveAspectRatio="none"
        >
            <path d="M248.45,0A247.12,247.12,0,0,1,419.31,68.69L455,33c15.12-15.12,41-4.41,41,17V184a24,24,0,0,1-24,24H337.94c-21.38,0-32.09-25.85-17-41l41.75-41.75A166.73,166.73,0,0,0,249.49,80C157.09,79.21,79.21,154,80,249.45,80.76,340,154.18,416,248,416a166.74,166.74,0,0,0,110.63-41.56A12,12,0,0,1,375,375l39.66,39.66a12,12,0,0,1-.48,17.43A247.1,247.1,0,0,1,248,496C111,496,0,385,0,248,0,111.19,111.65-.24,248.45,0Z" />
        </svg>
    </ReloadStyled>
);
