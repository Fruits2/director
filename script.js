const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('nextCanvas');
const nextCtx = nextCanvas.getContext('2d');

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = canvas.width / COLS; // 30px

// Standard Tetris colors keyed by piece name
const PIECES = [
    { name: 'I', color: '#00FFFF', shape: [[1, 1, 1, 1]] },
    { name: 'O', color: '#FFFF00', shape: [[1, 1], [1, 1]] },
    { name: 'T', color: '#AA00FF', shape: [[0, 1, 0], [1, 1, 1]] },
    { name: 'S', color: '#00EE00', shape: [[0, 1, 1], [1, 1, 0]] },
    { name: 'Z', color: '#FF2020', shape: [[1, 1, 0], [0, 1, 1]] },
    { name: 'J', color: '#0044FF', shape: [[1, 0, 0], [1, 1, 1]] },
    { name: 'L', color: '#FF8800', shape: [[0, 0, 1], [1, 1, 1]] }
];

let board = [];
let currentPiece = null;
let nextPiece = null;
let score = 0;
let level = 1;
let lines = 0;
let gameRunning = false;
let gamePaused = false;
let gameLoopId = null;
let dropSpeed = 1000;
let lastDropTime = 0;

const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const restartBtn = document.getElementById('restartBtn');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const linesDisplay = document.getElementById('lines');
const gameOverMsg = document.getElementById('gameOverMessage');
const finalScoreDisplay = document.getElementById('finalScore');

function initBoard() {
    board = Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
}

function getNewPiece() {
    const p = PIECES[Math.floor(Math.random() * PIECES.length)];
    return {
        shape: p.shape.map(row => [...row]), // deep copy
        color: p.color,
        x: Math.floor(COLS / 2) - Math.floor(p.shape[0].length / 2),
        y: 0
    };
}

function startGame() {
    initBoard();
    score = 0;
    level = 1;
    lines = 0;
    dropSpeed = 1000;
    gameRunning = true;
    gamePaused = false;
    lastDropTime = Date.now();

    currentPiece = getNewPiece();
    nextPiece = getNewPiece();

    updateUI();
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    gameOverMsg.classList.add('hidden');

    if (gameLoopId) clearInterval(gameLoopId);
    gameLoopId = setInterval(gameLoop, 16); // ~60fps
}

function gameLoop() {
    if (!gameRunning || gamePaused) return;

    const now = Date.now();
    if (now - lastDropTime > dropSpeed) {
        if (!movePiece(0, 1)) {
            lockPiece();
        }
        lastDropTime = now;
    }

    draw();
}

function movePiece(dx, dy) {
    const piece = { ...currentPiece, shape: currentPiece.shape.map(r => [...r]) };
    piece.x += dx;
    piece.y += dy;

    if (!isColliding(piece)) {
        currentPiece = piece;
        return true;
    }
    return false;
}

function rotatePiece() {
    const piece = { ...currentPiece, shape: currentPiece.shape.map(r => [...r]) };

    // 90° clockwise rotation
    piece.shape = piece.shape[0].map((_, i) =>
        piece.shape.map(row => row[i]).reverse()
    );

    if (!isColliding(piece)) {
        currentPiece = piece;
        return true;
    }

    // Wall kick: try ±1 and ±2 offsets
    for (const offset of [1, -1, 2, -2]) {
        const kicked = { ...piece, x: piece.x + offset };
        if (!isColliding(kicked)) {
            currentPiece = kicked;
            return true;
        }
    }
    return false;
}

function isColliding(piece) {
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (!piece.shape[row][col]) continue;
            const x = piece.x + col;
            const y = piece.y + row;
            if (x < 0 || x >= COLS || y >= ROWS) return true;
            if (y >= 0 && board[y][x] !== 0) return true;
        }
    }
    return false;
}

function placePiece() {
    for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
            if (!currentPiece.shape[row][col]) continue;
            const x = currentPiece.x + col;
            const y = currentPiece.y + row;
            if (y >= 0) board[y][x] = currentPiece.color;
        }
    }
}

function lockPiece() {
    placePiece();
    clearLines();
    currentPiece = nextPiece;
    nextPiece = getNewPiece();
    if (isColliding(currentPiece)) {
        endGame();
    }
}

function clearLines() {
    let cleared = 0;
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row].every(cell => cell !== 0)) {
            board.splice(row, 1);
            board.unshift(Array(COLS).fill(0));
            cleared++;
            row++;
        }
    }
    if (cleared > 0) {
        const points = [100, 300, 500, 800];
        score += (points[cleared - 1] || 800) * level;
        lines += cleared;
        level = Math.floor(lines / 10) + 1;
        dropSpeed = Math.max(100, 1000 - (level - 1) * 90);
        updateUI();
    }
}

function hardDrop() {
    let dropped = 0;
    while (movePiece(0, 1)) dropped++;
    score += dropped * 2;
    updateUI();
    lockPiece();
    lastDropTime = Date.now();
}

