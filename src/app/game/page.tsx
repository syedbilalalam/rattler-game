'use client'
import { type JSX, useEffect, useRef, useState } from 'react';
import '@/assets/scrollbar.css';
import { Game } from '@/components/game/game';
import { HomeScreen } from '@/components/game/home';
import { Settings } from '@/components/game/settings';
import { LoadingScreen } from '@/components/game/loading';
import { UserInteractor } from '@/components/game/user_interact';

enum SCREEN {
    HOME,
    SETTING,
    PAUSE,
    GAME,
    USER_INTERACT
}

enum DEFAULT_AUDIO_SETTINGS {
    MUSIC = 70,
    SFX = 100
}

export interface GameTextures {
    BACKGROUND: HTMLImageElement;
    TREE: HTMLImageElement;
    SNAKE_HEAD: HTMLImageElement;
    FIRED_HUT_ANGLES: HTMLImageElement[];
    PENGUS: {
        BLUE: HTMLImageElement;
        PINK: HTMLImageElement;
        RED: HTMLImageElement;
        GREEN: HTMLImageElement;
        BLACK: HTMLImageElement;
    }
}

export interface SettingsTextures {
    volumeBarHead: HTMLImageElement;
    sfxVolumeBarHead: HTMLImageElement;
    volumeBarHoldedHead: HTMLImageElement;
    sfxVolumeBarHoldedHead: HTMLImageElement;
}
export interface GameIcons {
    pause: HTMLImageElement;
}

export interface ButtonSfx {
    hovered: () => void;
    clicked: () => void;
}

export interface GameSfx {
    snakeEat: () => void;
    penguPop: () => void;
    gameOver: () => void;
    highScore: () => void;
}

export interface VolumeObject {
    musics: number;
    sfx: number;
}

// Loading sound data
interface SoundSession {
    musicVolume: number;
    sfxVolume: number;
}
const SOUND_SESSION_NAME = 'rattlerAudio';

type ProjectMimeTypes =
    'audio/mpeg' |
    'audio/wav' |
    'image/png';

type SfxManagerKey = 'buttonHover' |
    'buttonClicked' |
    'snakeEat' |
    'penguPop' |
    'gameOver' |
    'highScore'
export type CompleteInteraction = () => void;
export type SfxManager = (keyName: SfxManagerKey) => void;
export type AudioManager = (type: 'sfx' | 'musics', volume: number) => void;

