let currentGame = null;

function showGameOver(score, gameType) {
    if (currentGame) {
        cancelAnimationFrame(currentGame);
        currentGame = null;
    }

    const isHighScore = HighScoreSystem.checkHighScore(gameType, score);
    const gameContainer = document.querySelector('.game-container');
    const gameOverScreen = document.createElement('div');
    gameOverScreen.className = 'game-over-screen';

    // First show game over and score
    gameOverScreen.innerHTML = `
        <div class="game-over-text">
            <div>GAME OVER</div>
            <div class="game-over-score">Score: ${score}</div>
            ${isHighScore ? '<div class="new-highscore">NEW HIGH SCORE!</div>' : ''}
        </div>
    `;
    gameContainer.appendChild(gameOverScreen);

    // If it's a high score, save it and then show the high scores table
    if (isHighScore) {
        HighScoreSystem.saveScore(gameType, score).then(() => {
            // After player enters name, update the game over screen with high scores
            gameOverScreen.innerHTML += `
                ${HighScoreSystem.showHighScores(gameType)}
                <div class="game-over-buttons">
                    <button class="game-button" onclick="restartGame('${gameType}')">Play Again</button>
                    <button class="game-button" onclick="closeGames()">Exit</button>
                </div>
            `;
        });
    } else {
        // If not a high score, show high scores table immediately
        gameOverScreen.innerHTML += `
            ${HighScoreSystem.showHighScores(gameType)}
            <div class="game-over-buttons">
                <button class="game-button" onclick="restartGame('${gameType}')">Play Again</button>
                <button class="game-button" onclick="closeGames()">Exit</button>
            </div>
        `;
    }
}

function restartGame(gameType) {
    const gameOverScreen = document.querySelector('.game-over-screen');
    if (gameOverScreen) {
        gameOverScreen.remove();
    }
    startGame(gameType);
}

