import React from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';
import { Logo, Input, Button, ProgressModal } from '@common/components';
import { WarningMessage, ErrorMessage } from '@common/components/message';
import {
    importMedia,
    getProjectPath,
    addTwitchMetaData,
    getSep
} from '@common/extendscript';
import { FormatSelector } from './formatSelector.jsx';
import { VideoInfo } from './videoInfo.jsx';
import { save, load } from '@common/settings';
import { Environment } from './environment.jsx';
import { getMedia, getVideoInfo, formatTypes } from '../api';

const qs = require('qs');
const pkg = require('../../package.json');
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const BodyStyle = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 3.75rem 1.25rem 1.25rem 1.25rem;
    overflow-x: hidden;

    .target-group {
        position: relative;
    }

    .target-switch {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        margin-top: 0.1875rem;
    }

    .target-input .MuiInputBase-input {
        padding-right: 4.5rem;
    }
`;

const ImportButton = styled(Button)`
    && {
        padding-left: 0.3125rem;
        padding-right: 0.3125rem;
    }
`;

class BodyComponent extends React.Component {
    state = {
        loading: false,
        working: false,
        id: '',
        idIsValid: false,
        formatIsCombined: false,
        videoInfo: {},
        audioFormat: undefined,
        videoFormat: undefined,
        audioFormatDisabled: false,
        audioFormatIsValid: false,
        videoFormatIsValid: false,
        bytesTotal: 0,
        bytesCurrent: 0,
        progress: 0,
        formIsValid: false,
        hasError: false,
        error: '',
        complete: false
    };

    setStateAsync = state =>
        new Promise(resolve => this.setState(state, resolve));

    importClips = async () => {
        const { formIsValid } = this.state;
        if (!formIsValid) {
            return;
        }

        try {
            const { id, audioFormat, videoFormat } = this.state;
            await this.setStateAsync({
                working: true,
                complete: false,
                error: '',
                hasError: false
            });
            const seperator = await getSep();
            const [path] = await getProjectPath();
            const fullPath = path.substring(0, path.lastIndexOf(seperator));
            const filePath = `${fullPath}${seperator}`;

            try {
                const videoFormatData = this.getFormat(videoFormat);
                const audioFormatData = this.getFormat(audioFormat);

                let bytesTotal = 0;
                let { clen = 0 } = videoFormatData;
                bytesTotal += Number(clen);
                if (videoFormatData.type !== formatTypes.BOTH) {
                    ({ clen = 0 } = audioFormatData);
                    bytesTotal += Number(clen);
                }

                await this.setStateAsync({
                    bytesTotal: Number(bytesTotal),
                    bytesCurrent: 0
                });
                await getMedia(
                    id,
                    videoFormatData,
                    filePath,
                    this.updateProgress
                );

                if (videoFormatData.type !== formatTypes.BOTH) {
                    await getMedia(
                        id,
                        audioFormatData,
                        filePath,
                        this.updateProgress
                    );
                }
            } catch (error) {
                console.error(error);
            }
            await importMedia(fullPath, 'mp4|m4a|mp3');
            // await addTwitchMetaData(data);
            await this.setStateAsync({
                complete: true
            });
        } catch (error) {
            const { message } = error;
            console.error(error);
            this.setState({
                working: false,
                hasError: true,
                error: message,
                bytesCurrent: 0,
                bytesTotal: 0,
                progress: 0,
                complete: true
            });
        }
    };

    updateProgress = (bytesAdded = 0) => {
        const { bytesTotal, bytesCurrent } = this.state;
        const updatedBytesCurrent = bytesCurrent + bytesAdded;
        this.setState({
            bytesCurrent: updatedBytesCurrent,
            progress:
                bytesTotal === 0 ? 0 : (updatedBytesCurrent / bytesTotal) * 100
        });
    };

    async componentDidMount() {
        await this.load();
        await this.save();
        this.updateFormValidity();
    }

    save = async () => {
        await save(this.state, pkg.name);
    };

    load = async () => {
        const state = await load(pkg.name);
        await this.setStateAsync(state);
    };

    updateFormValidity = () => {
        const {
            idIsValid,
            audioFormatIsValid,
            videoFormatIsValid
        } = this.state;
        return this.setStateAsync({
            formIsValid: idIsValid && audioFormatIsValid && videoFormatIsValid,
            error: '',
            hasError: false
        });
    };

    resetProgress = async () => {
        await this.setStateAsync({
            working: false,
            progress: 0,
            bytesCurrent: 0
        });

        // wait for modal to close
        await wait(500);
        this.setState({
            complete: false
        });
    };

    onIdChange = async value => {
        let id = value;
        const isUrl = value.includes('?');

        if (isUrl) {
            const params = value.substring(value.indexOf('?') + 1);
            const parsedQuery = qs.parse(params);
            if ('v' in parsedQuery) {
                id = parsedQuery.v;
            }
        }

        const idIsValid = id.length >= 11 && id.length <= 12;
        await this.setStateAsync({
            id,
            idIsValid,
            loading: idIsValid,
            ...(idIsValid && {
                videoInfo: {},
                videoFormat: undefined,
                audioFormat: undefined,
                audioFormatIsValid: false,
                videoFormatIsValid: false
            })
        });

        if (idIsValid) {
            this.updateVideoInfo(id);
        }

        await this.updateFormValidity();
        this.save();
    };

    updateVideoInfo = async id => {
        try {
            const videoInfo = await getVideoInfo(id);
            console.log(videoInfo);
            await this.setStateAsync({
                videoInfo,
                loading: false
            });
            this.save();
        } catch (error) {
            let { message } = error;
            const { t } = this.props;

            switch (message) {
                case 'This video requires payment to watch.':
                    message = 'error.youtube.payment';
                    break;
                case 'This video is unavailable':
                    message = 'error.youtube.unavailable';
                    break;
                default:
                    message = 'error.generic';
                    break;
            }
            console.error(error);
            this.setState({
                hasError: true,
                error: t(message),
                loading: false
            });
        }
    };

    onVideoFormatChange = async videoId => {
        let audioId;
        const { type } = this.getFormat(videoId);
        const formatIsCombined = type === formatTypes.BOTH;
        if (type === formatTypes.BOTH) {
            audioId = videoId;
        }
        await this.setStateAsync({
            videoFormat: videoId,
            videoFormatIsValid: videoId.length > 0,
            audioFormatDisabled: false,
            formatIsCombined,
            ...(audioId && {
                audioId,
                audioFormatIsValid: videoId.length > 0,
                audioFormatDisabled: true
            })
        });
        await this.updateFormValidity();
        this.save();
    };

    onAudioFormatChange = async audioId => {
        await this.setStateAsync({
            audioFormat: audioId,
            audioFormatIsValid: audioId.length > 0
        });
        await this.updateFormValidity();
        this.save();
    };

    getFormat = id => {
        const { videoInfo: { lookup = {} } = {} } = this.state;
        if (id in lookup) {
            return lookup[id];
        }
        return undefined;
    };

    render() {
        const {
            id,
            idIsValid,
            formIsValid,
            formatIsCombined,
            videoInfo,
            audioFormatDisabled,
            videoFormat,
            audioFormat,
            hasError,
            loading,
            progress,
            error,
            working,
            complete
        } = this.state;
        const { t } = this.props;
        const {
            formats: { video = [], audio = [] } = {},
            thumbnail = '',
            title = '',
            author = '',
            duration = ''
        } = videoInfo;

        return (
            <BodyStyle working={working}>
                <Environment />
                <Logo />
                <Input
                    className="id-input"
                    value={id}
                    name="id"
                    label={t('form.field.id.label')}
                    onChange={this.onIdChange}
                    onStill={this.save}
                    enabled={!working}
                />
                <VideoInfo
                    image={thumbnail}
                    title={title}
                    author={author}
                    duration={duration}
                    loading={loading}
                    show={idIsValid}
                />
                <FormatSelector
                    audioValue={audioFormat}
                    videoValue={videoFormat}
                    videoValues={video}
                    audioValues={audio}
                    audioEnabled={audio.length > 0 && !audioFormatDisabled}
                    videoEnabled={video.length > 0}
                    onAudioChange={this.onAudioFormatChange}
                    onVideoChange={this.onVideoFormatChange}
                    show={idIsValid && video.length > 0}
                />
                {!hasError && (
                    <WarningMessage show={videoFormat && !formatIsCombined}>
                        {t('form.warning.speed')}
                    </WarningMessage>
                )}
                {hasError && (
                    <ErrorMessage show={hasError}>{t(error)}</ErrorMessage>
                )}

                <ImportButton
                    label={t('form.button.submit')}
                    enabled={!working && formIsValid}
                    onClick={this.importClips}
                />
                <ProgressModal
                    open={working}
                    onClose={this.resetProgress}
                    message={t('progress.progress.percent', {
                        percent: parseFloat(progress).toFixed(2)
                    })}
                    completeMessage={t('progress.message.done')}
                    progress={progress}
                    complete={complete}
                />
            </BodyStyle>
        );
    }
}

export const Body = withTranslation()(BodyComponent);
