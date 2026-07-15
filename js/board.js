function randomGem(row = -1, col = -1) {

    while (true) {

        const gem = gems[Math.floor(Math.random() * gems.length)];

        // Cek horizontal
        if (
            col >= 2 &&
            boardData[row] &&
            boardData[row][col - 1] === gem &&
            boardData[row][col - 2] === gem
        ) {
            continue;
        }

        // Cek vertikal
        if (
            row >= 2 &&
            boardData[row - 1] &&
            boardData[row - 2] &&
            boardData[row - 1][col] === gem &&
            boardData[row - 2][col] === gem
        ) {
            continue;
        }

        return gem;

    }

}

function createBoard() {


    boardData = [];


    for (let row = 0; row < SIZE; row++) {

        boardData[row] = [];

        for (let col = 0; col < SIZE; col++) {

            boardData[row][col] = randomGem(row, col);

        }

    }


    renderBoard();


}

function renderBoard() {
  

    board.innerHTML = "";
    

    for (let row = 0; row < SIZE; row++) {

        for (let col = 0; col < SIZE; col++) {

            const tile = document.createElement("div");
            

            tile.className = "tile";
            tile.dataset.row = row;
            tile.dataset.col = col;

            const gem = document.createElement("div");
            
            tile.classList.add("swap");

            if (boardData[row][col] != null) {

    const type = boardData[row][col];

    if (type === "rocketH") {

        gem.className = "rocket rocketH";

    }

    else if (type === "rocketV") {

        gem.className = "rocket rocketV";

    }

    else if (type === "bomb") {

        gem.className = "bomb";

    }

    else if (type === "rainbow") {

        gem.className = "rainbow";

    }

    else {

        gem.className = "gem " + type;

    }

}

          tile.appendChild(gem);

if(boardData[row][col]!=null){

    gem.classList.add("fall");

}

            tile.addEventListener("touchstart", touchStart, {
                passive: true
            });

            tile.addEventListener("touchend", touchEnd);

            board.appendChild(tile);
            setTimeout(()=>{

    gem.classList.remove("fall");

},220);

        }

    }

}

function touchStart(e) {

    firstTile = e.currentTarget;

    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;

}

function touchEnd(e) {

    if (!firstTile) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const dx = endX - startX;
    const dy = endY - startY;

    // Kalau cuma tap, jangan dianggap swipe
    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) {

        firstTile = null;
        return;

    }

    swipe(firstTile, dx, dy);

    firstTile = null;

}

function swipe(tile, dx, dy) {

    if (gameLocked) return;

    const row = Number(tile.dataset.row);
    const col = Number(tile.dataset.col);

    let newRow = row;
    let newCol = col;

    if (Math.abs(dx) > Math.abs(dy)) {

        if (dx > 30) newCol++;
        else if (dx < -30) newCol--;

    } else {

        if (dy > 30) newRow++;
        else if (dy < -30) newRow--;

    }

    if (
        newRow < 0 ||
        newRow >= SIZE ||
        newCol < 0 ||
        newCol >= SIZE
    ) {
        return;
    }

    swap(row, col, newRow, newCol);

}

function swap(r1, c1, r2, c2){

    // Tukar dulu
    const temp = boardData[r1][c1];
    boardData[r1][c1] = boardData[r2][c2];
    boardData[r2][c2] = temp;

    renderBoard();
    
    gameLocked = true;

    // Bomb
    if (boardData[r1][c1] === "bomb") {

        explodeBomb(r1, c1);
        return;

    }

    if (boardData[r2][c2] === "bomb") {

        explodeBomb(r2, c2);
        return;

    }
  

    // Rocket
    if (
        boardData[r1][c1] === "rocketH" ||
        boardData[r1][c1] === "rocketV"
    ) {

        explodeRocket(r1, c1);
        return;

    }

    if (
        boardData[r2][c2] === "rocketH" ||
        boardData[r2][c2] === "rocketV"
    ) {

        explodeRocket(r2, c2);
        return;

    }

    // Rainbow
    if (boardData[r1][c1] === "rainbow") {

        explodeRainbow(r1, c1, boardData[r2][c2]);
        return;

    }

    if (boardData[r2][c2] === "rainbow") {

        explodeRainbow(r2, c2, boardData[r1][c1]);
        return;

    }

    // Match biasa
if (checkMatch()) {

    levelMoves++;
    moves--;

    updateHUD();

    checkGameState();

    return;

}

// Tidak ada match → balikin lagi
setTimeout(() => {

    const temp = boardData[r1][c1];
    boardData[r1][c1] = boardData[r2][c2];
    boardData[r2][c2] = temp;

    renderBoard();

}, 150);

} // <-- PENUTUP FUNGSI swap()