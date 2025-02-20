
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

export { createPaddleControls, destroyPaddleControls };
