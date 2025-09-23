import type { JSX, RefObject } from "react";
import { useEffect, useState, useRef } from 'react';
import '@/assets/style.css';
import { Enemy, EnemyInfo } from "@/classes/enemies";
import { PauseMenu } from '@/components/game/pause';
import { Settings } from '@/components/game/settings';
import { GameOverMenu } from '@/components/game/over';
import { GameIcons, GameTextures, SettingsTextures } from '@/app/game/page';
import {
    RattlerSnake,
    Position,
    Size,
    ObstructionsArray,
    HEAD_POSITION
} from '@/classes/snake';
import {
    F_L_OBJECT,
    FIRST_LAYER_MAP_SIZE,
    MAP_2D
} from '@/maps/first_layer';

enum GAME_STATE {
    PLAY,
    PAUSE,
    OVER,
    SETTING
}

type FirstLayerObjectMapYComponent = Map<number, FiredHut | TreeObject>;
type FirstLayerObjectMap = Map<number, FirstLayerObjectMapYComponent>;

class FiredHut {

    private ctx: CanvasRenderingContext2D
    private firedHutAngles: HTMLImageElement[];
    private firedHutCurrentAngleIndex: number;
    private ANIMATE_COOL_DOWN_TIME = 150 // In ms
    private lastAnimationState = 0; // In ms
    private position: Position;
    private size: Size;

    constructor(
        ctx: CanvasRenderingContext2D,
        dx: number, dy: number,
        width: number, height: number,
        firedHutAngles: HTMLImageElement[]
    ) {
        this.firedHutAngles = firedHutAngles;
        this.ctx = ctx;
        const randomBytes = new Uint8Array(2);
        crypto.getRandomValues(randomBytes);
        const firedHutInitialAngleIndex = randomBytes[0] % firedHutAngles.length;
        this.firedHutCurrentAngleIndex = firedHutInitialAngleIndex;
        this.position = { x: dx, y: dy };
        this.size = { width, height };

        // Setting a random starting time
        const randomNumber = ((randomBytes[0] * randomBytes[1]) % 500); // Upto 500ms
        this.lastAnimationState = performance.now() + randomNumber;
    }

    public animate(): void {

        this.ctx.drawImage(
            this.firedHutAngles[this.firedHutCurrentAngleIndex],
            this.position.x,
            this.position.y,
            this.size.width,
            this.size.height
        );

        const currentState = performance.now();
        const currentAnimationDelay = currentState - this.lastAnimationState;

        if (currentAnimationDelay < this.ANIMATE_COOL_DOWN_TIME) return;
        this.lastAnimationState = currentState;

        this.firedHutCurrentAngleIndex++;
        if (this.firedHutCurrentAngleIndex >= this.firedHutAngles.length)
            this.firedHutCurrentAngleIndex = 0;
    }
}

class TreeObject {
    private position: Position;
    private size: Size;

    constructor(
        private ctx: CanvasRenderingContext2D,
        private treeTexture: HTMLImageElement,
        dx: number,
        dy: number,
        width: number,
        height: number
    ) {
        this.position = {
            x: dx,
            y: dy
        }
        this.size = {
            width,
            height
        }
    }

    public draw() {
        this.ctx.drawImage(
            this.treeTexture,
            this.position.x,
            this.position.y,
            this.size.width,
            this.size.height
        )
    }
}

function loadFirstLayerObjects(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    firedHutAngles: HTMLImageElement[],
    treeTexture: HTMLImageElement
) {
    const objectMap: FirstLayerObjectMap = new Map();

    const objectWidth = canvas.width / FIRST_LAYER_MAP_SIZE.X;
    const objectHeight = canvas.height / FIRST_LAYER_MAP_SIZE.Y;

    for (let y = 0; y < FIRST_LAYER_MAP_SIZE.Y; y++) {
        for (let x = 0; x < FIRST_LAYER_MAP_SIZE.X; x++) {

            if (MAP_2D[y][x] === null) continue;

            let yAxisMap: FirstLayerObjectMapYComponent = new Map();
            // Checking if there is already a map or not
            const firedHutObject = objectMap.get(x);
            if (firedHutObject) yAxisMap = firedHutObject;

            const objectPositionX = objectWidth * x;
            const objectPositionY = objectHeight * y;

            if (MAP_2D[y][x] === F_L_OBJECT.TREE) {
                yAxisMap.set(
                    y,
                    new TreeObject(
                        ctx,
                        treeTexture,
                        objectPositionX,
                        objectPositionY,
                        objectWidth,
                        objectHeight
                    )
                );
            }
            else if (MAP_2D[y][x] === F_L_OBJECT.FIRED_HUT) {
                yAxisMap.set(
                    y,
                    new FiredHut(
                        ctx,
                        objectPositionX,
                        objectPositionY,
                        objectWidth,
                        objectHeight,
                        firedHutAngles
                    )
                );
            }
            objectMap.set(x, yAxisMap);
        }
    }
    return objectMap;
}

