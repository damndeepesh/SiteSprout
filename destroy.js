function destroyScreen() {
    // Get all elements
    const allContent = document.querySelectorAll('h1, p, div, a, button, .countdown-segment');
    const navbar = document.querySelector('.retro-navbar');
    const background = document.querySelector('.background');
    
    // Add initial glitch effect
    document.body.classList.add('glitch');
    
    // Function to create falling characters
    function createFallingChar(char, x, y) {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.cssText = `
            position: fixed;
            color: var(--retro-green);
            left: ${x}px;
            top: ${y}px;
            font-family: 'VT323', monospace;
            font-size: ${Math.random() * 1 + 1}rem;
            pointer-events: none;
            transition: all ${Math.random() * 2 + 1}s cubic-bezier(.5,0,.5,1);
            z-index: 9999;
        `;
        document.body.appendChild(span);
        
        requestAnimationFrame(() => {
            span.style.transform = `
                translate(${(Math.random() - 0.5) * window.innerWidth}px, 
                ${window.innerHeight + 100}px) 
                rotate(${Math.random() * 720}deg)
            `;
            span.style.opacity = '0';
        });
        
        setTimeout(() => span.remove(), 3000);
    }
    
    // Make elements fall
    allContent.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const text = element.innerText;
        
        text.split('').forEach((char, i) => {
            if (char.trim()) {
                createFallingChar(char, rect.left + (i * 10), rect.top);
            }
        });
        
        element.style.opacity = '0';
    });
    
    // Hide navbar
    if (navbar) navbar.style.opacity = '0';
    
    // Show destruction message
    setTimeout(() => {
        // Change background color only when showing the message
        document.body.style.background = '#000000';
        if (background) {
            background.style.opacity = '0';
        }

        // Add dark overlay with transition
        const darkOverlay = document.createElement('div');
        darkOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            z-index: 9998;
            opacity: 0;
            transition: opacity 1s ease;
        `;
        document.body.appendChild(darkOverlay);

        // Fade in the overlay
        requestAnimationFrame(() => {
            darkOverlay.style.opacity = '1';
        });

        const terminalText = document.createElement('div');
        terminalText.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: var(--retro-green);
            font-family: 'VT323', monospace;
            font-size: 1.5rem;
            text-align: center;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;
        terminalText.innerHTML = 'SYSTEM DESTROYED';
        document.body.appendChild(terminalText);

        // Fade in the text
        requestAnimationFrame(() => {
            terminalText.style.opacity = '1';
        });

        // Start rebuild sequence
        setTimeout(() => {
            terminalText.innerHTML += '<br><span style="color: #ffff00">Connecting to backup server...</span>';
            
            setTimeout(() => {
                const transferLine = document.createElement('div');
                transferLine.style.color = '#ffff00';
                terminalText.appendChild(transferLine);
                
                let progress = 0;
                const transferInterval = setInterval(() => {
                    progress++;
                    transferLine.textContent = `Transferring files... ${progress}%`;
                    
                    if (progress >= 100) {
                        clearInterval(transferInterval);
                        startReboot();
                    }
                }, 50);
            }, 2000);
        }, 2000);
    }, 2000);
}

// Reboot sequence
function startReboot() {
    const rebootScreen = document.createElement('div');
    rebootScreen.style.cssText = `
        position: fixed;
        inset: 0;
        background: var(--retro-dark);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: 'Press Start 2P', cursive;
        color: var(--retro-green);
        z-index: 10000;
    `;
    
    rebootScreen.innerHTML = `
        <div style="font-size: 1.5rem; margin-bottom: 2rem;">SYSTEM REBOOT</div>
        <div class="loading-bar" style="width: 300px; height: 20px; border: 2px solid var(--retro-green); position: relative;">
            <div class="progress" style="width: 0%; height: 100%; background: var(--retro-green); transition: width 3s linear;"></div>
        </div>
        <div class="status" style="margin-top: 1rem; font-size: 0.8rem; color: #ffff00;"></div>
    `;
    
    document.body.appendChild(rebootScreen);
    
    const progress = rebootScreen.querySelector('.progress');
    const status = rebootScreen.querySelector('.status');
    
    setTimeout(() => {
        progress.style.width = '100%';
        status.textContent = 'Rebooting...';
        
        setTimeout(() => {
            window.location.reload();
        }, 3000);
    }, 100);
} 