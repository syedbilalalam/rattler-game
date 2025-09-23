import { useEffect, useState, type JSX, useRef } from 'react';
import Typed from 'typed.js';
import '@/assets/home.css';
import '@/assets/button.css';

interface HomeScreenComponentProps {
    startGame: () => void;
    openSettings: () => void;
    bannerImage: HTMLImageElement;
}

function LoginButton(): JSX.Element {

    const [loginButtonText, setLoginButtonText] = useState('Login');
    const loginButtonElement = useRef<HTMLButtonElement>(null);

    useEffect(() => {

        if (!loginButtonElement.current) return;

        loginButtonElement.current.onclick = () => {
            setLoginButtonText('Hi, Test User');
        }

    }, []);

    useEffect(() => {

        if (!loginButtonElement.current) return;

        loginButtonElement.current.innerText = loginButtonText;

    }, [loginButtonText]);

    return (
        <button className={'game-btn'} ref={loginButtonElement}>Login</button>
    )
}

export function HomeScreen({ startGame, openSettings, bannerImage }: HomeScreenComponentProps): JSX.Element {

    const [fullScreen, setFullScreenStatus] = useState(false);
    // const [screenResize, triggerResize] = useState(0);

    const bannerImageHolder = useRef<HTMLDivElement>(null);
    const fullScreenButton = useRef<HTMLButtonElement>(null);
    const menuTagLine = useRef<HTMLSpanElement>(null);
    const gameMenu = useRef<HTMLDivElement>(null);
    const pageRenderCount = useRef(0);

    useEffect(() => {
        if (
            !bannerImageHolder.current ||
            !gameMenu.current
        ) throw new Error('Invalid HTML');

        pageRenderCount.current++;

        bannerImage.classList.add('gameMenuImage');
        bannerImageHolder.current.append(bannerImage);

        if (document.fullscreenElement)
            setFullScreenStatus(true);

        if (pageRenderCount.current === 1)
            new Typed(menuTagLine.current!, {
                strings: ["Welcome to Rattler's World"],
                typeSpeed: 50
            });

        window.onresize = () => {
            if (window.innerHeight <= gameMenu.current!.scrollHeight) {
                gameMenu.current!.classList.remove('centered');
            }
            else {
                gameMenu.current!.classList.add('centered');
            }
        }
    }, []);

    useEffect(() => {

        if (!fullScreenButton.current) throw new Error('Incomplete HTML Element');

        if (fullScreen) fullScreenButton.current.innerText = 'Exit';
        else fullScreenButton.current.innerText = 'Full Screen'

        fullScreenButton.current.onclick = async () => {
            if (fullScreen) exitFullScreen();
            else setToFullScreen();
        }

        window.onblur = exitFullScreen;

    }, [fullScreen]);

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
                        <button
                            className={'game-btn'}
                            onClick={startGame}
                        >
                            Start Game
                        </button>
                        <button className={'game-btn'}>Leaderboard</button>
                        <button
                            className={'game-btn'}
                            onClick={openSettings}
                        >
                            Settings
                        </button>
                        {LoginButton()}
                        <button className={'game-btn'} ref={fullScreenButton}>Full Screen</button>
                    </div>
                </div>
            </div>
        </>
    )
}
