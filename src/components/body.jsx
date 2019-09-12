import React from 'react';
import styled from 'styled-components';
import { Reload } from './reload.jsx';
import { Input } from './input.jsx';
import { Button } from './button.jsx';
import { Progress } from './progress.jsx';
import {
    importTwitchClips,
    getProjectPath,
    addTwitchMetaData
} from '../extendscript/Premiere';
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
        const { oauth, game, start, count } = this.state;
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
            count
        );
        await this.setStateAsync({ progress: 2 });
        await importTwitchClips(fullPath);
        await this.setStateAsync({ progress: 3 });
        await addTwitchMetaData(data);
        await this.setStateAsync({ progress: 4, working: false });
        setTimeout(() => this.setState({ progress: 0 }), 500);
    };

    render() {
        const {
            oauth,
            game,
            start,
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
                    enabled={!working}
                />
                <Input
                    value={game}
                    name="game"
                    title="game"
                    onChange={value => this.setState({ game: value })}
                    enabled={!working}
                />
                <Input
                    value={start}
                    name="start"
                    title="start date"
                    onChange={value => this.setState({ start: value })}
                    enabled={!working}
                />
                <Input
                    value={count.toString()}
                    name="count"
                    title="video count"
                    onChange={value => this.setState({ count: value })}
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
