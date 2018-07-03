var context = document.getElementById("asteroids").getContext("2d");
context.lineWidth = 0.5;
context.strokeStyle = "white";
let x = context.canvas.width * 0.9;
let y = 0;
let radius = context.canvas.width * 0.1;
draw_grid(context);
for(let r = 0; r <= 0.5 * Math.PI; r += 0.05 * Math.PI) {
  context.save()
  context.rotate(r);
  draw_ship(context, x, y, radius, {guide: true});
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(x, 0);
  context.stroke();
  context.restore()
}
