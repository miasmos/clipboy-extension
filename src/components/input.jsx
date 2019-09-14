import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const InputStyle = styled.div`
    width: 100%;

    label {
        display: block;
        margin-bottom: 0.1875rem;
    }

    input {
        width: 100%;
        margin-bottom: 0.5rem;
        opacity: ${({ enabled = true }) => (enabled ? 1 : 0.2)};
        transition: opacity 0.4s;
    }
`;

export class Input extends React.Component {
    state = { typing: false };
    typingTimeout;

    setStateAsync = state =>
        new Promise(resolve => this.setState(state, resolve));

    onChange = event => {
        const { typing } = this.state;
        const { onChange } = this.props;

        if (!typing) {
            this.setState({ typing: true });
        }
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
        }
        this.typingTimeout = setTimeout(this.onStill, 1000);

        if (onChange) {
            onChange(event.target.value);
        }
    };

    onStill = async () => {
        await this.setStateAsync({ typing: false });
        const { onStill } = this.props;
        if (onStill) {
            onStill();
        }
    };

    render() {
        const { title, name, value, enabled = true } = this.props;
        return (
            <InputStyle enabled={enabled}>
                <>
                    <label htmlFor={name}>{title}</label>
                    <input
                        type="text"
                        name={name}
                        value={value}
                        onChange={this.onChange}
                        disabled={!enabled}
                    />
                </>
            </InputStyle>
        );
    }
}

Input.propTypes = {
    title: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onStill: PropTypes.func,
    enabled: PropTypes.bool
};
