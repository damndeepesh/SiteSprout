const HighScoreSystem = {
    saveScore(game, score) {
        // First check if it's actually a high score
        if (!this.checkHighScore(game, score)) {
            return Promise.resolve(this.getScores(game));
        }

        return new Promise((resolve) => {
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
                    <button id="submitScoreBtn" class="retro-modal-button">SUBMIT</button>
                </div>
            `;
            document.body.appendChild(modalOverlay);

            // Focus input
            const input = modalOverlay.querySelector('#playerName');
            input.select();

            // Add event listeners for both button click and Enter key
            const submitScore = () => {
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

            // Add click event listener
            const submitButton = modalOverlay.querySelector('#submitScoreBtn');
            submitButton.addEventListener('click', submitScore);

            // Add keyboard event listener
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    submitScore();
                }
            });
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