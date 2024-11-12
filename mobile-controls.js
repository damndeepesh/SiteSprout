class MobileControls {
    constructor() {
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
            || window.innerWidth <= 768;
        this.activeGame = null;
        this.controlsAdded = false;
        if (this.isMobile) {
            this.init();
        }
    }

    init() {
        // Override the original startGame function
        const originalStartGame = window.startGame;
        window.startGame = (gameType) => {
            originalStartGame(gameType);
            this.addControls();
            this.activeGame = gameType;
        };

        // Override the original closeGames function
        const originalCloseGames = window.closeGames;
        window.closeGames = () => {
            originalCloseGames();
            this.removeControls();
            this.activeGame = null;
        };
    }

    addControls() {
        if (this.controlsAdded) return;

        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'mobile-controls';
        controlsContainer.innerHTML = `
            <div class="d-pad-container">
                <div class="d-pad">
                    <button class="d-btn up-btn" data-key="ArrowUp">↑</button>
                    <button class="d-btn right-btn" data-key="ArrowRight">→</button>
                    <button class="d-btn down-btn" data-key="ArrowDown">↓</button>
                    <button class="d-btn left-btn" data-key="ArrowLeft">←</button>
                    <div class="d-pad-center"></div>
                </div>
            </div>
            <div class="action-buttons">
                <button class="action-btn a-btn" data-key="ArrowUp">A</button>
                <button class="action-btn b-btn" data-key="b">B</button>
            </div>
            <div class="menu-buttons">
                <button class="menu-btn pause-btn">PAUSE</button>
                <button class="menu-btn exit-btn" onclick="closeGames()">EXIT</button>
            </div>
        `;

        document.body.appendChild(controlsContainer);
        this.initControlEvents();
        this.controlsAdded = true;
    }

    removeControls() {
        const controls = document.querySelector('.mobile-controls');
        if (controls) {
            controls.remove();
            this.controlsAdded = false;
        }
    }

    initControlEvents() {
        const buttons = document.querySelectorAll('.mobile-controls button[data-key]');
        
        buttons.forEach(button => {
            // Touch events
            button.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                button.classList.add('pressed');
                this.dispatchGameAction(button.dataset.key, true);
            }, { passive: false });

            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                button.classList.remove('pressed');
                this.dispatchGameAction(button.dataset.key, false);
            }, { passive: false });
        });

        // Pause button
        const pauseBtn = document.querySelector('.pause-btn');
        if (pauseBtn) {
            pauseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                pauseBtn.classList.toggle('active');
                // Implement pause functionality here
            });
        }
    }

    dispatchGameAction(key, isPressed) {
        const event = new KeyboardEvent(isPressed ? 'keydown' : 'keyup', { key });
        document.dispatchEvent(event);
    }
}

// Initialize mobile controls
document.addEventListener('DOMContentLoaded', () => {
    window.mobileControls = new MobileControls();
}); 