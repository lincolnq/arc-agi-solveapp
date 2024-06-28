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

/** Select 'objects': contiguous blobs atop the background.
 * Eventually this will have options for orthogonal vs diagonal contiguity
 * and whether different colors are considered distinct objects. But for now
 * it just selects all orthogonally contiguous regions of the same color.
 */

export function objects(s: InterpState): InterpState {
    let gs = select();

    let visited = new Set<Pos>();
    let stack: Pos[] = [];

    for (let row of range(s.grid.length)) {
        for (let col of range(s.grid[row].length)) {
            let pos = makePos(row, col);
            if (visited.has(pos)) {
                continue;
            }
            // ignore black cells
            if (s.grid[row][col] === BLACK) {
                continue;
            }
            stack.push(pos);
            let subsel = select([]);
            while (stack.length > 0) {
                let p = stack.pop()!;
                if (visited.has(p)) {
                    continue;
                }
                visited.add(p);
                subsel.cells!.add(p);
                let [r, c] = p.split(',').map(Number);
                for (let [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
                    let rp = makePos(r + dr, c + dc);
                    if (rp in visited) {
                        continue;
                    }
                    if (r + dr < 0 || r + dr >= s.grid.length || c + dc < 0 || c + dc >= s.grid[r].length) {
                        continue;
                    }
                    if (s.grid[r][c] === s.grid[r + dr][c + dc]) {
                        stack.push(rp);
                    }
                }
            }
            gs.children.push(subsel);
        }
    }

    return s.setCurrentSelection(gs);
}

function* iterCells(g: Color[][]): Iterable<Pos> {
    for (let row of range(g.length)) {
        for (let col of range(g[row].length)) {
            yield makePos(row, col);
        }
    }
}

/** Filter current selection */
export function filter(s: InterpState, kwargs: any): InterpState {
    let gs = s.getCurrentSelection();
    // if there is not a current selection, create one by selecting all cells individually
    if (gs.children.length === 0) {
        gs = select([...iterCells(s.grid)]);
    }

    

    return s;

}