async function loadTextures(): Promise<GameTextures> {
    const TEXTURES: GameTextures = {
        BACKGROUND: new Image(100, 82),
        TREE: new Image(),
        SNAKE_HEAD: new Image(50, 100),
        FIRED_HUT_ANGLES: [
            new Image(),
            new Image(),
            new Image(),
            new Image()
        ],
        PENGUS: {
            PINK: new Image(),
            RED: new Image(),
            BLUE: new Image(),
            GREEN: new Image(),
            BLACK: new Image()
        }
    }
    const loadingTasks: Promise<void>[] = [];

    // Loading background texture
    TEXTURES.BACKGROUND.src = '/images/grass.png';
    loadingTasks.push(new Promise((resolve, reject) => {

        TEXTURES.BACKGROUND.onload = () => {
            resolve();
        }
        TEXTURES.BACKGROUND.onerror = () => {
            reject();
        }
    }));

    // Loading tree texture
    TEXTURES.TREE.src = '/images/tree.png';
    loadingTasks.push(new Promise((resolve, reject) => {

        TEXTURES.TREE.onload = () => {
            resolve();
        }
        TEXTURES.TREE.onerror = () => {
            reject();
        }
    }));

    // Loading snake texture
    TEXTURES.SNAKE_HEAD.src = '/images/snake_top_view_head.png';
    loadingTasks.push(new Promise((resolve, reject) => {

        TEXTURES.SNAKE_HEAD.onload = () => {
            resolve();
        }
        TEXTURES.SNAKE_HEAD.onerror = () => {
            reject();
        }
    }));

    // Loading pengues texture
    loadingTasks.push(new Promise((resolve, reject) => {

        TEXTURES.PENGUS.BLUE.src = '/images/enemies/blue_pengu.png';
        TEXTURES.PENGUS.BLUE.onload = () => {
            resolve();
        }
        TEXTURES.PENGUS.BLUE.onerror = () => {
            reject();
        }
    }));
    loadingTasks.push(new Promise((resolve, reject) => {

        TEXTURES.PENGUS.RED.src = '/images/enemies/red_pengu.png';
        TEXTURES.PENGUS.RED.onload = () => {
            resolve();
        }
        TEXTURES.PENGUS.RED.onerror = () => {
            reject();
        }
    }));
    loadingTasks.push(new Promise((resolve, reject) => {

        TEXTURES.PENGUS.PINK.src = '/images/enemies/pink_pengu.png';
        TEXTURES.PENGUS.PINK.onload = () => {
            resolve();
        }
        TEXTURES.PENGUS.PINK.onerror = () => {
            reject();
        }
    }));
    loadingTasks.push(new Promise((resolve, reject) => {

        TEXTURES.PENGUS.GREEN.src = '/images/enemies/green_pengu.png';
        TEXTURES.PENGUS.GREEN.onload = () => {
            resolve();
        }
        TEXTURES.PENGUS.GREEN.onerror = () => {
            reject();
        }
    }));
    loadingTasks.push(new Promise((resolve, reject) => {

        TEXTURES.PENGUS.BLACK.src = '/images/enemies/black_pengu.png';
        TEXTURES.PENGUS.BLACK.onload = () => {
            resolve();
        }
        TEXTURES.PENGUS.BLACK.onerror = () => {
            reject();
        }
    }));

    // Loading fired hut angles
    for (let index = 0; index < TEXTURES.FIRED_HUT_ANGLES.length; index++) {

        TEXTURES.FIRED_HUT_ANGLES[index].src = `/images/fired_hut_angles/${index + 1}.png`;
        loadingTasks.push(new Promise((resolve, reject) => {

            TEXTURES.FIRED_HUT_ANGLES[index].onload = () => {
                resolve();
            }
            TEXTURES.FIRED_HUT_ANGLES[index].onerror = () => {
                reject();
            }
        }));
    }

    try {
        await Promise.all(loadingTasks);
    }
    catch {
        throw 'Failed to load some textures';
    }

    return TEXTURES;
}

async function getContentObjectUrl(url: string, mimeType: ProjectMimeTypes): Promise<string> {
    const rawBlob = await (await fetch(url)).blob();
    const blob = new Blob([rawBlob], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);
    return blobUrl;
}

