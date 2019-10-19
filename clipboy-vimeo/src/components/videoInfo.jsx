import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import Grid from '@material-ui/core/Grid';

const VideoInfoStyle = styled(Grid)`
    padding: 1rem 0;

    img {
        width: 100%;
    }
`;

const TitleStyle = styled(Typography)`
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    max-height: 2.5rem;
`;

export class VideoInfo extends React.Component {
    render() {
        const {
            className,
            css,
            image,
            title,
            author,
            duration,
            loading = true,
            show = true
        } = this.props;
        return show ? (
            <VideoInfoStyle
                className={className}
                css={css}
                container
                spacing={2}
            >
                <Grid item xs={6}>
                    {loading ? (
                        <Skeleton variant="rect" />
                    ) : (
                        <img src={image} />
                    )}
                </Grid>
                <Grid item xs={6}>
                    <TitleStyle component="p">{title}</TitleStyle>
                    <Typography component="p" color="textSecondary">
                        {author}
                    </Typography>
                    <Typography component="p" color="textSecondary">
                        {duration}
                    </Typography>
                </Grid>
            </VideoInfoStyle>
        ) : null;
    }
}

VideoInfoStyle.propTypes = {
    className: PropTypes.string,
    css: PropTypes.object,
    image: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    duration: PropTypes.string,
    loading: PropTypes.bool,
    show: PropTypes.bool
};
