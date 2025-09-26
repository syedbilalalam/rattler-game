import { Enemy } from '@/classes/enemies';
import { isPlaneObstructed, Point } from '@/components/intersection';
import { OnPenguPopFn, OnScoreUpdateFn } from '@/components/game/game';

export enum HEAD_POSITION {
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


export type Position = {
    x: number;
    y: number;
}
export type Size = {
    width: number;
    height: number;
}

interface SnakeHeadEvents {
    gameOver: () => void;
    penguPop: OnPenguPopFn;
    scoreUpdate: OnScoreUpdateFn;
}

export interface ObjectSize {
    height: number;
    width: number;
}
interface Axis {
    x: number,
    y: number;
}

export type Obstruction = { x: number; y: number; width: number; height: number; };
export type ObstructionsArray = Obstruction[];


function getTailIfHead(headDirection: HEAD_POSITION): TAIL_POSITION {

    switch (headDirection) {

        case HEAD_POSITION.UP:
            return TAIL_POSITION.DOWN

        case HEAD_POSITION.DOWN:
            return TAIL_POSITION.UP

        case HEAD_POSITION.RIGHT:
            return TAIL_POSITION.LEFT

        case HEAD_POSITION.LEFT:
            return TAIL_POSITION.RIGHT
    }
}

function createAngledGradient(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    angle: number
): CanvasGradient {
    // Convert angle (in degrees) to radians
    const rad = angle * Math.PI / 180;

    // Half-diagonal of the rectangle
    const halfDiag = Math.sqrt(w * w + h * h) / 2;

    // Center point
    const cx = x + w / 2;
    const cy = y + h / 2;

    // Start and end points along the angle
    const x0 = cx + Math.cos(rad + Math.PI) * halfDiag;
    const y0 = cy + Math.sin(rad + Math.PI) * halfDiag;
    const x1 = cx + Math.cos(rad) * halfDiag;
    const y1 = cy + Math.sin(rad) * halfDiag;

    return ctx.createLinearGradient(x0, y0, x1, y1);
}

class SnakeTummy {
    private static readonly STROKE = 1;
    private static readonly COLOR = '#19850bff';
    private static readonly STROKE_COLOR = '#000';
    private static readonly GRADIENT_COLOR = {
        LEFT: '#0b801a',
        MIDDLE: '#3cb323',
        // MIDDLE: '#239c25',
        RIGHT: '#0b801a'
    }
    // private static readonly COLOR = '#33ad24';
    private size: Size;
    private headChanged = 0;
    public tailPart: SnakeTummy | null = null;
    public headPart: SnakeTummy | null = null;
    private state: BodyPartState;
    private halfTummySize;

    // private halfTummyWidthWithStroke = (SnakeTummy.STROKE * 2) + this.halfTummyWidth;
    // private halfTummyHeightWithStroke = (SnakeTummy.STROKE * 2) + this.halfTummyHeight;
    private readonly SNAKE_TUMMY_SIZES: {
        STRAIGHT: number,
        TURN: number
    };
    constructor(
        private ctx: CanvasRenderingContext2D,
        headPosition: HEAD_POSITION,
        tailPosition: TAIL_POSITION,
        public position: Position,
        tummySize: number,
        public id: number,
        deriveNewPosition: boolean
    ) {
        if (HEAD_POSITION[headPosition] === TAIL_POSITION[tailPosition]) throw new Error(
            "Logic error snake's tummay can't have same head and tail values"
        );

        this.state = {
            ...this.position,
            headPosition,
            tailPosition
        }

        this.updatePosition(position.x, position.y);

        this.size = {
            width: tummySize,
            height: tummySize
        }
        this.halfTummySize = this.size.width / 2;

        this.SNAKE_TUMMY_SIZES = {

            TURN: this.size.width - SnakeTummy.STROKE,

            STRAIGHT: this.size.width - (SnakeTummy.STROKE * 2)
        }

        if (deriveNewPosition) {
            switch (this.state.headPosition) {
                case HEAD_POSITION.UP:
                    this.state.y += this.size.height
                    this.updateState({ ...this.state });
                    break;
                case HEAD_POSITION.DOWN:
                    this.state.y -= this.size.height
                    this.updateState({ ...this.state });
                    break;
                case HEAD_POSITION.RIGHT:
                    this.state.x -= this.size.width;
                    this.updateState({ ...this.state });
                    break;
                case HEAD_POSITION.LEFT:
                    this.state.x += this.size.width;
                    this.updateState({ ...this.state });
                    break;
            }
        }
    }

