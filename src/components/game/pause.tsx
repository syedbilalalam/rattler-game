import { useEffect, useRef, type JSX } from 'react';
import '@/assets/home.css';
import '@/assets/root.css';
import '@/assets/settings.css';
import '@/assets/pause_menu.css';
import { SfxManager, WindowSize } from '@/app/game/page';
import { GameButton } from '@/components/game_button';

interface PauseMenuComponentProps {
    bannerImage: HTMLImageElement;
    score: {
        current: number;
        high: number;
    };
    sfx: SfxManager;
    resume: () => void;
    callSettings: () => void;
    mainMenu: () => void;
    windowSize: WindowSize;
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

export function PauseMenu({ bannerImage, score, sfx, resume, callSettings, mainMenu, windowSize }: PauseMenuComponentProps): JSX.Element {

    const bannerImageHolder = useRef<HTMLDivElement>(null);
    const gameMenu = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (
            !bannerImageHolder.current ||
            !gameMenu.current
        ) throw new Error('Invalid HTML');

        bannerImageHolder.current.replaceChildren(bannerImage);

    }, []);

    useEffect(() => {
        if (!windowSize) return;

        if (windowSize.innerHeight <= gameMenu.current!.scrollHeight) {
            gameMenu.current!.classList.remove('centered');
        }
        else {
            gameMenu.current!.classList.add('centered');
        }
    }, [windowSize])

    return (
        <>
            <div id={'menuHolder'}>
                <div id={'gameMenu'} className={'centered'} ref={gameMenu}>
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
                        <GameButton
                            className={'game-btn sm'}
                            sfx={sfx}
                            onClick={resume}
                        >Resume
                        </GameButton>

                        <GameButton
                            className={'game-btn sm'}
                            sfx={sfx}
                            onClick={callSettings}
                        >Settings
                        </GameButton>

                        <GameButton
                            className={'game-btn sm'}
                            sfx={sfx}
                            onClick={mainMenu}
                        >Leave Game
                        </GameButton>
                    </div>
                </div>
            </div>
        </>
    )
}