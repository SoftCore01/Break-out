Simple Web Game Development Using Canvas:
1.The entire game will be rendered entirely on the canvas element.

2.Canvas basics:
a.First we need to us JS to obtain the canvas element
    const canvas = document.getElementById("canvas")

b.Then we get the canvas 2d rendering context:
    const ctx = canvas.getContext("2d");

c.Then we write code for what we want to render between the following codes:
    ctx.beginPath()
    <!-- Rendering code -->
    ctx.closePath()

d.We can create simple shapes using:
    ctx.rect(x,y, width, height); create rectangle
    ctx.fillStyle = colorValue; assign colorValue as fill color
    ctx.fill(); fill rectangle

    where x: x coordinate of top left corner
          y: y coordinate of top left corner

    <!-- To Create an arc of circle -->
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle, directionOfArc);
    ctx.strokeStyle = "yellow";
    ctx.stroke();
    ctx.closePath();

