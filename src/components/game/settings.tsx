import { useEffect, useRef, useState, type JSX } from 'react';
import '@/assets/home.css';
import '@/assets/root.css';
import '@/assets/slider.css';
import '@/assets/settings.css';
import { GameButton } from '@/components/game_button';
import {
    AudioManager,
    SettingsTextures,
    SfxManager,
    VolumeObject,
    WindowSize
} from '@/app/game/page';

type OnOffButtonText = 'On' | 'Off';

interface SettingsComponentProps {
    bannerImage: HTMLImageElement;
    gotoParent: () => void;
    textures: SettingsTextures;
    sfx: SfxManager;
    audioManager: AudioManager;
    volume: VolumeObject;
    windowSize: WindowSize;
    windowBlured: boolean;
}

class Slider {
    private min = 0;
    private max = 100;
    private value = 0;
    private onUpdateFn = (value: number) => { };
    private onFocusFn = () => { };
    private onBlurFn = () => { };

    constructor(
        private thumb: HTMLDivElement,
        private slider: HTMLDivElement,
        private sliderFill: HTMLDivElement
    ) {


        this.thumb.addEventListener("mousedown", (e) => {
            this.startDrag(e);
        });
        this.thumb.addEventListener("touchstart", (e) => {
            this.startDrag(e);
        });
        // clicking directly on slider track
        this.slider.addEventListener("mousedown", (e) => {
            this.updateSlider(e.clientX);
        });
        this.slider.addEventListener("touchstart", (e) => {
            this.updateSlider(e.touches[0].clientX);
        });


    }

    public get seekValue(): number {
        return this.value;
    }

    public set updateValue(val: number) {
        const rect = this.slider.getBoundingClientRect();
        const offsetX = rect.width * (val / 100);
        this.value = val;
        this.thumb.style.left = `${offsetX}px`;
        this.sliderFill.style.width = `${offsetX}px`;
    }

    public onUpdate(fn: (value: number) => void): void {
        this.onUpdateFn = fn;
    }

    public onFocus(fn: () => void): void {
        this.onFocusFn = fn;
    }

    public onBlur(fn: () => void): void {
        this.onBlurFn = fn;
    }

    private updateSlider(clientX: number) {
        const rect = this.slider.getBoundingClientRect();
        let offsetX = clientX - rect.left;
        if (offsetX < 0) offsetX = 0;
        if (offsetX > rect.width) offsetX = rect.width;

        const percent = offsetX / rect.width;
        this.value = Math.round(this.min + percent * (this.max - this.min));

        this.thumb.style.left = `${offsetX}px`;
        this.sliderFill.style.width = `${offsetX}px`;

        this.onUpdateFn(this.value);
    }

    private startDrag(e: Event) {
        this.onFocusFn();
        e.preventDefault();
        const moveHandler = (event: Event | MouseEvent | TouchEvent) => {
            if (event instanceof MouseEvent)
                this.updateSlider(event.clientX);
            else if (event instanceof TouchEvent)
                this.updateSlider(event.touches[0].clientX);
        };
        const upHandler = () => {
            this.onBlurFn();
            document.removeEventListener("mousemove", moveHandler);
            document.removeEventListener("mouseup", upHandler);
            document.removeEventListener("touchmove", moveHandler);
            document.removeEventListener("touchend", upHandler);
        };

        document.addEventListener("mousemove", moveHandler);
        document.addEventListener("mouseup", upHandler);
        document.addEventListener("touchmove", moveHandler);
        document.addEventListener("touchend", upHandler);

        moveHandler(e); // update immediately
    }
};

