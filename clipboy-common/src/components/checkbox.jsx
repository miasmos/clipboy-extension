import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MaterialCheckbox from '@material-ui/core/Checkbox';

const CheckboxStyle = styled.div``;

export class Checkbox extends React.Component {
    onChange = () => {
        const { onChange, value } = this.props;
        if (onChange) {
            onChange(!value);
        }
    };

    render() {
        const { label, value, enabled = true } = this.props;
        return (
            <CheckboxStyle enabled={enabled} checked={value}>
                <FormControlLabel
                    label={label}
                    control={
                        <MaterialCheckbox
                            checked={value}
                            onChange={this.onChange}
                            color="primary"
                        />
                    }
                ></FormControlLabel>
            </CheckboxStyle>
        );
    }
}

Checkbox.propTypes = {
    label: PropTypes.string,
    value: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    enabled: PropTypes.bool
};
