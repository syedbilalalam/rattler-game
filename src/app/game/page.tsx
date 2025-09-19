'use client'
import type { Dispatch, JSX, SetStateAction } from "react";
import { useState, useEffect } from 'react';
import '../../../assets/style.css';
import { F_L_OBJECT, FIRST_LAYER_MAP_SIZE, MAP_2D } from '@/maps/first_layer';
import swal from 'sweetalert2';


type UseState<T> = [T, Dispatch<SetStateAction<T>>];

interface Axis {
    x: number,
    y: number;
}
interface ObjectSize {
    height: number;
    width: number;
}
interface TreeParams {
    position: Axis;
    size: ObjectSize;
}
interface RenderFirstLayerParams {
    gameWindowSize: ObjectSize;
}

enum ERROR_MSGS {
    TEXTURE_FAILED = 'There some issues while loading some textures'
}

// function Tree({ position, size }: TreeParams): JSX.Element {
//     const elementPosition = {
//         top: position.y * size.height,
//         left: position.x * size.width
//     }
//     return (
//         <>
//             <img
//                 className={'firstLayerObject'} src={'/images/tree_with_shadow.png'}
//                 height={size.height}
//                 width={size.width}
//                 style={{
//                     top: `${elementPosition.top}px`,
//                     left: `${elementPosition.left}px`
//                 }}
//             />
//         </>
//     );
// }

// function Hut({ position, size }: TreeParams): JSX.Element {

//     const HUT_IMAGE_URLS = [
//         '/images/fired_hut_angles/1.png',
//         '/images/fired_hut_angles/2.png',
//         '/images/fired_hut_angles/3.png',
//         '/images/fired_hut_angles/4.png'
//     ]
//     const [hutImageUrlCounter, setHutImageUrlCounter] = useState(0);
//     const elementPosition = {
//         top: position.y * size.height,
//         left: position.x * size.width
//     }

//     function animateHut() {
//         // console.log('we are running yay');
//         if (hutImageUrlCounter > (HUT_IMAGE_URLS.length - 2))
//             setHutImageUrlCounter(0);
//         else
//             setHutImageUrlCounter(hutImageUrlCounter + 1);
//     }

//     useEffect(() => {

//         setTimeout(() => {
//             window.requestAnimationFrame(animateHut);
//             // animateHut();
//         }, 150);
//         // console.log(hutImageUrlCounter);
//     }, [hutImageUrlCounter])

//     // useEffect(() => {
//     //     animateHut();
//     // }, []);
//     return (
//         <>
//             <img
//                 className={'firstLayerObject'} src={HUT_IMAGE_URLS[hutImageUrlCounter]}
//                 height={size.height}
//                 width={size.width}
//                 style={{
//                     top: `${elementPosition.top}px`,
//                     left: `${elementPosition.left}px`
//                 }}
//             />
//         </>
//     );
// }

// function RenderFirstLayer() {
//     const [texturesLoaded, setTexturesLoadingState] = useState(false);
//     const [treeTexture, setTreeTexture] = useState(null) as UseState<HTMLImageElement | null>;
//     const [backgroundTexture, setBackgroundTexture] = useState(null) as UseState<HTMLImageElement | null>;
//     const [textureInit, setTextureInit] = useState(false);

//     useEffect(() => {
//         setTreeTexture(new Image());
//         setBackgroundTexture(new Image());
//         setTextureInit(true);
//     }, []);

//     useEffect(() => {

//         if (!textureInit) return;
//         if (!treeTexture || !backgroundTexture) throw new Error(ERROR_MSGS.TEXTURE_FAILED);

//         const loadingTasks: Promise<void>[] = [];

//         backgroundTexture.src = '/images/grass.png';
//         treeTexture.src = '/images/tree.png';

//         loadingTasks.push(new Promise((resolve, reject) => {
//             backgroundTexture.onload = () => {
//                 resolve();
//             }
//             backgroundTexture.onerror = (err) => {
//                 reject(err);
//             }
//         }));

//         loadingTasks.push(new Promise((resolve, reject) => {
//             treeTexture.onload = () => {
//                 resolve();
//             }
//             treeTexture.onerror = (err) => {
//                 reject(err);
//             }
//         }));

