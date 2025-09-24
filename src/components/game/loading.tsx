import type { JSX } from 'react';
import '@/assets/loading.css'

interface LoadingScreenComponentProps {
    progress: number;
}

export function LoadingScreen({ progress }: LoadingScreenComponentProps): JSX.Element {
    return (
        <>
            <p className={'devWatermark'}>[Dev Build] BilalCode<sup>TM</sup></p>
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
    )
}