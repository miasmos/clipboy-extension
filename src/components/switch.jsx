import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import MaterialSwitch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export const Switch = ({ label, value, onChange, enabled = true }) => (
    <FormGroup>
        <FormControlLabel
            control={
                <MaterialSwitch
                    size="small"
                    checked={value}
                    onChange={(event, value) => {
                        onChange(value);
                    }}
                    disabled={!enabled}
                    color="primary"
                />
            }
            label={label}
        />
    </FormGroup>
);

Switch.propTypes = {
    label: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onStill: PropTypes.func,
    enabled: PropTypes.bool,
    value: PropTypes.bool
};
