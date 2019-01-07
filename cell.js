export class Cell {

  constructor(row, col) {
    this._live = false;
    this.col = col;
    this.row = row;
  }

  isAlive() {
    return this._live
  }

  die() {
    this._live = false;
  }

  revive() {
    this._live = true;
  }
}
