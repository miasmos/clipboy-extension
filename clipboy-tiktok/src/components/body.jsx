import React from 'react';
import styled from 'styled-components';
import { withTranslation } from 'react-i18next';
import { Logo, Input, Button, ProgressModal } from '@common/components';
import { ErrorMessage } from '@common/components/message';
import {
    importMedia,
    getProjectPath,
    addMediaMetaData,
    getSep
} from '@common/extendscript';
import { FormatSelector } from './formatSelector.jsx';
import { VideoInfo } from './videoInfo.jsx';
import { save, load } from '@common/settings';
import { Environment } from './environment.jsx';
import { getMedia } from '../api';

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
        margin-top: 3.5rem;
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
        videoInfo: {},
        videoFormat: undefined,
        videoFormatIsValid: false,
        progress: 0,
        formIsValid: false,
        hasError: false,
        error: '',
        complete: false,
        clientId: Math.random()
            .toString(36)
            .substring(2)
    };

    setStateAsync = state =>
        new Promise(resolve => this.setState(state, resolve));

    importClips = async () => {
        const { formIsValid } = this.state;
        if (!formIsValid) {
            return;
        }

        try {
            const { id, videoFormat } = this.state;
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
                const { url } = this.getFormat(videoFormat);
                console.log(url);
                await writeVideo(url, filePath, id);
            } catch (error) {
                console.error(error);
            }
            await importMedia(fullPath, 'mp4');

            const { author, title, url } = this.state.videoInfo;
            await addMediaMetaData([
                {
                    filename: id,
                    source: url,
                    title,
                    contributor: author
                }
            ]);
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
                progress: 0,
                complete: true
            });
        }
    };

    async componentDidMount() {
        await this.load();
        await this.save();
        this.updateFormValidity();

        const { clientId } = this.state;
        const userFeed = await getMedia('nonstopeats', clientId);
        console.log(userFeed);
    }

    save = async () => {
        await save(this.state, pkg.name);
    };

    load = async () => {
        const state = await load(pkg.name);
        await this.setStateAsync({
            ...state,
            id: 'id' in state ? String(state.id) : '',
            videoFormat:
                'videoFormat' in state ? String(state.videoFormat) : undefined
        });
    };

    updateFormValidity = () => {
        const { idIsValid, videoFormatIsValid } = this.state;
        return this.setStateAsync({
            formIsValid: idIsValid && videoFormatIsValid,
            error: '',
            hasError: false
        });
    };

    resetProgress = async () => {
        await this.setStateAsync({
            working: false,
            progress: 0
        });

        // wait for modal to close
        await wait(500);
        this.setState({
            complete: false
        });
    };

    onIdChange = async value => {
        const oldId = this.state.id;
        let id = value;
        const isUrl = value.includes('://');
        const pastedId =
            value.length - oldId.length === 8 ||
            value.length - oldId.length === 9;

        if (pastedId) {
            id = value.substring(oldId.length);
        } else if (isUrl) {
            const hasQuery = value.includes('?');
            if (hasQuery) {
                id = value.substring(
                    value.lastIndexOf('/') + 1,
                    value.lastIndexOf('?')
                );
            } else {
                id = value.substring(value.lastIndexOf('/') + 1);
            }
        }

        const idIsValid = id.length >= 8 && id.length <= 9;
        await this.setStateAsync({
            id,
            idIsValid,
            loading: idIsValid,
            ...(idIsValid && {
                videoInfo: {},
                videoFormat: undefined,
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
            console.error(error);
            this.setState({
                hasError: true,
                error: t(message),
                loading: false
            });
        }
    };

    onVideoFormatChange = async videoId => {
        await this.setStateAsync({
            videoFormat: videoId,
            videoFormatIsValid: videoId.length > 0
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
            videoInfo,
            videoFormat,
            hasError,
            loading,
            progress,
            error,
            working,
            complete
        } = this.state;
        const { t } = this.props;
        const {
            formats: { video = [] } = {},
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
                    videoValue={videoFormat}
                    videoValues={video}
                    videoEnabled={video.length > 0}
                    videoLabel={t('form.field.video.label')}
                    onVideoChange={this.onVideoFormatChange}
                    show={idIsValid && video.length > 0}
                />
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
