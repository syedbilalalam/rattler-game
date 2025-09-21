'use client'
import type { Dispatch, JSX, SetStateAction } from "react";
import { useState, useEffect } from 'react';
import swal from 'sweetalert2';
import '@/assets/style.css';
import {
    F_L_OBJECT,
    FIRST_LAYER_MAP_SIZE,
    MAP_2D
} from '@/maps/first_layer';
import {
    RattlerSnake,
    ObjectSize,
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
        ]
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

    // Rendering background texture
    // for (let row = 0; row < 9; row++)
    //     for (let column = 0; column < 9; column++)
    //         ctx.drawImage(backgroundTexture, (column * 100), (row * 82), 100, 82);
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
                const firstLayerObstructions = detectFirstLayerObstructions(c);
                const snakeObject = new RattlerSnake(
                    ctx,
                    firstLayerObstructions,
                    TEXTURES.SNAKE_HEAD
                );

                // Starting to listen keyboard events
                window.onkeydown = (e) => {

                    gameBackgroundAudio.play();

                    switch (e.key.toLowerCase()) {

                        case 'w':
                        case 'arrowup':
                            snakeObject.rotate(HEAD_POSITION.UP);
                            break;

                        case 's':
                        case 'arrowdown':
                            snakeObject.rotate(HEAD_POSITION.DOWN);
                            break;

                        case 'd':
                        case 'arrowright':
                            snakeObject.rotate(HEAD_POSITION.RIGHT);
                            break;

                        case 'a':
                        case 'arrowleft':
                            snakeObject.rotate(HEAD_POSITION.LEFT);
                            break;

                        case 'e':
                            snakeObject.increaseHealth(10);
                            break;

                    }
                }

                const gameLoop = () => {
                    ctx.clearRect(0, 0, c.width, c.height);
                    renderBackground(c, ctx, TEXTURES.BACKGROUND);
                    renderFirstLayer(firstLayerObjects);
                    renderSecondLayer(snakeObject);


                    // let gradient = ctx.createLinearGradient(100, 100, 200, 0);
                    // gradient.addColorStop(0, 'white');
                    // gradient.addColorStop(0.5, 'yellow');
                    // gradient.addColorStop(1, 'white');
                    // ctx.fillStyle = gradient;
                    // ctx.rect(
                    //     100,
                    //     100,
                    //     100,
                    //     100
                    // )
                    // ctx.fill();


                    // let x = 50, y = 50, w = 300, h = 100, r = 30; // rect + radius
                    // ctx.beginPath();
                    // // Start at top-left + radius
                    // ctx.moveTo(x + r, y);
                    // // Top edge
                    // ctx.lineTo(x + w, y);
                    // // Right edge
                    // ctx.lineTo(x + w, y + h);
                    // // Bottom edge
                    // ctx.lineTo(x, y + h);
                    // // Left edge up until curve start
                    // ctx.lineTo(x, y + r);
                    // // Top-left corner curve
                    // ctx.quadraticCurveTo(x, y, x + r, y);
                    // ctx.closePath();

                    // ctx.fillStyle = 'white';
                    // ctx.fill();

                    // setTimeout(() => {
                    window.requestAnimationFrame(gameLoop);
                    // }, 1000);
                }
                gameLoop();
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