function renderBackground(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    backgroundTexture: HTMLImageElement
): void {

    const backgroundTexturePattern = ctx.createPattern(backgroundTexture, 'repeat');
    if (!backgroundTexturePattern) throw new Error(
        'Failed to load background texture'
    );
    ctx.fillStyle = backgroundTexturePattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function renderFirstLayer(firstLayerObjectMap: FirstLayerObjectMap): void {

    // Rendering Trees textures
    for (let y = 0; y < FIRST_LAYER_MAP_SIZE.Y; y++) {
        for (let x = 0; x < FIRST_LAYER_MAP_SIZE.X; x++) {
            if (MAP_2D[y][x] === null) continue;
            const firstLayerObject = firstLayerObjectMap.get(x)?.get(y);
            if (!firstLayerObject) throw new Error(
                'Fired hut object was not loaded'
            );

            if (firstLayerObject instanceof TreeObject) {

                firstLayerObject.draw();
            }
            else if (firstLayerObject instanceof FiredHut) {

                firstLayerObject.animate();
            }
        }
    }
}

function renderSecondLayer(
    snake: RattlerSnake

): void {
    snake.update();
}

function detectFirstLayerObstructions(canvas: HTMLCanvasElement): ObstructionsArray {
    const obstructionsArray: ObstructionsArray = [];

    const objectWidth = canvas.width / FIRST_LAYER_MAP_SIZE.X;
    const objectHeight = canvas.height / FIRST_LAYER_MAP_SIZE.Y;

    // Analyzing first layer map
    for (let y = 0; y < FIRST_LAYER_MAP_SIZE.Y; y++) {
        for (let x = 0; x < FIRST_LAYER_MAP_SIZE.X; x++) {

            if (MAP_2D[y][x] === null) continue;

            const objectPositionX = objectWidth * x;
            const objectPositionY = objectHeight * y;

            obstructionsArray.push({
                x: objectPositionX,
                y: objectPositionY,
                width: objectWidth,
                height: objectHeight
            });
        }
    }

    return obstructionsArray;
}

function launchError(err: unknown) {
    throw err;
}

class MainGame {

    private scoreValue = 0;
    private quitRequested = false;
    private paused = false;
    private overed = false;
    private enemiesController: Enemy;
    private snakeObject: RattlerSnake;
    private firstLayerObstructions: ObstructionsArray;
    private onOverFn = (score: number) => { };
    private onScoreUpdateFn = (score: number) => { };
    private onPauseFn = () => { };
    private onResumeFn = () => { };

    constructor(
        private canvas: HTMLCanvasElement,
        private ctx: CanvasRenderingContext2D,
        private backgroundAudio: HTMLAudioElement,
        private TEXTURES: GameTextures,
        private firstLayerObjects: FirstLayerObjectMap
    ) {

        this.firstLayerObstructions = detectFirstLayerObstructions(this.canvas);

        this.snakeObject = new RattlerSnake(
            this.ctx,
            this.firstLayerObstructions,
            TEXTURES.SNAKE_HEAD,
            (() => { this.gameOver() }),
            ((val: number) => { this.updateScore(val) })
        );
        const enemiesInfo: EnemyInfo[] = [
            {
                texture: TEXTURES.PENGUS.BLUE,
                size: {
                    width: 50,
                    height: 77
                },
                value: 10
            },
            {
                texture: TEXTURES.PENGUS.RED,
                size: {
                    width: 50,
                    height: 64
                },
                value: 10
            },
            {
                texture: TEXTURES.PENGUS.PINK,
                size: {
                    width: 50,
                    height: 72
                },
                value: 10
            },
            {
                texture: TEXTURES.PENGUS.GREEN,
                size: {
                    width: 70,
                    height: 87
                },
                value: 50
            },
            {
                texture: TEXTURES.PENGUS.BLACK,
                size: {
                    width: 50,
                    height: 64
                },
                value: 10
            },
        ];
        this.enemiesController = new Enemy(this.canvas, this.ctx, enemiesInfo, [this.firstLayerObstructions], this.snakeObject)
        this.snakeObject.setEnemyController(this.enemiesController);
    }

    private gameLoop(): void {

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        renderBackground(this.canvas, this.ctx, this.TEXTURES.BACKGROUND);
        renderFirstLayer(this.firstLayerObjects);
        renderSecondLayer(this.snakeObject);
        this.enemiesController.draw();
        // setTimeout(() => {
        if (!this.paused && !this.quitRequested && !this.overed)
            window.requestAnimationFrame(() => { this.gameLoop() });
        // }, 1000);
    }

    public onOver(fn: (score: number) => void) {
        this.onOverFn = fn;
    }

    public onScoreUpdate(fn: (score: number) => void) {
        this.onScoreUpdateFn = fn;
    }

    public onPause(fn: () => void): void {
        this.onPauseFn = fn;
    }

    public onResume(fn: () => void): void {
        this.onResumeFn = fn;
    }

    public pause(): void {
        if (this.overed) return;
        this.paused = true;
        this.onPauseFn();
    }

    public resume(): void {
        this.paused = false;
        this.onResumeFn();
        this.gameLoop();
    }

    private gameOver(): void {
        this.overed = true;
        this.onOverFn(this.score);
    }

    public get isOvered(): boolean {
        return this.overed;
    }

    private updateScore(scoreValue: number) {
        this.scoreValue += scoreValue;
        this.onScoreUpdateFn(this.score);
    }

    public get score(): number {
        return this.scoreValue
    }

    public start(): void {

        // Starting to listen keyboard events
        window.onkeydown = (e) => {

            this.backgroundAudio.play();

            switch (e.key.toLowerCase()) {

                case 'w':
                case 'arrowup':
                    this.snakeObject.rotate(HEAD_POSITION.UP);
                    break;

                case 's':
                case 'arrowdown':
                    this.snakeObject.rotate(HEAD_POSITION.DOWN);
                    break;

                case 'd':
                case 'arrowright':
                    this.snakeObject.rotate(HEAD_POSITION.RIGHT);
                    break;

                case 'a':
                case 'arrowleft':
                    this.snakeObject.rotate(HEAD_POSITION.LEFT);
                    break;

                case 'p':
                case 'escape':
                    if (this.paused) this.resume();
                    else this.pause();
                    break;
            }
        }

        // Launching first enemy after
        setTimeout(() => {
            this.enemiesController.produce();
        }, 3000);

        // Initial health of snake
        this.snakeObject.increaseHealth(3);

        // Starting the game loop
        this.gameLoop();
    }

    public quit(): void {
        this.quitRequested = true;
    }
}

interface RattlerData {
    highScore: number;
}

interface GameComponentProps {
    gameBackgroundAudio: HTMLAudioElement;
    bannerImage: HTMLImageElement
    settingsMenuProps: {
        textures: SettingsTextures;
    },
    TEXTURES: GameTextures;
    icons: GameIcons;
    gameStatus: RefObject<{
        running: boolean;
    }>;
    mainMenu: () => void;
}

export function Game({
    gameBackgroundAudio,
    bannerImage,
    settingsMenuProps,
    TEXTURES,
    icons,
    gameStatus,
    mainMenu
}: GameComponentProps): JSX.Element {
    const [game, setGame] = useState(1);
    const [gameState, setGameState] = useState(GAME_STATE.PLAY);
    const [gameScore, setGameScore] = useState(0);
    const [gameHighScore, setGameHighScore] = useState(0);

    const gameWindow = useRef<HTMLCanvasElement>(null);
    const gameController = useRef<MainGame>(null);
    const pauseBtn = useRef<HTMLDivElement>(null);
    // const ctxGlobal = useRef<CanvasRenderingContext2D>(null);

    useEffect(() => {
        if (gameStatus.current.running) return;
        if (!gameWindow.current || !pauseBtn.current) throw new Error('Incomplete HTML');
        gameStatus.current.running = true;

        // loading high scores
        const sessionData = localStorage.getItem('rattlerData');
        if (sessionData) {
            try {
                const rattlerData: RattlerData = JSON.parse(sessionData);
                setGameHighScore(rattlerData.highScore);
            }
            catch {
                localStorage.clear();
            }
        }

        pauseBtn.current.replaceChildren(icons.pause);

        const c = gameWindow.current;
        const ctx = c.getContext('2d');
        if (!ctx) {
            alert('Update your brower to get set ready for the game :(');
            throw new Error('Browser is too older for managing high graphic engine');
        }


        (async () => {

            try {
                // const TEXTURES = await loadTextures();
                const firstLayerObjects = loadFirstLayerObjects(
                    c,
                    ctx,
                    TEXTURES.FIRED_HUT_ANGLES,
                    TEXTURES.TREE
                );

                gameController.current = new MainGame(c, ctx, gameBackgroundAudio, TEXTURES, firstLayerObjects);
                setGameScore(gameController.current.score);
                gameController.current.start();
                gameController.current.onOver(() => {
                    terminateGame();
                    setGameState(GAME_STATE.OVER);
                });
                gameController.current.onPause(() => {
                    setGameState(GAME_STATE.PAUSE);
                });
                gameController.current.onResume(() => {
                    setGameState(GAME_STATE.PLAY);
                });
                gameController.current.onScoreUpdate(setGameScore);
            }
            catch (err) {
                launchError(err);
            }
        })();

    }, [game]);

    useEffect(() => {
        if (!gameWindow.current) throw new Error('Invalid HTML');

        if (gameState !== GAME_STATE.PLAY)
            gameWindow.current.style.filter = 'blur(9px)';
        else
            gameWindow.current.style.filter = 'none';

        if (gameState === GAME_STATE.OVER && gameScore > gameHighScore)
            updateHighScore(gameScore);

    }, [gameState]);

    const updateHighScore = (score: number) => {
        const rattlerData: RattlerData = {
            highScore: score
        }
        localStorage.setItem('rattlerData', JSON.stringify(rattlerData));
        setGameHighScore(score);
    }

    const pauseGame = () => {
        if (!gameController.current) throw new Error('Invalid HTML');
        gameController.current.pause();
    }

    const resumeGame = () => {
        if (!gameController.current) throw new Error('Game controller not found');
        gameController.current.resume();
        setGameState(GAME_STATE.PLAY);
        if (gameController.current.isOvered) setGameState(GAME_STATE.OVER);
    }

    const openSettings = () => {
        setGameState(GAME_STATE.SETTING);
    }

    const newGame = () => {
        setGame(game + 1);
        setGameState(GAME_STATE.PLAY);
    }

    const terminateGame = () => {
        gameStatus.current.running = false;
    }

    const leaveGame = () => {
        terminateGame();
        mainMenu();
    }

    return (
        <>
            <div className={'gameBar'}>
                <div
                    className={'pause game-btn'}
                    ref={pauseBtn}
                    onClick={pauseGame}
                ></div>
                <div className={'game-box sm'}>SCORE: {gameScore}</div>
            </div>
            <canvas height={900} width={1100} ref={gameWindow} />
            {
                gameState === GAME_STATE.SETTING ? (
                    <Settings
                        bannerImage={bannerImage}
                        gotoParent={pauseGame}
                        textures={settingsMenuProps.textures}
                    />
                ) : gameState === GAME_STATE.PAUSE ? (
                    <PauseMenu
                        bannerImage={bannerImage}
                        score={{
                            current: gameScore,
                            high: gameHighScore
                        }}
                        resume={resumeGame}
                        callSettings={openSettings}
                        mainMenu={leaveGame}
                    />

                ) : gameState === GAME_STATE.OVER ? (
                    <GameOverMenu
                        bannerImage={bannerImage}
                        score={{
                            current: gameScore,
                            high: gameHighScore
                        }}
                        playAgain={newGame}
                        mainMenu={mainMenu}
                    />

                ) : (
                    <>
                    </>
                )
            }
        </>
    )
}