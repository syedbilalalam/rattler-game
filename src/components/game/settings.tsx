import { useEffect, useRef, useState, type JSX } from 'react';
import '@/assets/home.css';
import '@/assets/root.css';
import '@/assets/settings.css';
import '@/assets/slider.css';
import { SettingsTextures } from '@/app/game/page';

interface SettingsComponentProps {
    bannerImage: HTMLImageElement;
    gotoParent: () => void;
    textures: SettingsTextures;
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

export function Settings({ bannerImage, gotoParent, textures }: SettingsComponentProps): JSX.Element {

    const [musicVolume, setVolume] = useState(100);
    const [sfxVolume, setSfxVolume] = useState(100);
    const [musicSliderFocused, updateMusicSliderFocusStatus] = useState(false);
    const [sfxSliderFocused, updateSfxSliderFocusStatus] = useState(false);
    const [fullScreen, setFullScreenStatus] = useState(false);
    const fullScreenButton = useRef<HTMLButtonElement>(null);

    const gameMenu = useRef<HTMLDivElement>(null);
    const bannerImageHolder = useRef<HTMLDivElement>(null);
    const musicToggle = useRef<HTMLButtonElement>(null);
    const sfxToggle = useRef<HTMLButtonElement>(null);
    const musicSlider = useRef<Slider>(null);
    const sfxSlider = useRef<Slider>(null);
    const music = {
        slider: useRef<HTMLDivElement>(null),
        sliderFill: useRef<HTMLDivElement>(null),
        sliderThumb: useRef<HTMLDivElement>(null)
    };
    const sfx = {
        slider: useRef<HTMLDivElement>(null),
        sliderFill: useRef<HTMLDivElement>(null),
        sliderThumb: useRef<HTMLDivElement>(null)
    };

    useEffect(() => {
        if (
            !bannerImageHolder.current || !musicToggle.current ||
            !music.sliderFill.current || !music.sliderThumb.current || !music.slider.current ||
            !sfx.sliderFill.current || !sfx.sliderThumb.current || !sfx.slider.current
        ) throw new Error('Invalid HTML');

        bannerImage.classList.add('gameMenuImage');

        bannerImageHolder.current.append(bannerImage);

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
            sfx.sliderThumb.current,
            sfx.slider.current,
            sfx.sliderFill.current
        );
        sfxSlider.current.onUpdate((value) => {
            setSfxVolume(value);
        });
        sfxSlider.current.onFocus(() => {
            updateSfxSliderFocusStatus(true);
        });
        sfxSlider.current.onBlur(() => {
            updateSfxSliderFocusStatus(false);
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
        if (!music.sliderThumb.current) throw new Error('Invalid HTML');
        if (musicSliderFocused)
            music.sliderThumb.current.replaceChildren(textures.volumeBarHoldedHead);
        else
            music.sliderThumb.current.replaceChildren(textures.volumeBarHead);
    }, [musicSliderFocused]);

    useEffect(() => {
        if (!sfx.sliderThumb.current) throw new Error('Invalid HTML');
        if (sfxSliderFocused)
            sfx.sliderThumb.current.replaceChildren(textures.sfxVolumeBarHoldedHead);
        else
            sfx.sliderThumb.current.replaceChildren(textures.sfxVolumeBarHead);
    }, [sfxSliderFocused]);

    useEffect(() => {
        if (!musicToggle.current || !musicSlider.current) throw new Error('Invalid HTML');

        if (!musicVolume) {
            musicToggle.current.innerText = 'Off';
        }
        else {
            musicToggle.current.innerText = 'On';
        }

        musicToggle.current.onclick = () => {
            if (musicVolume) setVolume(0);
            else setVolume(100);
        }

        musicSlider.current.updateValue = musicVolume;

    }, [musicVolume]);

    useEffect(() => {
        if (!sfxToggle.current || !sfxSlider.current) throw new Error('Invalid HTML');

        if (!sfxVolume) {
            sfxToggle.current.innerText = 'Off';
        }
        else {
            sfxToggle.current.innerText = 'On';
        }

        sfxToggle.current.onclick = () => {
            if (sfxVolume) setSfxVolume(0);
            else setSfxVolume(100);
        }

        sfxSlider.current.updateValue = sfxVolume;

    }, [sfxVolume]);



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
                                    <div className={'slider'} ref={sfx.slider}>
                                        <div className={'sliderFill'} ref={sfx.sliderFill}></div>
                                        <div className={'sliderThumb'} ref={sfx.sliderThumb}>
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
                            <button className={'game-btn sm right'} ref={musicToggle}>ON</button>
                        </div>

                        <div className={'toggleRow'}>
                            <div
                                className={'game-box left'}
                                style={{ fontSize: '18px' }}
                            >Sound Effects:
                            </div>
                            <button className={'game-btn sm right'} ref={sfxToggle}>ON</button>
                        </div>
                    </div>

                    <div className={'buttonsHolder'}>
                        <button className={'game-btn sm'} ref={fullScreenButton}>Full Screen</button>
                        <button
                            className={'game-btn sm'}
                            onClick={gotoParent}
                        >Back</button>
                    </div>
                </div>
            </div>
        </>
    )
}