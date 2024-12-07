// Debounce function to limit the rate of function calls
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Add this at the beginning of your main.js file
function setMobileVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

document.addEventListener('DOMContentLoaded', handlePageLoad);

function handlePageLoad() {
    const loadingScreen = document.querySelector('.loading-screen');
    const pageWrapper = document.querySelector('.page-wrapper');
    
    // Check if this is a page refresh
    if (performance.navigation.type === 1 || sessionStorage.getItem('hasLoaded')) {
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
            document.documentElement.style.visibility = 'visible';
        }
        if (pageWrapper) {
            pageWrapper.style.opacity = '1';
        }
    } else {
        if (loadingScreen && pageWrapper) {
            loadingScreen.style.display = 'flex';
            // Force a reflow to ensure animations work
            void loadingScreen.offsetWidth;
            
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                loadingScreen.style.transition = 'opacity 0.5s ease';
                document.documentElement.style.visibility = 'visible';
                pageWrapper.style.opacity = '1';
                
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }, 3000);
        }
        sessionStorage.setItem('hasLoaded', 'true');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('js-loaded');

    // Get all tab elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const pricingTabs = document.querySelectorAll('.pricing-tab');
    const pricingSection = document.querySelector('.pricing-section');

    function initializePricingSection() {
        // Hide all tabs initially
        pricingTabs.forEach(tab => {
            tab.style.opacity = '0';
            tab.style.display = 'none';
            tab.classList.remove('active');
        });

        // Show default tab (websites) and activate its button
        const defaultTab = document.getElementById('websites');
        const defaultBtn = document.querySelector('[data-tab="websites"]');
        if (defaultTab) {
            defaultTab.style.display = 'block';
            defaultTab.style.opacity = '1';
            defaultTab.classList.add('active');
        }
        if (defaultBtn) {
            defaultBtn.classList.add('active');
        }

        // Force layout recalculation
        if (pricingSection) {
            void pricingSection.offsetHeight;
        }
    }

    // Initialize on load
    initializePricingSection();

    // Handle tab switching with proper spacing
    function switchTab(tabId) {
        // Hide all tabs with fade
        pricingTabs.forEach(tab => {
            tab.style.opacity = '0';
            setTimeout(() => {
                tab.style.display = 'none';
                tab.classList.remove('active');
            }, 300);
        });

        // Show selected tab with fade
        const selectedTab = document.getElementById(tabId);
        if (selectedTab) {
            setTimeout(() => {
                selectedTab.style.display = 'block';
                selectedTab.classList.add('active');
                // Force reflow
                void selectedTab.offsetHeight;
                selectedTab.style.opacity = '1';
            }, 300);
        }

        // Force layout recalculation
        void pricingSection.offsetHeight;
    }

    // Add click handlers to tab buttons
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Switch tab with animation
            switchTab(this.dataset.tab);
        });
    });
});

// Handle refresh and back/forward navigation
window.addEventListener('pageshow', function(event) {
    const pricingSection = document.querySelector('.pricing-section');
    if (pricingSection) {
        // Force layout recalculation
        void pricingSection.offsetHeight;
        
        // Additional delay to ensure proper rendering
        setTimeout(() => {
            void pricingSection.offsetHeight;
        }, 100);
    }
});

function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Particle Effect Initialization
const canvas = document.createElement("canvas");
document.getElementById("particles").appendChild(canvas);
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", debounce(resizeCanvas, 100));

function isMobile() {
    return window.innerWidth <= 768;
}

const particleCount = isMobile() ? 50 : 200;
const particles = Array.from({ length: particleCount }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1 + 0.2,
    speed: Math.random() * 2 + 1,
    direction: Math.random() * Math.PI * 2,
    alpha: Math.random() * 0.3 + 0.1,
    changeTimer: Math.random() * 100
}));

