// Initialize Lenis for smooth scrolling (if not on a very small/low-end device)
const initLenis = () => {
    // Disable Lenis on very small screens to save battery/performance on low-end devices
    if (window.innerWidth < 768) return;

    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
};

// Initialize IntersectionObserver for scroll animations
const initScrollAnimations = () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add class when element comes into view
                entry.target.classList.add('visible');
            } else {
                // Remove class when element exits view, making it repeatable on scroll up/down
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    // Observe all elements with animation classes
    document.querySelectorAll('.animate-fade-in-up').forEach((el) => {
        observer.observe(el);
    });
};

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initLenis();
    initScrollAnimations();
});
