import { useEffect, useRef, type JSX } from 'react';
import '@/assets/loading.css'
import '@/assets/user_interactor.css'
import { CompleteInteraction } from '@/app/game/page';

interface UserInteractorComponentProps {
    gameLogoTexture: HTMLImageElement;
    startGame: CompleteInteraction;
}

export function UserInteractor({gameLogoTexture, startGame}: UserInteractorComponentProps): JSX.Element {
    const logoHolder = useRef<HTMLDivElement>(null);
    useEffect(()=> {
        logoHolder.current!.replaceChildren(gameLogoTexture);
    }, []);
    return (
        <>
            <div className='welcomeScreenBoard'>

                <div className={'loadingBar'}>

                    <div className={'imageContianer'} ref={logoHolder}>
                    </div>
                    <div className={'progress-text'}></div>
                    <button
                    className={'game-btn'}
                    onClick={startGame}
                    >Start</button>
                </div>
            </div>
        </>
    )
}