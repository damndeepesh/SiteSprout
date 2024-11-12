// Audio Manager
const AudioManager = {
    sounds: {
        shoot: new Audio('sounds/shoot.wav'),
        explosion: new Audio('sounds/explosion.wav'),
        powerUp: new Audio('sounds/powerup.wav'),
        gameOver: new Audio('sounds/gameover.wav'),
        levelUp: new Audio('sounds/levelup.wav'),
        collision: new Audio('sounds/collision.wav'),
        background: new Audio('sounds/background.wav')
    },

    init() {
        // Set up background music loop
        this.sounds.background.loop = true;
        // Set volumes
        this.sounds.background.volume = 0.3;
        Object.values(this.sounds).forEach(sound => {
            sound.volume = 0.5;
        });
    },

    play(soundName) {
        const sound = this.sounds[soundName];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log("Audio play failed:", e));
        }
    },

    startBackground() {
        this.sounds.background.play().catch(e => console.log("Background music failed:", e));
    },

    stopBackground() {
        this.sounds.background.pause();
        this.sounds.background.currentTime = 0;
    }
};

// High Score Manager
const HighScoreManager = {
    getHighScores(game) {
        const scores = localStorage.getItem(`highScores_${game}`);
        return scores ? JSON.parse(scores) : [];
    },

    saveHighScore(game, score, playerName = 'PLAYER') {
        let scores = this.getHighScores(game);
        scores.push({ name: playerName, score: score, date: new Date().toISOString() });
        scores.sort((a, b) => b.score - a.score);
        scores = scores.slice(0, 5); // Keep top 5 scores
        localStorage.setItem(`highScores_${game}`, JSON.stringify(scores));
        return scores;
    },

    showHighScores(game) {
        const scores = this.getHighScores(game);
        let html = `
            <div class="high-scores">
                <h2>HIGH SCORES</h2>
                <table>
                    <tr>
                        <th>RANK</th>
                        <th>NAME</th>
                        <th>SCORE</th>
                    </tr>
        `;
        
        scores.forEach((score, index) => {
            html += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${score.name}</td>
                    <td>${score.score}</td>
                </tr>
            `;
        });
        
        html += `</table></div>`;
        return html;
    }
}; 