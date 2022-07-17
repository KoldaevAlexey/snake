"use strict";

const canvas = document.querySelector("#playing-field"),
  ctx = canvas.getContext("2d"),
  scoreLabel = document.querySelector("h1"),
  resultModal = document.querySelector(".modal-wrapper");

const config = {
  grid: 16,
  count: 0,
};

let score = 0;

const snake = {
  x: 160,
  y: 160,
  dx: config.grid,
  dy: 0,
  cells: [],
  maxCells: 4,
};

const apple = {
  x: 320,
  y: 320,
};

let n = 4,
  a = false;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function loop() {
  requestAnimationFrame(loop);

  a === true ? (n = 10000) : (n = 4);

  if (++config.count < n) {
    return;
  }

  scoreLabel.textContent = `ОЧКИ: ${score}`;
  config.count = 0;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snake.x += snake.dx;
  snake.y += snake.dy;

  if (snake.x < 0) {
    snake.x = canvas.width - config.grid;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }
  if (snake.y < 0) {
    snake.y = canvas.height - config.grid;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  snake.cells.unshift({ x: snake.x, y: snake.y });
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }
  ctx.fillStyle = "aqua";
  ctx.fillRect(apple.x, apple.y, config.grid - 1, config.grid - 1);
  ctx.fillStyle = "lightgreen";

  snake.cells.forEach(function (cell, index) {
    ctx.fillRect(cell.x, cell.y, config.grid - 1, config.grid - 1);

    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      score++;

      apple.x = getRandomInt(0, 25) * config.grid;
      apple.y = getRandomInt(0, 25) * config.grid;
    }

    for (let i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        snake.x = 320;
        snake.y = 320;
        snake.dx = config.grid;
        snake.dy = 0;
        snake.cells = [];
        snake.maxCells = 4;

        //test
        canvas.style.display = "none";
        resultModal.style.display = "flex";
        resultModal.textContent = `РЕУЗЛЬТАТ - ${score}`;

        score = 0;

        apple.x = getRandomInt(0, 25) * config.grid;
        apple.y = getRandomInt(0, 25) * config.grid;
      }
    }
  });
}
document.addEventListener("keydown", direction);

function direction(e) {
  if (e.keyCode === 37 && snake.dx === 0) {
    snake.dx -= config.grid;
    snake.dy = 0;
  }
  if (e.keyCode === 38 && snake.dy === 0) {
    snake.dy -= config.grid;
    snake.dx = 0;
  }
  if (e.keyCode === 39 && snake.dx === 0) {
    snake.dx = config.grid;
    snake.dy = 0;
  }
  if (e.keyCode === 40 && snake.dy === 0) {
    snake.dy = config.grid;
    snake.dx = 0;
  }
  if (e.keyCode === 32) {
    a ? (a = false) : (a = true);
  }
}

requestAnimationFrame(loop);
