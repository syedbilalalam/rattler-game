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

export const enum F_L_OBJECT {
    TREE,
    FIRED_HUT
}


const MAP_2D: (F_L_OBJECT | null)[][] = [
    [F_L_OBJECT.TREE,       F_L_OBJECT.TREE,        F_L_OBJECT.TREE,       F_L_OBJECT.TREE,        F_L_OBJECT.TREE,       F_L_OBJECT.TREE,        F_L_OBJECT.TREE,       F_L_OBJECT.TREE,        F_L_OBJECT.TREE,       F_L_OBJECT.TREE,        F_L_OBJECT.TREE,       F_L_OBJECT.TREE,        F_L_OBJECT.TREE  ],
    [F_L_OBJECT.TREE,       null,       null,      null,        null,     null,     null,        null,          null,       null,       null,      null,        F_L_OBJECT.TREE  ],
    [F_L_OBJECT.TREE,       null,       null,      null,        null,     null,     null,        null,          null,       null,       null,      null,        F_L_OBJECT.TREE  ],
    [F_L_OBJECT.TREE,       null,       null,      null,        null,     null,     null,        null,          null,       null,       null,      null,        F_L_OBJECT.TREE  ],
    [F_L_OBJECT.FIRED_HUT,  null,       null,      null,        null,     null,     null,        null,          null,       null,       null,      null,        F_L_OBJECT.FIRED_HUT  ],
    [F_L_OBJECT.TREE,       null,       null,      null,        null,     null,     null,        null,          null,       null,       null,      null,        F_L_OBJECT.TREE  ],
    [F_L_OBJECT.TREE,       null,       null,      null,        null,     null,     null,        null,          null,       null,       null,      null,        F_L_OBJECT.TREE  ],
    [F_L_OBJECT.TREE,       null,       null,      null,        null,     null,     null,        null,          null,       null,       null,      null,        F_L_OBJECT.TREE  ],
    [F_L_OBJECT.TREE,       F_L_OBJECT.TREE,        F_L_OBJECT.TREE,       F_L_OBJECT.TREE,        F_L_OBJECT.TREE,       F_L_OBJECT.TREE,        F_L_OBJECT.TREE,       F_L_OBJECT.TREE,        F_L_OBJECT.TREE,       F_L_OBJECT.TREE,        F_L_OBJECT.TREE,       F_L_OBJECT.TREE,        F_L_OBJECT.TREE  ]
];

export {
    MAP_2D
};
