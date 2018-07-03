var AsteroidsGame = function(id) {
  this.canvas = document.getElementById(id);
  this.c = this.canvas.getContext("2d");
  this.canvas.focus();
  this.guide = false;
  this.ship_mass = 10;
  this.ship_radius = 15;
  this.asteroid_mass = 5000;   // Mass of asteroids
  this.asteroid_push = 500000; // max force to apply in one frame
  this.ship = new Ship(
    this.ship_mass,
    this.ship_radius,
    this.canvas.width / 2,
    this.canvas.height / 2,
    1000, 200
  );
  this.projectiles = [];
  this.asteroids = [];
  this.asteroids.push(this.moving_asteroid());
  this.canvas.addEventListener("keydown", this.keyDown.bind(this), true);
  this.canvas.addEventListener("keyup", this.keyUp.bind(this), true);
  window.requestAnimationFrame(this.frame.bind(this));
}

AsteroidsGame.prototype.moving_asteroid = function(elapsed) {
  var asteroid = this.new_asteroid();
  this.push_asteroid(asteroid, elapsed);
  return asteroid;
}

AsteroidsGame.prototype.new_asteroid = function() {
  return new Asteroid(
    this.asteroid_mass,
    this.canvas.width * Math.random(),
    this.canvas.height * Math.random()
  );
}

AsteroidsGame.prototype.push_asteroid = function(asteroid, elapsed) {
  elapsed = elapsed || 0.015;
  asteroid.push(2 * Math.PI * Math.random(), this.asteroid_push, elapsed);
  asteroid.twist(
    (Math.random() - 0.5) * Math.PI * this.asteroid_push * 0.02,
    elapsed
  );
}

AsteroidsGame.prototype.keyDown = function(e) {
  this.key_handler(e, true);
}
AsteroidsGame.prototype.keyUp = function(e) {
  this.key_handler(e, false);
}

AsteroidsGame.prototype.key_handler = function(e, value) {
  var nothing_handled = false;
  switch(e.key || e.keyCode) {
    case "ArrowLeft":
    case 37: // left arrow
      this.ship.left_thruster = value;
      break;
    case "ArrowUp":
    case 38: // up arrow
      this.ship.thruster_on = value;
      break;
    case "ArrowRight":
    case 39: // right arrow
      this.ship.right_thruster = value;
      break;
    case "ArrowDown":
    case 40:
      this.ship.retro_on = value;
      break;
    case " ":
    case 32: //spacebar
      this.ship.trigger = value;
      break;
    case "g":
    case 71: // g for guide
      if(value) this.guide = !this.guide;
      break;
    default:
      nothing_handled = true;
  }
  if(!nothing_handled) e.preventDefault();
}

AsteroidsGame.prototype.frame = function(timestamp) {
  if (!this.previous) this.previous = timestamp;
  var elapsed = timestamp - this.previous;
  this.update(elapsed / 1000);
  this.draw();
  this.previous = timestamp;
  window.requestAnimationFrame(this.frame.bind(this));
}

AsteroidsGame.prototype.update = function(elapsed) {
  this.ship.compromised = false;
  this.asteroids.forEach(function(asteroid) {
    asteroid.update(elapsed, this.c);
  }, this);
  this.ship.update(elapsed, this.c);
  this.projectiles.forEach(function(p, i, projectiles) {
    p.update(elapsed, this.c);
    if(p.life <= 0) {
      projectiles.splice(i, 1);
    }
  }, this);
  if(this.ship.trigger && this.ship.loaded) {
    this.projectiles.push(this.ship.projectile(elapsed));
  }
}

AsteroidsGame.prototype.draw = function() {
  this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
  if(this.guide) {
    draw_grid(this.c);
    this.asteroids.forEach(function(asteroid) {
      draw_line(this.c, asteroid, this.ship);
    }, this);
  }
  this.asteroids.forEach(function(asteroid) {
    asteroid.draw(this.c, this.guide);
  }, this);
  this.ship.draw(this.c, this.guide);
  this.projectiles.forEach(function(p) {
    p.draw(this.c);
  }, this);
}
