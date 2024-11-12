const GameSounds = {
    sounds: {
        buttonPress: new Audio('assets/sounds/button-press.wav'),
        powerOn: new Audio('assets/sounds/power-on.wav'),
        gameStart: new Audio('assets/sounds/game-start.wav'),
        gameOver: new Audio('assets/sounds/game-over.wav'),
        snakeEat: new Audio('assets/sounds/snake-eat.wav'),
        snakeDie: new Audio('assets/sounds/snake-die.wav'),
        paddleHit: new Audio('assets/sounds/paddle-hit.wav'),
        wallHit: new Audio('assets/sounds/wall-hit.wav'),
        pongScore: new Audio('assets/sounds/pong-score.wav'),
        tetrisRotate: new Audio('assets/sounds/tetris-rotate.wav'),
        tetrisMove: new Audio('assets/sounds/tetris-move.wav'),
        tetrisLine: new Audio('assets/sounds/tetris-line.wav'),
        tetrisLevelUp: new Audio('assets/sounds/tetris-levelup.wav'),
        shoot: new Audio('assets/sounds/shoot.wav'),
        explosion: new Audio('assets/sounds/explosion.wav'),
        enemyHit: new Audio('assets/sounds/enemy-hit.wav'),
        powerUp: new Audio('assets/sounds/power-up.wav'),
        hit: new Audio('assets/sounds/hit.wav'),
        point: new Audio('assets/sounds/point.wav'),
        move: new Audio('assets/sounds/move.wav'),
        rotate: new Audio('assets/sounds/rotate.wav'),
        levelUp: new Audio('assets/sounds/level-up.wav'),
        bgMusic: new Audio('assets/sounds/background.wav')
    },

    init() {
        // Set volume for all sounds
        Object.values(this.sounds).forEach(sound => {
            sound.volume = 0.3;
        });
        this.sounds.bgMusic.volume = 0.1;
        this.sounds.bgMusic.loop = true;
    },

    play(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log("Audio play failed"));
        }
    },

    startBgMusic() {
        this.sounds.bgMusic.play().catch(e => console.log("Background music failed"));
    },

    stopBgMusic() {
        this.sounds.bgMusic.pause();
        this.sounds.bgMusic.currentTime = 0;
    },

    mute() {
        Object.values(this.sounds).forEach(sound => {
            sound.muted = true;
        });
    },

    unmute() {
        Object.values(this.sounds).forEach(sound => {
            sound.muted = false;
        });
    }
};

// Initialize sounds
GameSounds.init(); 