function openGames() {
    const gamesModal = document.createElement('div');
    gamesModal.className = 'games-modal';
    gamesModal.innerHTML = `
        <div class="games-container">
            <div class="games-header">
                <h2>SELECT GAME</h2>
                <button class="close-button" onclick="closeGames()">[X]</button>
            </div>
            
            <!-- Games Grid First -->
            <div class="games-grid">
                <div class="game-card" onclick="startGame('snake')">
                    <h3>SNAKE</h3>
                    <p>Classic Snake Game</p>
                </div>
                <div class="game-card" onclick="startGame('pong')">
                    <h3>AI PONG</h3>
                    <p>Play Against AI</p>
                </div>
                <div class="game-card" onclick="startGame('tetris')">
                    <h3>TETRIS</h3>
                    <p>Block Puzzle</p>
                </div>
                <div class="game-card" onclick="startGame('space')">
                    <h3>SPACE INVADERS</h3>
                    <p>Shoot Aliens</p>
                </div>
            </div>

            <!-- Divider -->
            <div class="retro-divider"></div>
            
            <!-- Leaderboard Section Below -->
            <div class="leaderboard-section">
                <h3>LEADERBOARD</h3>
                <select id="gameSelect" class="game-select" onchange="updateLeaderboard()">
                    <option value="all">All Games</option>
                    <option value="snake">Snake</option>
                    <option value="pong">AI Pong</option>
                    <option value="tetris">Tetris</option>
                    <option value="space">Space Invaders</option>
                </select>
                <div id="leaderboardContent" class="leaderboard-content">
                    <!-- Leaderboard data will be inserted here -->
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(gamesModal);
    updateLeaderboard(); // Initialize leaderboard
}

function closeGames() {
    const modal = document.querySelector('.games-modal');
    if (modal) {
        modal.remove();
    }
    if (currentGame) {
        if (typeof currentGame === 'number') {
            cancelAnimationFrame(currentGame);
        } else if (typeof currentGame === 'function') {
            currentGame();
        }
        currentGame = null;
    }
}

function startGame(gameType) {
    const gamesModal = document.querySelector('.games-modal');
    gamesModal.innerHTML = `
        <div class="games-container">
            <div class="games-header">
                <h2>${gameType.toUpperCase()}</h2>
                <button class="close-button" onclick="closeGames()">[X]</button>
            </div>
            <div class="game-container">
                <canvas id="gameCanvas"></canvas>
                <div class="game-score">Score: <span id="score">0</span></div>
                <div class="game-controls"></div>
            </div>
        </div>
    `;

    const canvas = document.getElementById('gameCanvas');
    canvas.width = 800;
    canvas.height = 600;
    
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Clear any existing game state
    if (currentGame) {
        if (typeof currentGame === 'number') {
            cancelAnimationFrame(currentGame);
        } else {
            clearInterval(currentGame);
        }
        currentGame = null;
    }

    // Remove any existing event listeners
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);

    // Clear canvas before starting
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Initialize game with proper scope
    switch(gameType) {
        case 'snake':
            initSnakeGame(canvas, ctx);
            break;
        case 'pong':
            // Initialize pong with proper scope
            const pongGame = {
                paddleHeight: canvas.height / 6,
                paddleWidth: canvas.width / 80,
                ballSize: canvas.width / 100,
                score: 0,
                gameOver: false,
                ball: {
                    x: canvas.width / 2,
                    y: canvas.height / 2,
                    dx: 5,
                    dy: 3,
                    speed: 5
                },
                playerPaddle: {
                    x: 50,
                    y: canvas.height / 2 - (canvas.height / 12),
                    speed: 8
                },
                aiPaddle: {
                    x: canvas.width - 50 - (canvas.width / 80),
                    y: canvas.height / 2 - (canvas.height / 12),
                    speed: 5
                }
            };
            initPongGame(canvas, ctx, pongGame);
            break;
        case 'tetris':
            initTetrisGame(canvas, ctx);
            break;
        case 'space':
            // Initialize space invaders with proper scope
            const spaceGame = {
                player: {
                    x: canvas.width / 2,
                    y: canvas.height - 50,
                    width: 40,
                    height: 30,
                    speed: 6,
                    color: '#33ff33',
                    lives: 3
                },
                enemies: [],
                bullets: [],
                enemyBullets: [],
                score: 0,
                level: 1
            };
            initSpaceGame(canvas, ctx, spaceGame);
            break;
    }
}

// Add global key handler
function handleKeyDown(e) {
    if (e.key.startsWith('Arrow')) {
        e.preventDefault(); // Prevent page scrolling
    }
}

function handleKeyUp(e) {
    if (e.key.startsWith('Arrow')) {
        e.preventDefault();
    }
}

// Snake Game Implementation
function initSnakeGame(canvas, ctx) {
    const gridSize = 20;
    let snake = [{ x: 10, y: 10 }];
    let food = { x: 15, y: 15 };
    let direction = 'right';
    let score = 0;
    let gameSpeed = 100;

    function drawSnake() {
        snake.forEach(segment => {
            ctx.fillStyle = '#33ff33';
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        });
    }

    function drawFood() {
        ctx.fillStyle = '#ff3333';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    }

    function moveSnake() {
        const head = { ...snake[0] };
        switch(direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }
        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score += 10;
            document.getElementById('score').textContent = score;
            food = {
                x: Math.floor(Math.random() * (canvas.width / gridSize)),
                y: Math.floor(Math.random() * (canvas.height / gridSize))
            };
            gameSpeed = Math.max(50, gameSpeed - 2); // Increase speed
        } else {
            snake.pop();
        }
    }

    function checkCollision() {
        const head = snake[0];
        if (head.x < 0 || 
            head.x >= canvas.width / gridSize ||
            head.y < 0 || 
            head.y >= canvas.height / gridSize ||
            snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
            showGameOver(score, 'snake');
            return true;
        }
        return false;
    }

    function gameLoop() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        moveSnake();
        
        if (checkCollision()) {
            ctx.fillStyle = '#33ff33';
            ctx.font = '30px "Press Start 2P"';
            ctx.textAlign = 'center';
            ctx.fillText(`GAME OVER - Score: ${score}`, canvas.width/2, canvas.height/2);
            return;
        }

        drawFood();
        drawSnake();
        currentGame = setTimeout(() => requestAnimationFrame(gameLoop), gameSpeed);
    }

    // Controls
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowUp': if (direction !== 'down') direction = 'up'; break;
            case 'ArrowDown': if (direction !== 'up') direction = 'down'; break;
            case 'ArrowLeft': if (direction !== 'right') direction = 'left'; break;
            case 'ArrowRight': if (direction !== 'left') direction = 'right'; break;
        }
    });

    // Add controls info
    const controls = document.querySelector('.game-controls');
    controls.innerHTML = 'Use Arrow Keys to control the snake';

    gameLoop();
}

// Pong Game Implementation
function initPongGame(canvas, ctx) {
    // Initialize game variables with proper dimensions
    const paddleHeight = canvas.height / 6;
    const paddleWidth = canvas.width / 80;
    const ballSize = canvas.width / 100;
    let score = 0;
    
    // Game objects with proper positioning
    const ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        dx: 5,
        dy: 3,
        speed: 5
    };
    
    const playerPaddle = {
        x: paddleWidth * 2,
        y: canvas.height / 2 - paddleHeight / 2,
        speed: 8
    };
    
    const aiPaddle = {
        x: canvas.width - paddleWidth * 3,
        y: canvas.height / 2 - paddleHeight / 2,
        speed: 5
    };

    // Controls
    let upPressed = false;
    let downPressed = false;

    // Event listeners
    const keyDownHandler = (e) => {
        if (e.key === 'ArrowUp') upPressed = true;
        if (e.key === 'ArrowDown') downPressed = true;
    };

    const keyUpHandler = (e) => {
        if (e.key === 'ArrowUp') upPressed = false;
        if (e.key === 'ArrowDown') downPressed = false;
    };

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    function gameLoop() {
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Move paddles
        if (upPressed && playerPaddle.y > 0) {
            playerPaddle.y -= playerPaddle.speed;
        }
        if (downPressed && playerPaddle.y < canvas.height - paddleHeight) {
            playerPaddle.y += playerPaddle.speed;
        }

        // AI movement
        const aiTarget = ball.y - paddleHeight / 2;
        if (aiPaddle.y < aiTarget - paddleHeight/6) {
            aiPaddle.y += aiPaddle.speed;
        } else if (aiPaddle.y > aiTarget + paddleHeight/6) {
            aiPaddle.y -= aiPaddle.speed;
        }

        // Keep AI paddle in bounds
        aiPaddle.y = Math.max(0, Math.min(canvas.height - paddleHeight, aiPaddle.y));

        // Move ball
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Ball collision with top and bottom
        if (ball.y + ballSize > canvas.height || ball.y - ballSize < 0) {
            ball.dy = -ball.dy;
        }

        // Ball collision with paddles
        if (ball.x - ballSize < playerPaddle.x + paddleWidth && 
            ball.y > playerPaddle.y && 
            ball.y < playerPaddle.y + paddleHeight) {
            ball.dx = Math.abs(ball.dx) * 1.1;
            score += 10;
            document.getElementById('score').textContent = score;
        }

        if (ball.x + ballSize > aiPaddle.x && 
            ball.y > aiPaddle.y && 
            ball.y < aiPaddle.y + paddleHeight) {
            ball.dx = -Math.abs(ball.dx) * 1.1;
        }

        // Ball out of bounds
        if (ball.x < 0 || ball.x > canvas.width) {
            showGameOver(score, 'pong');
            document.removeEventListener('keydown', keyDownHandler);
            document.removeEventListener('keyup', keyUpHandler);
            return;
        }

        // Draw paddles
        ctx.fillStyle = '#33ff33';
        ctx.fillRect(playerPaddle.x, playerPaddle.y, paddleWidth, paddleHeight);
        ctx.fillRect(aiPaddle.x, aiPaddle.y, paddleWidth, paddleHeight);

        // Draw ball
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ballSize, 0, Math.PI * 2);
        ctx.fill();

        // Continue game loop
        currentGame = requestAnimationFrame(gameLoop);
    }

    // Add controls info
    const controls = document.querySelector('.game-controls');
    controls.innerHTML = 'Use ↑ and ↓ arrows to move paddle';

    // Start game
    gameLoop();
}

// Tetris Game Implementation
function initTetrisGame(canvas, ctx) {
    // Adjust block size and board dimensions for better fit
    const BLOCK_SIZE = 25; // Reduced from 30
    const BOARD_WIDTH = 10;
    const BOARD_HEIGHT = 20;
    const BOARD_OFFSET_X = (canvas.width - (BOARD_WIDTH * BLOCK_SIZE)) / 2;
    const BOARD_OFFSET_Y = 10; // Reduced top margin
    
    // Calculate playable area to ensure everything fits
    const PLAYABLE_HEIGHT = canvas.height - 20; // Leave small margin at bottom
    const ACTUAL_BLOCK_SIZE = Math.min(
        BLOCK_SIZE,
        Math.floor(PLAYABLE_HEIGHT / BOARD_HEIGHT)
    );

    // Recalculate offsets with new block size
    const ACTUAL_BOARD_WIDTH = BOARD_WIDTH * ACTUAL_BLOCK_SIZE;
    const ACTUAL_BOARD_HEIGHT = BOARD_HEIGHT * ACTUAL_BLOCK_SIZE;
    const ACTUAL_OFFSET_X = (canvas.width - ACTUAL_BOARD_WIDTH) / 2;
    const ACTUAL_OFFSET_Y = (canvas.height - ACTUAL_BOARD_HEIGHT) / 2;
    
    let score = 0;
    let level = 1;
    let board = Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0));
    let currentPiece;
    let gameSpeed = 1000;
    let gameInterval;

    // Update piece colors for retro look
    const PIECES = [
        { shape: [[1, 1, 1, 1]], color: '#00ffff' },     // I - Cyan
        { shape: [[1, 1, 1], [0, 1, 0]], color: '#ff00ff' },  // T - Magenta
        { shape: [[1, 1], [1, 1]], color: '#ffff00' },    // O - Yellow
        { shape: [[1, 1, 0], [0, 1, 1]], color: '#ff0000' },  // Z - Red
        { shape: [[0, 1, 1], [1, 1, 0]], color: '#00ff00' },  // S - Green
        { shape: [[1, 0, 0], [1, 1, 1]], color: '#ff8000' },  // L - Orange
        { shape: [[0, 0, 1], [1, 1, 1]], color: '#0000ff' }   // J - Blue
    ];

    class Piece {
        constructor() {
            const piece = PIECES[Math.floor(Math.random() * PIECES.length)];
            this.shape = piece.shape;
            this.color = piece.color;
            this.x = Math.floor(BOARD_WIDTH / 2) - Math.floor(this.shape[0].length / 2);
            this.y = 0;
        }

        rotate() {
            const newShape = this.shape[0].map((_, i) => 
                this.shape.map(row => row[i]).reverse()
            );
            if (!checkCollision(this.x, this.y, newShape)) {
                this.shape = newShape;
            }
        }
    }

    function checkCollision(x, y, shape = currentPiece.shape) {
        return shape.some((row, dy) => 
            row.some((value, dx) => {
                if (!value) return false;
                const newX = x + dx;
                const newY = y + dy;
                return newX < 0 || 
                       newX >= BOARD_WIDTH || 
                       newY >= BOARD_HEIGHT ||
                       (newY >= 0 && board[newY][newX]);
            })
        );
    }

    function mergePiece() {
        currentPiece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    board[currentPiece.y + y][currentPiece.x + x] = currentPiece.color;
                }
            });
        });
        clearLines();
        currentPiece = new Piece();
        if (checkCollision(currentPiece.x, currentPiece.y)) {
            gameOver();
        }
    }

    function clearLines() {
        let linesCleared = 0;
        for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
            if (board[y].every(cell => cell)) {
                board.splice(y, 1);
                board.unshift(Array(BOARD_WIDTH).fill(0));
                linesCleared++;
                y++;
            }
        }
        
        if (linesCleared > 0) {
            // Tetris scoring system
            const points = [0, 40, 100, 300, 1200][linesCleared];
            score += points * Math.floor(level);
            document.getElementById('score').textContent = score;
            
            // Increase level and speed
            level = Math.floor(score / 1000) + 1;
            gameSpeed = Math.max(100, 1000 - (level * 50));
            resetInterval();
        }
    }

    function resetInterval() {
        clearInterval(gameInterval);
        gameInterval = setInterval(moveDown, gameSpeed);
    }

    function moveDown() {
        if (!checkCollision(currentPiece.x, currentPiece.y + 1)) {
            currentPiece.y++;
        } else {
            mergePiece();
        }
        draw();
    }

    function draw() {
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw game area background
        ctx.fillStyle = '#111';
        ctx.fillRect(
            ACTUAL_OFFSET_X - 4, 
            ACTUAL_OFFSET_Y - 4, 
            ACTUAL_BOARD_WIDTH + 8, 
            ACTUAL_BOARD_HEIGHT + 8
        );

        // Draw fancy border
        ctx.strokeStyle = '#33ff33';
        ctx.lineWidth = 2;
        
        // Outer border
        ctx.strokeRect(
            ACTUAL_OFFSET_X - 10, 
            ACTUAL_OFFSET_Y - 10, 
            ACTUAL_BOARD_WIDTH + 20, 
            ACTUAL_BOARD_HEIGHT + 20
        );
        
        // Inner border
        ctx.strokeRect(
            ACTUAL_OFFSET_X - 5, 
            ACTUAL_OFFSET_Y - 5, 
            ACTUAL_BOARD_WIDTH + 10, 
            ACTUAL_BOARD_HEIGHT + 10
        );

        // Draw grid
        ctx.strokeStyle = 'rgba(51, 255, 51, 0.15)';
        ctx.lineWidth = 1;
        
        // Draw board
        board.forEach((row, y) => {
            row.forEach((color, x) => {
                if (color) {
                    drawBlock(x, y, color);
                }
            });
        });

        // Draw current piece
        if (currentPiece) {
            currentPiece.shape.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value) {
                        drawBlock(currentPiece.x + x, currentPiece.y + y, currentPiece.color);
                    }
                });
            });
        }

        // Draw score and level
        ctx.fillStyle = '#33ff33';
        ctx.font = '20px "Press Start 2P"';
        ctx.textAlign = 'left';
        ctx.fillText(`Score: ${score}`, ACTUAL_OFFSET_X + ACTUAL_BOARD_WIDTH + 30, ACTUAL_OFFSET_Y + 30);
        ctx.fillText(`Level: ${level}`, ACTUAL_OFFSET_X + ACTUAL_BOARD_WIDTH + 30, ACTUAL_OFFSET_Y + 70);
    }

    function drawBlock(x, y, color) {
        const xPos = ACTUAL_OFFSET_X + x * ACTUAL_BLOCK_SIZE;
        const yPos = ACTUAL_OFFSET_Y + y * ACTUAL_BLOCK_SIZE;
        
        // Main block
        ctx.fillStyle = color;
        ctx.fillRect(xPos + 1, yPos + 1, ACTUAL_BLOCK_SIZE - 2, ACTUAL_BLOCK_SIZE - 2);
        
        // Light edge (top-left)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(xPos + 1, yPos + 1, ACTUAL_BLOCK_SIZE - 2, 2);
        ctx.fillRect(xPos + 1, yPos + 1, 2, ACTUAL_BLOCK_SIZE - 2);
        
        // Dark edge (bottom-right)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(xPos + ACTUAL_BLOCK_SIZE - 3, yPos + 1, 2, ACTUAL_BLOCK_SIZE - 2);
        ctx.fillRect(xPos + 1, yPos + ACTUAL_BLOCK_SIZE - 3, ACTUAL_BLOCK_SIZE - 2, 2);
    }

    function gameOver() {
        clearInterval(gameInterval);
        showGameOver(score, 'tetris');
    }

    // Controls
    document.addEventListener('keydown', e => {
        switch(e.key) {
            case 'ArrowLeft':
                if (!checkCollision(currentPiece.x - 1, currentPiece.y)) {
                    currentPiece.x--;
                }
                break;
            case 'ArrowRight':
                if (!checkCollision(currentPiece.x + 1, currentPiece.y)) {
                    currentPiece.x++;
                }
                break;
            case 'ArrowDown':
                moveDown();
                break;
            case 'ArrowUp':
                currentPiece.rotate();
                break;
        }
        draw();
    });

    // Initialize game
    currentPiece = new Piece();
    gameInterval = setInterval(moveDown, gameSpeed);
    
    // Add controls info
    const controls = document.querySelector('.game-controls');
    controls.innerHTML = 'Use ← → to move, ↑ to rotate, ↓ to drop faster';
    
    draw();
}

// Space Invaders Implementation with improvements
function initSpaceGame(canvas, ctx) {
    // Game state
    let score = 0;
    let gameOver = false;
    let enemies = [];
    let bullets = [];
    let enemyBullets = [];
    
    // Player setup
    const player = {
        x: canvas.width / 2,
        y: canvas.height - 50,
        width: 40,
        height: 30,
        speed: 5
    };

    // Controls
    let leftPressed = false;
    let rightPressed = false;
    let shooting = false;
    let lastShot = 0;

    // Create enemies
    function createEnemies() {
        const rows = 5;
        const cols = 10;
        const spacing = 50;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                enemies.push({
                    x: j * spacing + 50,
                    y: i * spacing + 50,
                    width: 30,
                    height: 30,
                    direction: 1,
                    type: i % 3
                });
            }
        }
    }

    // Event listeners
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') leftPressed = true;
        if (e.key === 'ArrowRight') rightPressed = true;
        if (e.key === 'ArrowUp') shooting = true;
    });

    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft') leftPressed = false;
        if (e.key === 'ArrowRight') rightPressed = false;
        if (e.key === 'ArrowUp') shooting = false;
    });

    function update() {
        if (gameOver) {
            showGameOver(score, 'space');
            return;
        }

        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Move player
        if (leftPressed && player.x > player.width/2) {
            player.x -= player.speed;
        }
        if (rightPressed && player.x < canvas.width - player.width/2) {
            player.x += player.speed;
        }

        // Player shooting
        if (shooting && Date.now() - lastShot > 250) {
            bullets.push({
                x: player.x,
                y: player.y - 10,
                width: 3,
                height: 15,
                speed: 7
            });
            lastShot = Date.now();
        }

        // Update bullets
        bullets.forEach((bullet, index) => {
            bullet.y -= bullet.speed;
            if (bullet.y < 0) {
                bullets.splice(index, 1);
            }
        });

        // Enemy shooting
        enemies.forEach(enemy => {
            if (Math.random() < 0.001) {
                enemyBullets.push({
                    x: enemy.x + enemy.width/2,
                    y: enemy.y + enemy.height,
                    width: 3,
                    height: 15,
                    speed: 5
                });
            }
        });

        // Update enemy bullets
        enemyBullets.forEach((bullet, index) => {
            bullet.y += bullet.speed;
            if (bullet.y > canvas.height) {
                enemyBullets.splice(index, 1);
            }
        });

        // Move enemies
        let touchedEdge = false;
        enemies.forEach(enemy => {
            enemy.x += enemy.direction * 2;
            if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
                touchedEdge = true;
            }
        });

        if (touchedEdge) {
            enemies.forEach(enemy => {
                enemy.direction *= -1;
                enemy.y += 20;
            });
        }

        // Check collisions
        bullets.forEach((bullet, bulletIndex) => {
            enemies.forEach((enemy, enemyIndex) => {
                if (bullet.x < enemy.x + enemy.width &&
                    bullet.x + bullet.width > enemy.x &&
                    bullet.y < enemy.y + enemy.height &&
                    bullet.y + bullet.height > enemy.y) {
                    bullets.splice(bulletIndex, 1);
                    enemies.splice(enemyIndex, 1);
                    score += 10;
                    document.getElementById('score').textContent = score;
                }
            });
        });

        enemyBullets.forEach((bullet, index) => {
            if (bullet.x < player.x + player.width/2 &&
                bullet.x + bullet.width > player.x - player.width/2 &&
                bullet.y < player.y + player.height &&
                bullet.y + bullet.height > player.y) {
                gameOver = true;
            }
        });

        // Draw everything
        drawPlayer();
        drawEnemies();
        drawBullets();

        // Check win condition
        if (enemies.length === 0) {
            createEnemies();
        }

        currentGame = requestAnimationFrame(update);
    }

    function drawPlayer() {
        ctx.fillStyle = '#33ff33';
        ctx.beginPath();
        ctx.moveTo(player.x, player.y);
        ctx.lineTo(player.x - player.width/2, player.y + player.height);
        ctx.lineTo(player.x + player.width/2, player.y + player.height);
        ctx.closePath();
        ctx.fill();
    }

    function drawEnemies() {
        enemies.forEach(enemy => {
            ctx.fillStyle = ['#ff0000', '#ff00ff', '#00ffff'][enemy.type];
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        });
    }

    function drawBullets() {
        ctx.fillStyle = '#33ff33';
        bullets.forEach(bullet => {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });

        ctx.fillStyle = '#ff0000';
        enemyBullets.forEach(bullet => {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        });
    }

    // Add controls info
    const controls = document.querySelector('.game-controls');
    controls.innerHTML = 'Use ← → to move, ↑ to shoot';

    // Start game
    createEnemies();
    update();
}

// Update the leaderboard function
function updateLeaderboard() {
    const gameSelect = document.getElementById('gameSelect');
    const selectedGame = gameSelect.value;
    const leaderboardContent = document.getElementById('leaderboardContent');
    
    let allScores = [];
    
    if (selectedGame === 'all') {
        // Get highest score from each game
        ['snake', 'pong', 'tetris', 'space'].forEach(game => {
            const scores = HighScoreSystem.getScores(game);
            if (scores.length > 0) {
                // Get only the highest score from each game
                allScores.push({
                    ...scores[0], // Highest score is already at index 0
                    game: game.toUpperCase()
                });
            }
        });
    } else {
        // Get all scores for the selected game
        allScores = HighScoreSystem.getScores(selectedGame)
            .map(score => ({
                ...score,
                game: selectedGame.toUpperCase()
            }));
    }

    // Generate leaderboard HTML
    const leaderboardHTML = `
        <table class="leaderboard-table">
            <thead>
                <tr>
                    <th>RANK</th>
                    <th>PLAYER</th>
                    <th>GAME</th>
                    <th>SCORE</th>
                    <th>DATE</th>
                </tr>
            </thead>
            <tbody>
                ${allScores.map((score, index) => `
                    <tr class="rank-${index + 1}">
                        <td>#${index + 1}</td>
                        <td>${score.name}</td>
                        <td>${score.game}</td>
                        <td>${score.score}</td>
                        <td>${score.date}</td>
                    </tr>
                `).join('')}
                ${allScores.length === 0 ? `
                    <tr>
                        <td colspan="5">No scores yet!</td>
                    </tr>
                ` : ''}
            </tbody>
        </table>
    `;

    leaderboardContent.innerHTML = leaderboardHTML;
}

// Add this function to clear all game scores
function clearAllGameScores() {
    const games = ['snake', 'pong', 'tetris', 'space'];
    games.forEach(game => {
        localStorage.removeItem(`highscores_${game}`);
    });
    console.log('All game scores cleared');
}

// Call this function to clear scores
clearAllGameScores();