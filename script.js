// Initialize variables
let currentGame = null;
let lastScrollPosition = 0;
let isScrolling;
const navbar = document.querySelector('.retro-navbar');

// Countdown Timer
function updateCountdown() {
    const targetDate = new Date('December 31, 2024 23:59:59').getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        countdownElement.innerHTML = `
            <div class="countdown-segment">
                <span class="countdown-number">${String(days).padStart(2, '0')}</span>
                <span class="countdown-label">Days</span>
            </div>
            <div class="countdown-segment">
                <span class="countdown-number">${String(hours).padStart(2, '0')}</span>
                <span class="countdown-label">Hours</span>
            </div>
            <div class="countdown-segment">
                <span class="countdown-number">${String(minutes).padStart(2, '0')}</span>
                <span class="countdown-label">Mins</span>
            </div>
            <div class="countdown-segment">
                <span class="countdown-number">${String(seconds).padStart(2, '0')}</span>
                <span class="countdown-label">Secs</span>
            </div>
        `;
    }
}

// Initialize countdown
document.addEventListener('DOMContentLoaded', () => {
    updateCountdown();
    setInterval(updateCountdown, 1000);
});

// Games Modal Functions
function openGames() {
    const gamesModal = document.createElement('div');
    gamesModal.className = 'games-modal';
    gamesModal.innerHTML = `
        <div class="games-container">
            <div class="games-header">
                <h2>SELECT GAME</h2>
                <button class="close-button" onclick="closeGames()">[X]</button>
            </div>
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
        </div>
    `;
    document.body.appendChild(gamesModal);
}

function closeGames() {
    const modal = document.querySelector('.games-modal');
    if (modal) {
        modal.remove();
    }
    if (currentGame) {
        cancelAnimationFrame(currentGame);
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
                <canvas id="gameCanvas" width="800" height="600"></canvas>
                <div class="game-score">Score: <span id="score">0</span></div>
                <div class="game-controls"></div>
            </div>
        </div>
    `;

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    // Initialize the selected game
    switch(gameType) {
        case 'snake':
            initSnakeGame(canvas, ctx);
            break;
        case 'pong':
            initPongGame(canvas, ctx);
            break;
        case 'tetris':
            initTetrisGame(canvas, ctx);
            break;
        case 'space':
            initSpaceGame(canvas, ctx);
            break;
    }
}

// Scroll handling for floating buttons
function handleScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScroll > lastScrollPosition) {
        navbar.style.transform = 'translateY(-100%)';
        navbar.style.opacity = '0';
    }
    
    lastScrollPosition = currentScroll;
    
    clearTimeout(isScrolling);
    
    isScrolling = setTimeout(() => {
        navbar.style.transform = 'translateY(0)';
        navbar.style.opacity = '1';
    }, 150);
}

function handleScrollUp() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScroll < lastScrollPosition) {
        navbar.style.transform = 'translateY(0)';
        navbar.style.opacity = '1';
    }
    
    lastScrollPosition = currentScroll;
}

// Add scroll event listeners
window.addEventListener('scroll', handleScroll);
window.addEventListener('scroll', handleScrollUp);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Add smooth transition for navbar
    if (navbar) {
        navbar.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out';
    }
});