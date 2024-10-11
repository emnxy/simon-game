let sequence = [];
let playerSequence = [];
let score = 0;
let allowInput = false;
let currentPlayer = null;

const startButton = document.getElementById('start-game');
const scoreDisplay = document.getElementById('score');
const colorBoxes = document.querySelectorAll('.color-box');
const registerBtn = document.getElementById('register-btn');
const usernameInput = document.getElementById('username');
const gameSection = document.getElementById('game-section');
const rankingList = document.getElementById('ranking-list');
const homeSection = document.getElementById('home-section');
const rankingSection = document.getElementById('ranking-section');
const playButton = document.getElementById('play-btn');
const rankingButton = document.getElementById('ranking-btn');
const backButton = document.getElementById('back-btn');
const backRankingButton = document.getElementById('back-ranking-btn');
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const closeModal = document.querySelector('.close');

closeModal.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

function loadRanking() {
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    rankingList.innerHTML = '';
    ranking.forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player.username} - ${player.score} pontos`;
        rankingList.appendChild(li);
    });
}

function saveScore(username, score) {
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    const playerIndex = ranking.findIndex(player => player.username === username);

    if (playerIndex >= 0) {
        if (score > ranking[playerIndex].score) {
            ranking[playerIndex].score = score;
        }
    } else {
        ranking.push({ username, score });
    }

    ranking.sort((a, b) => b.score - a.score);
    localStorage.setItem('ranking', JSON.stringify(ranking));
    loadRanking();
}

registerBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        currentPlayer = username;
        usernameInput.value = '';
        gameSection.style.display = 'block';
        document.getElementById('register-form').style.display = 'none';
        openModal("Cadastro realizado com sucesso!");
        startGame();
    } else {
        openModal('Digite um nome de usuário!');
    }
});

playButton.addEventListener('click', () => {
    homeSection.style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
});

backButton.addEventListener('click', () => {
    document.getElementById('register-form').style.display = 'none';
    homeSection.style.display = 'block';
});

rankingButton.addEventListener('click', () => {
    homeSection.style.display = 'none';
    rankingSection.style.display = 'block';
    loadRanking();
});

backRankingButton.addEventListener('click', () => {
    rankingSection.style.display = 'none';
    homeSection.style.display = 'block';
});

startButton.addEventListener('click', startGame);

function startGame() {
    sequence = [];
    playerSequence = [];
    score = 0;
    scoreDisplay.textContent = `Pontuação: ${score}`;
    nextRound();
}

function nextRound() {
    const colors = ['green', 'red', 'yellow', 'blue'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    sequence.push(randomColor);
    allowInput = false;
    playerSequence = [];
    displaySequence();
}

function displaySequence() {
    sequence.forEach((color, index) => {
        setTimeout(() => {
            playColor(color);
        }, (index + 1) * 800);
    });

    setTimeout(() => {
        allowInput = true;
    }, (sequence.length + 1) * 800);
}

function playColor(color) {
    const colorBox = document.getElementById(color);
    colorBox.classList.add('active');
    setTimeout(() => {
        colorBox.classList.remove('active');
    }, 300);
}

colorBoxes.forEach(colorBox => {
    colorBox.addEventListener('click', () => {
        if (allowInput) {
            const selectedColor = colorBox.id;
            playerSequence.push(selectedColor);
            playColor(selectedColor);
            checkSequence();
        }
    });
});

function checkSequence() {
    const currentIndex = playerSequence.length - 1;
    if (playerSequence[currentIndex] !== sequence[currentIndex]) {
        openModal('Sequência incorreta! Tente novamente.');
        resetGame();
    } else if (playerSequence.length === sequence.length) {
        score++;
        scoreDisplay.textContent = `Pontuação: ${score}`;
        saveScore(currentPlayer, score);
        setTimeout(nextRound, 1000);
    }
}

function resetGame() {
    sequence = [];
    playerSequence = [];
    score = 0;
    scoreDisplay.textContent = `Pontuação: ${score}`;
    allowInput = false;
}

window.onload = () => {
    loadRanking();
};
