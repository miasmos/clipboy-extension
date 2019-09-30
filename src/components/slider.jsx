import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import MaterialSlider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

const SliderStyle = styled.div`
    width: 100%;
    margin-top: 0.625rem;
`;

export class Slider extends Component {
    state = { sliding: false };
    slidingTimeout;

    setStateAsync = state =>
        new Promise(resolve => this.setState(state, resolve));

    onChange = (event, value) => {
        const { sliding } = this.state;
        const { onChange } = this.props;

        if (!sliding) {
            this.setState({ sliding: true });
        }
        if (this.slidingTimeout) {
            clearTimeout(this.slidingTimeout);
        }
        this.slidingTimeout = setTimeout(this.onStill, 1000);

        if (onChange) {
            onChange(value);
        }
    };

    onStill = async () => {
        await this.setStateAsync({ sliding: false });
        const { onStill } = this.props;
        if (onStill) {
            onStill();
        }
    };

    render() {
        const {
            label,
            onClick,
            enabled = true,
            step,
            min,
            max,
            defaultValue,
            marks
        } = this.props;

        return (
            <SliderStyle>
                {label && (
                    <Typography id={label} gutterBottom>
                        {label}
                    </Typography>
                )}
                <MaterialSlider
                    step={step}
                    color="primary"
                    onClick={onClick}
                    disabled={!enabled}
                    valueLabelDisplay="auto"
                    min={min}
                    max={max}
                    defaultValue={defaultValue}
                    marks={marks}
                    onChange={this.onChange}
                    disabled={!enabled}
                />
            </SliderStyle>
        );
    }
}

Slider.propTypes = {
    label: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onStill: PropTypes.func,
    enabled: PropTypes.bool,
    style: PropTypes.object,
    step: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    defaultValue: PropTypes.number,
    marks: PropTypes.oneOfType([PropTypes.array, PropTypes.bool])
};
