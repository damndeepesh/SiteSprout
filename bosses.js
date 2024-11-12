const BossPatterns = {
    spaceBoss: {
        health: 1000,
        patterns: [
            {
                name: 'Spiral',
                execute: (boss, bullets) => {
                    // Spiral bullet pattern
                    for(let i = 0; i < 8; i++) {
                        const angle = (boss.patternStep + i * 45) * Math.PI / 180;
                        bullets.push({
                            x: boss.x,
                            y: boss.y,
                            speed: 5,
                            dx: Math.cos(angle) * 5,
                            dy: Math.sin(angle) * 5
                        });
                    }
                    boss.patternStep += 10;
                }
            },
            {
                name: 'Laser',
                execute: (boss, bullets) => {
                    // Laser attack pattern
                    bullets.push({
                        x: boss.x,
                        y: boss.y,
                        speed: 8,
                        width: 800,
                        height: 20,
                        isLaser: true
                    });
                }
            }
        ]
    }
}; 