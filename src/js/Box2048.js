import {randomInt} from './math-funcs.js';
// TODO: More numbers to add
export const backColors = {
  2: 'rgb(236, 227, 227)',
  4: 'rgb(212, 200, 200)',
  8: 'rgb(182, 142, 109)',
  16: 'rgb(175, 107, 51)',
  32: 'rgb(146, 158, 40)',
  64: 'rgb(76, 146, 28)',
  128: 'rgb(21, 126, 77)',
  256: 'rgb(19, 116, 119)',
  512: 'rgb(116, 69, 83)',
  1024: 'rgb(134, 180, 155)',
  2048: 'rgb(168, 112, 161)',
};
/**
 * Implementing each box in the grid
 */
export class Box2048 {
  /**
   *
   * @param {number} row
   * @param {number} col
   * @param {number} w
   * @param {number} h
   * @param {number} value
   */
  constructor(row, col, w, h, value) {
    this.row = row;
    this.col = col;
    this.x = row*w;
    this.y = col*h;
    this.w = w;

    this.h = h;
    this.vel = [0, 0];
    this.value = value;
    this.textColor = 'black';
  }
  /**
   *
   * @param {*} ctx context2d from canvas
   */
  show(ctx) {
    ctx.fillStyle = backColors[this.value];
    ctx.beginPath();
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '60px Helvetica, Arial, sans-serif';
    ctx.fillText(this.value, this.x+this.w/2, this.y+this.h/2, this.w);
  }
  /**
   *
   * @param {number} row
   * @param {number} col
   * @param {number} value
   */
  update(row, col, value) {
    this.row = row;
    this.col = col;
    this.value = value;
    this.x = row*this.w;
    this.y = col*this.h;
  }
}

/**
 * @return {number} either a 2 or 4
 */
export function randomBoxValue() {
  const x = randomInt(1, 5);
  const value = (x>1)? 2:4;
  return value;
}
/**
 *
 * @param { Array<Array<boolean>> } gridEmpty status of grid locations if empty or full
 * @return { Array<number> | 0}
 */
export function randomBoxPos(gridEmpty) {
  const emptyPoses = [];
  for (let x = 0; x < gridEmpty.length; x++) {
    for (let y = 0; y < gridEmpty.length; y++) {
      if (gridEmpty[x][y]) {
        emptyPoses.push([x, y]);
      }
    }
  }
  if (emptyPoses.length === 0) {
    return 0;
  }
  const index = randomInt(0, emptyPoses.length-1);

  return emptyPoses[index];
}