    private updatePosition(x: number, y: number): void {
        this.position.x = x;
        this.position.y = y;
    }

    public updateState(newState: BodyPartState): void {
        const temp = this.state;

        this.state = { ...newState };
        this.updatePosition(newState.x, newState.y);

        if (
            this.headPart &&
            this.headPart.getState.headPosition !== this.state.headPosition &&
            this.headPart.getState.tailPosition !== this.state.tailPosition
        ) {
            this.state.headPosition = this.headPart.getState.headPosition;
        }

        this.tailPart?.updateState(temp);
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

    public isObstructed(plane: Obstruction): boolean {
        const planeObstruction = isPlaneObstructed(
            plane,
            [{
                ...this.size,
                x: this.position.x - this.halfTummySize,
                y: this.position.y - this.halfTummySize,
            }]
        )
        if (planeObstruction !== null) return true;
        else if (this.tailPart) return this.tailPart.isObstructed(plane);

        return false;
    }

    public draw(): void {

        this.ctx.save(); // save current state
        this.ctx.translate(this.position.x, this.position.y); // move origin to (x, y)


        this.ctx.beginPath();
        this.ctx.rect(
            - this.halfTummySize,
            - this.halfTummySize,
            this.size.width,
            this.size.height
        );
        this.ctx.fillStyle = SnakeTummy.STROKE_COLOR;
        this.ctx.stroke();
        this.ctx.fill();

        // Updating obstructions

        this.ctx.beginPath();
        this.ctx.fillStyle = SnakeTummy.COLOR;

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
            const gradient = this.ctx.createLinearGradient(
                - this.halfTummySize + SnakeTummy.STROKE,
                0,
                this.halfTummySize,
                0
            );
            gradient.addColorStop(0, SnakeTummy.GRADIENT_COLOR.LEFT);
            gradient.addColorStop(0.4, SnakeTummy.GRADIENT_COLOR.MIDDLE);
            gradient.addColorStop(0.6, SnakeTummy.GRADIENT_COLOR.MIDDLE);
            gradient.addColorStop(1.0, SnakeTummy.GRADIENT_COLOR.RIGHT);
            this.ctx.fillStyle = gradient;
            this.ctx.rect(
                - this.halfTummySize + SnakeTummy.STROKE,
                - this.halfTummySize - 1,
                this.SNAKE_TUMMY_SIZES.STRAIGHT,
                this.size.height + 2
            );
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
            const gradient = this.ctx.createLinearGradient(
                0,
                - this.halfTummySize + SnakeTummy.STROKE,
                0,
                this.halfTummySize
            );
            gradient.addColorStop(0, SnakeTummy.GRADIENT_COLOR.LEFT);
            gradient.addColorStop(0.4, SnakeTummy.GRADIENT_COLOR.MIDDLE);
            gradient.addColorStop(0.6, SnakeTummy.GRADIENT_COLOR.MIDDLE);
            gradient.addColorStop(1.0, SnakeTummy.GRADIENT_COLOR.RIGHT);
            this.ctx.fillStyle = gradient;
            this.ctx.rect(
                - this.halfTummySize - 1,
                - this.halfTummySize + SnakeTummy.STROKE,
                this.size.width + 2,
                this.SNAKE_TUMMY_SIZES.STRAIGHT
            );
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
            const gradient = this.ctx.createLinearGradient(
                - this.halfTummySize + SnakeTummy.STROKE,
                - this.halfTummySize + SnakeTummy.STROKE,
                this.halfTummySize,
                this.halfTummySize
            );
            gradient.addColorStop(0, SnakeTummy.GRADIENT_COLOR.LEFT);
            gradient.addColorStop(0.1, SnakeTummy.GRADIENT_COLOR.LEFT);
            gradient.addColorStop(0.8, SnakeTummy.GRADIENT_COLOR.MIDDLE);
            gradient.addColorStop(1.0, SnakeTummy.GRADIENT_COLOR.RIGHT);
            this.ctx.fillStyle = gradient;
            this.ctx.rect(
                - this.halfTummySize + SnakeTummy.STROKE,
                - this.halfTummySize + SnakeTummy.STROKE,
                this.SNAKE_TUMMY_SIZES.TURN + 1,
                this.SNAKE_TUMMY_SIZES.TURN + 1
            );
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
            const gradient = createAngledGradient(
                this.ctx,
                - this.halfTummySize + SnakeTummy.STROKE,
                - this.halfTummySize + SnakeTummy.STROKE,
                this.halfTummySize,
                this.halfTummySize,
                135
            );
            gradient.addColorStop(0, SnakeTummy.GRADIENT_COLOR.LEFT);
            gradient.addColorStop(0.1, SnakeTummy.GRADIENT_COLOR.LEFT);
            gradient.addColorStop(1.0, SnakeTummy.GRADIENT_COLOR.MIDDLE);
            this.ctx.fillStyle = gradient;
            // this.ctx.rotate(110 * Math.PI / 180);
            if (this.state.headPosition === HEAD_POSITION.DOWN)
                this.ctx.rect(
                    - this.halfTummySize - SnakeTummy.STROKE + 1,
                    - this.halfTummySize + SnakeTummy.STROKE,
                    this.SNAKE_TUMMY_SIZES.TURN,
                    this.SNAKE_TUMMY_SIZES.TURN + 1
                );
            else
                this.ctx.rect(
                    - this.halfTummySize - SnakeTummy.STROKE,
                    - this.halfTummySize + SnakeTummy.STROKE,
                    this.SNAKE_TUMMY_SIZES.TURN + 1,
                    this.SNAKE_TUMMY_SIZES.TURN
                );
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
            const gradient = createAngledGradient(
                this.ctx,
                - this.halfTummySize + SnakeTummy.STROKE,
                - this.halfTummySize + SnakeTummy.STROKE,
                this.halfTummySize,
                this.halfTummySize,
                315
            );
            gradient.addColorStop(0, SnakeTummy.GRADIENT_COLOR.LEFT);
            gradient.addColorStop(0.1, SnakeTummy.GRADIENT_COLOR.LEFT);
            gradient.addColorStop(1.0, SnakeTummy.GRADIENT_COLOR.MIDDLE);
            this.ctx.fillStyle = gradient;

            if (this.state.headPosition === HEAD_POSITION.RIGHT)
                this.ctx.rect(
                    - this.halfTummySize + SnakeTummy.STROKE,
                    - this.halfTummySize - SnakeTummy.STROKE,
                    this.SNAKE_TUMMY_SIZES.TURN + 1,
                    this.SNAKE_TUMMY_SIZES.TURN
                );
            else
                this.ctx.rect(
                    - this.halfTummySize + SnakeTummy.STROKE,
                    - this.halfTummySize - SnakeTummy.STROKE,
                    this.SNAKE_TUMMY_SIZES.TURN,
                    this.SNAKE_TUMMY_SIZES.TURN + 1
                );

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
            const gradient = createAngledGradient(
                this.ctx,
                - this.halfTummySize + SnakeTummy.STROKE + 5,
                - this.halfTummySize + SnakeTummy.STROKE + 5,
                this.halfTummySize,
                this.halfTummySize,
                235
            );
            gradient.addColorStop(0, SnakeTummy.GRADIENT_COLOR.LEFT);
            // gradient.addColorStop(0.1, SnakeTummy.GRADIENT_COLOR.LEFT);
            gradient.addColorStop(1.0, SnakeTummy.GRADIENT_COLOR.MIDDLE);
            this.ctx.fillStyle = gradient;

            if (this.state.headPosition === HEAD_POSITION.LEFT)
                this.ctx.rect(
                    - this.halfTummySize - SnakeTummy.STROKE,
                    - this.halfTummySize - SnakeTummy.STROKE,
                    this.SNAKE_TUMMY_SIZES.TURN + 1,
                    this.SNAKE_TUMMY_SIZES.TURN + 1
                );
            else
                this.ctx.rect(
                    - this.halfTummySize - SnakeTummy.STROKE,
                    - this.halfTummySize - SnakeTummy.STROKE,
                    this.SNAKE_TUMMY_SIZES.TURN + 1,
                    this.SNAKE_TUMMY_SIZES.TURN + 1
                );

        }
        else if (
            this.state.headPosition === HEAD_POSITION.UP &&
            this.state.tailPosition === TAIL_POSITION.END
        ) {

            this.ctx.rect(
                - this.halfTummySize,
                - this.halfTummySize - SnakeTummy.STROKE + 1,
                this.SNAKE_TUMMY_SIZES.STRAIGHT,
                this.SNAKE_TUMMY_SIZES.TURN
            );
        }
        else if (
            this.state.headPosition === HEAD_POSITION.DOWN &&
            this.state.tailPosition === TAIL_POSITION.END
        ) {

            this.ctx.rect(
                - this.halfTummySize,
                - this.halfTummySize + SnakeTummy.STROKE,
                this.SNAKE_TUMMY_SIZES.STRAIGHT,
                this.SNAKE_TUMMY_SIZES.TURN
            );
        }
        else if (
            this.state.headPosition === HEAD_POSITION.RIGHT &&
            this.state.tailPosition === TAIL_POSITION.END
        ) {

            this.ctx.rect(
                - this.halfTummySize + SnakeTummy.STROKE,
                - this.halfTummySize,
                this.SNAKE_TUMMY_SIZES.TURN,
                this.SNAKE_TUMMY_SIZES.STRAIGHT
            );
        }
        else if (
            this.state.headPosition === HEAD_POSITION.LEFT &&
            this.state.tailPosition === TAIL_POSITION.END
        ) {

            this.ctx.rect(
                - this.halfTummySize - SnakeTummy.STROKE,
                - this.halfTummySize,
                this.SNAKE_TUMMY_SIZES.TURN,
                this.SNAKE_TUMMY_SIZES.STRAIGHT
            );
        }

        this.ctx.fill();
        this.ctx.restore(); // restore state (no rotation for next draw)

        this.tailPart?.draw();
    }
}
abstract class SnakeHead {
    private gameOverRequested = false;
    protected selfObstructions: ObstructionsArray = [];
    protected snakeFirstTummy: SnakeTummy;
    protected position: Position = {
        x: 550,
        y: 550
    };
    protected state: BodyPartState = {
        ...this.position,
        headPosition: HEAD_POSITION.UP,
        tailPosition: TAIL_POSITION.DOWN
    };
    protected static readonly SIZE: Size = {
        width: 40,
        height: 70
    };
    protected static readonly SPEED = 20;
    protected static readonly HALF_WIDTH = SnakeHead.SIZE.width / 2;
    protected static readonly HALF_HEIGHT = SnakeHead.SIZE.height / 2;
    protected static readonly TUMMY_SIZE = SnakeHead.HALF_WIDTH + 3;
    private static readonly HEALTH = new Map([
        [10, 2,],
        [50, 10,],
    ]);
    private enemyController: Enemy | null = null;