function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 84, 22, ${p.alpha})`;
        ctx.fill();
    });
}

function updateParticles() {
    particles.forEach(p => {
        p.x += Math.cos(p.direction) * p.speed;
        p.y += Math.sin(p.direction) * p.speed;

        p.changeTimer--;
        if (p.changeTimer <= 0) {
            p.direction = Math.random() * Math.PI * 2;
            p.changeTimer = Math.random() * 100;
            p.speed = Math.random() * 2 + 1;
        }

        if (p.x < -50) p.x = canvas.width + 50;
        if (p.x > canvas.width + 50) p.x = -50;
        if (p.y < -50) p.y = canvas.height + 50;
        if (p.y > canvas.height + 50) p.y = -50;
    });
}

function animate() {
    drawParticles();
    updateParticles();
    requestAnimationFrame(animate);
}

animate();

function checkScroll() {
    const cards = document.querySelectorAll('.philosophy-card');
    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (cardTop < windowHeight * 0.85) {
            card.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', debounce(checkScroll, 100));
checkScroll();

document.addEventListener('DOMContentLoaded', function() {
    const boxes = document.querySelectorAll('.difference-box');
    
    const boxObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, {
        threshold: 0.2
    });
    
    boxes.forEach(box => boxObserver.observe(box));

    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(faq => {
                if (faq !== item) {
                    faq.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    });

    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;

    if (window.innerWidth > 768) {
        mobileMenu.style.display = 'none';
        mobileMenuBtn.style.display = 'none';
    }

    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.mobile-menu-items a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.style.overflow = '';
        });
    });

    const features = document.querySelectorAll('.feature');
    features.forEach(feature => {
        feature.addEventListener('touchstart', function(e) {
            e.preventDefault();
            features.forEach(f => f.classList.remove('touched'));
            this.classList.add('touched');
        });
    });

    document.addEventListener('touchstart', function(e) {
        if (!e.target.closest('.feature')) {
            features.forEach(f => f.classList.remove('touched'));
        }
    });
});

window.addEventListener('resize', debounce(function() {
    if (window.innerWidth > 768) {
        document.querySelector('.mobile-menu').style.display = 'none';
        document.querySelector('.mobile-menu-btn').style.display = 'none';
        document.body.style.overflow = '';
    } else {
        document.querySelector('.mobile-menu-btn').style.display = 'block';
    }
}, 100));

window.addEventListener('resize', debounce(() => {
    if (isMobile()) {
        particles.length = Math.min(particles.length, 50);
    }
}, 100));

document.addEventListener('touchstart', function(e) {
    if (e.target.closest('.feature')) {
        e.preventDefault();
        const feature = e.target.closest('.feature');
        feature.classList.toggle('touched');
    }
}, { passive: false });

document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.navbar-menu');
    
    mobileMenu.addEventListener('click', function() {
        nav.classList.toggle('active');
        this.classList.toggle('active');
    });
    
    const features = document.querySelectorAll('.feature');
    features.forEach(feature => {
        feature.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.classList.add('active');
        });
        
        feature.addEventListener('touchend', function() {
            this.classList.remove('active');
        });
    });
    
    if (window.innerWidth <= 375) {
        particleCount = 30;
        particleSpeed = 0.5;
    }
});

// Run on page load
setMobileVH();

// Run on resize
window.addEventListener('resize', debounce(setMobileVH, 100));

// Run on orientation change
window.addEventListener('orientationchange', () => {
    setTimeout(setMobileVH, 100);
});

// Remove or update the showSection function since we're using data attributes now
// If you need to keep it for backward compatibility:
function showSection(sectionId) {
    const btn = document.querySelector(`[data-tab="${sectionId}"]`);
    if (btn) {
        btn.click();
    }
}

document.querySelectorAll('.feature').forEach(feature => {
    feature.addEventListener('click', () => {
        // Check if we're on mobile
        if (window.innerWidth <= 768) {
            // Remove active class from all other features
            document.querySelectorAll('.feature').forEach(f => {
                if (f !== feature) f.classList.remove('active');
            });
            // Toggle active class on clicked feature
            feature.classList.toggle('active');
        }
    });
});

// Add smooth transition for pricing tabs on mobile
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const pricingTabs = document.querySelectorAll('.pricing-tab');

    function switchTab(tabId) {
        // Hide all tabs
        pricingTabs.forEach(tab => {
            tab.style.opacity = '0';
            setTimeout(() => {
                tab.style.display = 'none';
            }, 300);
        });

        // Show selected tab
        const selectedTab = document.getElementById(tabId);
        if (selectedTab) {
            setTimeout(() => {
                selectedTab.style.display = 'block';
                // Force reflow
                void selectedTab.offsetWidth;
                selectedTab.style.opacity = '1';
            }, 300);
        }
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Switch tab with animation
            switchTab(this.dataset.tab);
        });
    });
});

// Feature section mobile interactions
document.addEventListener('DOMContentLoaded', function() {
    const features = document.querySelectorAll('.feature');
    
    // Handle mobile touch interactions
    features.forEach(feature => {
        feature.addEventListener('touchstart', function(e) {
            // Prevent default only if needed
            if (!e.target.closest('a, button')) {
                e.preventDefault();
            }
            
            // Remove active state from other features
            features.forEach(f => {
                if (f !== this) f.classList.remove('active');
            });
            
            // Toggle active state on touched feature
            this.classList.toggle('active');
        }, { passive: false });
    });
    
    // Remove active state when touching outside features
    document.addEventListener('touchstart', function(e) {
        if (!e.target.closest('.feature')) {
            features.forEach(feature => {
                feature.classList.remove('active');
            });
        }
    });
    
    // Handle resize events
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Reset any mobile-specific states on resize
            if (window.innerWidth > 768) {
                features.forEach(feature => {
                    feature.classList.remove('active');
                });
            }
        }, 250);
    });
});

