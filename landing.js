// Landing Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Market data simulation - matching dashboard data
    const marketData = [
        { symbol: 'PETR4', name: 'Petrobras PN', price: 28.50, change: 2.15 },
        { symbol: 'VALE3', name: 'Vale ON', price: 72.30, change: 1.87 },
        { symbol: 'ITUB4', name: 'Itaú Unibanco PN', price: 31.20, change: -0.45 },
        { symbol: 'BBDC4', name: 'Bradesco PN', price: 27.80, change: 3.12 },
        { symbol: 'ABEV3', name: 'Ambev ON', price: 14.25, change: 1.23 },
        { symbol: 'MGLU3', name: 'Magazine Luiza ON', price: 3.45, change: 0.89 }
    ];

    // Update market prices with animation
    function updateMarketPrices() {
        const marketItems = document.querySelectorAll('.market-item');
        
        marketItems.forEach((item, index) => {
            if (marketData[index]) {
                const data = marketData[index];
                
                // Simulate price fluctuation
                const fluctuation = (Math.random() - 0.5) * 0.5;
                data.price += fluctuation;
                data.change += (Math.random() - 0.5) * 0.2;
                
                // Update price display
                const priceElement = item.querySelector('.price');
                const changeElement = item.querySelector('.change');
                
                if (priceElement) {
                    priceElement.textContent = `R$ ${data.price.toFixed(2)}`;
                }
                
                if (changeElement) {
                    const changeText = `${data.change >= 0 ? '+' : ''}${data.change.toFixed(2)}%`;
                    changeElement.textContent = changeText;
                    
                    // Update color based on change
                    changeElement.className = `change ${data.change >= 0 ? 'positive' : 'negative'}`;
                }
                
                // Add flash effect on price update
                priceElement.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    priceElement.style.transform = 'scale(1)';
                }, 200);
            }
        });
    }

    // Tab switching functionality
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Here you could implement different market data based on tab
            console.log('Tab switched to:', this.textContent);
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            if (this.getAttribute("href").startsWith("#")) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute("href"));
                if (target) {
                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }
        });
    });

    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Add transition to header
    header.style.transition = 'transform 0.3s ease-in-out';

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.hero-content, .market-section, .trust-indicators');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Button click analytics (placeholder)
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add click effect
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            console.log('CTA button clicked:', this.textContent.trim());
        });
    });

    // Start market price updates
    updateMarketPrices();
    setInterval(updateMarketPrices, 5000); // Update every 5 seconds

    // Initialize animations
    setTimeout(() => {
        animatedElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }, 300);

    // Mobile menu toggle (if needed in future)
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            const navMenu = document.querySelector('.nav-menu');
            navMenu.classList.toggle('active');
        });
    }

    // Typing effect for hero title (optional enhancement)
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Add loading state management
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Remove any loading indicators
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 500);
        }
    });
});

// Utility functions
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatPercentage(value) {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

// Export functions for potential use in other scripts
window.LandingPage = {
    formatCurrency,
    formatPercentage
};

