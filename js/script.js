const playBtn = document.getElementById("playBtn");
const menu = document.getElementById("menu");
const game = document.getElementById("game");
const board = document.getElementById("board");

const SIZE = 8;

let boardData = [];

let firstTile = null;
let startX = 0;
let startY = 0;

let gameLocked = false;

playBtn.addEventListener("click", startGame);

function startGame() {

    score = 0;
    level = 1;
    moves = 50;
    targetScore = 500;
    life = 3;
    levelMoves = 0;

    gameLocked = false;

    menu.style.display = "none";
    game.style.display = "block";

    createBoard();

    updateHUD();

}

window.onerror = function(msg, url, line, col, err) {
    alert(
        "ERROR:\n" +
        msg +
        "\nBaris: " + line
    );
};