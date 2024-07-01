// interpreter of the language

import type {Pos, InterpState, ColorGrid, GridSelection, GridSelectionView} from '$lib/types'

import {parse} from './stmtparser.mjs';
import * as BUILTINS from './builtins'

type Stmt = null | [Instr, Ident, Args]
type Instr = "applyToAll" | "apply"
type Args = KwArgs | PosArgs
type Ident = string
type KwArgs = Map<Ident, string>
type PosArgs = string[]

// returns a null (no-op) Stmt for blank lines and comments
export function parse_stmt(line: string): Stmt {
    line = line.trim();
    if (line.length === 0 || line.startsWith("#")) {
        return null;
    }
    return parse(line);
}

// filters blank lines and comments
export function parse_program(program: string): Stmt[] {
    let stmts: Stmt[] = [];
    for (let line of program.split("\n")) {
        let stmt = parse_stmt(line);
        if (stmt !== null) {
            stmts.push(stmt);
        }
    }
    return stmts;
}

class InterpStateImpl implements InterpState {
    grid: ColorGrid;
    selections: GridSelection[];

    constructor(grid: ColorGrid, selections: GridSelection[]) {
        this.grid = grid;
        this.selections = selections;
    }

    setCurrentSelection(selection: GridSelection): InterpState {
        if (this.selections.length > 0) {
            // overwrite the topmost (= last) selection
            return new InterpStateImpl(this.grid, this.selections.slice(0, -1).concat(selection));
        } else {
            // add a new selection
            return new InterpStateImpl(this.grid, [selection]);
        }
    }

    getCurrentSelection(): GridSelection {
        if (this.selections.length === 0) {
            return {children: []};
        }
        return this.selections[this.selections.length - 1];
    }

    getCurrentSelectionView(): GridSelectionView {
        return gridSelectionView(this.getCurrentSelection());
    }
}

// Recursively assemble (via simple flattening) the view of the current selection
export function gridSelectionView(selection: GridSelection): GridSelectionView {
    let result: GridSelectionView = [];

    function visit(sel: GridSelection) {
        if (sel.cells) {
            result.push(sel.cells);
        }
        for (let child of sel.children) {
            visit(child);
        }
    }
    visit(selection);
    return result;
}

export function makeInterpState(grid: ColorGrid): InterpState {
    return new InterpStateImpl(grid, []);
}

export function interp_stmt(stmt: Stmt, state: InterpState): InterpState {
    if (stmt === null) {
        return state;
    }
    console.log("interpret", stmt)

    let [instr, ident, args] = stmt;

    switch (instr) {
        case "applyToAll":
            return applyToAll(ident, args, state);
        case "apply":
            return apply(ident, args, state);
    }
}

function applyToAll(ident: Ident, args: Args, state: InterpState): InterpState {
    // TODO
    return state;
}

function apply(ident: Ident, args: Args, state: InterpState): InterpState {
    const f: ((arg0: InterpState, arg1: Args) => InterpState) = (BUILTINS as any)[ident];
    if (f === undefined) {
        // error!
        throw `Error: identifier ${ident} unrecognized`;
    }
    return f(state, args);
}

