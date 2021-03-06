// @flow

import React, { Component } from 'react';
import { Ball } from './Ball';
import { Store, type BallState } from './store';
import { DisplayValues } from './DisplayValues';
import { RerenderCounter } from './RerenderCounter';

const randomColor = () => '#xxxxxx'.replace(/x/g, () => Math.floor(Math.random() * 16).toString(16));
const updateBall = (overrides: $Shape<{| ...BallState |}>) =>
    Store.set(({ ball }) => ({ ball: { ...ball, ...overrides } }));

const stopEventPropagation = event => event.stopPropagation();

type AppProps = {||};
type AppState = { recording: boolean, replaying: boolean, recorded: Array<{ top: number, left: number }> };

export class App extends Component<AppProps, AppState> {
    state: AppState = { recording: false, replaying: false, recorded: [] };
    delegateBall = (event: any) => {
        const nextPosition = { top: event.clientY + window.scrollY, left: event.clientX + window.scrollX };
        if (this.state.recording) this.setState(state => ({ recorded: [...state.recorded, nextPosition] }));
        updateBall({ position: nextPosition });
    };
    record = () => this.setState(state => ({ recording: !state.recording }));
    replay = () => {
        if (this.state.recorded.length) {
            this.setState({ replaying: true });
            this.state.recorded.forEach((v, i) =>
                window.setTimeout(() => updateBall({ position: v, color: randomColor() }), i * 500)
            );
            window.setTimeout(() => this.setState({ replaying: false }), this.state.recorded.length * 500);
        }
    };
    deleteRecords = () => this.state.recorded.length && this.setState({ recorded: [] });
    changeColor = () => updateBall({ color: randomColor() });
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Welcome to react-rewired</h1>
                </header>
                <button className="record" onClick={this.record} disabled={this.state.replaying}>
                    {this.state.recording && <span className="recording" />}
                    Record
                </button>
                <button className="replay" onClick={this.replay} disabled={this.state.replaying}>
                    {this.state.replaying && <span className="replaying" />}
                    Replay
                </button>
                <button className="delete" onClick={this.deleteRecords} disabled={this.state.replaying}>
                    Delete Records ({this.state.recorded.length})
                </button>
                <button className="change-color" onClick={this.changeColor}>
                    Change Color
                </button>
                <main onClick={this.delegateBall}>
                    <div onClick={stopEventPropagation}>
                        <Ball />
                    </div>
                </main>
                <DisplayValues />
                <RerenderCounter name="App" />
                <a className="perf-link" href="/react-rewired/performance/">
                    Performance comparison to Redux
                </a>
            </div>
        );
    }
}
