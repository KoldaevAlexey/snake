"use strict";

const canvas = document.querySelector("#playing-field"),
  ctx = canvas.getContext("2d"),
  scoreLabel = document.querySelector("h1"),
  resultModal = document.querySelector(".modal-wrapper"),
  btnConfirm = resultModal.querySelector(".btn-confirm"),
  inputName = resultModal.querySelector(".modal_input");

const config = {
  grid: 16,
  count: 0,
};

let currentScore = 0;
let players;

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
  pausedCheck = false;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function loop() {
  requestAnimationFrame(loop);

  pausedCheck === true ? (n = 10000) : (n = 4);

  if (++config.count < n) {
    return;
  }

  scoreLabel.textContent = `ОЧКИ: ${currentScore}`;
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
      currentScore++;

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

        canvas.classList.add("hide");
        canvas.classList.remove("show");

        resultModal.classList.add("show");
        resultModal.classList.remove("hide");

        pausedCheck = true;

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
    pausedCheck ? (pausedCheck = false) : (pausedCheck = true);
  }
}

btnConfirm.addEventListener("click", () => {
  if (!localStorage.getItem("players")) {
    players = [];
  } else {
    players = JSON.parse(localStorage.getItem("players"));
  }

  players.push({ name: inputName.value, score: currentScore });

  let jsonPlayers = JSON.stringify(players);
  localStorage.setItem("players", jsonPlayers);

  players.sort((a, b) => {
    return b.score - a.score;
  });

  resultModal.classList.add("hide");
  resultModal.classList.remove("show");

  canvas.classList.add("show");
  canvas.classList.remove("hide");

  pausedCheck = false;
  currentScore = 0;

  for (let i = 0; i < players.length; i++) {
    addRatingList(players[i].name, players[i].score);
  }
});

function addRatingList(name, score) {
  let playerList = document.createElement("li");
  document.querySelector(".rating").append(playerList);
  playerList.textContent = `${name} : ${score}`;
}

requestAnimationFrame(loop);
