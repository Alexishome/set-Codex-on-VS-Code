const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;
const keys = new Set();

const game = {
  running: true,
  score: 0,
  best: 0,
  spawnTimer: 0,
  spawnEvery: 700,
  lastTime: 0,
};

const player = {
  x: W / 2 - 14,
  y: H - 100,
  w: 28,
  h: 32,
  speed: 260,
  cooldown: 0,
  fireEvery: 170,
  hp: 3,
};

const bullets = [];
const enemies = [];
const stars = Array.from({ length: 60 }, () => ({
  x: Math.random() * W,
  y: Math.random() * H,
  speed: 25 + Math.random() * 70,
  size: Math.random() > 0.8 ? 2 : 1,
}));

function reset() {
  game.running = true;
  game.score = 0;
  game.spawnTimer = 0;
  game.spawnEvery = 700;
  player.x = W / 2 - player.w / 2;
  player.y = H - 100;
  player.cooldown = 0;
  player.hp = 3;
  bullets.length = 0;
  enemies.length = 0;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function boxHit(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

function drawPixelShip(x, y, color) {
  const s = 4;
  ctx.fillStyle = color;
  const points = [
    [2, 0, 1, 1],
    [1, 1, 3, 1],
    [0, 2, 5, 1],
    [1, 3, 3, 1],
    [2, 4, 1, 1],
    [1, 5, 1, 1],
    [3, 5, 1, 1],
    [0, 6, 1, 1],
    [4, 6, 1, 1],
    [0, 7, 1, 1],
    [4, 7, 1, 1],
  ];
  for (const [px, py, pw, ph] of points) {
    ctx.fillRect(x + px * s, y + py * s, pw * s, ph * s);
  }
}

function drawEnemy(x, y) {
  const s = 4;
  ctx.fillStyle = "#ff5f6d";
  const points = [
    [0, 0, 1, 1],
    [4, 0, 1, 1],
    [1, 1, 3, 1],
    [0, 2, 5, 1],
    [1, 3, 1, 1],
    [3, 3, 1, 1],
    [2, 4, 1, 1],
  ];
  for (const [px, py, pw, ph] of points) {
    ctx.fillRect(x + px * s, y + py * s, pw * s, ph * s);
  }
}

function update(dt) {
  for (const star of stars) {
    star.y += star.speed * dt;
    if (star.y > H) {
      star.y = -2;
      star.x = Math.random() * W;
    }
  }

  if (!game.running) return;

  let dx = 0;
  let dy = 0;
  if (keys.has("ArrowLeft") || keys.has("a")) dx -= 1;
  if (keys.has("ArrowRight") || keys.has("d")) dx += 1;
  if (keys.has("ArrowUp") || keys.has("w")) dy -= 1;
  if (keys.has("ArrowDown") || keys.has("s")) dy += 1;

  player.x += dx * player.speed * dt;
  player.y += dy * player.speed * dt;
  player.x = clamp(player.x, 0, W - player.w);
  player.y = clamp(player.y, 0, H - player.h);

  player.cooldown -= dt * 1000;
  const firing = keys.has(" ") || keys.has("Space");
  if (firing && player.cooldown <= 0) {
    bullets.push({
      x: player.x + player.w / 2 - 2,
      y: player.y - 10,
      w: 4,
      h: 10,
      vy: -460,
    });
    player.cooldown = player.fireEvery;
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.y += b.vy * dt;
    if (b.y + b.h < 0) bullets.splice(i, 1);
  }

  game.spawnTimer += dt * 1000;
  if (game.spawnTimer >= game.spawnEvery) {
    game.spawnTimer = 0;
    const x = 20 + Math.random() * (W - 40);
    enemies.push({
      x,
      y: -28,
      w: 20,
      h: 20,
      vy: 100 + Math.random() * 140,
      hp: 1,
    });
    game.spawnEvery = Math.max(300, game.spawnEvery - 4);
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    e.y += e.vy * dt;
    if (e.y > H + 30) {
      enemies.splice(i, 1);
      continue;
    }

    if (boxHit(player, e)) {
      enemies.splice(i, 1);
      player.hp -= 1;
      if (player.hp <= 0) {
        game.running = false;
        game.best = Math.max(game.best, game.score);
      }
      continue;
    }

    for (let j = bullets.length - 1; j >= 0; j--) {
      if (boxHit(bullets[j], e)) {
        bullets.splice(j, 1);
        enemies.splice(i, 1);
        game.score += 10;
        break;
      }
    }
  }
}

function drawBackground() {
  ctx.fillStyle = "#070b17";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#9cb4ff";
  for (const star of stars) ctx.fillRect(star.x, star.y, star.size, star.size);
}

function drawHud() {
  ctx.fillStyle = "#d6e6ff";
  ctx.font = "14px monospace";
  ctx.fillText(`SCORE ${game.score}`, 14, 24);
  ctx.fillText(`HP ${player.hp}`, W - 70, 24);
  ctx.fillText(`BEST ${game.best}`, 14, 46);

  if (!game.running) {
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#ffffff";
    ctx.font = "22px monospace";
    ctx.fillText("GAME OVER", W / 2 - 70, H / 2 - 10);
    ctx.font = "14px monospace";
    ctx.fillText("Press R to Restart", W / 2 - 72, H / 2 + 20);
  }
}

function draw() {
  drawBackground();

  for (const b of bullets) {
    ctx.fillStyle = "#7be8ff";
    ctx.fillRect(b.x, b.y, b.w, b.h);
  }

  for (const e of enemies) drawEnemy(e.x, e.y);
  drawPixelShip(player.x, player.y, "#53b3ff");
  drawHud();
}

function frame(ts) {
  const dt = Math.min(0.033, (ts - game.lastTime) / 1000 || 0);
  game.lastTime = ts;
  update(dt);
  draw();
  requestAnimationFrame(frame);
}

window.addEventListener("keydown", (e) => {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
    e.preventDefault();
  }
  keys.add(e.key);
  if (e.key.toLowerCase() === "r" && !game.running) reset();
});

window.addEventListener("keyup", (e) => {
  keys.delete(e.key);
});

requestAnimationFrame(frame);