export type WindowSize = {
    innerWidth: number;
    innerHeight: number;
} | null;
export default function Page(): JSX.Element {

    const [screenType, updateScreenType] = useState(SCREEN.USER_INTERACT);
    const [gameLoaded, updateGameLoadingStatus] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [windowSize, setWindowSize] = useState<WindowSize>(null);
    const [windowBlured, setWindowBlur] = useState(false);

    // For loading things
    const TEXTURES = useRef<GameTextures>(null);
    const gameLogo = useRef<HTMLImageElement>(null);
    const gameIcons = useRef<GameIcons>(null);
    const bannerImage = useRef<HTMLImageElement>(null);
    const settingsTextures = useRef<SettingsTextures>(null);
    const volume = useRef<VolumeObject>({
        musics: DEFAULT_AUDIO_SETTINGS.MUSIC,
        sfx: DEFAULT_AUDIO_SETTINGS.SFX
    });

    const audio = {
        musics: {
            home: useRef<HTMLAudioElement>(null),
            game: useRef<HTMLAudioElement>(null),
            pauseMenu: useRef<HTMLAudioElement>(null)
        },
        sfx: {
            buttonHover: useRef<HTMLAudioElement>(null),
            buttonClicked: useRef<HTMLAudioElement>(null),
            snakeEat: useRef<HTMLAudioElement>(null),
            penguPop: useRef<HTMLAudioElement>(null),
            gameOver: useRef<HTMLAudioElement>(null),
            highScore: useRef<HTMLAudioElement>(null)
        }
    }

    const gameStatus = useRef({
        running: false
    });

    useEffect(() => {

        // Window global events
        window.onresize = () => {
            setWindowSize({
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight
            });
        }
        window.onblur = () => {
            setWindowBlur(true);
        }
        window.onfocus = () => {
            setWindowBlur(false);
        }

        (async () => {

            // Loading audios
            // Main menu audio
            const homeMusicRawBlob = await (await fetch('/audio/musics/main_menu.dat')).blob();
            const homeMusicBlob = new Blob([homeMusicRawBlob], { type: 'audio/mpeg' })
            const homeMusicUrl = URL.createObjectURL(homeMusicBlob);
            audio.musics.home.current = new Audio(homeMusicUrl);
            audio.musics.home.current.loop = true;
            audio.musics.home.current.onload = () => {
                URL.revokeObjectURL(homeMusicUrl);
            }
            setLoadingProgress(7);

            // Game play music
            const gameMusicUrl = await getContentObjectUrl(
                '/audio/musics/game.dat',
                'audio/wav'
            );
            audio.musics.game.current = new Audio(gameMusicUrl);
            audio.musics.game.current.loop = true;
            audio.musics.game.current.onload = () => {
                URL.revokeObjectURL(gameMusicUrl);
            }
            setLoadingProgress(14);

            // Pause menu music
            const pauseMenuMusicUrl = await getContentObjectUrl(
                '/audio/musics/pause_menu.dat',
                'audio/mpeg'
            );
            audio.musics.pauseMenu.current = new Audio(pauseMenuMusicUrl);
            audio.musics.pauseMenu.current.loop = true;
            audio.musics.pauseMenu.current.onload = () => {
                URL.revokeObjectURL(pauseMenuMusicUrl);
            }
            setLoadingProgress(20);

            // Sfx
            // Button hover
            const btnHoverSfxUrl = await getContentObjectUrl(
                '/audio/sfx/button_hover.dat',
                'audio/mpeg'
            );
            audio.sfx.buttonHover.current = new Audio(btnHoverSfxUrl);
            audio.sfx.buttonHover.current.onload = () => {
                URL.revokeObjectURL(btnHoverSfxUrl);
            }
            // Button clicked
            const btnClickedSfxUrl = await getContentObjectUrl(
                '/audio/sfx/button_click.dat',
                'audio/wav'
            );
            audio.sfx.buttonClicked.current = new Audio(btnClickedSfxUrl);
            audio.sfx.buttonClicked.current.onload = () => {
                URL.revokeObjectURL(btnClickedSfxUrl);
            }
            setLoadingProgress(22);
            // Snake eat
            const snakeEatSfxUrl = await getContentObjectUrl(
                '/audio/sfx/snake_eat.dat',
                'audio/mpeg'
            );
            audio.sfx.snakeEat.current = new Audio(snakeEatSfxUrl);
            audio.sfx.snakeEat.current.onload = () => {
                URL.revokeObjectURL(snakeEatSfxUrl);
            }
            setLoadingProgress(25);
            // Pengu pop
            const penguPopSfxUrl = await getContentObjectUrl(
                '/audio/sfx/pengu_pop.dat',
                'audio/wav'
            );
            audio.sfx.penguPop.current = new Audio(penguPopSfxUrl);
            audio.sfx.penguPop.current.onload = () => {
                URL.revokeObjectURL(penguPopSfxUrl);
            }
            // Game over sfx
            const gameOverSfxUrl = await getContentObjectUrl(
                '/audio/sfx/game_over.dat',
                'audio/wav'
            );
            audio.sfx.gameOver.current = new Audio(gameOverSfxUrl);
            audio.sfx.gameOver.current.onload = () => {
                URL.revokeObjectURL(gameOverSfxUrl);
            }
            setLoadingProgress(27);

            // Hight score sfx
            const highScoreSfxUrl = await getContentObjectUrl(
                '/audio/sfx/high_score.dat',
                'audio/mpeg'
            );
            audio.sfx.highScore.current = new Audio(highScoreSfxUrl);
            audio.sfx.highScore.current.onload = () => {
                URL.revokeObjectURL(highScoreSfxUrl);
            }

            setLoadingProgress(30);

            // Loading canvas textures
            TEXTURES.current = await loadTextures();

            setLoadingProgress(60);

            // Loading banner image
            const imageRawBlob = await (await fetch('/images/menu.dat')).blob();
            const imageBlob = new Blob([imageRawBlob], { type: 'image/png' });
            const bannerImageUrl = URL.createObjectURL(imageBlob);
            bannerImage.current = new Image();
            bannerImage.current.src = bannerImageUrl;
            bannerImage.current.alt = 'Rattler';
            bannerImage.current.onload = () => {
                URL.revokeObjectURL(bannerImageUrl);
            }

            // Loading setting textures
            const volumeBarHeadRawBlob = await (await fetch('/images/settings/volume_bar_head.dat')).blob();
            const volumeBarHoldedHeadRawBlob = await (await fetch('/images/settings/volume_bar_holded_head.dat')).blob();
            const volumeBarHeadBlob = new Blob([volumeBarHeadRawBlob], { type: 'image/png' });
            const volumeBarHoldedHeadBlob = new Blob([volumeBarHoldedHeadRawBlob], { type: 'image/png' });

            const volumeBarHeadUrl = URL.createObjectURL(volumeBarHeadBlob);
            const sfxVolumeBarHeadUrl = URL.createObjectURL(volumeBarHeadBlob);
            const volumeBarHoldedHeadUrl = URL.createObjectURL(volumeBarHoldedHeadBlob);
            const sfxVolumeBarHoldedHeadUrl = URL.createObjectURL(volumeBarHoldedHeadBlob);

            const volumeBarHeadImage = new Image();
            volumeBarHeadImage.src = volumeBarHeadUrl;
            volumeBarHeadImage.onload = () => {
                URL.revokeObjectURL(volumeBarHeadUrl);
            }
            const sfxVolumeBarHeadImage = new Image();
            sfxVolumeBarHeadImage.src = sfxVolumeBarHeadUrl;
            sfxVolumeBarHeadImage.onload = () => {
                URL.revokeObjectURL(sfxVolumeBarHeadUrl);
            }
            const volumeBarHoldedHeadImage = new Image();
            volumeBarHoldedHeadImage.src = volumeBarHoldedHeadUrl;
            volumeBarHoldedHeadImage.onload = () => {
                URL.revokeObjectURL(volumeBarHoldedHeadUrl);
            }
            const sfxVolumeBarHoldedHeadImage = new Image();
            sfxVolumeBarHoldedHeadImage.src = sfxVolumeBarHoldedHeadUrl;
            sfxVolumeBarHoldedHeadImage.onload = () => {
                URL.revokeObjectURL(sfxVolumeBarHoldedHeadUrl);
            }

            settingsTextures.current = {
                volumeBarHead: volumeBarHeadImage,
                volumeBarHoldedHead: volumeBarHoldedHeadImage,
                sfxVolumeBarHead: sfxVolumeBarHeadImage,
                sfxVolumeBarHoldedHead: sfxVolumeBarHoldedHeadImage
            }
            setLoadingProgress(85);


            // Loading pause icon
            const pauseIconRawBlob = await (await fetch('/icons/pause.dat')).blob();
            const pauseIconBlob = new Blob([pauseIconRawBlob], { type: 'image/svg+xml' });
            const pauseIconUrl = URL.createObjectURL(pauseIconBlob);
            const pauseIcon = new Image();
            pauseIcon.src = pauseIconUrl;
            pauseIcon.onload = () => {
                URL.revokeObjectURL(pauseIconUrl);
            }
            gameIcons.current = {
                pause: pauseIcon
            }

            // Loading game logo
            const gameLogoUrl = await getContentObjectUrl(
                '/images/logo.dat',
                'image/png'
            );
            gameLogo.current = new Image();
            gameLogo.current.src = gameLogoUrl;
            gameLogo.current.onload = () => {
                URL.revokeObjectURL(gameLogoUrl)
            }

            setLoadingProgress(95);

            const soundSession = localStorage.getItem(SOUND_SESSION_NAME);
            if (soundSession) {
                try {
                    const soundData: SoundSession = JSON.parse(soundSession);
                    audioManager('musics', soundData.musicVolume);
                    audioManager('sfx', soundData.sfxVolume);
                }
                catch {
                    localStorage.removeItem(SOUND_SESSION_NAME)
                }
            }
            setLoadingProgress(100);
            setTimeout(() => {
                updateGameLoadingStatus(true);
            }, 1000);
        })();

    }, []);

    useEffect(() => {
        if (gameLoaded) {

            if (screenType !== SCREEN.HOME && screenType !== SCREEN.SETTING) {
                audio.musics.home.current!.pause();
                audio.musics.home.current!.currentTime = 0;
            }

            audio.musics.game.current!.pause();
            audio.musics.pauseMenu.current!.pause();



            // Telling browser to remove this meta data
            if ('mediaSession' in navigator) {
                navigator.mediaSession.metadata = null;
            }
        }
    }, [screenType, gameLoaded]);

    const startGame = () => {
        updateScreenType(SCREEN.GAME);
    }

    const openSettings = () => {
        updateScreenType(SCREEN.SETTING);
    }

    const gotoHome = () => {
        updateScreenType(SCREEN.HOME);
    }

    const sfxManager: SfxManager = (keyName) => {
        audio.sfx[keyName].current!.currentTime = 0;
        audio.sfx[keyName].current!.play();
    }

    const audioSessionUpdate = () => {
        const packedData = JSON.stringify(
            {
                musicVolume: volume.current.musics,
                sfxVolume: volume.current.sfx
            } as SoundSession
        );
        localStorage.setItem(SOUND_SESSION_NAME, packedData);
    }

    const audioManager: AudioManager = (type, updatedVolumeLevel) => {
        const audioElements = Object.values(audio[type]);
        const formattedVolume = (updatedVolumeLevel * (1 / 100));
        audioElements.forEach(audio => {
            audio.current!.volume = formattedVolume;
            audio.current!.muted = formattedVolume ? false : true;
        });
        volume.current[type] = updatedVolumeLevel;
        audioSessionUpdate();
    }

    const completeInteraction: CompleteInteraction = () => {
        updateScreenType(SCREEN.HOME);
    }

    return (
        <>
            <img id={'backgroundImage'} src={'/images/game_background.png'} alt={'Failed to load game background image'} />

            {
                !gameLoaded ? (
                    <LoadingScreen progress={loadingProgress} />
                ) : (screenType === SCREEN.USER_INTERACT) ? (

                    <UserInteractor
                        gameLogoTexture={gameLogo.current!}
                        startGame={completeInteraction}
                    />

                ) : (screenType === SCREEN.HOME) ? (

                    <HomeScreen
                        startGame={startGame}
                        openSettings={openSettings}
                        bannerImage={bannerImage.current!}
                        homeMusic={audio.musics.home.current!}
                        sfx={sfxManager}
                        windowSize={windowSize}
                        windowBlured={windowBlured}
                    />

                ) : (screenType === SCREEN.GAME) ? (

                    <Game
                        TEXTURES={TEXTURES.current!}
                        bannerImage={bannerImage.current!}
                        settingsMenuProps={{
                            textures: settingsTextures.current!
                        }}
                        music={{
                            game: audio.musics.game.current!,
                            pauseMenu: audio.musics.pauseMenu.current!
                        }}
                        audioManager={audioManager}
                        sfx={sfxManager}
                        volume={volume.current}
                        gameStatus={gameStatus}
                        icons={gameIcons.current!}
                        mainMenu={gotoHome}
                        windowSize={windowSize}
                        windowBlured={windowBlured}
                    />

                ) : (screenType === SCREEN.SETTING) ? (
                    <Settings
                        bannerImage={bannerImage.current!}
                        gotoParent={gotoHome}
                        textures={settingsTextures.current!}
                        sfx={sfxManager}
                        audioManager={audioManager}
                        volume={volume.current}
                        windowSize={windowSize}
                        windowBlured={windowBlured}
                    />
                ) : (
                    <></>
                )
            }
        </>
    );
}