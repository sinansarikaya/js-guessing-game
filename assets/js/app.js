const homeButtons = document.querySelectorAll(".home");
const cards = document.querySelector(".cards");
const welcomeContainer = document.querySelector(".welcome-container");
const gameContainer = document.querySelector(".game-container");
const difficultyButtons = document.querySelector(".difficulty-buttons");
const upBtn = document.querySelector(".upBtn");
const downBtn = document.querySelector(".downBtn");
const userClass = document.querySelector(".username");

let selectNumber;
let hasUserGuessed = false;
let minNum = 1;
let maxNum;
let delNumArr = [];
let point;

const cardSound = new Audio(
  "https://sinansarikaya.github.io/js-guessing-game/assets/sounds/card.mp3"
);
const startGame = new Audio(
  "https://sinansarikaya.github.io/js-guessing-game/assets/sounds/startGame.mp3"
);

const getRandomNumber = (min, max) => {
  let rand = Math.floor(Math.random() * (max - min + 1) + min);
  return rand;
};

homeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    welcomeContainer.classList.remove("none");
    gameContainer.classList.add("none");
    userClass.innerText = "";
  });
});

difficultyButtons.addEventListener("click", (event) => {
  const selectedButton = event.target;
  point = 10;

  if (selectedButton.classList.contains("easy")) {
    maxNum = 10;
  } else if (selectedButton.classList.contains("medium")) {
    maxNum = 50;
  } else if (selectedButton.classList.contains("hard")) {
    maxNum = 100;
  } else {
    return;
  }
  startGame.currentTime = 0;
  startGame.play();
  point *= maxNum;
  userClass.innerText = "Sinan ";

  const pointSpan = document.createElement("span");
  pointSpan.className = "point";
  userClass.appendChild(pointSpan);
  pointSpan.innerText = parseInt(point);

  welcomeContainer.classList.add("none");
  gameContainer.classList.remove("none");

  numberArr = generateNumberArray(minNum, maxNum);
  randomNumber = getRandomNumber(minNum, maxNum);
});

const generateNumberArray = (min, max) => {
  while (cards.firstChild) {
    cards.removeChild(cards.firstChild);
  }

  let arr = [];
  for (let i = min; i <= max; i++) {
    if (!delNumArr.includes(i)) {
      arr.push(i);
    }
  }
  if (hasUserGuessed) {
    const winCard = document.createElement("div");
    winCard.className = "win-card";
    // winCard.innerText = `You won! Your point is ${point}`;
    winCard.innerText = "You won!";
    cards.appendChild(winCard);
  } else {
    for (let i of arr) {
      const card = document.createElement("div");
      if (maxNum <= 20) {
        card.className = "card easy";
      } else if (maxNum <= 70) {
        card.className = "card medium";
      } else {
        card.className = "card";
      }

      card.id = `card-${i}`;
      cards.appendChild(card);
      card.innerText = i;
      card.addEventListener("click", () => {
        selectNumber = handleCardClick(i);
      });
    }
  }

  return arr;
};

let numberArr = generateNumberArray(minNum, maxNum);
let randomNumber = getRandomNumber(minNum, maxNum);

cards.addEventListener("click", (e) => {
  if (!e.target.classList.contains("card")) {
    return;
  }
  cardSound.currentTime = 0;
  cardSound.play();
  let userNum = parseInt(selectNumber);

  if (userNum == randomNumber) {
    hasUserGuessed = true;
  } else if (userNum > randomNumber) {
    upBtn.classList.remove("active");
    downBtn.classList.add("active");
    point -= 10;
    userClass.lastChild.innerText = point;
  } else if (userNum < randomNumber) {
    upBtn.classList.add("active");
    downBtn.classList.remove("active");
    point -= 10;
    userClass.lastChild.innerText = point;
  }

  if (!delNumArr.includes(userNum)) {
    delNumArr.push(userNum);
  }
  numberArr = generateNumberArray(minNum, maxNum);

  console.log(randomNumber);
});

randomNumber = getRandomNumber(minNum, maxNum - delNumArr.length);

const handleCardClick = (selectedNumber) => {
  return selectedNumber;
};
