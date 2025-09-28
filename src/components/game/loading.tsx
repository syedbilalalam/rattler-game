import type { JSX } from 'react';
import { DevBuildTag } from '@/components/game/dev';
import '@/assets/loading.css'

interface LoadingScreenComponentProps {
    progress: number;
}

export function LoadingScreen({ progress }: LoadingScreenComponentProps): JSX.Element {
    return (
        <>
            <DevBuildTag />
            <div className='welcomeScreenBoard'>

                <div className={'loadingBar'}>

                    <div className={'progress-container'}>
                        <div
                            className={'progress-bar'}
                            style={{
                                width: `${progress}%`
                            }}
                        ></div>
                    </div>
                    <div className={'progress-text'}>Loading {progress}%</div>
                </div>
            </div>
        </>
    );
}