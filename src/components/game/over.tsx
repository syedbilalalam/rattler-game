import { useEffect, useRef, type JSX } from 'react';
import Typed from 'typed.js';
import '@/assets/home.css';
import '@/assets/root.css';
import '@/assets/settings.css';
import '@/assets/pause_menu.css';
import { GameButton } from '@/components/game_button';
import { ScoreAtMenu } from '@/components/game/pause';
import { SfxManager, WindowSize } from '@/app/game/page';
import { SMALL_MENU_MAX_WIDTH } from '@/components/game/home';

interface GameOverMenuComponentProps {
    bannerImage: HTMLImageElement;
    score: {
        current: number;
        high: number;
    };
    sfx: SfxManager
    playAgain: () => void;
    mainMenu: () => void;
    windowSize: WindowSize;
}

export function GameOverMenu({ bannerImage, score, sfx, playAgain, mainMenu, windowSize }: GameOverMenuComponentProps): JSX.Element {

    const gameMenu = useRef<HTMLDivElement>(null);
    const menuHolder = useRef<HTMLDivElement>(null);
    const bannerImageHolder = useRef<HTMLDivElement>(null);
    const gameOverCommentElement = useRef<HTMLSpanElement>(null);
    const pageRenderCount = useRef(0);

    useEffect(() => {
        if (
            !menuHolder.current ||
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

    }, []);

    useEffect(() => {
        if (!windowSize) return;

        if (windowSize.innerHeight <= gameMenu.current!.scrollHeight) {
            gameMenu.current!.classList.remove('centered');
        }
        else {
            gameMenu.current!.classList.add('centered');
        }
        if (windowSize.innerWidth < SMALL_MENU_MAX_WIDTH) {
                    menuHolder.current!.classList.add('smallMenu');
                }
                else {
                    menuHolder.current!.classList.remove('smallMenu');
                }
    }, [windowSize]);

    return (
        <>
            <div className={'menuHolder'} ref={menuHolder}>
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
                        <GameButton
                            className={'game-btn sm'}
                            sfx={sfx}
                            onClick={playAgain}
                        >Play Again</GameButton>

                        <GameButton
                            className={'game-btn sm'}
                            sfx={sfx}
                            onClick={mainMenu}
                        >Main Menu</GameButton>
                    </div>
                </div>
            </div>
        </>
    )
}