function getGhostY() {
    let ghostY = currentPiece.y;
    while (true) {
        const test = { ...currentPiece, y: ghostY + 1 };
        if (isColliding(test)) break;
        ghostY++;
    }
    return ghostY;
}

function updateUI() {
    scoreDisplay.textContent = score;
    levelDisplay.textContent = level;
    linesDisplay.textContent = lines;
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines (subtle)
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 0.5;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            ctx.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
        }
    }

    // Placed blocks
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (board[row][col]) drawBlock(ctx, col, row, board[row][col]);
        }
    }

    // Ghost piece
    if (currentPiece) {
        const ghostY = getGhostY();
        ctx.globalAlpha = 0.22;
        for (let row = 0; row < currentPiece.shape.length; row++) {
            for (let col = 0; col < currentPiece.shape[row].length; col++) {
                if (currentPiece.shape[row][col]) {
                    const y = ghostY + row;
                    if (y >= 0) drawBlock(ctx, currentPiece.x + col, y, currentPiece.color);
                }
            }
        }
        ctx.globalAlpha = 1;

        // Current piece
        for (let row = 0; row < currentPiece.shape.length; row++) {
            for (let col = 0; col < currentPiece.shape[row].length; col++) {
                if (currentPiece.shape[row][col]) {
                    const y = currentPiece.y + row;
                    if (y >= 0) drawBlock(ctx, currentPiece.x + col, y, currentPiece.color);
                }
            }
        }
    }

    drawNextPiece();
}

function drawBlock(context, x, y, color) {
    const s = BLOCK_SIZE;
    const px = x * s;
    const py = y * s;

    // Main fill
    context.fillStyle = color;
    context.fillRect(px + 1, py + 1, s - 2, s - 2);

    // Highlight (top-left bevel)
    context.fillStyle = 'rgba(255,255,255,0.35)';
    context.fillRect(px + 1, py + 1, s - 2, 3);
    context.fillRect(px + 1, py + 1, 3, s - 2);

    // Shadow (bottom-right bevel)
    context.fillStyle = 'rgba(0,0,0,0.35)';
    context.fillRect(px + 1, py + s - 4, s - 2, 3);
    context.fillRect(px + s - 4, py + 1, 3, s - 2);
}

function drawNextPiece() {
    nextCtx.fillStyle = '#000';
    nextCtx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
    if (!nextPiece) return;

    const bs = nextCanvas.width / 5;
    const offsetX = (nextCanvas.width - nextPiece.shape[0].length * bs) / 2;
    const offsetY = (nextCanvas.height - nextPiece.shape.length * bs) / 2;

    for (let row = 0; row < nextPiece.shape.length; row++) {
        for (let col = 0; col < nextPiece.shape[row].length; col++) {
            if (nextPiece.shape[row][col]) {
                const px = offsetX + col * bs;
                const py = offsetY + row * bs;
                nextCtx.fillStyle = nextPiece.color;
                nextCtx.fillRect(px + 1, py + 1, bs - 2, bs - 2);
                nextCtx.fillStyle = 'rgba(255,255,255,0.35)';
                nextCtx.fillRect(px + 1, py + 1, bs - 2, 3);
                nextCtx.fillRect(px + 1, py + 1, 3, bs - 2);
                nextCtx.fillStyle = 'rgba(0,0,0,0.35)';
                nextCtx.fillRect(px + 1, py + bs - 4, bs - 2, 3);
                nextCtx.fillRect(px + bs - 4, py + 1, 3, bs - 2);
            }
        }
    }
}

function endGame() {
    gameRunning = false;
    clearInterval(gameLoopId);
    gameLoopId = null;
    pauseBtn.disabled = true;
    startBtn.disabled = false;
    startBtn.textContent = '다시 시작';
    finalScoreDisplay.textContent = `최종 점수: ${score}`;
    gameOverMsg.classList.remove('hidden');
}

document.addEventListener('keydown', (e) => {
    if (!gameRunning || gamePaused) return;

    switch (e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            movePiece(-1, 0);
            break;
        case 'ArrowRight':
            e.preventDefault();
            movePiece(1, 0);
            break;
        case 'ArrowUp':
            e.preventDefault();
            rotatePiece();
            break;
        case 'ArrowDown':
            e.preventDefault();
            if (movePiece(0, 1)) {
                score += 1;
                updateUI();
                lastDropTime = Date.now();
            }
            break;
        case ' ':
            e.preventDefault();
            hardDrop();
            break;
    }
    draw();
});

startBtn.addEventListener('click', startGame);

pauseBtn.addEventListener('click', () => {
    gamePaused = !gamePaused;
    pauseBtn.textContent = gamePaused ? '재개' : '일시 정지';
    if (!gamePaused) draw();
});

restartBtn.addEventListener('click', startGame);
