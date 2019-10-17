import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Grid } from '@material-ui/core';
import { Dropdown } from '@common/components';
import { formatTypes } from '../api';

const FormatSelectorStyle = styled(Grid)``;

export class FormatSelector extends React.Component {
    onAudioChange = value => {
        const { onAudioChange } = this.props;
        if (onAudioChange) {
            onAudioChange(value);
        }
    };

    onVideoChange = value => {
        const { onVideoChange } = this.props;
        if (onVideoChange) {
            onVideoChange(value);
        }
    };

    componentDidUpdate(prevProps) {
        const { audioValues, videoValues, audioValue, videoValue } = this.props;

        // auto-select the first combined value
        if (
            prevProps.videoValues.length === 0 &&
            videoValues.length > 0 &&
            !videoValue
        ) {
            console.log(videoValues);
            const { value } =
                videoValues.find(({ type }) => type === formatTypes.BOTH) || {};

            if (value) {
                this.onVideoChange(value);
            } else {
                this.onVideoChange(videoValues[0].value);
            }
        }
        if (
            prevProps.audioValues.length === 0 &&
            audioValues.length > 0 &&
            !audioValue
        ) {
            const { value } = audioValues[0];
            this.onAudioChange(value);
        }
    }

    render() {
        const {
            className,
            css,
            audioEnabled,
            videoEnabled,
            audioValue,
            audioValues,
            videoValue,
            videoValues,

            show = true
        } = this.props;
        return show ? (
            <FormatSelectorStyle
                className={className}
                css={css}
                container
                spacing={1}
            >
                <Grid item xs={6}>
                    <Dropdown
                        label="Video Format"
                        value={videoValue}
                        values={videoValues}
                        onChange={this.onVideoChange}
                        enabled={videoEnabled}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Dropdown
                        label="Audio Format"
                        value={audioValue}
                        values={audioValues}
                        onChange={this.onAudioChange}
                        enabled={audioEnabled}
                    />
                </Grid>
            </FormatSelectorStyle>
        ) : null;
    }
}

FormatSelector.propTypes = {
    className: PropTypes.string,
    css: PropTypes.object,
    audioValue: PropTypes.string,
    videoValue: PropTypes.string,
    videoValues: PropTypes.array,
    audioValues: PropTypes.array,
    onAudioChange: PropTypes.func,
    onVideoChange: PropTypes.func,
    audioEnabled: PropTypes.bool,
    videoEnabled: PropTypes.bool,
    show: PropTypes.bool
};
