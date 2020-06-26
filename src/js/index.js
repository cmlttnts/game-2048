import {Box2048, randomBoxValue, randomBoxPos} from './Box2048.js';
import '../css/main.css';
// TODO: make it a module so i can play with a simple call Box2048.play() or smt
window.onload = function() {
  const canvas = document.getElementById('main-canvas');
  const ctx = canvas.getContext('2d');

  const numOfRows = 4;
  let numOfMoves = 0;
  const boxEdge = canvas.width / numOfRows;

  let grid = [
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
  ];

  let gridEmpty = [
    [true, true, true, true],
    [true, true, true, true],
    [true, true, true, true],
    [true, true, true, true],
  ];
  let prevGrid = JSON.parse(JSON.stringify(grid));
  let prevGridEmpty = JSON.parse(JSON.stringify(gridEmpty));

  let moveDirGlob = [0, 0];
  let firstMove = true;

  let takeBackCount = 0;
  this.document
      .querySelector('button#take-back')
      .addEventListener('click', function(e) {
        takeBackCount++;
        console.log(grid);
        console.log(gridEmpty);
        if (takeBackCount < 2) {
          numOfMoves--;
          if (numOfMoves === 0) firstMove = true;

          grid = JSON.parse(JSON.stringify(prevGrid));

          for (let x = 0; x < prevGrid.length; x++) {
            for (let y=0; y < prevGrid.length; y++) {
              if (grid[x][y] !== null) {
                grid[x][y] = new Box2048(
                    grid[x][y].row, grid[x][y].col,
                    grid[x][y].w, grid[x][y].h, grid[x][y].value);
              }
            }
          }
          gridEmpty = JSON.parse(JSON.stringify(prevGridEmpty));
          console.log(grid);
          console.log(gridEmpty);


          showAll();
        }
      });

  this.document.addEventListener('keydown', function(e) {
    switch (e.key) {
      case 'ArrowDown':
        moveDirGlob = 'down';
        break;
      case 'ArrowUp':
        moveDirGlob = 'up';
        break;
      case 'ArrowLeft':
        moveDirGlob = 'left';
        break;
      case 'ArrowRight':
        moveDirGlob = 'right';
        break;
      default:
        return 0;
    }
    prevGrid = JSON.parse(JSON.stringify(grid));

    for (let x = 0; x < prevGrid.length; x++) {
      for (let y=0; y < prevGrid.length; y++) {
        if (prevGrid[x][y] !== null) {
          prevGrid[x][y] = new Box2048(prevGrid[x][y].row, prevGrid[x][y].col, prevGrid[x][y].w, prevGrid[x][y].h, prevGrid[x][y].value);
        }
      }
    }
    prevGridEmpty = JSON.parse(JSON.stringify(gridEmpty));
    // console.log(prevGridEmpty);

    if (!calcDest(moveDirGlob) || firstMove) {
      insertBox();
      numOfMoves++;
      firstMove = false;
      takeBackCount = 0;
    }
    showAll();
  });
  function drawBackground() {
    ctx.strokeStyle = 'black';
    for (let i = 1; i < numOfRows; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * (canvas.height / numOfRows));
      ctx.lineTo(canvas.width, i * (canvas.height / numOfRows));
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(i * (canvas.width / numOfRows), 0);
      ctx.lineTo(i * (canvas.width / numOfRows), canvas.height);
      ctx.stroke();
    }
  }
  drawBackground();
  function insertBox() {
    const startPos = randomBoxPos(gridEmpty);
    if (startPos === 0) return 0;

    grid[startPos[0]][startPos[1]] = new Box2048(
        startPos[0],
        startPos[1],
        boxEdge,
        boxEdge,
        randomBoxValue(),
    );
    gridEmpty[startPos[0]][startPos[1]] = false;
  }

  function showAll(timeStamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < grid.length; x++) {
      for (let y = 0; y < grid.length; y++) {
        if (grid[x][y] !== null) {
          grid[x][y].show(ctx);
        }
      }
    }
    drawBackground();
  }

  function calcDest(moveDir) {
    let noBoxMoved = true;
    switch (moveDir) {
      case 'down':
        for (let x = 0; x < 4; x++) {
          for (let y = 3; y > 0; y--) {
            if (!gridEmpty[x][y]) {
              let i = y - 1;
              while (i > -1) {
                if (gridEmpty[x][i]) {
                  i--;
                  continue;
                } else {
                  if (grid[x][y].value === grid[x][i].value) {
                    grid[x][y].update(
                        grid[x][y].row,
                        grid[x][y].col,
                        grid[x][y].value * 2,
                    );
                    grid[x][i] = null;
                    gridEmpty[x][i] = true;
                    noBoxMoved = false;
                  } else break;
                }
              }
            }
          }
        }
        for (let x = 0; x < 4; x++) {
          for (let y = 3; y > -1; y--) {
            if (!gridEmpty[x][y]) {
              let lastEmptyPos = 0;
              let i = y + 1;
              // find furthest empty position
              while (i < 4) {
                if (gridEmpty[x][i]) lastEmptyPos = [x, i];
                i++;
              }
              if (lastEmptyPos !== 0) {
                const temp = grid[x][y];
                grid[x][y] = null;
                gridEmpty[x][y] = true;
                grid[lastEmptyPos[0]][lastEmptyPos[1]] = temp;
                grid[lastEmptyPos[0]][lastEmptyPos[1]].update(
                    lastEmptyPos[0],
                    lastEmptyPos[1],
                    temp.value,
                );
                noBoxMoved = false;
                gridEmpty[lastEmptyPos[0]][lastEmptyPos[1]] = false;
              }
            }
          }
        }
        break;
      case 'up':
        for (let x = 0; x < 4; x++) {
          for (let y = 0; y < 4; y++) {
            if (!gridEmpty[x][y]) {
              let i = y + 1;
              while (i < 4) {
                if (gridEmpty[x][i]) {
                  i++;
                  continue;
                } else {
                  if (grid[x][y].value === grid[x][i].value) {
                    grid[x][y].update(
                        grid[x][y].row,
                        grid[x][y].col,
                        grid[x][y].value * 2,
                    );
                    grid[x][i] = null;
                    gridEmpty[x][i] = true;
                    noBoxMoved = false;
                  } else break;
                }
              }
            }
          }
        }
        for (let x = 0; x < 4; x++) {
          for (let y = 0; y < 4; y++) {
            if (!gridEmpty[x][y]) {
              let lastEmptyPos = 0;
              let i = y - 1;
              // find furthest empty position
              while (i > -1) {
                if (gridEmpty[x][i]) lastEmptyPos = [x, i];
                i--;
              }
              if (lastEmptyPos !== 0) {
                const temp = grid[x][y];
                grid[x][y] = null;
                gridEmpty[x][y] = true;
                grid[lastEmptyPos[0]][lastEmptyPos[1]] = temp;
                grid[lastEmptyPos[0]][lastEmptyPos[1]].update(
                    lastEmptyPos[0],
                    lastEmptyPos[1],
                    temp.value,
                );
                noBoxMoved = false;
                gridEmpty[lastEmptyPos[0]][lastEmptyPos[1]] = false;
              }
            }
          }
        }
        break;
      case 'left':
        for (let y = 0; y < 4; y++) {
          for (let x = 0; x < 3; x++) {
            if (!gridEmpty[x][y]) {
              let i = x + 1;
              while (i < 4) {
                if (gridEmpty[i][y]) {
                  i++;
                  continue;
                }
                if (grid[x][y].value === grid[i][y].value) {
                  grid[x][y].update(
                      grid[x][y].row,
                      grid[x][y].col,
                      grid[x][y].value * 2,
                  );
                  grid[i][y] = null;
                  gridEmpty[i][y] = true;
                  noBoxMoved = false;
                } else break;
              }
            }
          }
        }
        for (let y = 0; y < 4; y++) {
          for (let x = 0; x < 4; x++) {
            if (!gridEmpty[x][y]) {
              let lastEmptyPos = 0;
              let i = x - 1;
              // find furthest empty position
              while (i > -1) {
                if (gridEmpty[i][y]) lastEmptyPos = [i, y];
                i--;
              }
              if (lastEmptyPos !== 0) {
                const temp = grid[x][y];
                grid[x][y] = null;
                gridEmpty[x][y] = true;
                grid[lastEmptyPos[0]][lastEmptyPos[1]] = temp;
                grid[lastEmptyPos[0]][lastEmptyPos[1]].update(
                    lastEmptyPos[0],
                    lastEmptyPos[1],
                    temp.value,
                );
                noBoxMoved = false;
                gridEmpty[lastEmptyPos[0]][lastEmptyPos[1]] = false;
              }
            }
          }
        }
        break;
      case 'right':
        for (let y = 0; y < 4; y++) {
          for (let x = 3; x > 0; x--) {
            if (!gridEmpty[x][y]) {
              let i = x - 1;
              while (i > -1) {
                if (gridEmpty[i][y]) {
                  i--;
                  continue;
                }
                if (grid[x][y].value === grid[i][y].value) {
                  grid[x][y].update(
                      grid[x][y].row,
                      grid[x][y].col,
                      grid[x][y].value * 2,
                  );
                  grid[i][y] = null;
                  gridEmpty[i][y] = true;
                  noBoxMoved = false;
                } else break;
              }
            }
          }
        }
        for (let y = 0; y < 4; y++) {
          for (let x = 3; x > -1; x--) {
            if (!gridEmpty[x][y]) {
              let lastEmptyPos = 0;
              let i = x + 1;
              // find furthest empty position
              while (i < 4) {
                if (gridEmpty[i][y]) lastEmptyPos = [i, y];
                i++;
              }
              if (lastEmptyPos !== 0) {
                const temp = grid[x][y];
                grid[x][y] = null;
                gridEmpty[x][y] = true;
                grid[lastEmptyPos[0]][lastEmptyPos[1]] = temp;
                grid[lastEmptyPos[0]][lastEmptyPos[1]].update(
                    lastEmptyPos[0],
                    lastEmptyPos[1],
                    temp.value,
                );
                noBoxMoved = false;
                gridEmpty[lastEmptyPos[0]][lastEmptyPos[1]] = false;
              }
            }
          }
        }
        break;
      default:
        break;
    }
    return noBoxMoved;
  }
};
/*
[1, 0]  y3, y2, y1, y0
[-1, 0] y0, y1, y2, y3
[0, 1]  x3, x2, x1, x0
[0, -1] x0, x1, x2, x3
*/
/*
for (let x = 0; x < array.length; x++) {
  for (let y = 3; y === -1; y--) {
  }
}
grid[0][3] if empty
  break;
  else if(prev value === this.value)
    merge();

*/
/*

    let xStart = (moveDir[1] > 0) ? (grid.length-1) : 0;
    let xEnd = (moveDir[1] > 0) ? -1 : (grid.length);
    let xInc = (moveDir[1] > 0) ? -1 : 1;
    let yStart = (moveDir[0] > 0) ? (grid.length-1) : 0;
    let yEnd = (moveDir[0] > 0) ? -1 : grid.length;
    let yInc = (moveDir[0] > 0) ? -1 : 1;
    let connected = true;
    if(moveDir[1] == 0){

      for(let x= xStart; x === xEnd; x+= xInc){
        for(let y= yStart; y === yEnd; y+= yInc){
          if(gridEmpty[x][y]){
            connected = false;
          }
          grid[x][y];
        }
      }
    }
    else{
      for(let y= yStart; y === yEnd; y+= yInc){
        for(let x= xStart; x === xEnd; x+= xInc){
          grid[x][y];
        }
      }
    }
*/