    constructor(
        protected ctx: CanvasRenderingContext2D,
        private obstructionArray: ObstructionsArray,
        private snakeTexture: HTMLImageElement,
        private events: SnakeHeadEvents,
    ) {

        this.snakeFirstTummy = new SnakeTummy(
            ctx,
            HEAD_POSITION.UP,
            TAIL_POSITION.DOWN,
            {
                ...this.position
            },
            SnakeHead.TUMMY_SIZE,
            1,
            false
        );
    }
    abstract increaseHealth(hp: number): void;

    public setEnemyController(enemyController: Enemy): void {
        this.enemyController = enemyController;
    }

    protected rotateSnakeHead(headPosition: HEAD_POSITION) {
        this.state.headPosition = headPosition;
        this.state.tailPosition = getTailIfHead(headPosition);
    }

    private updatePosition(x: number, y: number): boolean {

        const snakeHeadPlane: Obstruction = {
            ...SnakeHead.SIZE,
            x: x - SnakeHead.HALF_WIDTH,
            y: y - SnakeHead.HALF_HEIGHT
        }
        const snakeHeadPoints: Point[] = [];

        snakeHeadPoints.push({
            x: x - SnakeHead.HALF_WIDTH,
            y: y + SnakeHead.HALF_HEIGHT
        });
        snakeHeadPoints.push({
            x: x + SnakeHead.HALF_WIDTH,
            y: y + SnakeHead.HALF_HEIGHT
        });

        snakeHeadPoints.push({
            x: x - SnakeHead.HALF_WIDTH,
            y: y - SnakeHead.HALF_HEIGHT
        });

        snakeHeadPoints.push({
            x: x + SnakeHead.HALF_WIDTH,
            y: y - SnakeHead.HALF_HEIGHT
        });

        let obstructed = false;
        for (const { x, y } of snakeHeadPoints) {
            if (
                isPlaneObstructed(snakeHeadPlane, this.obstructionArray) !== null ||
                (
                    this.snakeFirstTummy.tailPart &&
                    this.snakeFirstTummy.tailPart.tailPart &&
                    this.snakeFirstTummy.tailPart.tailPart.tailPart &&
                    this.snakeFirstTummy.tailPart.tailPart.tailPart.isObstructed(snakeHeadPlane)
                )
            ) {
                obstructed = true;
                break;
            }
        }
        if (this.enemyController) {
            const obstruction = isPlaneObstructed(snakeHeadPlane, this.enemyController.obstructionsArray);
            if (obstruction !== null) {

                const value = this.enemyController.kill(obstruction.id);

                this.events.scoreUpdate(value);
                const healthValue = SnakeHead.HEALTH.get(value);
                if (healthValue)
                    this.increaseHealth(healthValue);

                setTimeout(() => {
                    if (this.enemyController) {
                        const penguValue = this.enemyController.produce();
                        this.events.penguPop(penguValue);
                    }
                }, 2000);
            }
        }
        // if (this.enemyController)
        //     for (const { x, y } of snakeHeadPoints) {

        //         for (const obstruction of this.enemyController.obstructionsArray) {
        //             if (checkPointObstruction(obstruction, { x, y })) {



        //                 break;
        //             }
        //         };

        //     }

        if (obstructed) {
            // Updating state
            this.state.x = 0;
            this.state.y = 0;
            if (!this.gameOverRequested) {
                this.events.gameOver();
                this.gameOverRequested = true;
            }
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
                return this.updatePosition(this.position.x, this.position.y - SnakeHead.SPEED);

            case HEAD_POSITION.DOWN:
                return this.updatePosition(this.position.x, this.position.y + SnakeHead.SPEED);

            case HEAD_POSITION.RIGHT:
                return this.updatePosition(this.position.x + SnakeHead.SPEED, this.position.y);

            case HEAD_POSITION.LEFT:
                return this.updatePosition(this.position.x - SnakeHead.SPEED, this.position.y);
        }
    }

