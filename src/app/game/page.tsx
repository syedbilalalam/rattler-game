'use client'
import type { Dispatch, JSX, SetStateAction } from "react";
import { useEffect } from 'react';
import swal from 'sweetalert2';
import { Enemy, EnemyInfo } from "@/classes/enemies";
import '@/assets/style.css';
import {
    F_L_OBJECT,
    FIRST_LAYER_MAP_SIZE,
    MAP_2D
} from '@/maps/first_layer';
import {
    RattlerSnake,
    Position,
    Size,
    ObstructionsArray,
    HEAD_POSITION
} from '@/classes/snake';


type UseState<T> = [T, Dispatch<SetStateAction<T>>];

enum ERROR_MSGS {
    TEXTURE_FAILED = 'There some issues while loading some textures'
}

interface GameTextures {
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
    private onOverFn = () => { };
    private onScoreUpdateFn = () => { };

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
                    height: 50
                },
                value: 10
            },
            {
                texture: TEXTURES.PENGUS.RED,
                size: {
                    width: 50,
                    height: 50
                },
                value: 10
            },
            {
                texture: TEXTURES.PENGUS.PINK,
                size: {
                    width: 50,
                    height: 50
                },
                value: 10
            },
            {
                texture: TEXTURES.PENGUS.GREEN,
                size: {
                    width: 70,
                    height: 70
                },
                value: 50
            },
            {
                texture: TEXTURES.PENGUS.BLACK,
                size: {
                    width: 50,
                    height: 50
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


    public pause(): void {
        this.paused = true;
    }

    public resume(): void {
        this.paused = false;
        this.gameLoop();
    }

    private gameOver(): void {
        this.overed = true;
        this.onOverFn();
    }

    public get isOvered(): boolean {
        return this.overed;
    }

    public onOver(fn: () => void) {
        this.onOverFn = fn;
    }

    public onScoreUpdate(fn: () => void) {
        this.onScoreUpdateFn = fn;
    }

    private updateScore(scoreValue: number) {
        this.scoreValue += scoreValue;
        this.onScoreUpdateFn();
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


export default function Page(): JSX.Element {

    useEffect(() => {

        const gameBackgroundAudio = new Audio('/audio/musics/game_1.mp3');
        gameBackgroundAudio.loop = true;

        const startGame = () => {
            swal.fire({
                text: 'Start game ?',
                allowOutsideClick: false
            }).then((e) => {
                if (e.isConfirmed)
                    document.body.requestFullscreen();
            });
        }
        let popupOpened = false;
        const gameWindowSizeUpdater = async () => {
            if (window.innerWidth - 300 <= window.innerHeight) {
                // window.onresize = null;
                if (popupOpened) return;
                popupOpened = true;
                await swal.fire({
                    text: 'This game is not designed to run in Potrait mode'
                });
                popupOpened = false;
                window.onresize = gameWindowSizeUpdater;
                gameWindowSizeUpdater();

            } else {
                // swal.close();
                if (popupOpened) startGame();
                popupOpened = false;
            }
        }

        const c = document.getElementById('gameWindow') as HTMLCanvasElement;
        if (!c) throw new Error('Incomple JSX, Required game window is not present');
        const ctx = c.getContext('2d');
        if (!ctx) {
            alert('Update your brower to get set ready for the game :(');
            throw new Error('Browser is too older for managing high graphic engine');
        }

        const isDevHere = (new URLSearchParams(window.location.search)).get('dev');
        if (!isDevHere) {
            window.onresize = gameWindowSizeUpdater;
            gameWindowSizeUpdater();

            alert(
                'This game is in its every early build, snake body is currently under development and testing for perfect physics and geometric calculations'
            );

            startGame();
        }


        (async () => {

            try {
                const TEXTURES = await loadTextures();
                const firstLayerObjects = loadFirstLayerObjects(
                    c,
                    ctx,
                    TEXTURES.FIRED_HUT_ANGLES,
                    TEXTURES.TREE
                );

                let game = new MainGame(c, ctx, gameBackgroundAudio, TEXTURES, firstLayerObjects);
                game.start();
                game.onScoreUpdate(()=> {console.log(game.score)});
                game.onOver(()=> {console.log('game overed'); game = new MainGame(c, ctx, gameBackgroundAudio, TEXTURES, firstLayerObjects); game.start() });

            }
            catch (err) {
                launchError(err);
            }
        })();
    }, []);

    return (
        <>
            <img id={'backgroundImage'} src={'/images/game_background.png'} alt={'Failed to load game background image'} />
            {<canvas id={'gameWindow'} height={900} width={1100} />}
        </>
    )
}