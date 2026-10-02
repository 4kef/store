const products = [
    {
        id: "sealed-nectar",
        title: "The Sealed Nectar",
        author: "Sheikh Safi-ur-Rahman",
        price: 24.99,
        folder: "sealedNector",
        coverType: "single",
        coverImage: "individualPages/sealedNector/assets/cover.jpg",
        badge: "Bestseller"
    },
    {
        id: "stories-of-prophets",
        title: "Stories of the Prophets",
        author: "Imam Ibn Kathir",
        price: 19.99,
        folder: "storiesOfprophet",
        coverType: "single",
        coverImage: "individualPages/storiesOfprophet/assets/cover.jpg",
        badge: "Classic"
    },
    {
        id: "ar-raheequl-makhtum",
        title: "Ar-Raheequl Makhtum",
        author: "Sheikh Safi-ur-Rahman",
        price: 29.99,
        folder: "ArRaheequlAakhtoom",
        coverType: "single",
        coverImage: "individualPages/ArRaheequlAakhtoom/assets/cover.jpg",
        badge: "Award Winner"
    },
    {
        id: "when-the-moon-split",
        title: "When The Moon Split",
        author: "Safiur Rahman Mubarakpuri",
        price: 26.99,
        folder: "whenTheMoonSplit",
        coverType: "single",
        coverImage: "individualPages/whenTheMoonSplit/assets/cover.jpg",
        badge: "New"
    },
    {
        id: "fortress-of-muslim",
        title: "Fortress of the Muslim",
        author: "Sa'id bin Ali bin Wahaf Al-Qahtani",
        price: 9.99,
        folder: "fortressOfMuslim",
        coverType: "single",
        coverImage: "individualPages/fortressOfMuslim/assets/cover.png",
        badge: "Essential"
    },
    {
        id: "700-words",
        title: "700 Words of the Quran",
        author: "Quranic Vocabulary",
        price: 14.99,
        folder: "700words",
        coverType: "composite",
        coverImages: [
            "individualPages/700words/assets/dark-preview.png",
            "individualPages/700words/assets/light-preview.png"
        ],
        badge: "Interactive"
    }
];

// Function to render a product card
function renderProductCard(product) {
    let coverHTML = '';
    
    if (product.coverType === 'single') {
        coverHTML = `<img src="${product.coverImage}" alt="${product.title}" class="product-img">`;
    } else if (product.coverType === 'composite') {
        // Special render for 700words combining both preview images
        coverHTML = `
            <div class="composite-cover">
                <div class="half-image left-half" style="background-image: url('${product.coverImages[0]}')"></div>
                <div class="half-image right-half" style="background-image: url('${product.coverImages[1]}')"></div>
                <div class="composite-overlay">Dual Theme</div>
            </div>
        `;
    }

    const badgeHTML = product.badge ? `<div class="product-badge">${product.badge}</div>` : '';

    return `
        <a href="individualPages/${product.folder}/index.html" class="product-card animate-scale-up">
            <div class="product-cover-container">
                ${badgeHTML}
                ${coverHTML}
                <div class="product-hover-action">View Details</div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-author">${product.author}</p>
                <div class="product-bottom">
                    <span class="product-price">$${product.price}</span>
                    <button class="btn-cart" onclick="event.preventDefault(); alert('Added to cart mock')">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-9.8-2h11.6a2 2 0 0 0 1.9-1.5l2.4-9a2 2 0 0 0-1.9-2.5H6.2L5.4 2H2v2h2.2l3.4 12.3a2 2 0 0 0-1.4 1.7z"/></svg>
                    </button>
                </div>
            </div>
        </a>
    `;
}

// Initialize Lenis for smooth scrolling
const initLenis = () => {
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

    document.querySelectorAll('.animate-fade-in-up, .animate-blur-up, .animate-scale-up, .animate-fade-in-down').forEach((el) => {
        observer.observe(el);
    });
};

// Initialize the store
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('product-grid');
    if (grid) {
        // Render all products from our pseudo-backend JSON
        // Add staggered transition delays for grid items
        grid.innerHTML = products.map((product, index) => {
            const delay = (index % 4) * 0.1;
            return renderProductCard(product).replace('class="product-card animate-scale-up"', `class="product-card animate-scale-up" style="transition-delay: ${delay}s"`);
        }).join('');
    }
    
    initLenis();
    // Use setTimeout to ensure DOM is fully populated before observing
    setTimeout(initScrollAnimations, 100);
});