//         (async () => {
//             await Promise.all(loadingTasks);
//             setTexturesLoadingState(true);
//         })();

//     }, [textureInit]);

//     useEffect(() => {
//         if (!texturesLoaded) return;
//         if (!backgroundTexture) throw new Error(ERROR_MSGS.TEXTURE_FAILED);

//         const c = document.getElementById('gameWindow') as HTMLCanvasElement;
//         if (!c) throw new Error('Incomple JSX, Required game window is not present');
//         const ctx = c.getContext('2d');
//         if (!ctx) {
//             alert('Update your brower to get set ready for the game :(');
//             throw new Error('Browser is too older for managing high graphic engine');
//         }

//         // Rendering background texture
//         ctx.drawImage(backgroundTexture, 1, 1, 25, 20);


//     }, [texturesLoaded]);

//     // const objectSize = {
//     //     height: gameWindowSize.height / FIRST_LAYER_MAP_SIZE.Y,
//     //     width: gameWindowSize.width / FIRST_LAYER_MAP_SIZE.X
//     // };

//     // return (
//     //     <>
//     //         {(() => {
//     //             const treesArray: JSX.Element[] = [];
//     //             let childIdCounter = 0;
//     //             for (let objY = 0; objY < FIRST_LAYER_MAP_SIZE.Y; objY++) {
//     //                 for (let objX = 0; objX < FIRST_LAYER_MAP_SIZE.X; objX++) {

//     //                     if (TREES_MAP_2D[objY][objX]) {

//     //                         treesArray.push(
//     //                             <Tree
//     //                                 key={++childIdCounter}
//     //                                 position={{
//     //                                     x: objX,
//     //                                     y: objY
//     //                                 }}
//     //                                 size={objectSize}
//     //                             />

//     //                         );
//     //                     }
//     //                     else if (HUTS_MAP_2D[objY][objX]) {
//     //                         treesArray.push(
//     //                             <Hut
//     //                                 key={++childIdCounter}
//     //                                 position={{
//     //                                     x: objX,
//     //                                     y: objY
//     //                                 }}
//     //                                 size={objectSize}
//     //                             />

//     //                         );
//     //                     }
//     //                 }
//     //             }
//     //             return treesArray;
//     //         })()}
//     //     </>
//     // );
// }


function TreeWithShadow(): JSX.Element {
    return (
        <>
            <img className={'tree'} src={'/images/tree_with_shadow.png'} />
        </>
    )
}

function MyFirstEveryCanvas(): JSX.Element {
    useEffect(() => {
        const c = document.getElementById('canvas') as HTMLCanvasElement;
        if (!c) throw new Error('Canvas not found');

        const ctx = c.getContext('2d');
        if (!ctx) {
            alert('Update your brower to get set ready for the game :(');
            throw new Error('Browser is too older for managing high graphic engine');
        }

        const img = new Image();
        const img2 = new Image();
        img.src = "/images/grass.png";
        img2.src = "/images/tree.png";
        img.onload = () => {
            ctx.drawImage(img, 10, 250, 100, 100); // x,y,w,h
        };
        img2.onload = () => {
            ctx.drawImage(img2, 8, 240, 50, 50);
            ctx.clearRect(8, 240, 25, 25);
        }

    }, []);

    return (
        <>
            <canvas id="canvas" height={500} width={600}></canvas>
            <img src="/images/grass.png" alt="" />
        </>
    )
}
interface GameTextures {
    BACKGROUND: HTMLImageElement;
    TREE: HTMLImageElement;
    SNAKE_HEAD: HTMLImageElement;
    FIRED_HUT_ANGLES: HTMLImageElement[];
}
type FirstLayerObjectMapYComponent = Map<number, FiredHut | TreeObject>;
type FirstLayerObjectMap = Map<number, FirstLayerObjectMapYComponent>;


type Position = {
    x: number;
    y: number;
}
type Size = {
    width: number;
    height: number;
}

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

