import React from 'react';
import styled from 'styled-components';
import FormGroup from '@material-ui/core/FormGroup';
import Typography from '@material-ui/core/Typography';
import { Reload } from './reload.jsx';
import { Input } from './input.jsx';
import { Button } from './button.jsx';
import { Slider } from './slider.jsx';
import { Switch } from './switch.jsx';
import { DateDisplay } from './DateDisplay.jsx';
import { Progress } from './progress.jsx';
import {
    importTwitchClips,
    getProjectPath,
    addTwitchMetaData,
    createTwitchClip,
    log
} from '../extendscript/Premiere';
import { settings } from '../settings';
import { clips, getClip } from '../api';

const BodyStyle = styled.div`
    padding: 0.3125rem;
`;

export class Body extends React.Component {
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
        caption: '',
        mode: false,
        formIsValid: false,
        hasError: false,
        message: ''
    };

    setStateAsync = state =>
        new Promise(resolve => this.setState(state, resolve));

    importClips = async () => {
        try {
            const { target, start, end, count, mode } = this.state;
            await this.setStateAsync({ working: true, caption: 'get path' });
            // const [path] = await getProjectPath();
            // const fullPath = path.substring(0, path.lastIndexOf('\\'));
            // await this.setStateAsync({ caption: 'get clip urls' });
            const data = await clips(target, start, end, mode, count);
            console.log(data);
            // await this.setStateAsync({ caption: 'get clip data' });
            // const clipData = await getClip(data[0].clip_url);
            // await log(JSON.stringify(clipData));
            // console.log(clipData.body);

            // await this.setStateAsync({ caption: 'write clip to disk' });
            // await createTwitchClip(data[0].id, fullPath, clipData);
            // await log(data[0].clip_url);
            // await this.setStateAsync({ caption: 'import clip to premiere' });
            // await importTwitchClips(fullPath);
            // await this.setStateAsync({ caption: 'add metadata' });
            // await addTwitchMetaData(data, {
            //     start,
            //     end,
            //     target
            // });
            await this.setStateAsync({ working: false });
            setTimeout(() => this.setState({ caption: '' }), 500);
        } catch (error) {
            const { message } = error;
            console.log(message, error);
            this.setState({
                working: false,
                caption: '',
                hasError: true,
                message: message || error
            });
        }
    };

    async componentDidMount() {
        await this.load();
        await this.save();
    }

    save = async () => {
        await settings.save(this.state);
    };

    load = async () => {
        const { start, end, target, count, mode } = await settings.load();
        await this.setStateAsync({
            start: start ? start : this.state.start,
            startIsValid: start ? true : false,
            end: end ? end : this.state.end,
            endIsValid: end ? true : false,
            target: target ? target : this.state.target,
            targetIsValid: target && target.length > 0 ? true : false,
            count: count ? count : this.state.count,
            countIsValid: true,
            mode: mode ? mode : this.state.mode
        });
        this.updateFormValidity();
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
                targetIsValid && startIsValid && endIsValid && countIsValid
        });
    };

    render() {
        const {
            target,
            start,
            end,
            count,
            working,
            caption,
            mode,
            formIsValid,
            hasError,
            message
        } = this.state;

        return (
            <BodyStyle>
                <FormGroup>
                    <Input
                        value={target}
                        name="target"
                        label={mode ? 'Broadcaster' : 'Game'}
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
                    label="Start"
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
                    label="End"
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
                    label="Clips"
                />
                {hasError && message && (
                    <Typography color="error">{message}</Typography>
                )}
                <Button
                    label="Import"
                    enabled={!working && formIsValid}
                    onClick={this.importClips}
                />
                <Progress caption={caption} show={working} />
                <Reload />
            </BodyStyle>
        );
    }
}
