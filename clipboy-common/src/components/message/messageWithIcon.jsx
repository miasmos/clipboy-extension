import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const MessageWithIconStyle = styled(Grid)`
    padding: 0.5rem 0;
`;

export const MessageWithIcon = ({
    className,
    children,
    icon: Icon,
    show = false
}) => (
    <MessageWithIconStyle container alignItems="center" spacing={2}>
        <Grid item xs={1}>
            {show && <Icon />}
        </Grid>
        <Grid item xs={11}>
            <Typography className={className} component="div">
                {show ? (
                    children
                ) : (
                    <div>
                        &nbsp;
                        <br />
                        &nbsp;
                    </div>
                )}
            </Typography>
        </Grid>
    </MessageWithIconStyle>
);

MessageWithIcon.propTypes = {
    label: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    show: PropTypes.bool,
    icon: PropTypes.node
};
