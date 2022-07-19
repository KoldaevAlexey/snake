"use strict";

const canvas = document.querySelector("#playing-field"),
  ctx = canvas.getContext("2d"),
  scoreLabel = document.querySelector("h1"),
  resultModal = document.querySelector(".modal-wrapper"),
  btnConfirm = resultModal.querySelector(".btn-confirm"),
  inputName = resultModal.querySelector(".modal_input");

let currentScore = 0,
  players,
  pausedGame = false;

const config = {
  grid: 16,
  count: 0,
  frameLimiter: 4,
};

const snake = {
  x: 160,
  y: 160,
  dx: config.grid,
  dy: 0,
  tail: [],
  maxTail: 4,

  reset() {
    snake.x = 320;
    snake.y = 320;
    snake.dx = config.grid;
    snake.dy = 0;
    snake.tail = [];
    snake.maxTail = 4;
  },
  eat() {
    snake.maxTail++;
  },
  crossBorderCanvas() {
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
  },
  startMove() {
    snake.x += snake.dx;
    snake.y += snake.dy;
  },
  movementAnimation() {
    snake.tail.unshift({ x: snake.x, y: snake.y });
    if (snake.tail.length > snake.maxTail) {
      snake.tail.pop();
    }
  },
};

const food = {
  x: getRandomInt(0, 25) * config.grid,
  y: getRandomInt(0, 25) * config.grid,

  render() {
    ctx.fillStyle = "aqua";
    ctx.fillRect(food.x, food.y, config.grid - 1, config.grid - 1);
  },
  spawn() {
    food.x = getRandomInt(0, 25) * config.grid;
    food.y = getRandomInt(0, 25) * config.grid;
  },
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function canvasShowHide() {
  if (canvas.classList.contains("show")) {
    canvas.classList.add("hide");
    canvas.classList.remove("show");
  } else {
    canvas.classList.add("show");
    canvas.classList.remove("hide");
  }
}

function modalShowHide() {
  if (resultModal.classList.contains("show")) {
    resultModal.classList.add("hide");
    resultModal.classList.remove("show");
  } else {
    resultModal.classList.add("show");
    resultModal.classList.remove("hide");
  }
}

function addRatingList(name, score) {
  if (players.length > 10) {
    players.pop();
  }
  let playerList = document.createElement("li");
  document.querySelector(".rating").append(playerList);
  playerList.textContent = `${name} : ${score}`;
}

function loadDataFromLocalStorage() {
  if (!localStorage.getItem("players")) {
    players = [];
  } else {
    players = JSON.parse(localStorage.getItem("players"));

    let jsonPlayers = JSON.stringify(players);
    localStorage.setItem("players", jsonPlayers);

    sortPlayersScoreForRatingList();

    for (let i = 0; i < players.length; i++) {
      addRatingList(players[i].name, players[i].score);
    }
  }
}

function sortPlayersScoreForRatingList() {
  players.sort((a, b) => {
    return b.score - a.score;
  });
}

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
    pausedGame ? (pausedGame = false) : (pausedGame = true);
  }
}

loadDataFromLocalStorage();

function game() {
  requestAnimationFrame(game);

  pausedGame === true
    ? (config.frameLimiter = 10000)
    : (config.frameLimiter = 4);

  if (++config.count < config.frameLimiter) {
    return;
  }

  scoreLabel.textContent = `SCORE: ${currentScore}`;
  config.count = 0;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  snake.startMove();
  snake.crossBorderCanvas();
  snake.movementAnimation();
  food.render();

  snake.tail.forEach(function (cell, index) {
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(cell.x, cell.y, config.grid - 1, config.grid - 1);

    if (cell.x === food.x && cell.y === food.y) {
      snake.eat();
      currentScore++;
      food.spawn();
    }

    for (let i = index + 1; i < snake.tail.length; i++) {
      if (cell.x === snake.tail[i].x && cell.y === snake.tail[i].y) {
        snake.reset();
        canvasShowHide();
        modalShowHide();
        pausedGame = true;
        food.spawn();
      }
    }
  });
}

document.addEventListener("keydown", direction);

btnConfirm.addEventListener("click", () => {
  players.push({ name: inputName.value, score: currentScore });

  let jsonPlayers = JSON.stringify(players);
  localStorage.setItem("players", jsonPlayers);

  sortPlayersScoreForRatingList();
  modalShowHide();
  canvasShowHide();

  pausedGame = false;
  currentScore = 0;

  document.querySelectorAll("li").forEach((item) => {
    item.remove();
  });
  for (let i = 0; i < players.length; i++) {
    addRatingList(players[i].name, players[i].score);
  }
  inputName.value = "";
});

requestAnimationFrame(game);
