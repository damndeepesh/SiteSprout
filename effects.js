const EffectsSystem = {
    particles: [],
    
    explosion(x, y, color, count = 15) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x, y,
                dx: (Math.random() - 0.5) * 8,
                dy: (Math.random() - 0.5) * 8,
                radius: Math.random() * 3 + 1,
                color: color,
                life: 1,
                decay: 0.02
            });
        }
    },
    
    trail(x, y, color) {
        this.particles.push({
            x, y,
            dx: (Math.random() - 0.5) * 2,
            dy: Math.random() * 2 + 1,
            radius: Math.random() * 2 + 1,
            color: color,
            life: 0.5,
            decay: 0.05
        });
    },
    
    update() {
        this.particles.forEach((p, index) => {
            p.x += p.dx;
            p.y += p.dy;
            p.life -= p.decay;
            
            if (p.life <= 0) {
                this.particles.splice(index, 1);
            }
        });
    },
    
    render(ctx) {
        this.particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
            ctx.fillStyle = `${p.color}${Math.floor(p.life * 255).toString(16).padStart(2, '0')}`;
            ctx.fill();
            
            // Add glow effect
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10 * p.life;
            ctx.fill();
            ctx.shadowBlur = 0;
        });
    }
}; 