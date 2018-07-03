function draw_asteroid(ctx, radius, shape, noise, guide) {
  ctx.save();
  ctx.beginPath();
  for(var i = 0; i < shape.length; i++) {
    ctx.rotate(2 * Math.PI / shape.length);
    ctx.lineTo(radius + radius * noise * shape[i], 0);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  if(guide) {
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.lineWidth = 0.2;
    ctx.arc(0, 0, radius + radius * noise, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, radius - radius * noise, 0, 2 * Math.PI);
    ctx.stroke();
  }
  ctx.restore();
}