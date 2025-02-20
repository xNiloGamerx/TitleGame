const blocks = {
    "grass": "🟩",
    "plant": "🪴",
    "dirt": "🟫",
    "stone": "🪨",
    "diamond": "💎",
    "gold": "🪙",
    "iron": "⚙️",
    "coal": "⬛", // Macht Probleme
    "empty": "🕳️"
}
const blockNames = Object.keys(blocks);

const heightIndicator = document.getElementById("height-indicator");

let x = 0;
let lastX = x;
let y = 0;
let lastY = y;
let maxY = 80;
let taskbarLength = 11;
let gameState = [[...new Array(taskbarLength)].map(x => blocks["grass"])];
let shownState = gameState[y];

const player = "😀";
const playerPos = Math.floor(taskbarLength / 2);

const indicatorHeights = [ 10, 48, 84, 120, 155, 195 ]

const inventory = document.getElementById('inventory');


function pushToInv(block) {
    const items = inventory.children;
    for (let i = 0; i < items.length; i++) {
        if (items[i].children[0].innerText === block) {
            items[i].children[1].innerText = parseInt(items[i].children[1].innerText) + 1;
            return;
        }
    }

    const item = document.createElement('div');
    item.className = "item";

    const blockDiv = document.createElement('div');
    blockDiv.className = "block";
    blockDiv.innerText = block;

    const count = document.createElement('div');
    count.className = "count";
    count.innerText = 1;

    item.appendChild(blockDiv);
    item.appendChild(count);
    inventory.appendChild(item);
}

function getRandomItem(defaultValue, specialValue, percentage) {
    let random = Math.random();
    if (random < (percentage / 100)) {
        return specialValue;
    } else {
        return defaultValue;
    }
}

function getBlock(height) {
    let block = "";
    if (height === 0) {
        block = blocks[getRandomItem("grass", "plant", 20)];
    } else if (height === 1) {
        block = blocks["dirt"];
    } else if (height < 10) {
        block = blocks[getRandomItem("stone", "coal", 20)];
    } else if (height < 25) {
        block = blocks[getRandomItem("stone", "iron", 10)];
    } else if (height < 50) {
        block = blocks[getRandomItem("stone", "gold", 5)];
    } else if (height < 80) {
        block = blocks[getRandomItem("stone", "diamond", 3)];
    }
    return block;
}

function updateState() {

    if (x != lastX) {

        for (let i = 0; i < gameState.length; i++) {
            if (x < 0) {
                gameState[i].unshift(getBlock(i));
                shownState = gameState[y].slice(0, taskbarLength);
            }
            else if ((x + taskbarLength) > gameState[i].length) {
                gameState[i].push(getBlock(i));
                
            }
        }

        if (x < 0) {
            x = 0;
        }
        shownState = gameState[y].slice(x, x + taskbarLength);

        lastX = x;
    } else if (y != lastY) {
        if (y > (gameState.length - 1)) {
            let newLevel = []
            for (let i = 0; i < gameState[0].length; i++) {
                newLevel.push(getBlock(y));
            }
            gameState.push(newLevel);
        }
        if (y < gameState.length) {
            if (x < 0) {
                shownState = gameState[y].slice(0, taskbarLength);
            } else {
                shownState = gameState[y].slice(x, x + 11);
            }
        }

        lastY = y;
    }
}

function walk(direction) {
    if (direction === "up" && y !== 0) {
        if (y !== 0) {
            y--;
        }
    } 
    else if (direction === "down") {
        if (y <= maxY) {
            y++;
        }
    } else if (direction === "left") {
        x--;
    } 
    else if (direction === "right") {
        x++;
    }

    updateState();
}

function breakBlock(direction) {
    if (direction === "right") {
        let block = gameState[y][playerPos + x + 1];
        if (block === blocks['empty']) {
            return;
        }

        pushToInv(block);

        gameState[y][playerPos + x + 1] = blocks['empty'];
    }
    else if (direction === "left") {
        let block = gameState[y][playerPos + x - 1];
        if (block === blocks['empty']) {
            return;
        }

        pushToInv(block);

        // document.getElementById('inv').innerText = document.getElementById('inv').innerText + " " + block;
        gameState[y][playerPos + x - 1] = blocks['empty'];
    }

    if (x < 0) {
        shownState = gameState[y].slice(0, taskbarLength);
    } else {
        shownState = gameState[y].slice(x, x + 11);
    }
}


// Rendering (every 100 milliseconds)
setInterval(() => {
    let state = [...shownState];
    state[playerPos] = player;

    let title = "";
    for (let i = 0; i < state.length; i++) {
        title += state[i];
    }
    document.title = title;

    if (y === 0) {
        heightIndicator.style.top = `${indicatorHeights[0]}px`;
    } else if (y === 1) {
        heightIndicator.style.top = `${indicatorHeights[1]}px`;
    } else if (y < 10) {
        heightIndicator.style.top = `${indicatorHeights[2]}px`;
    } else if (y < 25) {
        heightIndicator.style.top = `${indicatorHeights[3]}px`;
    } else if (y < 50) {
        heightIndicator.style.top = `${indicatorHeights[4]}px`;
    } else if (y < 80) {
        heightIndicator.style.top = `${indicatorHeights[5]}px`;
    }
}, 100)


                // Controller Logic
// UP
document.getElementById("upBtn").onclick = () => {
    walk("up");
}

// DOWN
document.getElementById("downBtn").onclick = () => {
    walk("down");
}

// RIGHT
document.getElementById("rightBtn").onclick = () => {
    walk("right");
}

// LEFT
document.getElementById("leftBtn").onclick = () => {
    walk("left");
}


// BREAK BLOCK RIGHT
document.getElementById("breakRightBtn").onclick = () => {
    breakBlock("right");
}

// BREAK BLOCK LEFT
document.getElementById("breakLeftBtn").onclick = () => {
    breakBlock("left");
}


const slider = document.getElementById('barLength')
slider.addEventListener('change', function() {
    taskbarLength = parseInt(slider.value);
})

// document.getElementById('barLength').onclick = () => {
//     let value = parseInt(document.getElementById('barLength').value);
//     console.log(value);
//     console.log(taskbarLength);
//     taskbarLength = value;
// }


// if (update) {
        
//     

// }

// update = false;
