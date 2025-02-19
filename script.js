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
let x = ballRadius;
let y = canvas.height - ballRadius;
let dx = 1;
let dy = -1;
let rightPressed = false;
let leftPressed = false;
let interval = 0;
let score = 0;
let lives = 3;



function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall(); 
  drawPaddle();
  drawBricks();
  collisionDetection();
  drawScore();
  drawLive()

  if (y + dy < ballRadius) {    
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
    } else {
        lives --;
        if (!lives) {
          gameOver();
        } else {
          x = canvas.width / 2;
          y = canvas.height - 30;
          dx = 1;
          dy = -1;
          paddleX = (canvas.width - paddleWidth) / 2
        }
    }
  }
  x + dx > canvas.width - ballRadius || x + dx < ballRadius  ? dx = -dx : null;

  x += dx;
  y += dy;

  rightPressed ? paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth) : null;
  leftPressed ? paddleX = Math.max(paddleX - 7, 0): null;
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
    ctx.fillStyle = "yellow"
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.roundRect(brickX, brickY, brickWidth, brickHeight, brickHeight / 2);
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
          
          score === brickColumnCount * brickRowCount ? gameOver() : null;
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
  relativeX > 0 && relativeX < canvas.width ? paddleX = relativeX - paddleWidth / 2: null;
}

function gameOver() {
  document.location.reload();
  clearInterval(interval);
}

function startGame() {
  interval = setInterval(draw, 10);
}



document.getElementById("runButton").addEventListener("click", function () {
    startGame();
    this.disable = true;
})

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
