function popAnimation() {

    const tiles = document.querySelectorAll(".tile");

    tiles.forEach(tile => {

        tile.style.transition = ".18s";

    });

}

// =====================
// BOMB
// =====================

function explodeBomb(row, col) {

    for (let r = row - 1; r <= row + 1; r++) {

        for (let c = col - 1; c <= col + 1; c++) {

            if (
                r >= 0 &&
                r < SIZE &&
                c >= 0 &&
                c < SIZE
            ) {

                boardData[r][c] = null;

            }

        }

    }

    board.classList.add("shake");

    if (navigator.vibrate) {

        navigator.vibrate(80);

    }

    setTimeout(() => {

        board.classList.remove("shake");

        gravity();

    }, 120);

}

// =====================
// ROCKET
// =====================

function explodeRocket(row, col) {
  
  function showLaser(type){

    const laser=document.createElement("div");

    laser.className=type;

    board.appendChild(laser);

    setTimeout(()=>{

        laser.remove();

    },220);

}

    const special = boardData[row][col];

    boardData[row][col] = null;

    if (special === "rocketH") {
      showLaser("laserH");

        for (let c = 0; c < SIZE; c++) {

            boardData[row][c] = null;

        }

    } else {
      showLaser("laserV");

        for (let r = 0; r < SIZE; r++) {

            boardData[r][col] = null;

        }

    }

    board.classList.add("shake");

    if (navigator.vibrate) {

        navigator.vibrate(100);

    }

    setTimeout(() => {

        board.classList.remove("shake");

        gravity();

    }, 150);

}

// =====================
// RAINBOW
// =====================

function explodeRainbow(row, col, color) {

    // Hilangkan Rainbow
    boardData[row][col] = null;

    // Kalau yang ditukar bukan gem biasa, batal
    if (
        color === "rocketH" ||
        color === "rocketV" ||
        color === "bomb" ||
        color === "rainbow" ||
        color == null
    ) {

        gravity();
        return;

    }

    // Hapus semua gem dengan warna yang sama
    for (let r = 0; r < SIZE; r++) {

        for (let c = 0; c < SIZE; c++) {

            if (boardData[r][c] === color) {

                boardData[r][c] = null;

            }

        }

    }

    board.classList.add("shake");

    if (navigator.vibrate) {

        navigator.vibrate([80,40,80]);

    }

    renderBoard();

    setTimeout(() => {

        board.classList.remove("shake");

        gravity();

    },250);

}