/* import { createPaddleControls, destroyPaddleControls } from "./modules/functions.js"; */
//To use import statements like above add type="module" to the script element of your index.html file.

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1};
  }
}


let paddleX = (canvas.width - paddleWidth) / 2;
let x = /* ballRadius */ canvas.width / 2;
let y = /* canvas.height - ballRadius */ canvas.height / 2;
let dx = 1;
let dy = 1;
let rightPressed = false;
let leftPressed = false;
let interval = 0;
let score = 0;
let lives = 3;
let isRestart = false;

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
}
  
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#000000";
  ctx.fill();
  ctx.closePath();

  /* ctx.beginPath();
  ctx.rect(x-ballRadius, y-ballRadius, 2*ballRadius, 2*ballRadius);
  ctx.strokeStyle = "#000000";
  ctx.stroke();
  ctx.closePath(); */
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
          : (ctx.fillStyle = "#0095DD");
        /* ctx.fillStyle = "#0095DD"; */
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}


/* function drawAnimation() {
  let newBricks = {...bricks};
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r].y = newBricks[c][r].y - 30;
    }
  }
} */

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          x - ballRadius > b.x - brickHeight / 2 &&
          x - ballRadius < b.x + brickWidth &&
          y + ballRadius > b.y &&
          y - ballRadius < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score ++;
          
          /* score === brickColumnCount * brickRowCount ? restartGame() : null; */
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
  x = canvas.width / 2;
  y = canvas.height / 2;
  dx = 1;
  dy = 1;
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r].status = 1;
      bricks[c][r].y = r * (brickHeight + brickPadding) + brickOffsetTop - 50;
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
      if (!lives) {
        gameOver();
      } else {
        repositionBallAndPaddle()
      }
    }
  }
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

document.getElementById("runButton").addEventListener("click", function () {
    startGame();
    this.disable = true;
})
document.getElementById("pause").addEventListener("click", pausePlay)
document.addEventListener("keydown", (e) => {
  e.code == "Escape" ? pausePlay() : null;
})

