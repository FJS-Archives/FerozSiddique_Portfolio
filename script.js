// Enhanced JavaScript for professional portfolio with gallery navigation

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navAnchors = document.querySelectorAll('.nav-links a');
    navAnchors.forEach(anchor => {
        anchor.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navLinksContainer.classList.remove('active');
        });
    });
    
    // Project filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Form submission handling
    const contactForm = document.getElementById('project-inquiry');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const projectType = formData.get('project-type');
            const budget = formData.get('budget');
            const message = formData.get('message');
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // In a real implementation, you would send this data to a server
            // For now, we'll simulate a network request
            setTimeout(() => {
                // Show success message
                alert(`Thank you ${name}! Your inquiry has been received. I'll get back to you within 24 hours.`);
                
                // Reset form and button
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }
    
    // Highlight active nav link based on scroll position
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav .nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset + 100;
        
        // Determine the current section in view
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        // Highlight the corresponding navigation link
        navLinks.forEach(link => {
            link.classList.remove('active');
            // Check if the link's href contains the current section's ID
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
    
    // Add subtle animation to elements when they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.service-card, .project-card, .pricing-card, .testimonial-card, .process-step');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = "1";
                element.style.transform = "translateY(0)";
            }
        });
    };
    
    // Set initial state for animated elements
    const animatedElements = document.querySelectorAll('.service-card, .project-card, .pricing-card, .testimonial-card, .process-step');
    animatedElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });
    
    // Initialize gallery navigation
    initGalleryNavigation();
    
    // Call on load and on scroll for better UX
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
});

// Gallery navigation system
let currentGalleryIndex = 0;
let galleryItems = [];

function initGalleryNavigation() {
    // Collect all gallery items from project cards
    const projectMedia = document.querySelectorAll('.project-media img, .project-media video');
    galleryItems = Array.from(projectMedia).map(media => ({
        element: media,
        src: media.getAttribute('src'),
        type: media.tagName.toLowerCase()
    }));
}

function openLightbox(src, element) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const video = document.getElementById('lightbox-video');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    // Find current index
    currentGalleryIndex = galleryItems.findIndex(item => item.src === src);
    
    // Update navigation buttons visibility
    updateNavigationButtons();

    // Animate lightbox opening
    lightbox.style.opacity = '0';
    lightbox.classList.add('active');
    
    setTimeout(() => {
        lightbox.style.opacity = '1';
    }, 10);

    // Set media content
    if (galleryItems[currentGalleryIndex].type === 'video') {
        video.src = galleryItems[currentGalleryIndex].src;
        video.style.display = 'block';
        img.style.display = 'none';
        video.play().catch(error => {
            console.warn("Autoplay was prevented:", error);
        });
    } else {
        img.src = galleryItems[currentGalleryIndex].src;
        img.style.display = 'block';
        video.style.display = 'none';
        video.pause();
    }

    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const video = document.getElementById('lightbox-video');

    // Animate lightbox closing
    lightbox.style.opacity = '0';
    
    setTimeout(() => {
        lightbox.classList.remove('active');
        video.pause();
        video.currentTime = 0;
        document.body.style.overflow = '';
    }, 300);
}

function navigateGallery(direction) {
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const video = document.getElementById('lightbox-video');
    
    // Animate current media out
    lightbox.querySelector('.lightbox-media-container').style.opacity = '0';
    lightbox.querySelector('.lightbox-media-container').style.transform = direction === 'next' ? 'translateX(-20px)' : 'translateX(20px)';
    
    setTimeout(() => {
        // Update index
        if (direction === 'next') {
            currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
        } else {
            currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
        }
        
        // Update navigation buttons
        updateNavigationButtons();
        
        // Set new media
        if (galleryItems[currentGalleryIndex].type === 'video') {
            video.src = galleryItems[currentGalleryIndex].src;
            video.style.display = 'block';
            img.style.display = 'none';
            video.play().catch(error => {
                console.warn("Autoplay was prevented:", error);
            });
        } else {
            img.src = galleryItems[currentGalleryIndex].src;
            img.style.display = 'block';
            video.style.display = 'none';
            video.pause();
        }
        
        // Animate new media in
        lightbox.querySelector('.lightbox-media-container').style.opacity = '1';
        lightbox.querySelector('.lightbox-media-container').style.transform = 'translateX(0)';
    }, 300);
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    
    // Show/hide buttons based on gallery length
    if (galleryItems.length <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';
    }
}

// Close lightbox when clicking outside the media or pressing Escape
document.addEventListener('click', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (e.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            navigateGallery('prev');
        } else if (e.key === 'ArrowRight') {
            navigateGallery('next');
        }
    }
});

// Enhanced video background handling
function initVideoBackground() {
    const video = document.getElementById('hero-video');
    const videoContainer = document.querySelector('.hero-video-background');
    
    if (video) {
        // Show loading state
        videoContainer.classList.add('loading');
        
        // Handle video load
        video.addEventListener('loadeddata', () => {
            videoContainer.classList.remove('loading');
        });
        
        // Handle video errors
        video.addEventListener('error', () => {
            videoContainer.classList.remove('loading');
            console.warn('Hero video failed to load, using fallback');
        });
        
        // Ensure video plays when user interacts with page (autoplay policies)
        document.addEventListener('click', () => {
            if (video.paused) {
                video.play().catch(e => console.log('Video play prevented:', e));
            }
        }, { once: true });
        
        // Mute/unmute toggle for video (optional feature)
        let isMuted = true;
        const muteButton = document.createElement('button');
        muteButton.innerHTML = '🔇';
        muteButton.className = 'video-mute-toggle';
        muteButton.title = 'Toggle video sound';
        muteButton.setAttribute('aria-label', 'Toggle video sound');
        muteButton.style.cssText = `
            position: absolute;
            bottom: 20px;
            right: 20px;
            background: var(--glass-bg);
            backdrop-filter: blur(10px);
            border: 1px solid var(--glass-border);
            color: var(--color-text-light);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            cursor: pointer;
            z-index: 10;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
        `;
        
        muteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            isMuted = !isMuted;
            video.muted = isMuted;
            muteButton.innerHTML = isMuted ? '🔇' : '🔊';
            muteButton.style.background = isMuted ? 'var(--glass-bg)' : 'var(--color-accent)';
            muteButton.style.color = isMuted ? 'var(--color-text-light)' : 'var(--color-primary)';
        });
        
        videoContainer.appendChild(muteButton);
    }
}