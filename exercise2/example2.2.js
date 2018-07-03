context.strokeStyle = "#00FF00";
for(var x = 0; x < canvas.width; x += 10) {
  context.beginPath();
  context.moveTo(x, 0);
  context.lineTo(x, canvas.height);
  context.lineWidth = (x % 50 == 0) ? 0.5 : 0.25;
  context.stroke();
}
for(var y = 0; y < canvas.height; y += 10) {
  context.beginPath();
  context.moveTo(0, y);
  context.lineTo(canvas.width, y);
  context.lineWidth = (y % 50 == 0) ? 0.5 : 0.25;
  context.stroke();
}