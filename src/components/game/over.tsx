import { useEffect, useRef, type JSX } from 'react';
import Typed from 'typed.js';
import '@/assets/home.css';
import '@/assets/root.css';
import '@/assets/settings.css';
import '@/assets/pause_menu.css';
import { ScoreAtMenu } from '@/components/game/pause';

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

    const gameMenu = useRef<HTMLDivElement>(null);
    const bannerImageHolder = useRef<HTMLDivElement>(null);
    const gameOverCommentElement = useRef<HTMLSpanElement>(null);
    const pageRenderCount = useRef(0);

    useEffect(() => {
        if (
            !bannerImageHolder.current ||
            !gameMenu.current
        ) throw new Error('Invalid HTML');
        pageRenderCount.current++;

        bannerImageHolder.current.replaceChildren(bannerImage);

        const COMMENT_WRITE_SPEED = 18;
        if (pageRenderCount.current === 1)
            if (score.current > score.high) {
                new Typed(gameOverCommentElement.current!, {
                    strings: ['Congrats! You got a new high score'],
                    typeSpeed: COMMENT_WRITE_SPEED
                });
            }
            else {
                new Typed(gameOverCommentElement.current!, {
                    strings: ['Not this time! High score stands'],
                    typeSpeed: COMMENT_WRITE_SPEED
                });
            }

        window.onresize = () => {
            if (window.innerHeight <= gameMenu.current!.scrollHeight) {
                gameMenu.current!.classList.remove('centered');
            }
            else {
                gameMenu.current!.classList.add('centered');
            }
        }
    }, []);

    return (
        <>
            <div id={'menuHolder'}>
                <div id={'gameMenu'} className={'centered'} ref={gameMenu}>
                    <div className={'bannerImageHolder'} ref={bannerImageHolder}></div>

                    <div className={'pauseTitle'}>
                        <p>
                            <span ref={gameOverCommentElement}></span>
                        </p>
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