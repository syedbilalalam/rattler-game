export enum FIRST_LAYER_MAP_SIZE {
    X = 13,
    Y = 9
}
// const TREE_MAP_2D: boolean[][] = new Array(TREES_MAP.X).fill(
//     new Array(TREES_MAP.Y).fill(false)
// );
// boolean (Y, X)
// let TREES_MAP_2D: boolean[][] = new Array(FIRST_LAYER_MAP_SIZE.Y).fill(
//     new Array(FIRST_LAYER_MAP_SIZE.X).fill(false)
// );
// TREES_MAP_2D[0] = new Array(FIRST_LAYER_MAP_SIZE.X).fill(true);
// for(let index=0; index<FIRST_LAYER_MAP_SIZE.Y; index++) {
//     TREES_MAP_2D[index] = new Array(FIRST_LAYER_MAP_SIZE.X).fill(true);
// }

const HUTS_MAP_2D: boolean[][] = [
    [false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false],
    [false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false],
    [false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false],
    [false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false],
    [true,   false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  true],
    [true,  true,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false],
    [false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false],
    [false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false],
    [false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false]
];
const TREES_MAP_2D: boolean[][] = [
    [true,  true,   true,   true,   true,   true,   true,   true,   true,   true,   true,   true,   true    ],
    [true,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  true    ],
    [true,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  true    ],
    [true,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  true    ],
    [false, false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false   ],
    [false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  true    ],
    [true,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  true    ],
    [true,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  false,  true    ],
    [true,  true,   true,   true,   true,   true,   true,   true,   true,   true,   true,   true,   true    ]
];

export {
    TREES_MAP_2D,
    HUTS_MAP_2D
};
