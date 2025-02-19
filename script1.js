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

function draw() {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  roundedRect(ctx, 12, 12, 184, 168, 15);
  roundedRect(ctx, 19, 19, 170, 154, 9);
  roundedRect(ctx, 53, 53, 49, 33, 10);
  roundedRect(ctx, 53, 119, 49, 16, 6);
  roundedRect(ctx, 135, 53, 49, 33, 10);
  roundedRect(ctx, 135, 119, 25, 49, 10);

  
}

// A utility function to draw a rectangle with rounded corners.

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
  ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.arcTo(x, y, x, y + radius, radius);
  ctx.stroke();
}


draw()