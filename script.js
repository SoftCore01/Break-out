import { createBricks, drawBricks } from "./modules/functions.js";
//To use import statements like above add type="module" to the script element of your index.html file.

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("runButton");
const pauseButton = document.getElementById("pause");

const colors = {
  red: ["#620000", "#930000", "#c40000", "#f50000", "#ff2727", "#ff5858", "#ff8989"],
  blue: ["#000062", "#000093", "#0000c4", "#0000f5", "#2727ff", "#5858ff", "#8989ff"],

};
const ballRadius = 5;
const paddleHeight = 7;
let paddleWidth = 80;
const brickRowCount = 5;
const brickColumnCount = 7;
const brickWidth = 50;
const brickHeight = 15;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const extraLife = {
  name: "Extra Life",
  x: 0,
  y: 0,
  size: 25,
  visible: false,
  isCalled: false,
  polarity: 0,
};
const paddleModifier = {
  name: "Paddle Extender",
  x: 0,
  y: 0,
  size: 25,
  visible: false,
  isCalled: false,
};
const ice = {
  name: "Ice",
  x: 0,
  y: 0,
  size: 25,
  visible: false,
  isCalled: false,
};
const bomb = { name: "Bomb", x: 0, y: 0, size: 25, visible: false, isCalled: false };

const bricks = createBricks(
  brickColumnCount, brickRowCount, extraLife, 
  bomb, paddleModifier,ice, addPowerUpToBrick, changeLife
);


let paddleX = (canvas.width - paddleWidth) / 2;
let x = randomRange(50, canvas.width - 50);
let y = /* canvas.height - ballRadius */ canvas.height / 2;
let dx = changeLife();
let dy = 1;
let rightPressed = false;
let leftPressed = false;
let interval = 0;
let score = 0;
let lives = 3;
let isRestart = false;
let paddleSpeed = 7;
/* let callCountForAddExtraLives = 0; */

let isPlay = false;
let isStart = false;
let ddx, ddy;


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  console.log(bomb.visible)
  drawBall();
  drawPaddle();
  drawBricks(
    brickColumnCount,
    brickRowCount,
    brickHeight,
    brickWidth,
    brickPadding,
    brickOffsetLeft,
    brickOffsetTop,
    isRestart,
    bomb,
    extraLife,
    ice,
    paddleModifier,
    bricks,
    ctx
  );
  collisionDetection();
  drawScore();
  drawLive();
  ballWallCollision();
  updateBallPosition();
  paddleMovementByKeydown();
  drawPowerUp(extraLife);
  drawPowerUp(paddleModifier);
  drawPowerUp(ice);
  drawPowerUp(bomb);
  checkPowerUpAndPaddleCollision(extraLife);
  checkPowerUpAndPaddleCollision(paddleModifier);
  checkPowerUpAndPaddleCollision(ice);
  updatePowerUpPosition(ice)
  updatePowerUpPosition(extraLife);
  updatePowerUpPosition(paddleModifier);
  checkLivesLeft();
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#000000";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.roundRect(
    paddleX,
    canvas.height - paddleHeight,
    paddleWidth,
    paddleHeight,
    paddleHeight / 2
  );
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
}



function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (hasBallAndBrickCollided(b)) {
          dy == -1.4 ? dy = 1 : null
          dy = -dy;
          b.status = 0;
          /* b.life ? lives ++ : null; */
          if (b.life) {
            extraLife.visible = true;
            extraLife.x = b.x;
            extraLife.y = b.y;
            b.life = false;
          }
          if (b.bomb) {
            explosion(c, r);
            b.bomb = false;
            bomb.visible = false;
          }
          if (b.paddleMod) {
            paddleModifier.visible = true;
            paddleModifier.x = b.x;
            paddleModifier.y = b.y;
            b.paddleMod = false;
          }
          if (b.ice) {
            ice.visible = true;
            ice.x = b.x;
            ice.y = b.y;
            b.ice = false;
          }
          score++;
          checkAllStatus() ? null : restartGame();
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "black";
  ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLive() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "black";
  ctx.fillText(`Lives: ${lives-1}`, canvas.width - 65, 20);
}

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = true;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") {
    rightPressed = false;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    leftPressed = false;
  }
}

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width - paddleWidth / 2) {
    paddleX = Math.max(0,relativeX - paddleWidth / 2);
  }
}

