function createPaddleControls(keyUpHandler, keyDownHandler, mouseMoveHandler) {
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("mousemove", mouseMoveHandler, false);
}

function destroyPaddleControls(keyUpHandler, keyDownHandler, mouseMoveHandler) {
  document.removeEventListener("keydown", keyDownHandler);
  document.removeEventListener("keyup", keyUpHandler);
  document.removeEventListener("mousemove", mouseMoveHandler);
}

function createBricks(
  brickColumnCount,
  brickRowCount,
  extraLife,
  bomb,
  paddleModifier,
  ice,
  addPowerUpToBrick,
  changeLife
) {
  let bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = {
        x: 0,
        y: 0,
        status: 1,
        life: false,
        bomb: false,
        paddleMode: false,
        ice: false,
      };
      if (addPowerUpToBrick(c, r, extraLife)) {
        bricks[c][r].life = true;
        extraLife.isCalled = true;
        extraLife.visible = true;
        extraLife.polarity = changeLife();
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
      if (addPowerUpToBrick(c, r, ice)) {
        bricks[c][r].ice = true;
        ice.isCalled = true;
        ice.visible = true;
      }
    }
  }
  return bricks;
}

function drawBricks(
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
) {
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
        }
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        bricks[c][r].x = brickX;
        ctx.beginPath();
        ctx.roundRect(
          brickX,
          bricks[c][r].y,
          brickWidth,
          brickHeight,
          brickHeight / 2
        );
        r == 0
          ? (ctx.fillStyle = "red")
          : r == 1
          ? (ctx.fillStyle = "green")
          : r == 2
          ? (ctx.fillStyle = "#0095DD")
          : r == 3
          ? (ctx.fillStyle = "yellow")
          : (ctx.fillStyle = "purple");
        /* bricks[c][r].bomb ? (ctx.fillStyle = "purple") : null; */
        if (bricks[c][r].bomb) {
          bomb.x = bricks[c][r].x + brickWidth / 2 - bomb.size / 2;
          bomb.y = bricks[c][r].y;
        }
        if (bricks[c][r].life) {
          extraLife.x = bricks[c][r].x + brickWidth / 2 - extraLife.size / 2;
          extraLife.y = bricks[c][r].y;
        }
        if (bricks[c][r].paddleMod) {
          paddleModifier.x =
            bricks[c][r].x + brickWidth / 2 - paddleModifier.size / 2;
          paddleModifier.y = bricks[c][r].y;
        }
        if (bricks[c][r].ice) {
          ice.x = bricks[c][r].x + brickWidth / 2 - ice.size / 2;
          ice.y = bricks[c][r].y;
        }
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}



export { createPaddleControls, destroyPaddleControls, createBricks, drawBricks, };
