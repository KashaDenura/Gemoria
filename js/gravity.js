function gravity() {

    let moved = false;

    for (let col = 0; col < SIZE; col++) {

        let empty = SIZE - 1;

        // Turunkan semua gem
        for (let row = SIZE - 1; row >= 0; row--) {

            if (boardData[row][col] != null) {

                boardData[empty][col] = boardData[row][col];

                if (empty !== row) {

                    boardData[row][col] = null;
                    moved = true;

                }

                empty--;

            }

        }

        // Isi dari atas
        while (empty >= 0) {

            boardData[empty][col] = randomGem(empty, col);

            moved = true;
            empty--;

        }

    }

    renderBoard();

    // Kalau ada cascade, lanjut otomatis
    setTimeout(() => {

        if (hasMatch()) {

    checkMatch();

} else {

    gameLocked = false;

}

    }, moved ? 180 : 80);

}