function touchMoveHandler(e) {
  const relativeX = e.touches[0].clientX - canvas.offsetLeft;
  if (relativeX > 0 &&  relativeX < canvas.width - paddleWidth / 2) {
    paddleX = Math.max(0, relativeX - paddleWidth / 2);
  }
}

function gameOver() {
  document.location.reload();
  clearInterval(interval);
}

function startGame() {
  interval = setInterval(draw, 10);
  createPaddleControls();
  isPlay = true;
}

function restartGame() {
  paddleSpeed = 7;
  isRestart = true;
  extraLife.isCalled = false;
  bomb.isCalled = false;
  paddleModifier.isCalled = false;
  ice.isCalled = false
  paddleWidth = 75;
  x = randomRange(50, canvas.width - 50);
  y = canvas.height / 2;
  dx = 1;
  dy = 1;
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r].status = 1;
      bricks[c][r].y = r * (brickHeight + brickPadding) + brickOffsetTop - 50;
      if (addPowerUpToBrick(c, r, extraLife)) {
        bricks[c][r].life = true;
        extraLife.isCalled = true;
        extraLife.polarity = changeLife();
        extraLife.visible = true;
      }
      if (addPowerUpToBrick(c, r, bomb)) {
        bricks[c][r].bomb = true;
        bomb.isCalled = true;
        bomb.visible = true;
      }
      if (addPowerUpToBrick(c, r, paddleModifier)) {
        bricks[c][r].paddleMod = true;
        paddleModifier.isCalled = true;
        paddleModifier.visible = true;
      }
      if (addPowerUpToBrick(c,r, ice)) {
        bricks[c][r].ice = true;
        ice.isCalled = true;
        ice.visible = true;
      }
    }
  }
}

function checkAllStatus() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) return true;
    }
  }
  return false;
}

function pausePlay() {
  if (isPlay && isStart) {
    ddx = dx;
    ddy = dy;
    dx = 0;
    dy = 0;
    isPlay = false;
    clearInterval(interval);
    pauseButton.style.backgroundColor = "blue";
    pauseButton.style.border = "2px solid white";
    pauseButton.style.color = "white";
  } else if(!isPlay && isStart) {
    interval = setInterval(draw, 10);
    dx = ddx;
    dy = ddy;
    isPlay = true;
    pauseButton.style.backgroundColor = "transparent";
    pauseButton.style.border = "2px solid blue";
    pauseButton.style.color = "black";
  }
}

function createPaddleControls() {
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);
  document.addEventListener("touchmove", touchMoveHandler, false);
}


function ballWallCollision() {
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx == 0.5 ? dx = 1 : dx == -0.5 ? dx = -1 : null;
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dx == 0.5 ? (dx = 1) : dx == -0.5 ? (dx = -1) : null;
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius - paddleHeight) {
    if (paddleBallCollision()) {
      dy = -dy;
      if (x + dx < paddleX + 30  && dx > 0) {
        dx = -1
      } else if (x + dx > paddleX + 60 && dx < 0) {
        dx = 1;
      } else {
        dx > 0 ? dx = 0.5 : dx = -0.5;
        dy == -1 ? dy = -1.5: null;
      }
    } else {
      lives--;
      repositionBallAndPaddle();
    }
  }
}

function randomRange(min, max) {
  const randomStart = Math.random();
  const diff = max - min;

  return randomStart * diff + min;
}

function updateBallPosition() {
  x += dx;
  y += dy;
}

function paddleMovementByKeydown() {
  rightPressed
    ? (paddleX = Math.min(paddleX + paddleSpeed, canvas.width - paddleWidth))
    : null;
  leftPressed ? (paddleX = Math.max(paddleX - paddleSpeed, 0)) : null;
}

function paddleBallCollision() {
  return (
    x > paddleX - ballRadius &&
    x < paddleX + paddleWidth + ballRadius
  );
}

function repositionBallAndPaddle() {
  x = canvas.width / 2;
  y = canvas.height / 2;
  dx = 1;
  dy = 1;
  paddleX = (canvas.width - paddleWidth) / 2;
  document.addEventListener("mousemove", mouseMoveHandler, false);
  document.addEventListener("touchmove", touchMoveHandler, false)
  paddleSpeed = 7;
}

