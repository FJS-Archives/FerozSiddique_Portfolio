// Performance optimizations
let ticking = false;

// 1. Optimized Cursor with Throttling
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

function updateCursor(e) {
    const posX = e.clientX;
    const posY = e.clientY;

    if (cursorDot) {
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
    }

    if (cursorOutline && !ticking) {
        ticking = true;
        
        requestAnimationFrame(() => {
            cursorOutline.style.left = `${posX}px`;
            cursorOutline.style.top = `${posY}px`;
            ticking = false;
        });
    }
}

// Throttled mousemove for better performance
function throttle(callback, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall < delay) return;
        lastCall = now;
        callback(...args);
    }
}

window.addEventListener('mousemove', throttle(updateCursor, 16)); // ~60fps

// Hover states with event delegation for better performance
document.body.addEventListener('mouseover', (e) => {
    if (e.target.matches('a, button, .project-card, input, textarea')) {
        document.body.classList.add('hovering');
    }
});

document.body.addEventListener('mouseout', (e) => {
    if (e.target.matches('a, button, .project-card, input, textarea')) {
        document.body.classList.remove('hovering');
    }
});

// 2. Enhanced Text Reveals with Performance
const observerOptions = { 
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// 3. Enhanced Project Filters
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.getAttribute('data-filter');
            
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter projects with animation
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                const shouldShow = filter === 'all' || category === filter;
                
                if (shouldShow) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });
}

// 4. Mobile Menu with Better UX
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });
        
        // Close menu when clicking on links
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuBtn.classList.remove('active');
            });
        });
    }
}

// 5. Enhanced Lightbox with Animation
let currentGalleryIndex = 0;
let galleryItems = [];

function initLightbox() {
    // Build gallery items from all media
    document.querySelectorAll('.project-media img, .project-media video').forEach(media => {
        galleryItems.push({
            src: media.getAttribute('src'),
            type: media.tagName.toLowerCase(),
            alt: media.getAttribute('alt') || 'Portfolio work'
        });
    });
}

function openLightbox(src) {
    const lightbox = document.getElementById('lightbox');
    const container = document.getElementById('lightbox-container');
    currentGalleryIndex = galleryItems.findIndex(item => item.src === src);
    
    if (currentGalleryIndex !== -1) {
        lightbox.classList.add('active');
        container.classList.add('slide-active');
        updateLightboxContent();
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const container = document.getElementById('lightbox-container');
    const video = document.getElementById('lightbox-video');
    
    lightbox.classList.remove('active');
    container.classList.remove('slide-active', 'slide-next', 'slide-prev');
    video.pause();
    document.body.style.overflow = ''; // Restore scrolling
}

function updateLightboxContent() {
    const item = galleryItems[currentGalleryIndex];
    const img = document.getElementById('lightbox-img');
    const video = document.getElementById('lightbox-video');
    const container = document.getElementById('lightbox-container');
    
    // Reset and hide both
    img.style.display = 'none';
    video.style.display = 'none';
    video.pause();
    
    if (item.type === 'video') {
        video.style.display = 'block';
        video.src = item.src;
        video.load();
    } else {
        img.style.display = 'block';
        img.src = item.src;
        img.alt = item.alt;
    }
}

// 6. Form Handling (FIXED)
function initForm() {
    const form = document.getElementById('project-inquiry');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Stops page reload, but we will send data manually below
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            // Show loading state
            submitBtn.innerHTML = '<div class="loading-spinner"></div> Sending...';
            submitBtn.disabled = true;
            
            try {
                // ACTUALLY send the data to Formspree using AJAX
                const response = await fetch(form.action, {
                    method: form.method,
                    body: new FormData(form),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success!
                    submitBtn.textContent = 'Message Sent!';
                    form.reset();
                } else {
                    // Formspree returned an error (like spam detection)
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        alert(data["errors"].map(error => error["message"]).join(", "));
                    } else {
                        submitBtn.textContent = 'Error!';
                        alert('Oops! There was a problem submitting your form');
                    }
                }
            } catch (error) {
                // Network error
                submitBtn.textContent = 'Error!';
                alert('Oops! There was a problem submitting your form');
            }
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);
        });
    }
}

// 7. Video Optimization
function initVideoOptimization() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        // Add loading state
        video.addEventListener('loadstart', () => {
            video.parentElement.classList.add('loading');
        });
        
        video.addEventListener('loadeddata', () => {
            video.parentElement.classList.remove('loading');
        });
        
        // Preload metadata only for better performance
        video.preload = 'metadata';
    });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Observe reveal elements
    document.querySelectorAll('.reveal-text').forEach(el => observer.observe(el));
    
    // Initialize components
    initFilters();
    initMobileMenu();
    initLightbox();
    initForm();
    initVideoOptimization();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Lightbox navigation with animation
function navigateGallery(dir) {
    const container = document.getElementById('lightbox-container');
    
    // Add animation class based on direction
    if (dir === 'next') {
        container.classList.remove('slide-prev');
        container.classList.add('slide-next');
        currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
    } else {
        container.classList.remove('slide-next');
        container.classList.add('slide-prev');
        currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
    }
    
    // Update content after a short delay for animation
    setTimeout(() => {
        updateLightboxContent();
        // Reset animation classes after content update
        setTimeout(() => {
            container.classList.remove('slide-next', 'slide-prev');
            container.classList.add('slide-active');
        }, 50);
    }, 300);
}

// Close lightbox on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Performance: Clean up on page hide
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause videos when tab is not visible
        document.querySelectorAll('video').forEach(video => video.pause());
    }
});