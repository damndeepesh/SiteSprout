const PowerUpSystem = {
    types: {
        RAPID_FIRE: {
            name: 'RAPID FIRE',
            color: '#ffff00',
            duration: 5000,
            effect: (player) => {
                player.fireRate = 100;
                setTimeout(() => player.fireRate = 250, 5000);
            }
        },
        SHIELD: {
            name: 'SHIELD',
            color: '#00ffff',
            duration: 8000,
            effect: (player) => {
                player.isInvulnerable = true;
                setTimeout(() => player.isInvulnerable = false, 8000);
            }
        },
        MULTI_SHOT: {
            name: 'MULTI SHOT',
            color: '#ff00ff',
            duration: 6000,
            effect: (player) => {
                player.multiShot = true;
                setTimeout(() => player.multiShot = false, 6000);
            }
        },
        SPEED_BOOST: {
            name: 'SPEED BOOST',
            color: '#ff8800',
            duration: 7000,
            effect: (player) => {
                player.speed *= 1.5;
                setTimeout(() => player.speed /= 1.5, 7000);
            }
        }
    },

    spawn(x, y, game) {
        if (Math.random() < 0.1) {
            const types = Object.values(this.types);
            const powerUp = types[Math.floor(Math.random() * types.length)];
            return {
                x, y,
                width: 20,
                height: 20,
                type: powerUp.name,
                color: powerUp.color,
                effect: powerUp.effect,
                duration: powerUp.duration,
                render: function(ctx) {
                    ctx.fillStyle = this.color;
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                    
                    // Add glow effect
                    ctx.shadowColor = this.color;
                    ctx.shadowBlur = 15;
                    ctx.fillRect(this.x, this.y, this.width, this.height);
                    ctx.shadowBlur = 0;
                    
                    // Add pulsing animation
                    const pulse = Math.sin(Date.now() / 200) * 0.2 + 0.8;
                    ctx.globalAlpha = pulse;
                    ctx.strokeStyle = this.color;
                    ctx.strokeRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
                    ctx.globalAlpha = 1;
                }
            };
        }
        return null;
    }
}; 