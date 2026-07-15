function checkMatch() {

    // Cari semua match
    const horizontal = findHorizontalMatches();
    const vertical = findVerticalMatches();

    // Gabungkan semua tile yang match
    const matched = collectMatchedTiles(horizontal, vertical);

    // Tidak ada match
    if (matched.length === 0) {
gameLocked = true;
        return false;

    }

    // Cari special
    const rockets = detectRockets(horizontal, vertical);
    const rainbows = detectRainbows(horizontal, vertical);
    const bombs = detectBombs(matched);

    // Prioritas Rainbow > Bomb > Rocket
    const specials = mergeSpecials(
        rainbows,
        bombs,
        rockets
    );

    // ==========================
    // SCORE
    // ==========================

    score += matched.length * 10;
    score += specials.length * 40;

    updateHUD();

    // ==========================
    // COMBO
    // ==========================

    showComboText(matched.length);

    // ==========================
    // SHAKE
    // ==========================

    board.classList.add("shake");

    setTimeout(() => {

        board.classList.remove("shake");

    },180);

    // ==========================
    // VIBRATE
    // ==========================

    if(navigator.vibrate){

        navigator.vibrate(35);

    }

    // ==========================
    // POP
    // ==========================

    const tiles = document.querySelectorAll(".tile");

    matched.forEach(tile=>{

        const index = tile.row * SIZE + tile.col;

        if(tiles[index]){

            tiles[index].classList.add("pop");

        }

    });

    // Tunggu animasi
    setTimeout(()=>{

        // Hapus gem
        matched.forEach(tile=>{

            boardData[tile.row][tile.col]=null;

        });

        // Pasang special gem
        specials.forEach(s=>{

            boardData[s.row][s.col]=s.type;

        });

        gravity();

setTimeout(()=>{

    cascade();

},200);

},200);

    return true;

}

function showComboText(total){

    const combo=document.getElementById("comboText");

    let text="";

    if(total>=10){

        text="🌈 INCREDIBLE!";

    }

    else if(total>=8){

        text="👑 GEM MASTER!";

    }

    else if(total>=6){

        text="💥 AWESOME!";

    }

    else if(total>=5){

        text="⚡ GREAT!";

    }

    else if(total>=4){

        text="🔥 GOOD!";

    }

    if(text==="") return;

    combo.textContent=text;

    combo.classList.remove("comboShow");

    void combo.offsetWidth;

    combo.classList.add("comboShow");

}

// ==========================
// CASCADE SYSTEM
// ==========================

function cascade(){

    renderBoard();

    setTimeout(()=>{

        if(checkMatch()){

            cascade();

        }else{

            gameLocked = false;

        }

    },250);

}




// ==========================
// CARI MATCH HORIZONTAL
// ==========================

function findHorizontalMatches() {

    const matches = [];

    for (let row = 0; row < SIZE; row++) {

        let start = 0;

        while (start < SIZE) {

            const gem = boardData[row][start];

            if (!gem) {
                start++;
                continue;
            }

            let end = start;

            while (
                end + 1 < SIZE &&
                boardData[row][end + 1] === gem
            ) {

                end++;

            }

            const length = end - start + 1;

            if (length >= 3) {

                matches.push({

                    type: "horizontal",

                    gem,

                    row,

                    start,

                    end,

                    length

                });

            }

            start = end + 1;

        }

    }

    return matches;

}

// ==========================
// CARI MATCH VERTIKAL
// ==========================

function findVerticalMatches() {

    const matches = [];

    for (let col = 0; col < SIZE; col++) {

        let start = 0;

        while (start < SIZE) {

            const gem = boardData[start][col];

            if (!gem) {
                start++;
                continue;
            }

            let end = start;

            while (

                end + 1 < SIZE &&
                boardData[end + 1][col] === gem

            ) {

                end++;

            }

            const length = end - start + 1;

            if (length >= 3) {

                matches.push({

                    type: "vertical",

                    gem,

                    col,

                    start,

                    end,

                    length

                });

            }

            start = end + 1;

        }

    }

    return matches;

}

// ==========================
// GABUNGKAN SEMUA MATCH
// ==========================

function collectMatchedTiles(horizontal, vertical) {

    const map = new Map();

    horizontal.forEach(match => {

        for (let c = match.start; c <= match.end; c++) {

            map.set(match.row + "," + c, {

                row: match.row,

                col: c

            });

        }

    });

    vertical.forEach(match => {

        for (let r = match.start; r <= match.end; r++) {

            map.set(r + "," + match.col, {

                row: r,

                col: match.col

            });

        }

    });

    return [...map.values()];

}

// ==========================
// DETEKSI ROCKET
// ==========================

function detectRockets(horizontal, vertical) {

    const specials = [];

    horizontal.forEach(match => {

        if (match.length === 4) {

            specials.push({

                type: "rocketH",

                row: match.row,

                col: Math.floor((match.start + match.end) / 2)

            });

        }

    });

    vertical.forEach(match => {

        if (match.length === 4) {

            specials.push({

                type: "rocketV",

                row: Math.floor((match.start + match.end) / 2),

                col: match.col

            });

        }

    });

    return specials;

}

// ==========================
// DETEKSI RAINBOW
// ==========================

function detectRainbows(horizontal, vertical) {

    const specials = [];

    horizontal.forEach(match => {

        if (match.length >= 5) {

            specials.push({

                type: "rainbow",

                row: match.row,

                col: Math.floor((match.start + match.end) / 2)

            });

        }

    });

    vertical.forEach(match => {

        if (match.length >= 5) {

            specials.push({

                type: "rainbow",

                row: Math.floor((match.start + match.end) / 2),

                col: match.col

            });

        }

    });

    return specials;

}

// ==========================
// DETEKSI BOMB
// ==========================

function detectBombs(tiles) {

    const specials = [];

    tiles.forEach(tile => {

        let h = 1;
        let v = 1;

        let c = tile.col - 1;

        while (
            c >= 0 &&
            boardData[tile.row][c] === boardData[tile.row][tile.col]
        ) {

            h++;
            c--;

        }

        c = tile.col + 1;

        while (
            c < SIZE &&
            boardData[tile.row][c] === boardData[tile.row][tile.col]
        ) {

            h++;
            c++;

        }

        let r = tile.row - 1;

        while (
            r >= 0 &&
            boardData[r][tile.col] === boardData[tile.row][tile.col]
        ) {

            v++;
            r--;

        }

        r = tile.row + 1;

        while (
            r < SIZE &&
            boardData[r][tile.col] === boardData[tile.row][tile.col]
        ) {

            v++;
            r++;

        }

        if (h >= 3 && v >= 3) {

            specials.push({

                type: "bomb",

                row: tile.row,

                col: tile.col

            });

        }

    });

    return specials;

}

// ==========================
// PRIORITAS SPECIAL
// Rainbow > Bomb > Rocket
// ==========================

function mergeSpecials(rainbows, bombs, rockets) {

    const map = new Map();

    rainbows.forEach(s => {

        map.set(s.row + "," + s.col, s);

    });

    bombs.forEach(s => {

        const key = s.row + "," + s.col;

        if (!map.has(key)) {

            map.set(key, s);

        }

    });

    rockets.forEach(s => {

        const key = s.row + "," + s.col;

        if (!map.has(key)) {

            map.set(key, s);

        }

    });

    return [...map.values()];

}

function hasMatch() {

    const horizontal = findHorizontalMatches();
    const vertical = findVerticalMatches();

    return (
        horizontal.length > 0 ||
        vertical.length > 0
    );

}