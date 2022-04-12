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
const player = new Player(x, y, 10, "white");

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

    //random enemy color
    const color = `hsl(${Math.random() * 360}, 50%, 50%)`;

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

let animationId;

//animate function
function animate() {
  //store animationId to a variable
  animationId = requestAnimationFrame(animate);

  //fade effect
  c.fillStyle = "rgba(0, 0, 0, 0.1)";

  //clear canvas
  c.fillRect(0, 0, canvas.width, canvas.height);

  //create player
  player.draw();

  //animate projectile
  projectiles.forEach((projectile, index) => {
    projectile.update();

    //remove projectile overflow from the screen
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.height
    ) {
      setTimeout(() => {
        //remove projectile the screen
        projectiles.splice(index, 1);
      }, 0);
    }
  });

  //animate enemies
  enemies.forEach((enemy, index) => {
    enemy.update();

    //determine enemy collision to player
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

    //check if enemy collide to player
    if (dist - enemy.radius - player.radius < 1) {
      //end game
      cancelAnimationFrame(animationId);
    }

    //determine projectile collision
    projectiles.forEach((projectile, index) => {
      //distance of projectile from enemy
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

      //check if projectile collide to enemy
      if (dist - enemy.radius - projectile.radius < 1) {
        //delay the disappearance of enemy and projectile object
        setTimeout(() => {
          //remove enemy from the screen
          enemies.splice(index, 1);

          //remove projectile the screen
          projectiles.splice(index, 1);
        }, 0.2);
      }
    });
  });
}

//fire projectile
document.addEventListener("click", (e) => {
  console.log(projectiles);

  //angle
  const angle = Math.atan2(
    e.clientY - canvas.height / 2,
    e.clientX - canvas.width / 2
  );

  //velocity
  const velocity = {
    x: Math.cos(angle) * 6,
    y: Math.sin(angle) * 6,
  };

  //create projectile and push to projectiles arr
  projectiles.push(
    new Projectile(canvas.width / 2, canvas.height / 2, 5, "white", velocity)
  );
});

//call animate fn
animate();

//call spawn enemies
spawnEnemies();
