const playBtn = document.getElementById("playBtn");
const menu = document.getElementById("menu");
const game = document.getElementById("game");
const board = document.getElementById("board");
const scoreText = document.getElementById("score");

const SIZE = 8;

let boardData = [];
let score = 0;

let firstTile = null;
let startX = 0;
let startY = 0;

playBtn.addEventListener("click", startGame);

function startGame(){


    score = 0;
    scoreText.textContent = score;

    menu.style.display = "none";
    game.style.display = "block";

    createBoard();

}