export function Settings({
    bannerImage,
    gotoParent,
    textures,
    sfx,
    audioManager,
    volume,
    windowSize,
    windowBlured
}: SettingsComponentProps): JSX.Element {

    const [musicVolume, setVolume] = useState(volume.musics);
    const [sfxVolume, setSfxVolume] = useState(volume.sfx);
    const [musicSliderFocused, updateMusicSliderFocusStatus] = useState(false);
    const [sfxSliderFocused, updateSfxSliderFocusStatus] = useState(false);
    const [fullScreen, setFullScreenStatus] = useState(false);
    const [fullScreenText, setFullScreenText] = useState('Full Screen');
    const [musicToggleText, setMusicToggleText] = useState<OnOffButtonText>('On');
    const [sfxToggleText, setSfxToggleText] = useState<OnOffButtonText>('On');

    const gameMenu = useRef<HTMLDivElement>(null);
    const bannerImageHolder = useRef<HTMLDivElement>(null);
    const musicSlider = useRef<Slider>(null);
    const sfxSlider = useRef<Slider>(null);
    const music = {
        slider: useRef<HTMLDivElement>(null),
        sliderFill: useRef<HTMLDivElement>(null),
        sliderThumb: useRef<HTMLDivElement>(null)
    };
    const sfxAdjustment = {
        slider: useRef<HTMLDivElement>(null),
        sliderFill: useRef<HTMLDivElement>(null),
        sliderThumb: useRef<HTMLDivElement>(null)
    };

    useEffect(() => {
        if (
            !bannerImageHolder.current ||
            !music.sliderFill.current || !music.sliderThumb.current || !music.slider.current ||
            !sfxAdjustment.sliderFill.current || !sfxAdjustment.sliderThumb.current || !sfxAdjustment.slider.current
        ) throw new Error('Invalid HTML');

        bannerImage.classList.add('gameMenuImage');
        bannerImageHolder.current.replaceChildren(bannerImage);

        musicSlider.current = new Slider(
            music.sliderThumb.current,
            music.slider.current,
            music.sliderFill.current
        );
        musicSlider.current.onUpdate((value) => {
            setVolume(value);
        });
        musicSlider.current.onFocus(() => {
            updateMusicSliderFocusStatus(true);
        });
        musicSlider.current.onBlur(() => {
            updateMusicSliderFocusStatus(false);
        });

        sfxSlider.current = new Slider(
            sfxAdjustment.sliderThumb.current,
            sfxAdjustment.slider.current,
            sfxAdjustment.sliderFill.current
        );
        sfxSlider.current.onUpdate((value) => {
            setSfxVolume(value);
        });
        sfxSlider.current.onFocus(() => {
            updateSfxSliderFocusStatus(true);
        });
        sfxSlider.current.onBlur(() => {
            updateSfxSliderFocusStatus(false);
            
            // Test sound for users
            sfx('snakeEat');
        });
        if (volume.sfx) setSfxVolume(volume.sfx)

    }, []);

    useEffect(() => {
        if (!windowSize) return;

        if (windowSize.innerHeight <= gameMenu.current!.scrollHeight) {
            gameMenu.current!.classList.remove('centered');
        }
        else {
            gameMenu.current!.classList.add('centered');
        }
    }, [windowSize]);

    useEffect(() => {
        if (!music.sliderThumb.current) throw new Error('Invalid HTML');
        if (musicSliderFocused)
            music.sliderThumb.current.replaceChildren(textures.volumeBarHoldedHead);
        else
            music.sliderThumb.current.replaceChildren(textures.volumeBarHead);
    }, [musicSliderFocused]);

    useEffect(() => {

        if (!sfxAdjustment.sliderThumb.current) throw new Error('Invalid HTML');

        if (sfxSliderFocused)
            sfxAdjustment.sliderThumb.current.replaceChildren(textures.sfxVolumeBarHoldedHead);
        else
            sfxAdjustment.sliderThumb.current.replaceChildren(textures.sfxVolumeBarHead);

    }, [sfxSliderFocused]);

    useEffect(() => {
        if (!musicSlider.current) throw new Error('Invalid HTML');

        setMusicToggleText(musicVolume ? 'On' : 'Off');

        musicSlider.current.updateValue = musicVolume;

        // Applying changes to all sfx
        audioManager('musics', musicVolume);

    }, [musicVolume]);

    useEffect(() => {
        if (!sfxSlider.current) throw new Error('Invalid HTML');

        setSfxToggleText(sfxVolume ? 'On' : 'Off');

        sfxSlider.current.updateValue = sfxVolume;

        // Applying changes to all sfx
        audioManager('sfx', sfxVolume);

    }, [sfxVolume]);

    useEffect(() => {

        setFullScreenText(fullScreen ? 'Exit' : 'Full Screen');

    }, [fullScreen]);

    useEffect(()=> {

        if (windowBlured) exitFullScreen();

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

                    <div className={'settingsHolder'}>

                        <div className={'volumeParent'}>
                            <p className={'settingTitle'}>Music</p>
                            <div className={'musicController'}>
                                <div className={'sliderHolder'}>
                                    <div className={'slider'} ref={music.slider}>
                                        <div className={'sliderFill'} ref={music.sliderFill}></div>
                                        <div className={'sliderThumb'} ref={music.sliderThumb}>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={'volumeParent'}>
                            <p className={'settingTitle'}>Sound Effects</p>
                            <div className={'sfxController'}>
                                <div className={'sliderHolder'}>
                                    <div className={'slider'} ref={sfxAdjustment.slider}>
                                        <div className={'sliderFill'} ref={sfxAdjustment.sliderFill}></div>
                                        <div className={'sliderThumb'} ref={sfxAdjustment.sliderThumb}>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className={'toggleRow'}>
                            <div
                                className={'game-box left'}
                                style={{ fontSize: '18px' }}
                            >Game Music:</div>
                            <GameButton
                                className={'game-btn sm right'}
                                sfx={sfx}
                                onClick={() => {
                                    setVolume(musicVolume ? 0 : 100);
                                }}
                            >{musicToggleText}</GameButton>
                        </div>

                        <div className={'toggleRow'}>
                            <div
                                className={'game-box left'}
                                style={{ fontSize: '18px' }}
                            >Sound Effects:
                            </div>
                            <GameButton
                                className={'game-btn sm right'}
                                sfx={sfx}
                                onClick={() => {
                                    setSfxVolume(sfxVolume ? 0 : 100);
                                }}
                            >{sfxToggleText}</GameButton>
                        </div>
                    </div>

                    <div className={'buttonsHolder'}>
                        <GameButton
                            className={'game-btn sm'}
                            sfx={sfx}
                            onClick={() => {
                                if (fullScreen) exitFullScreen();
                                else setToFullScreen();
                            }}
                        >{fullScreenText}</GameButton>
                        <GameButton
                            className={'game-btn sm'}
                            sfx={sfx}
                            onClick={gotoParent}
                        >Back</GameButton>
                    </div>
                </div>
            </div>
        </>
    )
}