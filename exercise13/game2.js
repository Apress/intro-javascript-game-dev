function collision(obj1, obj2) {
  return distance_between(obj1, obj2) < (obj1.radius + obj2.radius);
}

function distance_between(obj1, obj2) {
  return Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2));
}

var AsteroidsGame = function(id) {
  this.canvas = document.getElementById(id);
  this.c = this.canvas.getContext("2d");
  this.canvas.focus();
  this.guide = false;
  this.ship_mass = 10;
  this.ship_radius = 15;
  this.asteroid_mass = 10000;   // Mass of asteroids
  this.asteroid_push = 5000000; // max force to apply in one frame
  this.mass_destroyed = 500;
  this.health_indicator = new Indicator("health", 5, 5, 100, 10);
  this.score_indicator = new NumberIndicator("score", this.canvas.width - 10, 5);
  this.level_indicator = new NumberIndicator("level", this.canvas.width / 2, 5, {
    align: "center"
  });
  this.fps_indicator = new NumberIndicator("fps", this.canvas.width - 10, this.canvas.height - 15, {
    digits: 2
  });
  this.message = new Message(this.canvas.width / 2, this.canvas.height * 0.4);
  this.canvas.addEventListener("keydown", this.keyDown.bind(this), true);
  this.canvas.addEventListener("keyup", this.keyUp.bind(this), true);
  window.requestAnimationFrame(this.frame.bind(this));
  this.reset_game();
}

AsteroidsGame.prototype.reset_game = function() {
  this.game_over = false;
  this.score = 0;
  this.level = 0;
  this.ship = new Ship(
    this.ship_mass,
    this.ship_radius,
    this.canvas.width / 2,
    this.canvas.height / 2,
    1000, 200
  );
  this.projectiles = [];
  this.asteroids = [];
  this.level_up();
}

AsteroidsGame.prototype.level_up = function() {
  this.level += 1;
  for(var i = 0; i < this.level; i++) {
    this.asteroids.push(this.moving_asteroid());
  }
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
  asteroid.push(Math.PI * 2 * Math.random(), this.asteroid_push, elapsed);
  asteroid.twist(
    (Math.random() - 0.5) * Math.PI * this.asteroid_push * 0.02,
    elapsed
  );
}

AsteroidsGame.prototype.split_asteroid = function(asteroid, elapsed) {
  asteroid.mass -= this.mass_destroyed;
  this.score += this.mass_destroyed;
  var split = 0.25 + 0.5 * Math.random(); // split unevenly
  var ch1 = asteroid.child(asteroid.mass * split);
  var ch2 = asteroid.child(asteroid.mass * (1 - split));
  [ch1, ch2].forEach(function(child) {
    if(child.mass < this.mass_destroyed) {
      this.score += child.mass;
    } else {
      this.push_asteroid(child, elapsed);
      this.asteroids.push(child);
    }
  }, this);
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
      if(this.game_over) {
        this.reset_game();
      } else {
        this.ship.trigger = value;
      }
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
  this.draw(1000 / elapsed);
  this.previous = timestamp;
  window.requestAnimationFrame(this.frame.bind(this));
}

AsteroidsGame.prototype.update = function(elapsed) {
  if(this.asteroids.length == 0) {
    this.level_up();
  }
  this.ship.compromised = false;
  this.asteroids.forEach(function(asteroid) {
    asteroid.update(elapsed, this.c);
    if(collision(asteroid, this.ship)) {
      this.ship.compromised = true;
    }
  }, this);
  this.ship.update(elapsed, this.c);
  if(this.ship.health <= 0) {
    this.game_over = true;
    return;
  }
  this.projectiles.forEach(function(p, i, projectiles) {
    p.update(elapsed, this.c);
    if(p.life <= 0) {
      projectiles.splice(i, 1);
    } else {
      this.asteroids.forEach(function(asteroid, j) {
        if(collision(asteroid, p)) {
          projectiles.splice(i, 1);
          this.asteroids.splice(j, 1);
          this.split_asteroid(asteroid, elapsed);
        }
      }, this);
    }
  }, this);
  if(this.ship.trigger && this.ship.loaded) {
    this.projectiles.push(this.ship.projectile(elapsed));
  }
}

AsteroidsGame.prototype.draw = function(fps) {
  this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
  if(this.guide) {
    draw_grid(this.c);
    this.asteroids.forEach(function(asteroid) {
      if(!this.game_over) draw_line(this.c, asteroid, this.ship);
      this.projectiles.forEach(function(p) {
        draw_line(this.c, asteroid, p);
      }, this);
    }, this);
    this.fps_indicator.draw(this.c, fps);
  }
  this.asteroids.forEach(function(asteroid) {
    asteroid.draw(this.c, this.guide);
  }, this);
  if(this.game_over) {
    this.message.draw(this.c, "GAME OVER", "Press space to play again");
    return;
  }
  this.ship.draw(this.c, this.guide);
  this.projectiles.forEach(function(p) {
    p.draw(this.c);
  }, this);
  this.health_indicator.draw(this.c, this.ship.health, this.ship.max_health);
  this.score_indicator.draw(this.c, this.score);
  this.level_indicator.draw(this.c, this.level);
}
