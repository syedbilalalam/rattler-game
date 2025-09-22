import { isPointObstructed, Obstruction, ObstructionsArray, RattlerSnake, Size } from "@/classes/snake";

export interface EnemyObstruction extends Obstruction {
    id: number;
    enemyIndex: number;
}
export interface EnemyInfo {
    texture: HTMLImageElement;
    size: Size;
    value: number;
}

export class Enemy {
    private nextEnemyId = 1;
    private map: Map<number, EnemyObstruction> = new Map();

    private get assignId(): number {
        return this.nextEnemyId++;
    }

    constructor(
        private canvas: HTMLCanvasElement,
        private ctx: CanvasRenderingContext2D,
        private enemiesInfo: EnemyInfo[],
        private obstructionsSet: ObstructionsArray[],
        private snakeObject: RattlerSnake
    ) { }

    public produce(): void {
        const arrayBuffer = new Uint8Array(9);
        const randomValues = crypto.getRandomValues(arrayBuffer);
        const randomNumberA = randomValues[0] * randomValues[1] * randomValues[2];
        const randomNumberB = randomValues[3] * randomValues[4] * randomValues[5];
        const randomNumberC = randomValues[6] * randomValues[7] * randomValues[8];

        const windowWidth = this.canvas.width;
        const windowHeight = this.canvas.height;

        const x = randomNumberA % windowWidth;
        const y = randomNumberB % windowHeight;
        const enemyIndex = randomNumberC % this.enemiesInfo.length;
        const enemy = this.enemiesInfo[enemyIndex];

        for (const obstructions of this.obstructionsSet) {

            if (
                isPointObstructed(obstructions, { x, y }) ||
                isPointObstructed(obstructions, {
                    x: x + enemy.size.width,
                    y: y + enemy.size.height
                }) ||
                isPointObstructed(obstructions, {
                    x: x + enemy.size.width,
                    y
                }) ||
                isPointObstructed(obstructions, {
                    x,
                    y: y + enemy.size.height
                }) ||
                this.snakeObject.doesSnakeObstructs(x, y)
            ) {
                this.produce();
                return;
            }
        }

        // Now enemy location is decided successfully

        const id = this.assignId;
        this.map.set(id, {
            id,
            enemyIndex,
            x,
            y,
            width: enemy.size.width,
            height: enemy.size.height
        });

        // console.log('Enemy launched and its position is ');
        // console.log({ x, y });

    }

    public kill(id: number): number {
        const { value } = (() => {
            const enemyObject = this.map.get(id)
            if (!enemyObject) throw new Error('Invalid enemy id provided');
            // if (!enemyObject) return {value: 0};
            return this.enemiesInfo[enemyObject.enemyIndex];
        })();

        this.map.delete(id);
        return value;
    }

    public get obstructionsArray(): EnemyObstruction[] {
        return [...this.map.values()];
    }

    public draw(): void {
        this.map.values().forEach(enemyObject => {

            const enemyInfo = this.enemiesInfo[enemyObject.enemyIndex];

            this.ctx.drawImage(enemyInfo.texture, enemyObject.x, enemyObject.y, enemyObject.width, enemyObject.height);
        });
    }

}
