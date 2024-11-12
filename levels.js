const LevelSystem = {
    currentLevel: 1,
    experiencePoints: 0,
    nextLevelThreshold: 1000,
    
    patterns: {
        standard: (level) => ({
            enemySpeed: Math.min(3 + level * 0.5, 8),
            enemyCount: Math.min(5 + level * 2, 30),
            enemyHealth: Math.ceil(level / 3),
            powerUpChance: Math.min(0.1 + level * 0.02, 0.3),
            scoreMultiplier: 1 + level * 0.1
        }),
        
        boss: (level) => ({
            bossHealth: 1000 * level,
            bossSpeed: 2 + level * 0.3,
            attackPatterns: Math.min(2 + Math.floor(level / 2), 5),
            powerUpChance: 0.5,
            scoreMultiplier: 2 + level * 0.2
        })
    },
    
    getCurrentLevelConfig() {
        return this.patterns.standard(this.currentLevel);
    },
    
    addExperience(points) {
        this.experiencePoints += points;
        if (this.experiencePoints >= this.nextLevelThreshold) {
            this.levelUp();
        }
    },
    
    levelUp() {
        this.currentLevel++;
        this.experiencePoints -= this.nextLevelThreshold;
        this.nextLevelThreshold *= 1.5;
        
        // Return level up effects/bonuses
        return {
            healthBonus: this.currentLevel * 20,
            speedBonus: Math.min(this.currentLevel * 0.1, 0.5),
            powerUpDurationBonus: this.currentLevel * 1000
        };
    },
    
    isBossLevel() {
        return this.currentLevel % 5 === 0;
    }
}; 