let enemyMaxHealth = 100;
let enemyCurrentHealth = enemyMaxHealth;
let totalMedals = 0;
let reinforceLevel = 0;
let reinforceCost = 10;
let reinforceInterval = null;

const healthBar = document.querySelector(".health-progress");
const enemyImage = document.querySelector(".enemy-image");
const totalMedalsElement = document.querySelector("#total-medals");
const medalCost = document.querySelector(".Reinforce-cost");
const reinforceLevelElement = document.querySelector(
  ".upgrade[onclick='buyReinforce()'] .right-section"
);

const enemies = [
  { name: "Automaton A1", health: 100, image: "./Automaton/Unité-A1.png" },
  { name: "Automaton A2", health: 150, image: "./Automaton/Unité-A2.png" },
  { name: "Automaton C", health: 200, image: "./Automaton/Unité-C.png" },
  { name: "Automaton B1", health: 250, image: "./Automaton/Unité-B1.png" },
  { name: "Automaton B2", health: 350, image: "./Automaton/Unité-B2.png" },
];

let currentEnemyIndex = 0;

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

function updateEnemyDisplay() {
  const enemy = enemies[currentEnemyIndex];
  enemyMaxHealth = enemy.health;
  enemyCurrentHealth = enemyMaxHealth;

  const enemyImage = document.querySelector(".enemy-image");
  enemyImage.src = enemy.image;
  enemyImage.alt = enemy.name;

  updateHealthBar();
}

function attackEnemy() {
  const damage = 10;
  enemyCurrentHealth = Math.max(0, enemyCurrentHealth - damage);
  updateHealthBar();

  if (enemyCurrentHealth === 0) {
    defeatEnemy();
  }
}

function defeatEnemy() {
  const medalReward = Math.floor(Math.random() * 3) + 1;
  updateMedalCount(medalReward);

  let newEnemyIndex;
  do {
    newEnemyIndex = Math.floor(Math.random() * enemies.length);
  } while (newEnemyIndex === currentEnemyIndex); // Évite de choisir le même ennemi deux fois de suite

  currentEnemyIndex = newEnemyIndex;
  updateEnemyDisplay();
}

function resetEnemy() {
  enemyCurrentHealth = enemyMaxHealth;
  updateHealthBar();
}

function updateMedalCount(amount) {
  totalMedals += amount;
  totalMedalsElement.textContent = totalMedals;
}

updateHealthBar();

function buyReinforce() {
  if (totalMedals >= reinforceCost) {
    totalMedals -= reinforceCost;
    totalMedalsElement.textContent = totalMedals;

    reinforceLevel++;
    reinforceCost = Math.floor(reinforceCost * 1.8); // cost + 80%
    document.querySelector(".Reinforce-cost").textContent = reinforceCost;
    reinforceLevelElement.textContent = `Level ${reinforceLevel}`;

    startReinforce();
  } else {
    console.log("Pas assez de médailles !");
  }
}

function startReinforce() {
  if (reinforceInterval) clearInterval(reinforceInterval); // Supprime l'ancien intervalle

  reinforceInterval = setInterval(() => {
    attackEnemy();
  }, Math.max(2000 - reinforceLevel * 200, 500)); // Attaque plus vite, minimum 500ms
}
