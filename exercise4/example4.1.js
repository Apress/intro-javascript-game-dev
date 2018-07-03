function draw_ship(ctx, x, y, radius, options) {
  options = options || {};
  ctx.save();
  ctx.lineWidth = options.lineWidth || 2;
  ctx.strokeStyle = options.stroke || "white";
  ctx.fillStyle = options.fill || "black";
  let angle = (options.angle || 0.5 * Math.PI) / 2;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(
    x + Math.cos(Math.PI - angle) * radius,
    y + Math.sin(Math.PI - angle) * radius
  );
  ctx.lineTo(
    x + Math.cos(Math.PI + angle) * radius,
    y + Math.sin(Math.PI + angle) * radius
  );
  ctx.lineTo(x + radius, y);
  ctx.fill();
  ctx.stroke();
  if(options.guide) {
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }
  ctx.restore();
}
