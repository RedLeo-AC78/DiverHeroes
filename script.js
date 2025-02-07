// Starts the game by playing sounds,fading out the welcome screen, and hiding it after a delay.
function startGame() {
  const welcomeScreen = document.getElementById("welcome-screen");
  const clickSound = document.getElementById("click-sound");
  const backgroundMusic = document.getElementById("background-music");

  clickSound.play();
  backgroundMusic.play();

  welcomeScreen.classList.add("fade-out");

  setTimeout(() => {
    welcomeScreen.style.display = "none";
  }, 1000);
}

let enemyMaxHealth = 100;
let enemyCurrentHealth = enemyMaxHealth;

let totalMedals = 0;

let reinforceLevel = 0;
let reinforceCost = 5;
let reinforceInterval = null;

let mortarLevel = 0;
let mortarCost = 10;
let mortarDamaga = 50;
let mortarInterval = null;

let bazookCost = 15;

let defeatedEnemies = 0;
let difficultyLevel = 1;

const healthBar = document.querySelector(".health-progress");
const enemyImage = document.querySelector(".enemy-image");
const totalMedalsElement = document.querySelector("#total-medals");
const medalCost = document.querySelector(".Reinforce-cost");
const reinforceLevelElement = document.querySelector(
  ".upgrade[onclick='buyReinforce()'] .right-section"
);
const Mortar_Sentry_Level_Element = document.querySelector(
  ".upgrade[onclick='buyMortar()'] .right-section"
);

const enemies = [
  { name: "Automaton A1", health: 100, image: "./Automaton/Unité-A1.png" },
  { name: "Automaton A2", health: 150, image: "./Automaton/Unité-A2.png" },
  { name: "Automaton C", health: 200, image: "./Automaton/Unité-C.png" },
  { name: "Automaton B1", health: 250, image: "./Automaton/Unité-B1.png" },
  { name: "Automaton B2", health: 350, image: "./Automaton/Unité-B2.png" },
];

const enemySounds = [
  "./sound/Unité-A1.mp3",
  "./sound/Unité-A2.mp3",
  "./sound/Unité-C.mp3",
  "./sound/Unité-B1.mp3",
  "./sound/Unité-B2.mp3",
  "./sound/Unité-B3.mp3",
];

const boss = [
  { name: "BOSS HULK", health: 1000, image: "./Automaton/Unité-D.png" },
  { name: "BOSS TANK", health: 1200, image: "./Automaton/Unité-F.png" },
  { name: "BOSS FACTORY", health: 1500, image: "./Automaton/Unité-G.png" },
];

const bossSounds = [
  "./sound/Unité-D.mp3",
  "./sound/Unité-F.mp3",
  "./sound/Unité-G.mp3",
];

let currentBossIndex = 0;
let currentEnemyIndex = 0;

// Updates the enemy's health bar visually based on the current health percentage.
function updateHealthBar() {
  if (!healthBar) {
    console.error("Health bar element not found!");
    return;
  }

  const healthPercentage = (enemyCurrentHealth / enemyMaxHealth) * 100;
  healthBar.style.width = `${healthPercentage}%`;

  if (healthPercentage > 50) {
    healthBar.style.backgroundColor = "limegreen";
  } else if (healthPercentage > 25) {
    healthBar.style.backgroundColor = "orange";
  } else {
    healthBar.style.backgroundColor = "red";
  }
}

// Updates the displayed enemy image and resets its health bar.
function updateEnemyDisplay() {
  const enemy = enemies[currentEnemyIndex];
  enemyMaxHealth = enemy.health;
  enemyCurrentHealth = enemyMaxHealth;

  const enemyImage = document.querySelector(".enemy-image");
  enemyImage.src = enemy.image;
  enemyImage.alt = enemy.name;

  updateHealthBar();
}

// Reduces enemy health when attacked and checks if the enemy is defeated.
function attackEnemy() {
  const damage = 10;
  enemyCurrentHealth = Math.max(0, enemyCurrentHealth - damage);

  setTimeout(() => {
    updateHealthBar();
  }, 0);

  if (enemyCurrentHealth === 0) {
    defeatEnemy();
  }
}

// Handles enemy defeat, awards medals, and determines whether to spawn a new enemy or a boss.
function defeatEnemy() {
  playEnemyDeathSound();

  const medalReward = Math.floor(Math.random() * 3) + 1 + difficultyLevel;
  updateMedalCount(medalReward);

  defeatedEnemies++;

  if (currentEnemyIndex === -1) {
    playBossDeathSound();
    increaseDifficulty();
    currentEnemyIndex = Math.floor(Math.random() * enemies.length);
    updateEnemyDisplay();
    return;
  }

  if (defeatedEnemies % 10 === 0) {
    currentEnemyIndex = -1;

    const currentBoss = boss[currentBossIndex];

    enemyMaxHealth = currentBoss.health * difficultyLevel;
    enemyCurrentHealth = enemyMaxHealth;
    document.querySelector(".enemy-image").src = currentBoss.image;
    document.querySelector(".enemy-image").alt = currentBoss.name;
  } else {
    let newEnemyIndex;
    do {
      newEnemyIndex = Math.floor(Math.random() * enemies.length);
    } while (newEnemyIndex === currentEnemyIndex);
    currentEnemyIndex = newEnemyIndex;
    updateEnemyDisplay();
  }
}

