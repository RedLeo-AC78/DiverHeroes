let medal = document.querySelector(".medal-cost");
let parsedMedal = parseFloat(medal.innerHTML);

let clickerCost = document.querySelector(".clicker-cost");
let parsedClickerCost = parseFloat(clickerCost.innerHTML);

function incrementMedal() {
  parsedMedal += 1;
  medal.innerHTML = parsedMedal;
}

function buyClicker() {
  if (parsedMedal >= parsedClickerCost) {
    parsedMedal -= parsedClickerCost;
    medal.innerHTML -= parsedClickerCost;
  }
}
