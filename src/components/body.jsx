import React from 'react';
import styled from 'styled-components';
import { Reload } from './reload.jsx';
import { Input } from './input.jsx';
import { Button } from './button.jsx';
import { StartDateDisplay } from './startDateDisplay.jsx';
import { EndDateDisplay } from './endDateDisplay.jsx';
import { Progress } from './progress.jsx';
import {
    importTwitchClips,
    getProjectPath,
    addTwitchMetaData
} from '../extendscript/Premiere';
import { settings } from '../settings';
import { clips } from '../api';

const BodyStyle = styled.div`
    background-color: ${({ theme }) => theme.colors.background};
    padding: 0.3125rem;
`;

export class Body extends React.Component {
    state = {
        working: false,
        path: '',
        oauth: 'l0vmpckj22o9xdk003tytq9xw0swgk',
        game: 'Overwatch',
        start: '2019-09-09',
        end: '2019-09-16',
        count: '30',
        progress: 0,
        captions: [
            'get project path',
            'fetch clips',
            'import clips',
            'add metadata'
        ]
    };
    setStateAsync = state =>
        new Promise(resolve => this.setState(state, resolve));

    importClips = async () => {
        const { oauth, game, start, end, count } = this.state;
        await this.setStateAsync({ working: true, progress: 0 });
        const [path] = await getProjectPath();
        const fullPath =
            path.substring(0, path.lastIndexOf('\\')) + '\\media\\twitch';
        await this.setStateAsync({ progress: 1 });
        const data = await clips(
            oauth,
            game,
            fullPath.replace('\\\\?\\', ''),
            start,
            end,
            count
        );
        await this.setStateAsync({ progress: 2 });
        await importTwitchClips(fullPath);
        await this.setStateAsync({ progress: 3 });
        await addTwitchMetaData(data);
        await this.setStateAsync({ progress: 4, working: false });
        setTimeout(() => this.setState({ progress: 0 }), 500);
    };

    async componentDidMount() {
        await this.load();
        await this.save();
    }

    save = async () => {
        await settings.save(this.state);
    };

    load = async () => {
        const { start, end, oauth, game, count } = await settings.load();
        await this.setStateAsync({
            start: start ? start : this.state.start,
            end: end ? end : this.state.end,
            oauth: oauth ? oauth : this.state.oauth,
            game: game ? game : this.state.game,
            count: count ? count : this.state.count
        });
    };

    render() {
        const {
            oauth,
            game,
            start,
            end,
            count,
            working,
            captions,
            progress
        } = this.state;
        return (
            <BodyStyle>
                <Input
                    value={oauth}
                    name="oauth"
                    title="oauth"
                    onChange={value => this.setState({ oauth: value })}
                    onStill={this.save}
                    enabled={!working}
                />
                <Input
                    value={game}
                    name="game"
                    title="game"
                    onChange={value => this.setState({ game: value })}
                    onStill={this.save}
                    enabled={!working}
                />
                <StartDateDisplay
                    value={start}
                    onChange={value => this.setState({ start: value })}
                    onStill={this.save}
                    enabled={!working}
                />
                <EndDateDisplay
                    value={end}
                    onChange={value => this.setState({ end: value })}
                    onStill={this.save}
                    enabled={!working}
                    start={start}
                />
                <Input
                    value={count.toString()}
                    name="count"
                    title="video count"
                    onChange={value => this.setState({ count: value })}
                    onStill={this.save}
                    enabled={!working}
                />
                <Button
                    title="Import"
                    enabled={!working}
                    onClick={this.importClips}
                />
                <Progress
                    captions={captions}
                    progress={progress}
                    show={working}
                />
                <Reload />
            </BodyStyle>
        );
    }
}
