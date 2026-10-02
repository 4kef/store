// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

document.addEventListener('DOMContentLoaded', () => {
    // Advanced Lenis Scroll Animations
    const heroVisual = document.querySelector('.hero-visual');
    const previewImages = document.querySelectorAll('.preview-image');
    const pricingCard = document.querySelector('.pricing-card');

    lenis.on('scroll', (e) => {
        const scrollY = window.scrollY;
        const velocity = e.velocity;

        // Only apply heavy scroll animations on Desktop to prevent mobile vibration/jank
        if (window.innerWidth > 768) {
            // 1. Hero Parallax (Books glide down smoothly)
            if (heroVisual) {
                heroVisual.style.transform = `translateY(${scrollY * 0.15}px)`;
            }

            // 2. Pricing Parallax (Pricing card glides up smoothly)
            if (pricingCard) {
                const offset = Math.max(0, scrollY - 600);
                pricingCard.style.transform = `translateY(${-offset * 0.05}px)`;
            }

            // 3. Velocity Squeeze on Images (Jelly effect)
            if (previewImages.length > 0) {
                const skew = Math.max(-1.5, Math.min(1.5, velocity * 0.04));
                const scale = 1 - Math.min(0.015, Math.abs(velocity * 0.0005));
                
                previewImages.forEach(img => {
                    img.style.transform = `skewY(${skew}deg) scale(${scale})`;
                });
            }
        }

        // Global scroll progress (for the progress bar)
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollY / docHeight) * 100;
        document.documentElement.style.setProperty('--scroll-progress', `${progress}%`);
    });

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .animate-blur-up, .animate-slide-in-left, .animate-slide-in-right, .animate-scale-up');
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Animate UI: Spotlight Effect for Cards
    const handleOnMouseMove = e => {
        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        target.style.setProperty("--mouse-x", `${x}px`);
        target.style.setProperty("--mouse-y", `${y}px`);
    };

    document.querySelectorAll(".feature-card").forEach(card => {
        card.addEventListener('mousemove', handleOnMouseMove);
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // Viewer Toggle Logic
    const viewerBtns = document.querySelectorAll('.viewer-btn');
    const viewerLight = document.getElementById('viewer-light');
    const viewerDark = document.getElementById('viewer-dark');

    viewerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            viewerBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            // Show appropriate viewer content
            if (btn.dataset.view === 'light') {
                viewerDark.classList.add('hidden');
                setTimeout(() => {
                    viewerLight.classList.remove('hidden');
                }, 50); // slight delay for smooth transition
            } else if (btn.dataset.view === 'dark') {
                viewerLight.classList.add('hidden');
                setTimeout(() => {
                    viewerDark.classList.remove('hidden');
                }, 50);
            }
        });
    });

    // Book Stack Click to Separate
    const bookStack = document.querySelector('.book-stack');
    if (bookStack) {
        bookStack.addEventListener('click', () => {
            bookStack.classList.toggle('separated');
        });
    }

    // Animate UI: Ripple Effect
    const createRipple = (e) => {
        const button = e.currentTarget;
        
        const circle = document.createElement("span");
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        let clientX, clientY;
        if (e.type === 'touchstart') {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${clientX - button.getBoundingClientRect().left - radius}px`;
        circle.style.top = `${clientY - button.getBoundingClientRect().top - radius}px`;
        circle.classList.add("ripple-ink");

        // Use a slight dark ripple for light buttons
        if (button.classList.contains('btn-secondary') || button.classList.contains('viewer-btn')) {
             circle.style.backgroundColor = "rgba(213, 161, 42, 0.3)";
        }

        const existingInk = button.getElementsByClassName("ripple-ink")[0];
        if (existingInk) {
            existingInk.remove();
        }

        button.appendChild(circle);

        setTimeout(() => {
            circle.remove();
        }, 600);
    };

    const rippleButtons = document.querySelectorAll('.btn, .viewer-btn');
    rippleButtons.forEach(btn => {
        btn.classList.add('ripple-btn');
        btn.addEventListener('mousedown', createRipple);
        btn.addEventListener('touchstart', createRipple, { passive: true });
    });
});

