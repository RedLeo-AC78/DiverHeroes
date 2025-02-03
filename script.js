let enemyMaxHealth = 100;
let enemyCurrentHealth = enemyMaxHealth;
let totalMedals = 0;

const healthBar = document.querySelector(".health-progress");
const enemyImage = document.querySelector(".enemy-image");
const totalMedalsElement = document.querySelector("#total-medals");
const medalCostElement = document.querySelector(".clicker-cost");

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
  resetEnemy();
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
