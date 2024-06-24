// A Pos indexes into a 2d grid: a pair of ints, converted to strings and concatenated with ','
export type Pos = string;

export function makePos(row: number, col: number): Pos {
  return `${row},${col}`;
}

export type Color = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// A 2d rectangular grid of colors
export type ColorGrid = Color[][];

// ProblemData / ProblemExample is the JSON problem input format
export type ProblemData = { train: ProblemExample[], test: ProblemExample[] };
export type ProblemExample = { input: ColorGrid, output?: ColorGrid };

// Each position can be part of zero or more selection sets. This type represents a view of the selections
// as is useful for the UI.
export type GridSelectionView = Set<Pos>[];

// Selections are formed into a tree.
export type GridSelection = {
  // If cells is null then it means 'all cells'
  cells?: Set<Pos>;

  // this selection may have children, which are also selections
  children: GridSelection[];

};

// An InterpState is the current grid plus a stack of selections
export interface InterpState {
  grid: ColorGrid;
  selections: GridSelection[];

  // TODO: the program?

  // InterpStates are immutable, so all functions that modify them return a new state
  setCurrentSelection(selection: GridSelection): InterpState;
  getCurrentSelection(): GridSelection;
  getCurrentSelectionView(): GridSelectionView;
};


// general utility function like Python
export function* range( start: number, end?: number, step = 1 ) {
  if( end === undefined ) [end, start] = [start, 0];
  for( let n = start; n < end; n += step ) yield n;
}