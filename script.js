/* import { createPaddleControls, destroyPaddleControls } from "./modules/functions.js"; */
//To use import statements like above add type="module" to the script element of your index.html file.

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const ballRadius = 10;
const paddleHeight = 10;
let paddleWidth = 75;
const brickRowCount = 4;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const extraLife = { name: "Extra Life", x: 0, y: 0, visible: false, isCalled: false};
const paddleModifier = { name: "Paddle Extender",x: 0, y: 0, visible: false, isCalled: false};
const bomb = {name: "Bomb", visible: false, isCalled: false};
const powerUpCallCounts = {
  callCountForAddBomb: true,
  callCountForAddExtraLives: true,
  callCountForPaddleModifier: false
}
let callCountForAddExtraLives = 0;
let callCountForAddBomb = 0;

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1, life: false, bomb: false, paddleMode: false};
    if (addPowerUpToBrick(c,r, extraLife)) {
      console.log(c,r, extraLife)
      bricks[c][r].life = true;
      extraLife.isCalled = true;
    };
    if (addPowerUpToBrick(c,r, bomb)) {
      console.log(c,r, bomb)
      bricks[c][r].bomb = true;
      bomb.isCalled = true;
    }
    if (addPowerUpToBrick(c,r, paddleModifier)) {
      console.log(c,r, paddleModifier)
      bricks[c][r].paddleMod = true;
      paddleModifier.isCalled = true;
    }
  }
}


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
/* let callCountForAddExtraLives = 0; */

let isPlay = false;
let ddx, ddy;


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall(); 
  drawPaddle();
  drawBricks();
  collisionDetection();
  drawScore();
  drawLive();
  ballWallCollision();
  updateBallPosition();
  paddleMovementByKeydown();
  checkPowerUpAndPaddleCollision(extraLife);
  checkPowerUpAndPaddleCollision(paddleModifier);
  drawPowerUp(extraLife, "pink");
  drawPowerUp(paddleModifier, "orange");
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
  ctx.roundRect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight, paddleHeight / 2);
  ctx.fillStyle = "black"
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        if (
          isRestart &&
          bricks[c][r].y < r * (brickHeight + brickPadding) + brickOffsetTop
        ) {
          bricks[c][r].y += 0.5;
        } else {
          isRestart = false;
          const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[c][r].y = brickY;
        };
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        bricks[c][r].x = brickX;
        ctx.beginPath();
        ctx.roundRect(brickX, bricks[c][r].y, brickWidth, brickHeight, brickHeight / 2);
        r == 0
          ? (ctx.fillStyle = "red")
          : r == 1
          ? (ctx.fillStyle = "green")
          : r == 2
          ? (ctx.fillStyle = "#0095DD")
          : (ctx.fillStyle = "yellow");
        bricks[c][r].bomb ? ctx.fillStyle = "purple" : null;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}


