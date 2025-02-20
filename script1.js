/* const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let x = 0;
let y = canvas.height;
let dx = 1;
let dy = -1;
let isForward = true;

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (x <= canvas.height && y >= 1 && isForward) {
    x += dx;
    y += dy;
    x == canvas.height && y == 0 ? (isForward = false) : null;
  } else if (!isForward) {
    x += -dx;
    y += -dy;
    x == 0 && y == canvas.height ? (isForward = true) : null;
  }
  drawBall();
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function startGame() {
  setInterval(draw, 10);
}

document.getElementById("runButton").addEventListener("click", function () {
  startGame();
  this.disable = true;
});
 */

/* const fetchPromise = fetch(
  "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json"
);

console.log(fetchPromise);


fetchPromise.then((response) => {
  const jsonPromise = response.json();
  
  jsonPromise.then((data) => {
    console.log(data[0].name);
  });
});

console.log("Started request…"); */

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let newBrick = {
  x: 20,
  y: 20,
  width: 30,
  lenght: 60,
};

function drawAnimation() {
  ctx.beginPath();
  ctx.roundRect(
    newBrick.x,
    newBrick.y,
    newBrick.width,
    newBrick.lenght,
    newBrick.lenght / 2
  );
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();
}

drawAnimation()

