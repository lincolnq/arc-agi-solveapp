// 2d arrays with selection sets

class Grid<T> {
    data: T[][];

    constructor(data: T[][]) {
        this.data = data;
    }

    ncols(): number {
        return this.data[0].length;
    }
    nrows(): number {
        return this.data.length;
    }

    // Iterate over (row, col, value)
    * iter(): Iterable<[number, number, T]> {
        for (let row=0; row < this.nrows(); ++row) {
            for (let col=0; col < this.ncols(); ++col) {
                yield [row, col, this.data[row][col]];
            }
        }
    }

    // Iterate over only the values
    * iter_cells(): Iterable<T> {
        yield * this.data.flat();
    }

    // apply a function to each element returning a new grid
    map<U>(f: (value: T, row: number, col: number) => U): Grid<U> {
        let result = this.data.map((row, i) => row.map((value, j) => f(value, i, j)));
        return new Grid(result);
    }
}

type GridSelection = Grid<Boolean>;

