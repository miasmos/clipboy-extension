import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import styled from 'styled-components';
import DateFnsUtils from '@date-io/date-fns';
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider
} from '@material-ui/pickers';

const DateDisplayStyle = styled.div`
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

export const DateDisplay = ({
    value,
    onChange,
    onStill,
    enabled,
    label,
    minDate,
    maxDate
}) => (
    <DateDisplayStyle>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                disableToolbar
                disableFuture
                invalidDateMessage="Invalid date"
                variant="inline"
                inputVariant="filled"
                format="yyyy-MM-dd"
                margin="normal"
                variant="inline"
                minDate={minDate}
                maxDate={maxDate}
                value={value}
                name={label}
                label={label}
                onChange={onChange}
                disabled={!enabled}
                autoOk={true}
            />
        </MuiPickersUtilsProvider>
    </DateDisplayStyle>
);

DateDisplay.propTypes = {
    value: PropTypes.instanceOf(Date),
    onChange: PropTypes.func.isRequired,
    enabled: PropTypes.bool,
    label: PropTypes.string,
    minDate: PropTypes.instanceOf(Date),
    maxDate: PropTypes.instanceOf(Date)
};
