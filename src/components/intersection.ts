import { Obstruction, ObstructionsArray } from "@/classes/snake";

export interface Point {
    x: number;
    y: number;
}

interface Line {
    pA: Point;
    pB: Point
}

type LinesOfPlane = [Line, Line, Line, Line];


function checkPointObstruction(obstruction: Obstruction, point: Point) {

    if (
        point.x >= obstruction.x && point.x <= (obstruction.x + obstruction.width)
        &&
        point.y >= obstruction.y && point.y <= (obstruction.y + obstruction.height)

    ) return true;

    return false;
}

export function isPointObstructed(obstructionsArray: ObstructionsArray, point: Point): boolean {

    for (const obstruction of obstructionsArray) {
        if (checkPointObstruction(obstruction, point)) return true
    }
    return false;
}

function planeToLines(plane: Obstruction): LinesOfPlane {
    const lines: LinesOfPlane = [
        {
            pA: {
                x: plane.x,
                y: plane.y
            },
            pB: {
                x: plane.x + plane.width,
                y: plane.y
            }
        },
        {
            pA: {
                x: plane.x,
                y: plane.y
            },
            pB: {
                x: plane.x,
                y: plane.y + plane.height
            }
        },
        {
            pA: {
                x: plane.x + plane.width,
                y: plane.y
            },
            pB: {
                x: plane.x + plane.width,
                y: plane.y + plane.height
            }
        },
        {
            pA: {
                x: plane.x,
                y: plane.y + plane.height
            },
            pB: {
                x: plane.x + plane.width,
                y: plane.y + plane.height
            }
        },
    ];

    return lines;
}

function doSegmentsIntersect(p1: Point, p2: Point, q1: Point, q2: Point) {
    // helper: orientation of ordered triplet (a, b, c)
    function orient(a: Point, b: Point, c: Point) {
        return (b.x - a.x) * (c.y - a.y) -
            (b.y - a.y) * (c.x - a.x);
    }

    // helper: check if point c lies on segment ab
    function onSegment(a: Point, b: Point, c: Point) {
        return Math.min(a.x, b.x) <= c.x && c.x <= Math.max(a.x, b.x) &&
            Math.min(a.y, b.y) <= c.y && c.y <= Math.max(a.y, b.y);
    }

    const o1 = orient(p1, p2, q1);
    const o2 = orient(p1, p2, q2);
    const o3 = orient(q1, q2, p1);
    const o4 = orient(q1, q2, p2);

    // General case
    if (o1 * o2 < 0 && o3 * o4 < 0) {
        return true;
    }

    // Special Cases (collinear cases)
    if (o1 === 0 && onSegment(p1, p2, q1)) return true;
    if (o2 === 0 && onSegment(p1, p2, q2)) return true;
    if (o3 === 0 && onSegment(q1, q2, p1)) return true;
    if (o4 === 0 && onSegment(q1, q2, p2)) return true;

    return false;
}

function isSegmentObstructed<T extends Obstruction>(line: Line, obstructions: T[]): T | null {
    for (const obstruction of obstructions) {

        const obstructionLines: Line[] = planeToLines(obstruction);

        for (const obstructionLine of obstructionLines) {
            if (doSegmentsIntersect(

                line.pA,
                line.pB,
                obstructionLine.pA,
                obstructionLine.pB

            )) return obstruction;
        }
    }

    return null;
}

export function isPlaneObstructed<T extends Obstruction>(plane: Obstruction, obstructions: T[]): T | null {
    const planeLines = planeToLines(plane);

    for (const planeLine of planeLines) {
        const segmentObstrution = isSegmentObstructed(

            planeLine,
            obstructions

        )
        if (segmentObstrution !== null) return segmentObstrution

    }

    // Hard checking if whole plane was inside obstruction or vice versa
    for (const obstruction of obstructions) {
        if (
            isPointObstructed([obstruction], { ...plane }) ||
            isPointObstructed([plane], { ...obstruction })
        ) {
            return obstruction
        };
    }

    return null;
}
