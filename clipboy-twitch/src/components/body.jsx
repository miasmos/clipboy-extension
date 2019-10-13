import React from 'react';
import styled from 'styled-components';
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';
import { withTranslation } from 'react-i18next';
import {
    Logo,
    Input,
    Button,
    Slider,
    Switch,
    DateDisplay,
    ProgressModal
} from '@common/components';
import { Environment } from './environment.jsx';
import {
    importTwitchClips,
    getProjectPath,
    addTwitchMetaData,
    getSep
} from '@common/extendscript';
import { settings } from '@common/settings';
import { getClipMetadata, getClips } from '../api';

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
        working: false,
        path: '',
        target: '',
        targetIsValid: false,
        start: new Date(),
        startIsValid: false,
        end: new Date(),
        endIsValid: false,
        count: 30,
        countIsValid: true,
        progress: 0,
        mode: false,
        formIsValid: false,
        hasError: false,
        error: '',
        currentItem: 0,
        totalItems: 1,
        progress: 0,
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
            const { target, start, end, count, mode } = this.state;
            await this.setStateAsync({
                working: true,
                complete: false,
                error: '',
                hasError: false
            });
            const seperator = await getSep();
            const [path] = await getProjectPath();
            const fullPath = path.substring(0, path.lastIndexOf('\\'));
            const data = await getClipMetadata(target, start, end, mode, count);
            await this.setStateAsync({ totalItems: data.length || 1 });
            const filePath = `${fullPath}${seperator}`;
            try {
                await getClips(data, filePath, this.updateProgress);
            } catch (error) {
                console.error(error);
            }
            await importTwitchClips(fullPath);
            await addTwitchMetaData(data);
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
                currentItem: 0,
                totalItems: 1,
                progress: 0,
                complete: true
            });
        }
    };

    async componentDidMount() {
        await this.load();
        await this.save();
        this.updateFormValidity();
    }

    save = async () => {
        await settings.save(this.state);
    };

    load = async () => {
        const { start, end, target, count, mode } = await settings.load();
        const init = {
            start: start ? new Date(start) : this.state.start,
            end: end ? new Date(end) : this.state.end,
            target: target ? target : this.state.target,
            count: count ? Number(count) : this.state.count,
            mode: mode ? mode : this.state.mode
        };
        await this.setStateAsync({
            ...init,
            startIsValid: init.end instanceof Date,
            endIsValid: init.end instanceof Date,
            targetIsValid: !!(
                target &&
                typeof target === 'string' &&
                target.length > 0
            ),
            countIsValid: !!(count && !isNaN(count) && count > 0)
        });
    };

    updateProgress = () => {
        const { currentItem, totalItems } = this.state;
        this.setState({
            currentItem: currentItem + 1,
            progress: ((currentItem + 1) / totalItems) * 100
        });
    };

    resetProgress = async () => {
        await this.setStateAsync({
            working: false
        });

        // wait for modal to close
        await wait(500);
        this.setState({
            complete: false,
            currentItem: 0,
            totalItems: 1,
            progress: 0
        });
    };

    updateFormValidity = () => {
        const {
            targetIsValid,
            startIsValid,
            endIsValid,
            countIsValid
        } = this.state;
        this.setState({
            formIsValid:
                targetIsValid && startIsValid && endIsValid && countIsValid,
            error: '',
            hasError: false
        });
    };

    render() {
        const {
            target,
            start,
            end,
            count,
            working,
            mode,
            formIsValid,
            hasError,
            error,
            currentItem,
            totalItems,
            progress,
            complete
        } = this.state;
        const { t } = this.props;

        return (
            <BodyStyle working={working}>
                <Environment />
                <Logo />
                <FormGroup className="target-group">
                    <Input
                        className="target-input"
                        value={target}
                        name="target"
                        label={
                            mode
                                ? t('form.field.broadcaster.label')
                                : t('form.field.game.label')
                        }
                        onChange={async value => {
                            await this.setStateAsync({
                                target: value,
                                targetIsValid: value.length > 0
                            });
                            this.updateFormValidity();
                        }}
                        onStill={this.save}
                        enabled={!working}
                    />
                    <Switch
                        className="target-switch"
                        onChange={async value => {
                            await this.setStateAsync({
                                mode: value,
                                target: '',
                                targetIsValid: false,
                                formIsValid: false
                            });
                            this.save();
                        }}
                        enabled={!working}
                        value={mode}
                    />
                </FormGroup>
                <DateDisplay
                    value={start}
                    onChange={async value => {
                        await this.setStateAsync({
                            start: value,
                            startIsValid: value instanceof Date
                        });
                        this.updateFormValidity();
                        this.save();
                    }}
                    onStill={this.save}
                    enabled={!working}
                    maxDate={end}
                    label={t('form.field.startDate.label')}
                    name="startDate"
                    error={t('form.field.startDate.invalid')}
                />
                <DateDisplay
                    value={end}
                    onChange={async value => {
                        await this.setStateAsync({
                            end: value,
                            endIsValid: value instanceof Date
                        });
                        this.updateFormValidity();
                        this.save();
                    }}
                    enabled={!working}
                    minDate={start}
                    label={t('form.field.endDate.label')}
                    name="endDate"
                    error={t('form.field.endDate.invalid')}
                />
                <Slider
                    defaultValue={count}
                    step={10}
                    min={10}
                    max={100}
                    marks={true}
                    onChange={async value => {
                        await this.setStateAsync({
                            count: value,
                            countIsValid: count >= 10 && count <= 100
                        });
                        this.updateFormValidity();
                    }}
                    enabled={!working}
                    label={t('form.field.clipCount.label')}
                    name="clipCount"
                />
                <Typography color="error" component="div">
                    {hasError ? t(error) : <div>&nbsp;</div>}
                </Typography>

                <ImportButton
                    label={t('form.button.submit')}
                    enabled={!working && formIsValid}
                    onClick={this.importClips}
                />
                <ProgressModal
                    open={working}
                    onClose={this.resetProgress}
                    message={t('progress.progress.clipsleft', {
                        current: currentItem,
                        total: totalItems
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