function hasBallAndBrickCollided(b) {
  return (
    x - ballRadius > b.x - brickHeight / 2 &&
    x - ballRadius < b.x + brickWidth &&
    y + ballRadius > b.y &&
    y - ballRadius < b.y + brickHeight
  );
}

function addPowerUpToBrick(c, r, powerUp) {
  if (!powerUp.isCalled && c != r && c > 0) {
    let randC = Math.round(Math.random() * c);
    return powerUp.name == "Bomb"
      ? c == randC && c != 1 && r == 3
      : powerUp.name == "Extra Life"
      ? c == randC && r == 0
      : powerUp.name == "Paddle Extender"
      ? c == randC && r == 1
      : c == randC && r == 2;
  }
  return false;
}


function drawPowerUp(powerUp) {
  if (powerUp.visible) {
    ctx.beginPath();
    if (powerUp.name == "Extra Life") {
      const img = new Image();
      extraLife.polarity > 0
        ? (img.src = "./imgs/heart-tick-svgrepo-com.svg")
        : (img.src = "./imgs/heart-remove-svgrepo-com.svg");
      ctx.drawImage(img, powerUp.x, powerUp.y, powerUp.size, brickHeight);
    } else if (powerUp.name == "Paddle Extender") {
      const img = new Image();
      img.src = "./imgs/plus-minus-svgrepo-com.svg";
      ctx.drawImage(img, powerUp.x, powerUp.y, powerUp.size, brickHeight);
    } else if (powerUp.name == "Ice") {
      const img = new Image();
      img.src = "./imgs/ice-svgrepo-com.svg";
      ctx.drawImage(img, powerUp.x, powerUp.y, powerUp.size, brickHeight);
    } else if (powerUp.name == "Bomb") {
      const img = new Image();
      img.src = "./imgs/bomb-svgrepo-com.svg";
      ctx.drawImage(img, powerUp.x, powerUp.y, powerUp.size, brickHeight);
    }
    ctx.closePath();
  }
}


function updatePowerUpPosition(powerUp) {
  if (powerUp.visible) {
    powerUp.name == "Extra Life"
      ? (powerUp.y += 0.5)
      : powerUp.name == "Paddle Extender"
      ? (powerUp.y += 0.8)
      : powerUp.name == "Ice"
      ? (powerUp.y += 0.7)
      : null;
  }
}

function checkPowerUpAndPaddleCollision(powerUp) {
  powerUp.y >= canvas.height ? (powerUp.visible = false) : null;
  if (
    powerUp.visible &&
    powerUp.x >= paddleX  &&
    powerUp.x <= paddleX + paddleWidth &&
    powerUp.y >= canvas.height - 25 - paddleHeight
  ) {
    if (powerUp.name == "Extra Life") {
      lives += extraLife.polarity;
    } else if (powerUp.name == "Paddle Extender") {
      paddleWidth += changeLife() * 10;
    } else if (powerUp.name == "Ice") {
      paddleSpeed = 0;
      document.removeEventListener("mousemove", mouseMoveHandler);
      document.removeEventListener("touchmove", touchMoveHandler);
    }
    powerUp.visible = false;
  }
}

function checkLivesLeft() {
  if (lives < 1) {
    gameOver();
  }
}

function explosion(c, r) {
  if (r == 0) {
    bricks[c][r + 1].status = 0;
    score++;
  } else if (r == 3) {
    bricks[c][r - 1].status = 0;
    score++;
  } else {
    bricks[c][r + 1].status = 0;
    bricks[c][r - 1].status = 0;
    score += 2;
  }

  if (c == 0) {
    bricks[c + 1][r].status = 0;
    score++;
  } else if (c == 4) {
    bricks[c - 1][r].status = 0;
    score++;
  } else {
    bricks[c + 1][r].status = 0;
    bricks[c - 1][r].status = 0;
    score += 2;
  }
}

function changeLife() {
  const weight = Math.round(Math.random() * 10);
  return weight <= 5 ? 1 : weight >= 6 ? -1 : null;
}

document.getElementById("runButton").addEventListener("click", function () {
  if (!isStart) {
    startGame();
    startButton.style.backgroundColor = "red";
    startButton.style.border = "2px solid white";
    startButton.style.color = "white";
    isStart = true;
    isPlay = true
  }
  
});
pauseButton.addEventListener("click", pausePlay);
document.addEventListener("keydown", (e) => {
  e.code == "Escape" ? pausePlay() : null;
});