// Play the death sound of the enemy.
function playEnemyDeathSound() {
  if (currentEnemyIndex >= 0 && currentEnemyIndex < enemySounds.length) {
    const sound = new Audio(enemySounds[currentEnemyIndex]);
    sound.play();
  }
}

// Play the death sound of the boss.
function playBossDeathSound() {
  if (currentBossIndex >= 0 && currentBossIndex < bossSounds.length) {
    const sound = new Audio(bossSounds[currentBossIndex]);
    sound.play();
  }
}

// Increase game difficulty, boost enemy and boss health, and update the difficulty level display.
function increaseDifficulty() {
  difficultyLevel++;
  defeatedEnemies = 0;

  enemies.forEach((enemy) => {
    enemy.health = Math.floor(enemy.health * 1.2);
  });

  currentBossIndex = (currentBossIndex + 1) % boss.length;

  boss.forEach((boss) => {
    boss.health = Math.floor(boss.health * 1.5);

    document.querySelector(
      "#difficulty-level"
    ).textContent = ` ${difficultyLevel}`;
  });
}

// Reset enemy health to maximum and update the health bar.
function resetEnemy() {
  enemyCurrentHealth = enemyMaxHealth;
  updateHealthBar();
}

// Update the total medal count displayed.
function updateMedalCount(amount) {
  totalMedals += amount;
  totalMedalsElement.textContent = totalMedals;
}

updateHealthBar();

// Handle the purchase of reinforcement if the player has enough medals.
function buyReinforce() {
  if (totalMedals >= reinforceCost) {
    totalMedals -= reinforceCost;
    totalMedalsElement.textContent = totalMedals;

    reinforceLevel++;
    reinforceCost = Math.floor(reinforceCost * 1.5);
    document.querySelector(".Reinforce-cost").textContent = reinforceCost;
    reinforceLevelElement.textContent = `Level ${reinforceLevel}`;

    document.getElementById("reinforce-sound").play();
    startReinforce();
  } else {
    console.log("Pas assez de médailles !");
  }
}

// Start the reinforcement attack, making periodic attacks on the enemy.
function startReinforce() {
  if (reinforceInterval) clearInterval(reinforceInterval);

  reinforceInterval = setInterval(() => {
    attackEnemy();
  }, Math.max(2000 - reinforceLevel * 200, 100));
}

// Handle the purchase of a mortar upgrade if the player has enough medals.
function buyMortar() {
  if (totalMedals >= mortarCost) {
    totalMedals -= mortarCost;
    totalMedalsElement.textContent = totalMedals;

    mortarLevel++;
    mortarCost = Math.floor(mortarCost * 2);
    document.querySelector(".Mortar-cost").textContent = mortarCost;
    Mortar_Sentry_Level_Element.textContent = `Level ${mortarLevel}`;

    document.getElementById("mortar-sound").play();
    startMortar();
  } else {
    console.log("Pas assez de médailles !");
  }
}

// Start the mortar attack, dealing periodic damage to the enemy.
function startMortar() {
  if (mortarInterval) clearInterval(mortarInterval);

  mortarInterval = setInterval(() => {
    enemyCurrentHealth = Math.max(0, enemyCurrentHealth - 50);
    updateHealthBar();

    if (enemyCurrentHealth === 0) {
      defeatEnemy();
    }
  }, Math.max(5000 - mortarLevel * 500, 1000));
}

// Handle the purchase of a bazooka attack if the player has enough medals.
function buyBazook() {
  if (totalMedals >= bazookCost) {
    totalMedals -= bazookCost;
    totalMedalsElement.textContent = totalMedals;

    const bazookDamage = 500;

    enemyCurrentHealth = Math.max(0, enemyCurrentHealth - bazookDamage);
    updateHealthBar();

    if (enemyCurrentHealth === 0) {
      defeatEnemy();
    }

    bazookCost = Math.floor(bazookCost * 1.2);
    document.querySelector(".Bazook-cost").textContent = bazookCost;
    document.getElementById("bazook-sound").play();
  } else {
    console.log("Pas assez de médailles !");
  }
}

// Ensure that the page elements are visible after loading.
document.addEventListener("DOMContentLoaded", function () {
  document.body.style.display = "block";
});
