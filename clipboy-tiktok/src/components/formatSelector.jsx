import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import { Dropdown } from '@common/components';

const FormatSelectorStyle = styled(Grid)``;

export class FormatSelector extends React.Component {
    onVideoChange = value => {
        const { onVideoChange } = this.props;
        if (onVideoChange) {
            onVideoChange(value);
        }
    };

    componentDidUpdate(prevProps) {
        const { videoValues, videoValue } = this.props;

        // auto-select the first value
        if (
            prevProps.videoValues.length === 0 &&
            videoValues.length > 0 &&
            !videoValue
        ) {
            console.log(videoValues);
            this.onVideoChange(videoValues[0].value);
        }
    }

    render() {
        const {
            className,
            css,
            videoEnabled,
            videoValue,
            videoValues,
            videoLabel,
            show = true
        } = this.props;
        return show ? (
            <FormatSelectorStyle
                className={className}
                css={css}
                container
                spacing={2}
            >
                <Grid item xs={12}>
                    <Dropdown
                        label={videoLabel}
                        value={videoValue}
                        values={videoValues}
                        onChange={this.onVideoChange}
                        enabled={videoEnabled}
                    />
                </Grid>
            </FormatSelectorStyle>
        ) : null;
    }
}

FormatSelector.propTypes = {
    className: PropTypes.string,
    css: PropTypes.object,
    videoValue: PropTypes.string,
    videoValues: PropTypes.array,
    onVideoChange: PropTypes.func,
    videoEnabled: PropTypes.bool,
    videoLabel: PropTypes.string,
    show: PropTypes.bool
};
