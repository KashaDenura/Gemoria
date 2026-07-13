const gems = [
    "blue",
    "red",
    "green",
    "yellow",
    "purple",
    "orange"
];

function randomGem() {
    return gems[Math.floor(Math.random() * gems.length)];
}