    protected get headState(): BodyPartState {
        return {
            ...this.position,
            headPosition: this.state.headPosition,
            tailPosition: this.state.tailPosition
        }
    }

    protected draw(): void {

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
            -SnakeHead.HALF_WIDTH,
            -SnakeHead.SIZE.height + 8,
            SnakeHead.SIZE.width,
            SnakeHead.SIZE.height

        ); // draw with center at origin
        this.ctx.restore(); // restore state (no rotation for next draw)

    }
}

export class RattlerSnake extends SnakeHead {

    private health = 1;
    private snakeLastTummy: SnakeTummy;
    private lastUpdated = 0;
    private lastHeadRotated = 0;
    private static readonly DELAY = 60;
    private static readonly HEAD_ROTATE_DELAY = 190;
    private tummyId = 2;
    private requestHeadPosition: HEAD_POSITION | null = null;

    constructor(
        ctx: CanvasRenderingContext2D,
        obstructionArray: ObstructionsArray,
        snakeTexture: HTMLImageElement,
        events: SnakeHeadEvents,
        scoreUpdaterFn: (score: number) => void
    ) {
        super(ctx, obstructionArray, snakeTexture, events);
        this.snakeLastTummy = this.snakeFirstTummy;
    }

    public doesSnakeObstructs(plane: Obstruction): boolean {
        return this.snakeFirstTummy.isObstructed(plane);
    }

