function checkMatch() {

    let matched = [];
    let specials = [];

    // ==========================
    // HORIZONTAL
    // ==========================

    for (let row = 0; row < SIZE; row++) {

        let count = 1;

        for (let col = 1; col <= SIZE; col++) {

            if (
                col < SIZE &&
                boardData[row][col] &&
                boardData[row][col] === boardData[row][col - 1]
            ) {

                count++;

            } else {

                if (count >= 3) {

                    for (let i = 0; i < count; i++) {

                        matched.push([row, col - 1 - i]);

                    }

                    // Match 5
                    if (count >= 5) {

                        specials.push({
                            type: "rainbow",
                            row: row,
                            col: col - 3
                        });

                    }

                    // Match 4
                    else if (count === 4) {

                        specials.push({
                            type: "rocketH",
                            row: row,
                            col: col - 2
                        });

                    }

                }

                count = 1;

            }

        }

    }

    // ==========================
    // VERTIKAL
    // ==========================

    for (let col = 0; col < SIZE; col++) {

        let count = 1;

        for (let row = 1; row <= SIZE; row++) {

            if (

                row < SIZE &&
                boardData[row][col] &&
                boardData[row][col] === boardData[row - 1][col]

            ) {

                count++;

            } else {

                if (count >= 3) {

                    for (let i = 0; i < count; i++) {

                        matched.push([row - 1 - i, col]);

                    }

                    // Match 5
                    if (count >= 5) {

                        specials.push({
                            type: "rainbow",
                            row: row - 3,
                            col: col
                        });

                    }

                    // Match 4
                    else if (count === 4) {

                        specials.push({
                            type: "rocketV",
                            row: row - 2,
                            col: col
                        });

                    }

                }

                count = 1;

            }

        }

    }

    // ==========================
    // HAPUS DUPLIKAT
    // ==========================

    matched = [...new Set(matched.map(JSON.stringify))]
        .map(JSON.parse);

    if (matched.length === 0) {

        return false;

    }
    
        // ==========================
    // SCORE
    // ==========================

    score += matched.length * 10;

    // Bonus special gem
    score += specials.length * 40;

    scoreText.textContent = score;

    // ==========================
    // COMBO TEXT
    // ==========================

    const combo = document.getElementById("comboText");

    let text = "";

    if (matched.length >= 10) {

        text = "🌈 INCREDIBLE!";

    } else if (matched.length >= 8) {

        text = "👑 GEM MASTER!";

    } else if (matched.length >= 6) {

        text = "💥 AWESOME!";

    } else if (matched.length >= 5) {

        text = "⚡ GREAT!";

    } else if (matched.length >= 4) {

        text = "🔥 GOOD!";

    }

    if (text !== "") {

        combo.textContent = text;

        combo.classList.remove("comboShow");

        void combo.offsetWidth;

        combo.classList.add("comboShow");

    }

    // ==========================
    // SHAKE
    // ==========================

    board.classList.add("shake");

    setTimeout(() => {

        board.classList.remove("shake");

    }, 180);

    // ==========================
    // VIBRATE
    // ==========================

    if (navigator.vibrate) {

        navigator.vibrate(35);

    }

    // ==========================
    // POP
    // ==========================

    const tiles = document.querySelectorAll(".tile");

    matched.forEach(([r, c]) => {

        const index = r * SIZE + c;

        if (tiles[index]) {

            tiles[index].classList.add("pop");

        }

    });

    // Tunggu animasi selesai
    setTimeout(() => {
      
              // ==========================
        // HAPUS GEM
        // ==========================

        matched.forEach(([r, c]) => {

            boardData[r][c] = null;

        });

        // ==========================
        // BUAT SPECIAL GEM
        // ==========================

        specials.forEach(s => {

            // Kalau posisi special ikut terhapus,
            // munculkan kembali sebagai special gem.

            boardData[s.row][s.col] = s.type;

        });

        // ==========================
        // DETEKSI BOMB (Bentuk T / L)
        // ==========================

        const countMap = {};

        matched.forEach(([r, c]) => {

            const key = r + "," + c;

            countMap[key] = (countMap[key] || 0) + 1;

        });

        matched.forEach(([r, c]) => {

            let horizontal = 1;
            let vertical = 1;

            // kiri
            let x = c - 1;

            while (
                x >= 0 &&
                matched.some(v => v[0] === r && v[1] === x)
            ) {

                horizontal++;
                x--;

            }

            // kanan
            x = c + 1;

            while (
                x < SIZE &&
                matched.some(v => v[0] === r && v[1] === x)
            ) {

                horizontal++;
                x++;

            }

            // atas
            let y = r - 1;

            while (
                y >= 0 &&
                matched.some(v => v[0] === y && v[1] === c)
            ) {

                vertical++;
                y--;

            }

            // bawah
            y = r + 1;

            while (
                y < SIZE &&
                matched.some(v => v[0] === y && v[1] === c)
            ) {

                vertical++;
                y++;

            }

            // Bentuk T / L

            if (
                horizontal >= 3 &&
                vertical >= 3
            ) {

                boardData[r][c] = "bomb";

            }

        });

        // ==========================
        // JATUHKAN GEM
        // ==========================

        gravity();

    }, 220);

    return true;

}

function hasMatch() {

    // Horizontal
    for (let row = 0; row < SIZE; row++) {

        let count = 1;

        for (let col = 1; col <= SIZE; col++) {

            if (

                col < SIZE &&
                boardData[row][col] &&
                boardData[row][col] === boardData[row][col - 1]

            ) {

                count++;

            } else {

                if (count >= 3) {

                    return true;

                }

                count = 1;

            }

        }

    }

    // Vertikal
    for (let col = 0; col < SIZE; col++) {

        let count = 1;

        for (let row = 1; row <= SIZE; row++) {

            if (

                row < SIZE &&
                boardData[row][col] &&
                boardData[row][col] === boardData[row - 1][col]

            ) {

                count++;

            } else {

                if (count >= 3) {

                    return true;

                }

                count = 1;

            }

        }

    }

    return false;

}