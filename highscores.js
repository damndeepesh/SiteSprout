const HighScoreSystem = {
    saveScore(game, score) {
        // Create custom modal for name input
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'retro-modal-overlay';
        modalOverlay.innerHTML = `
            <div class="retro-modal">
                <h2>NEW HIGH SCORE!</h2>
                <p>Score: ${score}</p>
                <div class="retro-input-group">
                    <label for="playerName">Enter Your Name:</label>
                    <input type="text" id="playerName" class="retro-input" maxlength="10" value="Player">
                </div>
                <button class="retro-modal-button" onclick="submitHighScore(this)">SUBMIT</button>
            </div>
        `;
        document.body.appendChild(modalOverlay);

        // Focus input
        const input = modalOverlay.querySelector('#playerName');
        input.select();

        // Return a promise that resolves when the name is submitted
        return new Promise((resolve) => {
            window.submitHighScore = (button) => {
                const playerName = input.value.trim() || 'Anonymous';
                modalOverlay.remove();
                
                let scores = this.getScores(game);
                scores.push({
                    name: playerName,
                    score: score,
                    date: new Date().toLocaleDateString(),
                    game: game
                });
                
                scores.sort((a, b) => b.score - a.score);
                scores = scores.slice(0, 5);
                
                localStorage.setItem(`highscores_${game}`, JSON.stringify(scores));
                resolve(scores);
            };
        });
    },

    getScores(game) {
        const scores = localStorage.getItem(`highscores_${game}`);
        return scores ? JSON.parse(scores) : [];
    },

    showHighScores(game) {
        const scores = this.getScores(game);
        return `
            <div class="high-scores-table">
                <h2>HIGH SCORES</h2>
                <table>
                    <tr>
                        <th>RANK</th>
                        <th>NAME</th>
                        <th>SCORE</th>
                        <th>DATE</th>
                    </tr>
                    ${scores.map((score, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${score.name}</td>
                            <td>${score.score}</td>
                            <td>${score.date}</td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        `;
    },

    checkHighScore(game, score) {
        const scores = this.getScores(game);
        return scores.length < 5 || score > scores[scores.length - 1].score;
    }
}; 