    private updateState(): void {

        if (
            this.snakeFirstTummy.getState.x !== this.headState.x ||
            this.snakeFirstTummy.getState.y !== (this.headState.y)
        ) {

            this.snakeFirstTummy.updateState({ ...this.headState });
        }
    }

    public update(): void {
        const currentTime = performance.now();
        const delayed = currentTime - this.lastUpdated;
        if (delayed > RattlerSnake.DELAY) {
            this.moveForward();
            this.updateState();
            this.lastUpdated = currentTime;
        }

        this.checkHeadRotatation();
        this.snakeFirstTummy.draw();
        this.draw();
    }

    public checkHeadRotatation(): void {

        if (this.requestHeadPosition === null) return;

        const currentTime = performance.now();
        const delayed = currentTime - this.lastHeadRotated;
        if (delayed > RattlerSnake.HEAD_ROTATE_DELAY) {
            this.lastHeadRotated = currentTime;

            this.rotateSnakeHead(this.requestHeadPosition);
            this.requestHeadPosition = null;
        }

    }

    public rotate(headPosition: HEAD_POSITION): void {

        if (this.requestHeadPosition !== null) return;
        
        // Checking for head position changes
        switch (headPosition) {
            case HEAD_POSITION.UP:
                if (this.state.headPosition === HEAD_POSITION.DOWN) return;
                break;

            case HEAD_POSITION.DOWN:
                if (this.state.headPosition === HEAD_POSITION.UP) return;
                break;

            case HEAD_POSITION.RIGHT:
                if (this.state.headPosition === HEAD_POSITION.LEFT) return;
                break;

            case HEAD_POSITION.LEFT:
                if (this.state.headPosition === HEAD_POSITION.RIGHT) return;
                break;

        }
        this.requestHeadPosition = headPosition;
    }

    public increaseHealth(hp: number, deriveNewPosition = false): void {
        const newSnakeTummy = new SnakeTummy(
            this.ctx,
            this.snakeLastTummy.getState.headPosition,
            this.snakeLastTummy.getState.tailPosition,
            {
                x: this.snakeLastTummy.position.x,
                y: this.snakeLastTummy.position.y
            },
            SnakeHead.TUMMY_SIZE,
            this.tummyId++,
            deriveNewPosition
        );
        newSnakeTummy.headPart = this.snakeLastTummy;
        this.snakeLastTummy.tailPart = newSnakeTummy;
        this.snakeLastTummy = newSnakeTummy;
        this.health++;
        if (--hp) this.increaseHealth(hp, deriveNewPosition);
    }
}