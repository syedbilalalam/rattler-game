'use client'
import { type JSX, useEffect, useRef, useState } from 'react';
import { Game } from '@/components/game/game';
import { HomeScreen } from '@/components/game/home';
import { Settings } from '@/components/game/settings';

enum SCREEN {
    HOME,
    SETTING,
    PAUSE,
    GAME
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

export default function Page(): JSX.Element {

    const [screenType, updateScreenType] = useState(SCREEN.HOME);
    const [gameLoaded, updateGameLoadingStatus] = useState(false);

    // For loading things
    const gameBackgroundAudio = useRef<HTMLAudioElement>(null);
    const TEXTURES = useRef<GameTextures>(null);
    const gameIcons = useRef<GameIcons>(null);
    const bannerImage = useRef<HTMLImageElement>(null);
    const settingsTextures = useRef<SettingsTextures>(null);
    const gameStatus = useRef({
        running: false
    });

    useEffect(() => {
        (async () => {

            // Loading audios
            const audioRawBlob = await (await fetch('/audio/musics/game_1.dat')).blob();
            const audioBlob = new Blob([audioRawBlob], { type: 'audio/mpeg' })
            const url = URL.createObjectURL(audioBlob);
            gameBackgroundAudio.current = new Audio(url);
            gameBackgroundAudio.current.loop = true;
            gameBackgroundAudio.current.onload = () => {
                URL.revokeObjectURL(url);
            }

            TEXTURES.current = await loadTextures();

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

            updateGameLoadingStatus(true);
        })();
    }, []);

    useEffect(() => {
        // Resetting window events
        window.onresize = () => { };
    }, [screenType]);

    const startGame = () => {
        updateScreenType(SCREEN.GAME);
    }

    const openSettings = () => {
        updateScreenType(SCREEN.SETTING);
    }

    const gotoHome = () => {
        updateScreenType(SCREEN.HOME);
    }

    return (
        <>
            {/* Background image */}
            <img id={'backgroundImage'} src={'/images/game_background.png'} alt={'Failed to load game background image'} />

            {/* {HomeScreen({ startGame })} */}

            {
                !gameLoaded ? (
                    <>Loading...</>
                ) : (screenType === SCREEN.HOME) ? (

                    <HomeScreen
                        startGame={startGame}
                        openSettings={openSettings}
                        bannerImage={bannerImage.current!}
                    />

                ) : (screenType === SCREEN.GAME) ? (

                    <Game
                        gameBackgroundAudio={gameBackgroundAudio.current!}
                        TEXTURES={TEXTURES.current!}
                        bannerImage={bannerImage.current!}
                        settingsMenuProps={{
                            textures: settingsTextures.current!
                        }}
                        gameStatus={gameStatus}
                        icons={gameIcons.current!}
                        mainMenu={gotoHome}
                    />

                ) : (screenType === SCREEN.SETTING) ? (
                    <Settings
                        bannerImage={bannerImage.current!}
                        gotoParent={gotoHome}
                        textures={settingsTextures.current!}
                    />
                ) : (
                    <></>
                )
            }
        </>
    );
}