import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button } from './button.jsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const ModalStyle = styled(Modal)`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const PaperStyle = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: ${({ theme }) => theme.palette.background.default};
    border: 0.125rem solid #000;
    box-shadow: ${({ theme }) => theme.shadows[5]};
    padding: ${({ theme }) => theme.spacing(1, 1, 3)};
    outline: 0;
    border-radius: 10px;
    border: 0;
`;

const ProgressStyle = styled(CircularProgress)`
    margin: ${({ theme }) => theme.spacing(2)}px;
`;

const TitleStyle = styled(Typography)`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: opacity 0.2s;
`;

const ButtonStyle = styled(Button)`
    && {
        transition: opacity 0.2s;
        cursor: default;
        opacity: 0;

        ${({ complete }) =>
            complete
                ? `
        opacity: 1;
        cursor: pointer;
    `
                : ''};
    }
`;

export const ProgressModal = ({
    open,
    onClose,
    complete = false,
    progress = 0,
    message = '',
    completeMessage = ''
}) => {
    const { t } = useTranslation();
    const loading = progress < 100;
    const started = progress > 0;

    return (
        <ModalStyle
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            disableBackdropClick
            disableEscapeKeyDown
            keepMounted
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500
            }}
        >
            <Fade in={open}>
                <PaperStyle>
                    <div style={{ position: 'relative' }}>
                        <Fade in={!complete}>
                            <ProgressStyle
                                variant="indeterminate"
                                value={progress}
                                size={100}
                                thickness={1}
                            />
                        </Fade>

                        <Fade
                            in={complete || (loading && started && !complete)}
                        >
                            <TitleStyle
                                color="textPrimary"
                                progress={progress}
                                variant="h6"
                            >
                                {!complete ? message : completeMessage}
                            </TitleStyle>
                        </Fade>
                    </div>
                    <ButtonStyle
                        label={t('progress.button.done')}
                        onClick={complete ? onClose : undefined}
                        complete={complete}
                    />
                </PaperStyle>
            </Fade>
        </ModalStyle>
    );
};

ProgressModal.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    message: PropTypes.string,
    progress: PropTypes.number,
    complete: PropTypes.bool
};
