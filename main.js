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
    const navbar = document.querySelector('.retro-navbar');
    
    // Hide navbar when scrolling down
    if (currentScroll > lastScrollPosition && currentScroll > 50) { // Added threshold
        navbar.style.transform = 'translateY(-100%)';
        navbar.style.opacity = '0';
        navbar.style.pointerEvents = 'none'; // Disable interactions while hidden
    } else {
        // Show navbar when scrolling up
        navbar.style.transform = 'translateY(0)';
        navbar.style.opacity = '1';
        navbar.style.pointerEvents = 'auto'; // Re-enable interactions
    }
    
    lastScrollPosition = currentScroll;
}

// Add debounced scroll handler to improve performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    const navbar = document.querySelector('.retro-navbar');
    if (navbar) {
        navbar.style.transition = 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out';
        navbar.style.position = 'fixed';
        navbar.style.top = '0';
        navbar.style.width = '100%';
        navbar.style.zIndex = '1000';
    }
    
    // Use debounced scroll handler
    window.addEventListener('scroll', debounce(handleScroll, 10));
    
    // Hide navbar when user hasn't scrolled for a while
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (window.pageYOffset > 50) { // Only hide if not at top
                navbar.style.transform = 'translateY(-100%)';
                navbar.style.opacity = '0';
                navbar.style.pointerEvents = 'none';
            }
        }, 3000); // Hide after 3 seconds of no scrolling
    });
}); 