type ObstructionsArray = { x: number; y: number; width: number; height: number; }[];
function renderFirstLayer(

    ctx: CanvasRenderingContext2D,
    backgroundTexture: HTMLImageElement,
    firstLayerObjectMap: FirstLayerObjectMap

): void {

    // Rendering background texture
    for (let row = 0; row < 9; row++)
        for (let column = 0; column < 9; column++)
            ctx.drawImage(backgroundTexture, (column * 100), (row * 82), 100, 82);

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

function isPointObstructed(obstructionsArray: ObstructionsArray, point: Point): boolean {

    for (const obstruction of obstructionsArray) {
        if (
            point.x >= obstruction.x && point.x <= (obstruction.x + obstruction.width)
            &&
            point.y >= obstruction.y && point.y <= (obstruction.y + obstruction.height)

        ) return true;
    }

    return false;
}

enum HEAD_POSITION {
    UP,
    DOWN,
    RIGHT,
    LEFT
}
enum TAIL_POSITION {
    UP,
    DOWN,
    RIGHT,
    LEFT,
    END
}

interface BodyPartState extends Position {
    headPosition: HEAD_POSITION
    tailPosition: TAIL_POSITION
}

class SnakeHead {
    protected position: Position = {
        x: 150,
        y: 150
    };
    private state: BodyPartState = {
        x: this.position.x,
        y: this.position.y,
        headPosition: HEAD_POSITION.UP,
        tailPosition: TAIL_POSITION.DOWN
    };
    protected size: Size = {
        width: 40,
        height: 70
    };
    private halfSnakeWidth: number = this.size.width / 2;
    private halfSnakeHeight = this.size.height / 2;
    private rotateRequested = false;
    protected readonly SNAKE_SPEED = 20;

    constructor(
        protected ctx: CanvasRenderingContext2D,
        private obstructionArray: ObstructionsArray,
        private snakeTexture: HTMLImageElement
    ) { }

    protected rotateSnakeHead(headPosition: HEAD_POSITION) {
        this.state.headPosition = headPosition;

        switch (this.state.headPosition) {

            case HEAD_POSITION.UP:
                this.state.tailPosition = TAIL_POSITION.DOWN
                break;

            case HEAD_POSITION.DOWN:
                this.state.tailPosition = TAIL_POSITION.UP
                break;

            case HEAD_POSITION.RIGHT:
                this.state.tailPosition = TAIL_POSITION.LEFT
                break;

            case HEAD_POSITION.LEFT:
                this.state.tailPosition = TAIL_POSITION.RIGHT
                break;
        }

    }

    private updatePosition(x: number, y: number): boolean {

        const SnakeHeadPoints: Point[] = [];

        SnakeHeadPoints.push({
            x: x - this.halfSnakeWidth,
            y: y + this.halfSnakeHeight
        });
        SnakeHeadPoints.push({
            x: x + this.halfSnakeWidth,
            y: y + this.halfSnakeHeight
        });

        SnakeHeadPoints.push({
            x: x - this.halfSnakeWidth,
            y: y - this.halfSnakeHeight
        });

        SnakeHeadPoints.push({
            x: x + this.halfSnakeWidth,
            y: y - this.halfSnakeHeight
        });

        let obstructed = false;
        for (const { x, y } of SnakeHeadPoints) {
            if (isPointObstructed(this.obstructionArray, { x, y })) {
                obstructed = true;
                break;
            }
        }

        if (obstructed) {
            // Updating state
            this.state.x = 0;
            this.state.y = 0;

            return false;
        }
        else {
            // Updating state
            this.state.x = x - this.position.x;
            this.state.y = y - this.position.y;

            this.position = { x, y };
            return true;
        }

    }

    public moveForward(): boolean {
        switch (this.state.headPosition) {

            case HEAD_POSITION.UP:
                return this.updatePosition(this.position.x, this.position.y - this.SNAKE_SPEED);

            case HEAD_POSITION.DOWN:
                return this.updatePosition(this.position.x, this.position.y + this.SNAKE_SPEED);

            case HEAD_POSITION.RIGHT:
                return this.updatePosition(this.position.x + this.SNAKE_SPEED, this.position.y);

            case HEAD_POSITION.LEFT:
                return this.updatePosition(this.position.x - this.SNAKE_SPEED, this.position.y);
        }
    }

    protected get headState(): BodyPartState {
        return {
            x: this.position.x,
            y: this.position.y,
            headPosition: this.state.headPosition,
            tailPosition: this.state.tailPosition
        }
    }

    protected updateSnakeHead(): void {

        this.moveForward();
        this.ctx.save(); // save current state
        this.ctx.translate(this.position.x, this.position.y); // move origin to (x, y)
        switch (this.state.headPosition) {

            case HEAD_POSITION.UP:
                this.ctx.rotate(0);   // rotate canvas
                break;

            case HEAD_POSITION.DOWN:
                this.ctx.rotate(Math.PI);   // rotate canvas
                break;

            case HEAD_POSITION.RIGHT:
                this.ctx.rotate(Math.PI / 2);   // rotate canvas
                break;

            case HEAD_POSITION.LEFT:
                this.ctx.rotate(Math.PI / 2 + Math.PI);   // rotate canvas
                break;
        }
        this.ctx.drawImage(

            this.snakeTexture,
            -this.halfSnakeWidth,
            -this.size.height,
            this.size.width,
            this.size.height

        ); // draw with center at origin
        this.ctx.restore(); // restore state (no rotation for next draw)
    }
}

class SnakeTummy {
    private readonly SNAKE_TUMMY_STROKE = 1;
    private size: Size;
    public tailPart: SnakeTummy | null = null;
    private state: BodyPartState;
    private halfTummySize;

    // private halfTummyWidthWithStroke = (this.SNAKE_TUMMY_STROKE * 2) + this.halfTummyWidth;
    // private halfTummyHeightWithStroke = (this.SNAKE_TUMMY_STROKE * 2) + this.halfTummyHeight;
    private readonly SNAKE_TUMMY_SIZES: {
        STRAIGHT: number,
        TURN: number
    };
    constructor(
        private ctx: CanvasRenderingContext2D,
        headPosition: HEAD_POSITION,
        tailPosition: TAIL_POSITION,
        public position: Position,
        tummySize: number
    ) {
        if (HEAD_POSITION[headPosition] === TAIL_POSITION[tailPosition]) throw new Error(
            "Logic error snake's tummay can't have same head and tail values"
        );

        this.state = {
            x: 0,
            y: 0,
            headPosition,
            tailPosition
        }

        this.size = {
            width: tummySize,
            height: tummySize
        }
        this.halfTummySize = this.size.width / 2;

        this.SNAKE_TUMMY_SIZES = {

            TURN: this.size.width - this.SNAKE_TUMMY_STROKE,

            STRAIGHT: this.size.width - (this.SNAKE_TUMMY_STROKE * 2)
        }

    }

    private updatePosition(x: number, y: number): void {
        this.position.x = x;
        this.position.y = y;
    }

    public updateState(newState: BodyPartState): void {

        this.tailPart?.updateState({ ...this.state });

        // let newPosition: Position = { x: newState.x, y: newState.y };

        // switch (newState.tailPosition) {

        //     case TAIL_POSITION.UP:
        //         newPosition = {
        //             x: newState.x,
        //             y: newState.y - this.size.height
        //         };
        //         break;

        //     case TAIL_POSITION.DOWN:
        //         newPosition = {
        //             x: newState.x,
        //             y: newState.y + this.size.height
        //         };
        //         break;

        //     case TAIL_POSITION.RIGHT:
        //         newPosition = {
        //             x: newState.x + this.size.width,
        //             y: newState.y
        //         };
        //         break;

        //     case TAIL_POSITION.LEFT:
        //         newPosition = {
        //             x: newState.x - this.size.width,
        //             y: newState.y
        //         };
        //         break;

        // }

        // if (
        //     newState.headPosition !== this.state.headPosition &&
        //     newState.tailPosition !== this.state.tailPosition
        // ) {

        //     this.state = {
        //         x: newState.x,
        //         y: newState.y,
        //         headPosition: newState.headPosition,
        //         tailPosition: this.state.tailPosition
        //     }
        // }
        // else if (
        //     newState.headPosition === this.state.headPosition &&
        //     newState.tailPosition !== this.state.tailPosition
        // ) {

        //     this.state = {
        //         x: newState.x,
        //         y: newState.y,
        //         headPosition: newState.headPosition,
        //         tailPosition: newState.tailPosition
        //     }
        // }
        // else {
        //     this.state = {
        //         x: newState.x,
        //         y: newState.y,
        //         headPosition: this.state.headPosition,
        //         tailPosition: this.state.tailPosition
        //     }
        // }
        this.state = { ...newState };
        this.updatePosition(
            this.state.x,
            this.state.y
        );
    }

    public get getState(): BodyPartState {
        return this.state;
    }

    public setHead(headPosition: HEAD_POSITION): void {

        if (this.state.headPosition === headPosition) return;

        switch (this.state.tailPosition) {

            case TAIL_POSITION.UP:
                this.tailPart?.setHead(HEAD_POSITION.UP);
                break;

            case TAIL_POSITION.DOWN:
                this.tailPart?.setHead(HEAD_POSITION.DOWN);
                break;

            case TAIL_POSITION.RIGHT:
                this.tailPart?.setHead(HEAD_POSITION.RIGHT);
                break;

            case TAIL_POSITION.LEFT:
                this.tailPart?.setHead(HEAD_POSITION.LEFT);
                break;
        }


        switch (this.state.headPosition) {

            case HEAD_POSITION.UP:
                this.state.tailPosition = TAIL_POSITION.UP;
                break;

            case HEAD_POSITION.DOWN:
                this.state.tailPosition = TAIL_POSITION.DOWN;
                break;

            case HEAD_POSITION.RIGHT:
                this.state.tailPosition = TAIL_POSITION.RIGHT;
                break;

            case HEAD_POSITION.LEFT:
                this.state.tailPosition = TAIL_POSITION.LEFT;
                break;
        }

        this.state.headPosition = headPosition;
    }

    public update(): void {

        this.ctx.save(); // save current state
        this.ctx.translate(this.position.x, this.position.y); // move origin to (x, y)

        // this.ctx.drawImage(

        //     this.snakeTexture,
        //     -this.halfSnakeWidth,
        //     -this.size.height,
        //     this.size.width,
        //     this.size.height


        // this.ctx.beginPath();
        // this.ctx.rect(
        //     - this.halfTummyWidth,
        //     - this.halfTummyHeight,
        //     this.size.width,
        //     this.size.height
        // );
        // this.ctx.fillStyle = "green";
        // this.ctx.fill();
        // this.ctx.lineWidth = 2;
        // this.ctx.strokeStyle = "black";
        // this.ctx.stroke();


        this.ctx.beginPath();
        this.ctx.rect(
            - this.halfTummySize,
            - this.halfTummySize,
            this.size.width,
            this.size.height
        );
        // this.ctx.strokeStyle = "#000";
        // this.ctx.fillStyle = "#a72020ff";
        this.ctx.fillStyle = "#000";
        this.ctx.lineWidth = this.SNAKE_TUMMY_STROKE;
        // this.ctx.stroke();
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.fillStyle = "#33ad24";
        // this.ctx.fillStyle = "#4b24adff";

        // console.log(HEAD_POSITION[this.state.headPosition] + ' _ ' + TAIL_POSITION[this.state.tailPosition]);
        if (
            (
                this.state.headPosition === HEAD_POSITION.UP &&
                this.state.tailPosition === TAIL_POSITION.DOWN
            ) ||
            (
                this.state.headPosition === HEAD_POSITION.DOWN &&
                this.state.tailPosition === TAIL_POSITION.UP
            )
        ) {
            this.ctx.rect(
                - this.halfTummySize + this.SNAKE_TUMMY_STROKE,
                - this.halfTummySize,
                this.SNAKE_TUMMY_SIZES.STRAIGHT,
                this.size.height
            )
        }
        else if (
            (
                this.state.headPosition === HEAD_POSITION.RIGHT &&
                this.state.tailPosition === TAIL_POSITION.LEFT
            ) ||
            (
                this.state.headPosition === HEAD_POSITION.LEFT &&
                this.state.tailPosition === TAIL_POSITION.RIGHT
            )
        ) {
            this.ctx.rect(
                - this.halfTummySize,
                - this.halfTummySize + this.SNAKE_TUMMY_STROKE,
                this.size.width,
                this.SNAKE_TUMMY_SIZES.STRAIGHT
            )
        }
        else if (
            (
                this.state.headPosition === HEAD_POSITION.RIGHT &&
                this.state.tailPosition === TAIL_POSITION.DOWN
            ) ||
            (
                this.state.headPosition === HEAD_POSITION.DOWN &&
                this.state.tailPosition === TAIL_POSITION.RIGHT
            )
        ) {

            this.ctx.rect(
                - this.halfTummySize + this.SNAKE_TUMMY_STROKE,
                - this.halfTummySize + this.SNAKE_TUMMY_STROKE,
                this.SNAKE_TUMMY_SIZES.TURN,
                this.SNAKE_TUMMY_SIZES.TURN
            )
        }
        else if (
            (
                this.state.headPosition === HEAD_POSITION.LEFT &&
                this.state.tailPosition === TAIL_POSITION.DOWN
            ) ||
            (
                this.state.headPosition === HEAD_POSITION.DOWN &&
                this.state.tailPosition === TAIL_POSITION.LEFT
            )
        ) {

            this.ctx.rect(
                - this.halfTummySize - this.SNAKE_TUMMY_STROKE,
                - this.halfTummySize + this.SNAKE_TUMMY_STROKE,
                this.SNAKE_TUMMY_SIZES.TURN,
                this.SNAKE_TUMMY_SIZES.TURN
            )
        }
        else if (
            (
                this.state.headPosition === HEAD_POSITION.RIGHT &&
                this.state.tailPosition === TAIL_POSITION.UP
            ) ||
            (
                this.state.headPosition === HEAD_POSITION.UP &&
                this.state.tailPosition === TAIL_POSITION.RIGHT
            )
        ) {

            this.ctx.rect(
                - this.halfTummySize + this.SNAKE_TUMMY_STROKE,
                - this.halfTummySize - this.SNAKE_TUMMY_STROKE,
                this.SNAKE_TUMMY_SIZES.TURN,
                this.SNAKE_TUMMY_SIZES.TURN
            )
        }
        else if (
            (
                this.state.headPosition === HEAD_POSITION.LEFT &&
                this.state.tailPosition === TAIL_POSITION.UP
            ) ||
            (
                this.state.headPosition === HEAD_POSITION.UP &&
                this.state.tailPosition === TAIL_POSITION.LEFT
            )
        ) {

            this.ctx.rect(
                - this.halfTummySize - this.SNAKE_TUMMY_STROKE,
                - this.halfTummySize - this.SNAKE_TUMMY_STROKE,
                this.SNAKE_TUMMY_SIZES.TURN,
                this.SNAKE_TUMMY_SIZES.TURN
            )
        }
        else if (
            this.state.headPosition === HEAD_POSITION.UP &&
            this.state.tailPosition === TAIL_POSITION.END
        ) {

            this.ctx.rect(
                - this.halfTummySize,
                - this.halfTummySize - this.SNAKE_TUMMY_STROKE,
                this.SNAKE_TUMMY_SIZES.STRAIGHT,
                this.SNAKE_TUMMY_SIZES.TURN
            )
        }
        else if (
            this.state.headPosition === HEAD_POSITION.DOWN &&
            this.state.tailPosition === TAIL_POSITION.END
        ) {

            this.ctx.rect(
                - this.halfTummySize,
                - this.halfTummySize + this.SNAKE_TUMMY_STROKE,
                this.SNAKE_TUMMY_SIZES.STRAIGHT,
                this.SNAKE_TUMMY_SIZES.TURN
            )
        }
        else if (
            this.state.headPosition === HEAD_POSITION.RIGHT &&
            this.state.tailPosition === TAIL_POSITION.END
        ) {

            this.ctx.rect(
                - this.halfTummySize + this.SNAKE_TUMMY_STROKE,
                - this.halfTummySize,
                this.SNAKE_TUMMY_SIZES.TURN,
                this.SNAKE_TUMMY_SIZES.STRAIGHT
            )
        }
        else if (
            this.state.headPosition === HEAD_POSITION.LEFT &&
            this.state.tailPosition === TAIL_POSITION.END
        ) {

            this.ctx.rect(
                - this.halfTummySize - this.SNAKE_TUMMY_STROKE,
                - this.halfTummySize,
                this.SNAKE_TUMMY_SIZES.TURN,
                this.SNAKE_TUMMY_SIZES.STRAIGHT
            )
        }

        this.ctx.fill();
        // ); // draw with center at origin
        this.ctx.restore(); // restore state (no rotation for next draw)

        this.tailPart?.update();
    }
}


class RattlerSnake extends SnakeHead {

    private health = 2;
    private snakeFirstTummy: SnakeTummy;
    private snakeLastTummy: SnakeTummy;
    private TUMMY_SIZE: number;

    constructor(
        ctx: CanvasRenderingContext2D,
        obstructionArray: ObstructionsArray,
        snakeTexture: HTMLImageElement
    ) {
        super(ctx, obstructionArray, snakeTexture);

        // this.currentState = {
        //     x: this.headState.x,
        //     y: this.headState.y,
        //     headPosition: this.headState.headPosition,
        //     tailPosition: this.headState.tailPosition
        // }

        this.TUMMY_SIZE = (this.size.width / 2) + 3;

        this.snakeFirstTummy = new SnakeTummy(
            ctx,
            HEAD_POSITION.UP,
            TAIL_POSITION.DOWN,
            {
                x: this.position.x,
                y: this.position.y + 10
            },
            this.TUMMY_SIZE
        );
        this.snakeLastTummy = this.snakeFirstTummy;
    }

    public update(): void {
        // console.log(HEAD_POSITION[this.currentState.headPosition]);
        // if (
        //     this.snakeFirstTummy.getState.headPosition !== this.headState.headPosition ||
        //     this.snakeFirstTummy.getState.x !== this.headState.x ||
        //     this.snakeFirstTummy.getState.y !== this.headState.y

        // ) {
        // }
        if (
            this.snakeFirstTummy.getState.x !== this.headState.x ||
            this.snakeFirstTummy.getState.y !== this.headState.y
        ) {

            this.snakeFirstTummy.updateState({ ...this.headState });
        }

        this.updateSnakeHead();
        this.snakeFirstTummy.update();
    }

    public rotate(headPosition: HEAD_POSITION): void {

        switch (headPosition) {
            case HEAD_POSITION.UP:
                if (this.headState.headPosition === HEAD_POSITION.DOWN) return;
                break;

            case HEAD_POSITION.DOWN:
                if (this.headState.headPosition === HEAD_POSITION.UP) return;
                break;

            case HEAD_POSITION.RIGHT:
                if (this.headState.headPosition === HEAD_POSITION.LEFT) return;
                break;

            case HEAD_POSITION.LEFT:
                if (this.headState.headPosition === HEAD_POSITION.RIGHT) return;
                break;

        }

        this.snakeFirstTummy.setHead(headPosition);
        this.rotateSnakeHead(headPosition);
    }

    public increaseHealth(): void {
        const newSnakeTummy = new SnakeTummy(
            this.ctx,
            this.snakeLastTummy.getState.headPosition,
            this.snakeLastTummy.getState.tailPosition,
            {
                x: this.snakeLastTummy.position.x,
                y: this.snakeLastTummy.position.y
            },
            this.TUMMY_SIZE
        );
        this.snakeLastTummy.tailPart = newSnakeTummy;
        this.snakeLastTummy = newSnakeTummy;
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

type Point = {
    x: number;
    y: number;
}


function launchError(err: unknown) {
    throw err;
}

export default function Page(): JSX.Element {

    useEffect(() => {

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
                            snakeObject.increaseHealth();
                            break;

                    }
                }

                const gameLoop = () => {
                    ctx.clearRect(0, 0, c.width, c.height);
                    renderFirstLayer(ctx, TEXTURES.BACKGROUND, firstLayerObjects);
                    renderSecondLayer(snakeObject);
                    // ctx.beginPath();
                    // ctx.rect(200, 50, 150, 100);
                    // ctx.strokeStyle = "black";
                    // ctx.lineWidth = 2;
                    // ctx.stroke();

                    // ctx.beginPath();
                    // ctx.fillStyle = "#fff";
                    // ctx.rect(200, 52, 150, 96); // inset rectangle
                    // ctx.fill();
                    // ctx.strokeStyle = "blue";
                    // ctx.lineWidth = 2;
                    // ctx.stroke();
                    // setTimeout(() => {

                    window.requestAnimationFrame(gameLoop);
                    // }, 500);
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
            {/* <canvas id={'gameWindow'} /> */}
            {<canvas id={'gameWindow'} height={700} width={900} />}
            {/* <RenderTrees gameWindowSize={gameWindowSize} /> */}
            {/* <img src={'/images/grass.png'} alt="" /> */}
            {/* {MyFirstEveryCanvas()} */}
        </>
    )
}