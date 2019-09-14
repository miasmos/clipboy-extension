import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const CheckboxStyle = styled.div`
    display: flex;
    align-items: center;

    .label {
        display: block;
        margin-bottom: 0.1875rem;
        white-space: nowrap;
        margin-right: 5px;
    }

    .checkbox {
        position: relative;
        background-color: ${({ theme }) => theme.colors.input};
        border: 2px solid ${({ theme }) => theme.colors.border};
        opacity: ${({ enabled = true }) => (enabled ? 1 : 0.2)};
        transition: opacity 0.4s;
        height: 1.25rem;
        width: 1.25rem;
        border-radius: 0.3125rem;
        cursor: pointer;
    }

    .check {
        position: absolute;
        height: 100%;
        width: 100%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        opacity: ${({ checked }) => (checked ? 1 : 0)};
        text-align: center;
        font-weight: bold;
        z-index: 2;
    }
`;

export class Checkbox extends React.Component {
    onChange = () => {
        const { onChange, value } = this.props;
        if (onChange) {
            onChange(!value);
        }
    };

    render() {
        const { title, value, enabled = true } = this.props;
        return (
            <CheckboxStyle enabled={enabled} checked={value}>
                <>
                    <p className="label">{title}</p>
                    <div
                        className="checkbox"
                        onClick={this.onChange}
                        disabled={!enabled}
                    >
                        <span className="check">x</span>
                    </div>
                </>
            </CheckboxStyle>
        );
    }
}

Checkbox.propTypes = {
    title: PropTypes.string,
    value: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    enabled: PropTypes.bool
};
