/* 
    Todo list: 

    1. Create player 
    2. Shoot projectile 
    3. Create enimies 
    4. Detect collision on enemy / projectile hit 
    5. Detect collision on enemy / player hit 
    6. Remove off Screen projectiles 
    7. Colorize game 
    8. Shrink enemies on hit 
    9. Create particle explosion on hit 
    10. Add score 
    11. Add game over UI 
    12. Add restart button 
    13. Add start game button
*/

//canvas element
const canvas = document.querySelector("#canvas");
const c = canvas.getContext("2d");

// canvas height
canvas.width = innerWidth;
canvas.height = innerHeight;

//create player
class Player {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }
}

//projectile
class Projectile {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();

    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

//enemy
class Enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
  }

  update() {
    this.draw();

    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

//center player
const x = canvas.width / 2;
const y = canvas.height / 2;

//instantiate player class
const player = new Player(x, y, 30, "blue");

//store multiple projectile
const projectiles = [];

//store multiple enemies
const enemies = [];

//spawn enemies
function spawnEnemies() {
  //create enemy every 1 second
  setInterval(() => {
    // randowm spawn of enemies on x axis
    const radius = Math.random() * (30 - 4) + 4;

    let x;
    let y;

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;

      // y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    } else {
      x = Math.random() * canvas.width;
      y = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;

      // y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
    }

    const color = "green";

    //Move enemy to player
    const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);

    //velocity
    const velocity = {
      x: Math.cos(angle),
      y: Math.sin(angle),
    };

    //push enemy to enemies arr
    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 1000);
}

//animate function
function animate() {
  requestAnimationFrame(animate);

  //clear canvas
  c.clearRect(0, 0, canvas.width, canvas.height);

  //create player
  player.draw();

  //animate projectile
  projectiles.forEach((projectile) => {
    projectile.update();
  });

  //animate enemies
  enemies.forEach((enemy) => {
    enemy.update();
  });
}

//fire projectile
document.addEventListener("click", (e) => {
  //angle
  const angle = Math.atan2(
    e.clientY - canvas.height / 2,
    e.clientX - canvas.width / 2
  );

  //velocity
  const velocity = {
    x: Math.cos(angle),
    y: Math.sin(angle),
  };

  //create projectile and push to projectiles arr
  projectiles.push(
    new Projectile(canvas.width / 2, canvas.height / 2, 5, "red", velocity)
  );
});

animate();

spawnEnemies();
