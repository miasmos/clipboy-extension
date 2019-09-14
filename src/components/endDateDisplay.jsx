import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import dayjs from 'dayjs';
import { Input } from './input.jsx';
import { Checkbox } from './checkbox.jsx';
import { Button } from './button.jsx';

const EndDateDisplayStyle = styled.div`
    display: flex;

    .input-wrapper {
        flex-grow: 1;
        margin-right: 0.125rem;
    }

    .button-wrapper {
        display: flex;

        > * {
            margin-left: 0.125rem;
        }
    }
`;

const now = dayjs();

export class EndDateDisplay extends React.Component {
    state = {
        fromStart: true
    };

    render() {
        const { value, start, onChange, onStill, enabled } = this.props;
        const { fromStart } = this.state;
        return (
            <EndDateDisplayStyle>
                <div className="input-wrapper">
                    <Input
                        value={value}
                        name="end"
                        title="end date"
                        onChange={onChange}
                        onStill={onStill}
                        enabled={enabled}
                    />
                </div>
                <div className="button-wrapper">
                    <Checkbox
                        value={fromStart}
                        enabled={enabled}
                        title="from start date:"
                        onChange={value => this.setState({ fromStart: value })}
                    />
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
                            let diff;

                            if (fromStart) {
                                diff = dayjs(start).add(7, 'days');

                                if (diff.isAfter(now)) {
                                    diff = now;
                                }
                            } else {
                                diff = now.subtract(7, 'days');
                            }
                            onChange(diff.format('YYYY-MM-DD'));
                            setTimeout(onStill, 100);
                        }}
                    ></Button>
                    <Button
                        title="Month"
                        enabled={enabled}
                        onClick={() => {
                            let diff;

                            if (fromStart) {
                                diff = dayjs(start).add(30, 'days');

                                if (diff.isAfter(now)) {
                                    diff = now;
                                }
                            } else {
                                diff = now.subtract(30, 'days');
                            }
                            onChange(diff.format('YYYY-MM-DD'));
                            setTimeout(onStill, 100);
                        }}
                    ></Button>
                    <Button
                        title="Year"
                        enabled={enabled}
                        onClick={() => {
                            let diff;

                            if (fromStart) {
                                diff = dayjs(start).add(365, 'days');

                                if (diff.isAfter(now)) {
                                    diff = now;
                                }
                            } else {
                                diff = now.subtract(365, 'days');
                            }
                            onChange(diff.format('YYYY-MM-DD'));
                            setTimeout(onStill, 100);
                        }}
                    ></Button>
                </div>
            </EndDateDisplayStyle>
        );
    }
}

EndDateDisplay.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onStill: PropTypes.func,
    enabled: PropTypes.bool,
    start: PropTypes.string.isRequired
};
