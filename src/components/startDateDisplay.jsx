import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { Input } from './input.jsx';
import { Button } from './button.jsx';

const StartDateDisplayStyle = styled.div`
    display: flex;

    .input-wrapper {
        flex-grow: 1;
    }

    .button-wrapper {
        display: flex;

        > * {
            margin-left: 0.125rem;
        }
    }
`;

const now = dayjs();

export const StartDateDisplay = ({ value, onChange, onStill, enabled }) => (
    <StartDateDisplayStyle>
        <div className="input-wrapper">
            <Input
                value={value}
                name="start"
                title="start date"
                onChange={onChange}
                onStill={onStill}
                enabled={enabled}
            />
        </div>
        <div className="button-wrapper">
            <Button
                title="Today"
                enabled={enabled}
                onClick={() => {
                    onChange(now.format('YYYY-MM-DD'));
                    setTimeout(onStill, 100);
                }}
            ></Button>
            <Button
                title="Week"
                enabled={enabled}
                onClick={() => {
                    onChange(now.subtract(7, 'days').format('YYYY-MM-DD'));
                    setTimeout(onStill, 100);
                }}
            ></Button>
            <Button
                title="Month"
                enabled={enabled}
                onClick={() => {
                    onChange(now.subtract(30, 'days').format('YYYY-MM-DD'));
                    setTimeout(onStill, 100);
                }}
            ></Button>
            <Button
                title="Year"
                enabled={enabled}
                onClick={() => {
                    onChange(now.subtract(365, 'days').format('YYYY-MM-DD'));
                    setTimeout(onStill, 100);
                }}
            ></Button>
        </div>
    </StartDateDisplayStyle>
);

StartDateDisplay.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onStill: PropTypes.func,
    enabled: PropTypes.bool
};
