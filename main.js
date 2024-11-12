// Countdown Timer and main site functionality
let lastScrollPosition = 0;
let isScrolling;
const navbar = document.querySelector('.retro-navbar');

function updateCountdown() {
    const targetDate = new Date('December 31, 2024 23:59:59').getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        countdownElement.innerHTML = `
            <div class="countdown-segment">
                <span class="countdown-number">${String(days).padStart(2, '0')}</span>
                <span class="countdown-label">Days</span>
            </div>
            <div class="countdown-segment">
                <span class="countdown-number">${String(hours).padStart(2, '0')}</span>
                <span class="countdown-label">Hours</span>
            </div>
            <div class="countdown-segment">
                <span class="countdown-number">${String(minutes).padStart(2, '0')}</span>
                <span class="countdown-label">Mins</span>
            </div>
            <div class="countdown-segment">
                <span class="countdown-number">${String(seconds).padStart(2, '0')}</span>
                <span class="countdown-label">Secs</span>
            </div>
        `;
    }
}

// Scroll handling for floating buttons
function handleScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScroll > lastScrollPosition) {
        navbar.style.transform = 'translateY(-100%)';
        navbar.style.opacity = '0';
    }
    
    lastScrollPosition = currentScroll;
    clearTimeout(isScrolling);
    
    isScrolling = setTimeout(() => {
        navbar.style.transform = 'translateY(0)';
        navbar.style.opacity = '1';
    }, 150);
}

function handleScrollUp() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScroll < lastScrollPosition) {
        navbar.style.transform = 'translateY(0)';
        navbar.style.opacity = '1';
    }
    
    lastScrollPosition = currentScroll;
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    if (navbar) {
        navbar.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out';
    }
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScrollUp);
}); 