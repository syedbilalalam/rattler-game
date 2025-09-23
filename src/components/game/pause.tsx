import { useEffect, useRef, type JSX } from 'react';
import '@/assets/home.css';
import '@/assets/root.css';
import '@/assets/settings.css';
import '@/assets/pause_menu.css';

interface PauseMenuComponentProps {
    bannerImage: HTMLImageElement;
    score: {
        current: number;
        high: number;
    }
    resume: () => void;
    callSettings: () => void;
    mainMenu: () => void;
}


interface ScoreAtMenuComponentProps {
    currentScore: number;
    highScore: number;
}

export function ScoreAtMenu({ currentScore, highScore }: ScoreAtMenuComponentProps): JSX.Element {
    return (
        <div className={'menuScore'}>
            <div className={'toggleRow'}>
                <div
                    className={'game-box left'}
                    style={{ fontSize: '18px' }}
                >Score:</div>
                <button className={'game-btn sm right score'}>{currentScore}</button>
            </div>
            <div className={'toggleRow'}>
                <div
                    className={'game-box left'}
                    style={{ fontSize: '18px' }}
                >My High Score:</div>
                <button className={'game-btn sm right highScore'}>{highScore}</button>
            </div>
        </div>
    )
}

export function PauseMenu({ bannerImage, score, resume, callSettings, mainMenu }: PauseMenuComponentProps): JSX.Element {

    const bannerImageHolder = useRef<HTMLDivElement>(null);


    useEffect(() => {
        if (!bannerImageHolder.current) throw new Error('Invalid HTML');

        bannerImageHolder.current.replaceChildren(bannerImage);
    }, []);

    return (
        <>
            <div id={'menuHolder'}>
                <div id={'gameMenu'} className={'centered'}>
                    <div className={'bannerImageHolder'} ref={bannerImageHolder}></div>

                    <div className={'pauseTitle'}>
                        <p>Rattler is waiting for you...</p>
                        <span>Game Paused</span>
                    </div>

                    <ScoreAtMenu
                        currentScore={score.current}
                        highScore={score.high}
                    />


                    <div className={'buttonsHolder'}>
                        <button
                            className={'game-btn sm'}
                            onClick={resume}
                        >
                            Resume
                        </button>
                        <button
                            className={'game-btn sm'}
                            onClick={callSettings}
                        >
                            Settings
                        </button>
                        <button
                            className={'game-btn sm'}
                            onClick={mainMenu}
                        >
                            Leave Game
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}