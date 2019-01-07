import { Cell } from "/cell.js";

export class Universe {

  constructor(canvas, height, width, size) {
    this._canvas = canvas;
    this._canvas.height = height;
    this._canvas.width = width;
    this._rows = Math.floor(height / size);
    this._cols = Math.floor(width / size);
    this._size = size;
    this._space = canvas.getContext('2d');
    this._cells = {};
  }

  static suitableConditions() {
    return Math.random() >= 0.5;
  }

  makeFirstGeneration() {
    for (let row = 0; row < this._rows; row++) {
      this._cells[row] = {};
      for (let col = 0; col < this._cols; col++) {
        const cell = new Cell(row, col);
        this._cells[row][col] = cell;
        if (Universe.suitableConditions()) {
          this.reviveCell(cell);
        }
      }
    }
  }

  getNextGeneration() {
    const nextGeneration = {};
    Object.keys(this._cells).forEach(row => {
      nextGeneration[row] = {};
      Object.keys(this._cells[row]).forEach(col => {
        nextGeneration[row][col] = this.willLive(this.getCellByPoint(row, col));
      });
    });
    return nextGeneration;
  }

  makeNextGeneration() {
    const nextGeneration = this.getNextGeneration();
    Object.keys(this._cells).forEach(row => {
      Object.keys(this._cells[row]).forEach(col => {
        const cell = this._cells[row][col];
        const willLive = nextGeneration[row][col];
        if (cell.isAlive()) {
          if (!willLive) {
            this.killCell(cell);
          }
        } else {
          if (willLive) {
            this.reviveCell(cell);
          }
        }
      })
    });
  }

  reviveCell(cell) {
    cell.revive();
    this._space.fillRect(cell.col * this._size, cell.row * this._size, this._size, this._size);
  }

  killCell(cell) {
    cell.die();
    this._space.clearRect(cell.col * this._size, cell.row * this._size, this._size, this._size);
  }

  getCellByPoint(row, col) {
    return this._cells[row][col];
  }

  getRightCol(cell) {
    return cell.col === this._cols - 1 ? 0 : cell.col + 1;
  }

  getLeftCol(cell) {
    return cell.col === 0 ? this._cols - 1 : cell.col - 1;
  }

  getTopRow(cell) {
    return cell.row === 0 ? this._rows - 1 : cell.row - 1;
  }

  getBottomRow(cell) {
    return cell.row === this._rows - 1 ? 0 : cell.row + 1;
  }

  getColNeighbors(cell) {
    const cols = [this.getLeftCol(cell), this.getRightCol(cell)];
    return cols.map(col => this.getCellByPoint(cell.row, col));
  }

  getRowNeighbors(cell) {
    const rows = [this.getTopRow(cell), this.getBottomRow(cell)];
    return rows.map(row => this.getCellByPoint(row, cell.col));
  }

  getDiagonalNeighbors(cell) {
    const left = [this.getBottomRow(cell), this.getTopRow(cell)]
      .map(row => this.getCellByPoint(row, this.getLeftCol(cell)));
    const right = [this.getBottomRow(cell), this.getTopRow(cell)]
      .map(row => this.getCellByPoint(row, this.getRightCol(cell)));
    return [...left, ...right];
  }

  getCellNeighbors(cell) {
    return [...this.getColNeighbors(cell), ...this.getRowNeighbors(cell), ...this.getDiagonalNeighbors(cell)];
  }

  getLivingNeighbors(cell) {
    return this.getCellNeighbors(cell).filter(neighbor => neighbor.isAlive()).length;
  }

  willLive(cell) {
    const livingNeighbors = this.getLivingNeighbors(cell);
    if (cell.isAlive()) {
      return livingNeighbors === 2 || livingNeighbors === 3;
    }
    return livingNeighbors === 3;
  }
}
