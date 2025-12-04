// Brew Bliss Cafe - Modern Interactive Features
document.addEventListener('DOMContentLoaded', function() {
    console.log("Brew Bliss Cafe site loaded");
    
    // Initialize all interactive features
    initSmoothScrolling();
    initNavbarScroll();
    initNewsletterForm();
    initContactForm();
    initReservationForm();
    initGalleryModal();
    initScrollAnimations();
    initTestimonialAutoPlay();
    initLoadingStates();
});

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for styling
        if (scrollTop > 100) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
        
        // Hide/show navbar on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Newsletter form handling
function initNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            const button = this.querySelector('button[type="submit"]');
            
            // Show loading state
            const originalText = button.textContent;
            button.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Subscribing...';
            button.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Show success message
                showNotification('Thank you for subscribing! You\'ll receive our latest updates soon.', 'success');
                
                // Reset form
                this.reset();
                button.textContent = originalText;
                button.disabled = false;
            }, 2000);
        });
    }
}

// Contact form handling
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const button = this.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            
            // Show loading state
            button.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Sending...';
            button.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                showNotification('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
                
                // Reset form
                this.reset();
                button.textContent = originalText;
                button.disabled = false;
            }, 2000);
        });
    }
}

// Reservation form handling
function initReservationForm() {
    const form = document.getElementById('reservationForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const button = this.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            
            // Show loading state
            button.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Processing...';
            button.disabled = true;
            
            try {
                // Collect form data
                const formData = new FormData(this);
                const reservationData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    guests: parseInt(formData.get('guests')),
                    date: formData.get('date'),
                    time: formData.get('time'),
                    occasion: formData.get('occasion') || '',
                    notes: formData.get('notes') || ''
                };

                // Send reservation to backend
                const response = await fetch('/api/reservations', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(reservationData)
                });

                const result = await response.json();

                if (response.ok) {
                    showNotification(
                        `Reservation confirmed! Your reservation ID is ${result.reservation._id}. We'll send you a confirmation email shortly.`, 
                        'success'
                    );
                    
                    // Reset form
                    this.reset();
                    // Set default date to today
                    const dateInput = document.getElementById('date');
                    if (dateInput) {
                        const today = new Date().toISOString().split('T')[0];
                        dateInput.value = today;
                    }
                } else {
                    showNotification(
                        result.message || 'Failed to create reservation. Please try again.', 
                        'error'
                    );
                }
            } catch (error) {
                console.error('Error creating reservation:', error);
                showNotification(
                    'Network error. Please check your connection and try again.', 
                    'error'
                );
            } finally {
                // Reset button
                button.textContent = originalText;
                button.disabled = false;
            }
        });
    }
}

// Gallery modal functionality
function initGalleryModal() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const src = img.src;
            const alt = img.alt;
            
            // Create modal
            const modal = createImageModal(src, alt);
            document.body.appendChild(modal);
            
            // Show modal
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        });
    });
}

// Create image modal
function createImageModal(src, alt) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-backdrop">
            <div class="modal-content">
                <button class="modal-close" aria-label="Close modal">&times;</button>
                <img src="${src}" alt="${alt}" class="modal-image">
                <div class="modal-caption">${alt}</div>
            </div>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .image-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .image-modal.show {
            opacity: 1;
        }
        
        .modal-backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        
        .modal-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
        }
        
        .modal-close {
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            z-index: 1;
        }
        
        .modal-image {
            max-width: 100%;
            max-height: 80vh;
            object-fit: contain;
            border-radius: 8px;
        }
        
        .modal-caption {
            color: white;
            text-align: center;
            margin-top: 1rem;
            font-size: 1.1rem;
        }
    `;
    document.head.appendChild(style);
    
    // Close modal functionality
    modal.addEventListener('click', function(e) {
        if (e.target === this || e.target.classList.contains('modal-close') || e.target.classList.contains('modal-backdrop')) {
            this.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(this);
                document.head.removeChild(style);
            }, 300);
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            modal.click();
        }
    });
    
    return modal;
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.card, .gallery-item, .testimonial-card');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Testimonial carousel auto-play
function initTestimonialAutoPlay() {
    const carousel = document.getElementById('testimonialCarousel');
    if (carousel) {
        const bsCarousel = new bootstrap.Carousel(carousel, {
            interval: 5000,
            wrap: true
        });
        
        // Pause on hover
        carousel.addEventListener('mouseenter', () => {
            bsCarousel.pause();
        });
        
        carousel.addEventListener('mouseleave', () => {
            bsCarousel.cycle();
        });
    }
}

// Loading states for buttons
function initLoadingStates() {
    const buttons = document.querySelectorAll('button[type="submit"]');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.form && this.form.checkValidity()) {
                this.classList.add('loading');
            }
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    let iconClass = 'info-circle';
    if (type === 'success') iconClass = 'check-circle';
    else if (type === 'error') iconClass = 'exclamation-triangle';
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="bi bi-${iconClass} me-2"></i>
            ${message}
        </div>
        <button class="notification-close" aria-label="Close notification">&times;</button>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            z-index: 9999;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-success {
            border-left: 4px solid #28a745;
        }
        
        .notification-info {
            border-left: 4px solid #17a2b8;
        }
        
        .notification-error {
            border-left: 4px solid #dc3545;
        }
        
        .notification-content {
            flex: 1;
            color: #333;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            color: #666;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        removeNotification(notification, style);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        removeNotification(notification, style);
    });
}

function removeNotification(notification, style) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
        if (document.head.contains(style)) {
            document.head.removeChild(style);
        }
    }, 300);
}

// Add CSS for scroll animations
const animationCSS = `
    .card, .gallery-item, .testimonial-card {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .card.animate-in, .gallery-item.animate-in, .testimonial-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .navbar-scrolled {
        background: rgba(139, 69, 19, 0.95) !important;
        backdrop-filter: blur(10px);
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = animationCSS;
document.head.appendChild(styleSheet);