function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (hasBallAndBrickCollided(b)) {
          dy = -dy;
          b.status = 0;
          /* b.life ? lives ++ : null; */
          if (b.life) {
            extraLife.visible = true;
            extraLife.x = b.x + b.x / 2;
            extraLife.y = b.y;
            b.life = false;
          }
          if (b.bomb) {
            explosion(c,r);
            b.bomb = false;
          }
          if (b.paddleMod) {
            paddleModifier.visible = true;
            paddleModifier.x = b.x + b.x / 2;
            paddleModifier.y = b.y;
            b.paddleMod = false;
          }
          score ++;
          checkAllStatus() ? null : restartGame(); 
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Score: ${score}`, 8, 20);
}

function drawLive() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20);
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
  if (relativeX > 0 && relativeX < canvas.width - paddleWidth) {
    paddleX = relativeX;
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
  isRestart = true;
  extraLife.isCalled = false;
  bomb.isCalled = false
  paddleModifier.isCalled = false;
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
      }
      if (addPowerUpToBrick(c, r, bomb)) {
        bricks[c][r].bomb = true;
        bomb.isCalled = true;
      }
      if (addPowerUpToBrick(c, r, paddleModifier)) {
        bricks[c][r].paddleMod = true;
        paddleModifier.isCalled = true;
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
  if (isPlay) {
    ddx = dx;
    ddy = dy;
    dx = 0;
    dy = 0;
    isPlay = false;
    destroyPaddleControls();
  } else {
    dx = ddx;
    dy = ddy;
    isPlay = true;
    createPaddleControls();
  }
}

function createPaddleControls() {
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);
}

function destroyPaddleControls() {
  document.removeEventListener("keydown", keyDownHandler);
  document.removeEventListener("keyup", keyUpHandler);
  document.removeEventListener("mousemove", mouseMoveHandler);
}

function ballWallCollision() {
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius - paddleHeight) {
    if (paddleBallCollision()) {
      dy = -dy;
    } else {
      lives--;
      repositionBallAndPaddle()
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
    ? (paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth))
    : null;
  leftPressed ? (paddleX = Math.max(paddleX - 7, 0)) : null;
}

function paddleBallCollision() {
  return (
    x > paddleX - paddleHeight / 2 &&
    x < paddleX + paddleWidth + paddleHeight / 2
  );
}

function repositionBallAndPaddle() {
  x = canvas.width / 2;
  y = canvas.height / 2;
  dx = 1;
  dy = 1;
  paddleX = (canvas.width - paddleWidth) / 2;
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
  if (!powerUp.isCalled && c != r && c > 0)  {
    let randC = Math.round(Math.random() * c);
    const randR = Math.round(Math.random() * r);
    return c == randC && r == randR;
  }
  return false 
}

function initializeBricks() {
  
}

/* function addPaddleModifier(c, r, powerUp) {
  if (powerUpCallCounts.callCountForPaddleModifier < 1 && c != r && r > 0 && c > 0) {
    let randC = Math.round(Math.random() * c);
    const randR = Math.round(Math.random() * r);
    return c == randC && r == randR;
  }
  return false; 
} */

function drawPowerUp(powerUp, color) {
  if (powerUp.visible) {
    ctx.beginPath();
    if (powerUp.name == "Extra Life"){
      ctx.arc(powerUp.x, powerUp.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = color;
    } else if (powerUp.name == "Paddle Extender") {
      ctx.arc(powerUp.x, powerUp.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = color;
    }  
    ctx.fill();
    ctx.closePath();
  }
}

function updatePowerUpPosition(powerUp) {
  if (powerUp.visible) {
    powerUp.name == "Extra Life"
      ? (powerUp.y += 0.5)
      : powerUp.name == "Paddle Extender"
      ? (powerUp.y += 0.8)
      : null;

  } 
}

function checkPowerUpAndPaddleCollision(powerUp) {
  if (
    powerUp.visible &&
    powerUp.x >= paddleX - paddleHeight / 2 &&
    powerUp.x <= paddleX + paddleWidth + paddleHeight / 2 &&
    powerUp.y >= canvas.height - 5 - paddleHeight
  ) {
    if (powerUp.name == "Extra Life") {
      lives += changeLife();
    } else if (powerUp.name == "Paddle Extender") {
      paddleWidth += changeLife() * 10;
    } 
    powerUp.visible = false;
  }
}

function checkLivesLeft() {
  if (lives < 1) {
    gameOver()
  }
}

function explosion(c,r) {
  if (r == 0) {
    bricks[c][r+1].status = 0;
    score++;
  } else if (r == 3) {
    bricks[c][r-1].status = 0;
    score++;
  } else {
    bricks[c][r+1].status = 0;
    bricks[c][r-1].status = 0;
    score += 2;
  }

  if (c == 0) {
    bricks[c+1][r].status = 0;
    score++;
  } else if (c == 4) {
    bricks[c-1][r].status = 0;
    score++;
  } else {
    bricks[c+1][r].status = 0;
    bricks[c-1][r].status = 0;
    score += 2;
  }
}

function changeLife() {
  const weight = Math.round(Math.random()*10);
  return weight <= 5 ? 1: weight >= 6 ? -1 : null
}

document.getElementById("runButton").addEventListener("click", function () {
    startGame();
    this.disable = true;
})
document.getElementById("pause").addEventListener("click", pausePlay)
document.addEventListener("keydown", (e) => {
  e.code == "Escape" ? pausePlay() : null;
})

