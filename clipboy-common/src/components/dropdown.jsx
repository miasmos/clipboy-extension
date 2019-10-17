import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const DropdownStyle = styled(FormControl)`
    width: 100%;
`;

export class Dropdown extends React.Component {
    onChange = event => {
        const { onChange } = this.props;
        if (onChange) {
            onChange(event.target.value);
        }
    };

    render() {
        const {
            className,
            css,
            label,
            values,
            value,
            enabled = true
        } = this.props;
        return (
            <DropdownStyle
                variant="filled"
                className={className}
                css={css}
                disabled={!enabled}
            >
                <InputLabel htmlFor={label}>{label}</InputLabel>
                <Select
                    value={value || ''}
                    onChange={this.onChange}
                    inputProps={{
                        name: label,
                        id: label
                    }}
                >
                    {values.map(({ label, value }) => (
                        <MenuItem key={value} value={value}>
                            {label}
                        </MenuItem>
                    ))}
                </Select>
            </DropdownStyle>
        );
    }
}

Dropdown.propTypes = {
    className: PropTypes.string,
    css: PropTypes.object,
    label: PropTypes.string,
    value: PropTypes.any,
    values: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    enabled: PropTypes.bool
};
