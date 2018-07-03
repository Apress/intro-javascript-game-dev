function draw_pacman(ctx, x, y, r, m) {
  angle = 0.2 * Math.PI * m;
  ctx.save();
  ctx.fillStyle = "yellow";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.arc(x, y, r, angle, -angle);
  ctx.lineTo(x, y);
  ctx.closePath()
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}
