import { useEffect, useState, useRef, type JSX } from 'react';
import '@/assets/home.css';
import '@/assets/button.css';
import Typed from 'typed.js';
import { GameButton } from '@/components/game_button';
import { SfxManager, WindowSize } from '@/app/game/page';

interface HomeScreenComponentProps {
    startGame: () => void;
    openSettings: () => void;
    bannerImage: HTMLImageElement;
    homeMusic: HTMLAudioElement;
    sfx: SfxManager;
    windowSize: WindowSize;
    windowBlured: boolean;
}

interface LoginButtonComponentProps {
    sfx: SfxManager;
}

function LoginButton({ sfx }: LoginButtonComponentProps): JSX.Element {

    const [loginButtonText, setLoginButtonText] = useState('Login');

    return (
        <GameButton
            className={'game-btn'}
            sfx={sfx}
            onClick={() => {
                setLoginButtonText('Hi, Test User');
            }}
        >
            {loginButtonText}
        </GameButton>
    )
}

export function HomeScreen({
    startGame,
    openSettings,
    bannerImage,
    homeMusic,
    sfx,
    windowSize,
    windowBlured
}: HomeScreenComponentProps): JSX.Element {

    const [fullScreen, setFullScreenStatus] = useState(false);
    const [fullScreenBtnText, setFullScreenBtnText] = useState('Full Screen');
    // const [screenResize, triggerResize] = useState(0);

    const bannerImageHolder = useRef<HTMLDivElement>(null);
    // const fullScreenButton = useRef<HTMLButtonElement>(null);
    const menuTagLine = useRef<HTMLSpanElement>(null);
    const gameMenu = useRef<HTMLDivElement>(null);
    const pageRenderCount = useRef(0);

    useEffect(() => {
        if (
            !bannerImageHolder.current ||
            !gameMenu.current
        ) throw new Error('Invalid HTML');

        pageRenderCount.current++;

        homeMusic.play();

        bannerImage.classList.add('gameMenuImage');
        bannerImageHolder.current.append(bannerImage);

        if (document.fullscreenElement)
            setFullScreenStatus(true);

        if (pageRenderCount.current === 1)
            new Typed(menuTagLine.current!, {
                strings: ["Welcome to Rattler's World"],
                typeSpeed: 50
            });

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

    useEffect(() => {

        // Fullscreen management
        setFullScreenBtnText(fullScreen ? 'Exit' : 'Full Screen');

    }, [fullScreen]);

    useEffect(() => {

        if (windowBlured) {
            exitFullScreen()
            homeMusic.pause();
        }
        else {
            homeMusic.play();
        }
        
    }, [windowBlured]);

    const setToFullScreen = async () => {
        try {
            await document.body.requestFullscreen()
        }
        catch { }
        finally {
            setFullScreenStatus(true);
        }
    }

    const exitFullScreen = async () => {
        try {
            await document.exitFullscreen()
        }
        catch { }
        finally {
            setFullScreenStatus(false);
        }
    }

    return (
        <>
            <div id={'menuHolder'}>
                <div id={'gameMenu'} className={'centered'} ref={gameMenu}>
                    <div className={'bannerImageHolder'} ref={bannerImageHolder}></div>
                    <div className={'menuTagLine'}>
                        <span ref={menuTagLine}></span>
                    </div>
                    <div className={'buttonsHolder'}>
                        <GameButton
                            className={'game-btn'}
                            onClick={startGame}
                            sfx={sfx}
                        >
                            Start Game
                        </GameButton>
                        <GameButton className={'game-btn'} sfx={sfx}>Leaderboard</GameButton>
                        <GameButton
                            className={'game-btn'}
                            sfx={sfx}
                            onClick={openSettings}
                        >
                            Settings
                        </GameButton>

                        {LoginButton({ sfx })}

                        <GameButton
                            className={'game-btn'}
                            sfx={sfx}
                            onClick={() => {
                                if (fullScreen) exitFullScreen();
                                else setToFullScreen();
                            }}
                        >
                            {fullScreenBtnText}
                        </GameButton>
                    </div>
                </div>
            </div>
        </>
    )
}
