const homeButtons = document.querySelectorAll(".home");
const cards = document.querySelector(".cards");
const welcomeContainer = document.querySelector(".welcome-container");
const gameContainer = document.querySelector(".game-container");
const difficultyButtons = document.querySelector(".difficulty-buttons");
const upBtn = document.querySelector(".upBtn");
const downBtn = document.querySelector(".downBtn");
const userClass = document.querySelector(".username");
const checkbox = document.getElementById("cb");
const user = document.querySelector(".name");
const alert = document.querySelector(".alert");
const leaderboard = document.querySelector(".leaderboard");
const leadLink = document.querySelector(".lead-link");
const leaderboardContainer = document.querySelector(".leaderboard");

let cardsArray = Array.from(cards.children);

let selectNumber;
let hasUserGuessed = false;
let minNum = 1;
let maxNum;
let delNumArr = [];
let point;

const sounds = {
  startGame: new Audio(
    "https://sinansarikaya.github.io/js-guessing-game/assets/sounds/startGame.mp3"
  ),
  card: new Audio(
    "https://sinansarikaya.github.io/js-guessing-game/assets/sounds/card.mp3"
  ),
  levelWin: new Audio(
    "https://sinansarikaya.github.io/js-guessing-game/assets/sounds/levelWin.mp3"
  ),
};

window.onload = () => {
  const savedCheckboxState = localStorage.getItem("soundStatus");
  if (savedCheckboxState === null) {
    localStorage.setItem("soundStatus", "true");
  }

  if (savedCheckboxState === "true") {
    checkbox.checked = true;
  } else {
    checkbox.checked = false;
  }
};

checkbox.addEventListener("change", () => {
  const isChecked = checkbox.checked;
  localStorage.setItem("soundStatus", JSON.stringify(isChecked));
});

const getRandomNumber = (min, max) => {
  let rand = Math.floor(Math.random() * (max - min + 1) + min);
  return rand;
};

const playSounds = (sound) => {
  sound.currentTime = 0;
  console.log(checkbox.checked);
  if (checkbox.checked) {
    sound.play();
  } else {
    sound.pause();
  }
};

const updateLeaderboard = () => {
  leaderboardContainer.innerHTML = "";
  const leadTitle = document.createElement("div");
  leadTitle.className = "leaderboard-title";
  leadTitle.innerText = "Leaderboard";

  leaderboardContainer.appendChild(leadTitle);

  const topScores = JSON.parse(localStorage.getItem("topScores")) || [];

  console.log(topScores.length == 0);

  if (topScores.length == 0) {
    const noValue = document.createElement("div");
    noValue.className = "no-value";
    noValue.innerText = "No scores yet! Start playing to add your score.";

    leaderboardContainer.appendChild(noValue);
  }

  topScores.forEach((user, index) => {
    const userElement = document.createElement("div");
    userElement.className = "user";

    const rankSpan = document.createElement("span");
    rankSpan.className = "rank";
    rankSpan.innerText = index + 1;
    userElement.appendChild(rankSpan);

    const usernameSpan = document.createElement("span");
    usernameSpan.className = "user-name";
    usernameSpan.innerText = user.username;
    userElement.appendChild(usernameSpan);

    const userPointSpan = document.createElement("span");
    userPointSpan.className = "userPoint";
    userPointSpan.innerText = Math.max(...user.scores);
    userElement.appendChild(userPointSpan);

    leaderboardContainer.appendChild(userElement);
  });
};

const updateTopScores = (username, score) => {
  const topScores = JSON.parse(localStorage.getItem("topScores")) || [];

  const existingUser = topScores.find((user) => user.username === username);

  if (existingUser) {
    const newUser = { username, scores: [score] };
    topScores.push(newUser);
  } else {
    const existingUserIndex = topScores.findIndex(
      (user) => user.username === username
    );

    if (existingUserIndex !== -1) {
      topScores[existingUserIndex].scores.push(score);
    } else {
      topScores.push({ username, scores: [score] });
    }
  }

  topScores.sort((a, b) => {
    const aMaxScore = Math.max(...a.scores);
    const bMaxScore = Math.max(...b.scores);
    return bMaxScore - aMaxScore;
  });

  if (topScores.length > 5) {
    topScores.pop();
  }

  localStorage.setItem("topScores", JSON.stringify(topScores));
};

difficultyButtons.addEventListener("click", (event) => {
  const selectedButton = event.target;
  point = 10;

  if (user.value.trim() === "" || user.value.length > 20) {
    alert.classList.add("error");
    user.classList.add("error");
    return;
  }

  if (selectedButton.classList.contains("easy")) {
    maxNum = 10;
  } else if (selectedButton.classList.contains("medium")) {
    maxNum = 50;
  } else if (selectedButton.classList.contains("hard")) {
    maxNum = 100;
  } else {
    return;
  }

  playSounds(sounds.startGame);
  point *= maxNum;
  userClass.innerText = user.value + " ";

  const pointSpan = document.createElement("span");
  pointSpan.className = "point";
  userClass.appendChild(pointSpan);
  pointSpan.innerText = parseInt(point);

  welcomeContainer.classList.add("none");
  gameContainer.classList.remove("none");
  leaderboard.classList.add("none");

  numberArr = generateNumberArray(minNum, maxNum);
  randomNumber = getRandomNumber(minNum, maxNum);

  if (hasUserGuessed) {
    hasUserGuessed = false;
    alert.classList.remove("error");
    user.classList.remove("error");
    upBtn.classList.remove("active");
    downBtn.classList.remove("active");
  }
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
    winCard.innerText = `You won! Your point is ${point}`;
    cards.appendChild(winCard);
    playSounds(sounds.levelWin);

    updateTopScores(user.value, parseInt(point));
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
  playSounds(sounds.card);
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

homeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    welcomeContainer.classList.remove("none");
    leaderboard.classList.add("none");
    gameContainer.classList.add("none");
    alert.classList.remove("error");
    user.classList.remove("error");
    upBtn.classList.remove("active");
    downBtn.classList.remove("active");
    user.value = "";
    userClass.innerText = "";
    hasUserGuessed = false;
    delNumArr = [];
  });
});

leadLink.addEventListener("click", () => {
  welcomeContainer.classList.add("none");
  leaderboard.classList.remove("none");
  gameContainer.classList.add("none");

  updateLeaderboard();
});
