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
    padding: ${({ theme }) => theme.spacing(2, 1, 3)};
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
`;

const ButtonStyle = styled(Button)`
    /* visibility: ${({ complete }) => (complete ? 'visible' : 'hidden')}; */
`;

export const ProgressModal = ({
    open,
    onClose,
    complete = false,
    progress = 0,
    message = ''
}) => {
    const { t } = useTranslation();

    return (
        <ModalStyle
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500
            }}
        >
            <Fade in={open}>
                <PaperStyle>
                    <div style={{ position: 'relative' }}>
                        {!complete && (
                            <ProgressStyle
                                variant={
                                    progress < 100
                                        ? 'indeterminate'
                                        : 'indeterminate'
                                }
                                value={progress}
                                size={100}
                                thickness={1}
                            />
                        )}
                        <TitleStyle color="textPrimary">{message}</TitleStyle>
                    </div>
                    <ButtonStyle
                        label={t('progress.button.done')}
                        onClick={onClose}
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
