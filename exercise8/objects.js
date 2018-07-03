function PacMan(x, y, radius, speed) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.speed = speed;
  this.angle = 0;
  this.x_speed = speed;
  this.y_speed = 0;
  this.time = 0;
  this.mouth = 0;
}

PacMan.prototype.draw = function(ctx) {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.angle);
  draw_pacman(ctx, this.radius, this.mouth);
  ctx.restore();
}

PacMan.prototype.turn = function(direction) {
  if(this.y_speed) {
    this.x_speed = -direction * this.y_speed;
    this.y_speed = 0;
    this.angle = this.x_speed > 0 ? 0 : Math.PI;
  } else {
    this.y_speed = direction * this.x_speed;
    this.x_speed = 0;
    this.angle = this.y_speed > 0 ? 0.5 * Math.PI : 1.5 * Math.PI;
  }
}

PacMan.prototype.turn_left = function() {
  this.turn(-1);
}

PacMan.prototype.turn_right = function() {
  this.turn(1);
}

PacMan.prototype.update = function(elapsed, width, height) {

  if(Math.random() <= 0.01) {
    if(Math.random() < 0.5) {
      this.turn_left();
    } else {
      this.turn_right();
    }
  }

  if(this.x - this.radius + elapsed * this.x_speed > width) {
    this.x = -this.radius;
  }
  if(this.x + this.radius + elapsed * this.x_speed < 0) {
    this.x = width + this.radius;
  }
  if(this.y - this.radius + elapsed * this.y_speed > height) {
    this.y = -this.radius;
  }
  if(this.y + this.radius + elapsed * this.y_speed < 0) {
    this.y = height + this.radius;
  }
  this.x += this.x_speed * elapsed;
  this.y += this.y_speed * elapsed;
  this.time += elapsed;
  this.mouth = Math.abs(Math.sin(2 * Math.PI * this.time));
}

function Ghost(x, y, radius, speed, colour) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.speed = speed;
  this.colour = colour;
}

Ghost.prototype.draw = function(ctx) {
  ctx.save();
  ctx.translate(this.x, this.y);
  draw_ghost(ctx, this.radius, {
    fill: this.colour
  });
  ctx.restore();
}

Ghost.prototype.update = function(target, elapsed) {
  var angle = Math.atan2(target.y - this.y, target.x - this.x);
  var x_speed = Math.cos(angle) * this.speed;
  var y_speed = Math.sin(angle) * this.speed;
  this.x += x_speed * elapsed;
  this.y += y_speed * elapsed;
}
