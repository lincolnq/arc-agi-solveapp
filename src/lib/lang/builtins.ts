import type { Pos, Color, GridSelection, InterpState } from '$lib/types';

import { makePos, range } from '$lib/types';

// Everything exported here is made available to the user

export const BLACK: Color = 0;
export const GRAY: Color = 5;

// TODO
//export const PIXEL: GridSelection = {}

function select(cells?: Pos[]): GridSelection {
    let result: GridSelection = {children: []};
    if (cells) {
        result.cells = new Set(cells);
    }
    return result;
}

/** Select all rows */
export function rows(s: InterpState): InterpState {
    let gs = select();

    for (let row = 0; row < s.grid.length; row++) {
        let subsel = select([...range(s.grid[row].length)].map(col => makePos(row, col)));
        gs.children.push(subsel);
    }

    return s.setCurrentSelection(gs)
}

/** Select all columns */
export function cols(s: InterpState): InterpState {
    let gs = select();

    for (let col = 0; col < s.grid[0].length; col++) {
        let subsel = select([...range(s.grid.length)].map(row => makePos(row, col)));
        gs.children.push(subsel);
    }

    return s.setCurrentSelection(gs)
}