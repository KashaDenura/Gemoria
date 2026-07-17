let score = 0;

let level = 1;

let moves = 50;

let targetScore = 250;

let life = 3;

let levelMoves = 0;

const scoreText = document.getElementById("scoreText");

const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupMessage = document.getElementById("popupMessage");
const popupButton = document.getElementById("popupButton");

function updateHUD() {

    scoreText.textContent = score;

    document.getElementById("levelText").textContent = level;

    document.getElementById("movesText").textContent = moves;

    document.getElementById("targetText").textContent = targetScore;

document.getElementById("lifeText").textContent =
"❤️".repeat(life) + "🤍".repeat(3-life);

}

function getStars() {

    if (score >= targetScore * 2) {

        return "⭐⭐⭐";

    }

    if (score >= targetScore * 1.5) {

        return "⭐⭐";

    }

    return "⭐";

}

function showPopup(title, message, buttonText, callback) {

    popupTitle.textContent = title;

    popupMessage.innerHTML = message;

    popupButton.textContent = buttonText;

    gameLocked = true;

    popup.style.display = "flex";

    popupButton.onclick = () => {

        popup.style.display = "none";

        gameLocked = false;

        callback();

    };

}

function levelComplete() {

    showPopup(

        "🎉 LEVEL COMPLETE!",

        "Level : " + level +
        "<br>Score : " + score +
        "<br><br>" + getMoveStars(),

        "Next Level",

        () => {

            if (navigator.vibrate) {

                navigator.vibrate([120, 50, 120]);

            }

            level++;
            
            levelMoves = 0;


            moves = 50;

            targetScore = Math.floor(targetScore * 1.7);

            createBoard();

            updateHUD();

        }

    );

}

function gameOver() {

    showPopup(

        "💀 GAME OVER",

        "Level : " + level +
        "<br>Score : " + score,

        "Main Lagi",

        () => {

            if (navigator.vibrate) {

                navigator.vibrate(250);

            }

            level = 1;

            score = 0;

            moves = 50;

            targetScore = 250;

            createBoard();

            updateHUD();

        }

    );

}

function checkGameState() {

    // =========================
    // LEVEL COMPLETE
    // =========================
    if (score >= targetScore) {

        let stars = 1;

        if (moves >= 35) {

            stars = 3;

        } else if (moves >= 20) {

            stars = 2;

        }

        let starText = "";

        if (stars === 3) {

            starText = "⭐⭐⭐";

        } else if (stars === 2) {

            starText = "⭐⭐";

        } else {

            starText = "⭐";

        }

        showPopup(
            "🎉 LEVEL COMPLETE!",
            "Bintang : " + starText,
            "Lanjut",
            () => {

                level++;

                targetScore += 250;

                moves = 50;

                updateHUD();

                createBoard();

            }
        );

        return;

    }

    // =========================
    // MOVES HABIS
    // =========================
    if (moves <= 0) {

        life--;

        if (life <= 0) {

            gameOver();
            return;

        }

        moves = 50;

        updateHUD();

        showPopup(
            "💔 LIFE BERKURANG",
            "Sisa Life : " + life,
            "Lanjut",
            () => {}
        );

    }

}
