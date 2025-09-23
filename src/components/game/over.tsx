import { useEffect, useRef, type JSX } from 'react';
import '@/assets/home.css';
import '@/assets/root.css';
import '@/assets/settings.css';
import '@/assets/pause_menu.css';
import { ScoreAtMenu } from './pause';

interface GameOverMenuComponentProps {
    bannerImage: HTMLImageElement;
    score: {
        current: number;
        high: number;
    }
    playAgain: () => void;
    mainMenu: () => void;
}


export function GameOverMenu({ bannerImage, score, playAgain, mainMenu }: GameOverMenuComponentProps): JSX.Element {

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
                        {
                            score.current && score.current >= score.high ? (

                                <p>Congrats! You got a new high score</p>
                            ): (
                                <p>Not this time! High score stands</p>
                            )
                        }
                        <span>Game Over</span>
                    </div>

                    <ScoreAtMenu
                        currentScore={score.current}
                        highScore={score.high}
                    />


                    <div className={'buttonsHolder'}>
                        <button
                            className={'game-btn sm'}
                            onClick={playAgain}
                        >
                            Play Again
                        </button>
                        <button
                            className={'game-btn sm'}
                            onClick={mainMenu}
                        >
                            Main Menu
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}