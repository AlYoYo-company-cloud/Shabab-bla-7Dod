/**
 * ============================================
 * مبادرة شباب بلا حدود - Enterprise JavaScript
 * Version: 2.0
 * Author: Development Team
 * ============================================
 */

'use strict';

/**
 * DOM Content Loaded - Initialize all modules
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all functionality
    initScrollProgress();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initAnimatedCounters();
    initFloatingCTA();
    initActiveNavLinks();
    initParallaxEffects();
});

/**
 * ============================================
 * Scroll Progress Indicator
 * Shows reading progress at top of page
 * ============================================
 */
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    
    if (!progressBar) return;
    
    const updateProgress = () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / scrollHeight) * 100;
        progressBar.style.width = `${Math.min(scrolled, 100)}%`;
    };
    
    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateProgress();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial call
    updateProgress();
}

/**
 * ============================================
 * Sticky Navbar with scroll effects
 * ============================================
 */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    
    if (!navbar) return;
    
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        
        // Add scrolled class when scrolled down
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScrollY = currentScrollY;
    };
    
    // Throttle scroll events
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * ============================================
 * Mobile Menu Toggle
 * ============================================
 */
function initMobileMenu() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (!mobileBtn || !navLinks) return;
    
    // Toggle menu on button click
    mobileBtn.addEventListener('click', () => {
        mobileBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    
    // Close menu when clicking a link
    const links = navLinks.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', () => {
            mobileBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !mobileBtn.contains(e.target)) {
            mobileBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            mobileBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/**
 * ============================================
 * Smooth Scroll for anchor links
 * ============================================
 */
function initSmoothScroll() {
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip if external link or just "#"
            if (href === '#' || link.getAttribute('target') === '_blank') {
                return;
            }
            
            e.preventDefault();
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navbarHeight = document.getElementById('navbar')?.offsetHeight || 80;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * ============================================
 * Scroll-based Fade-in Animations
 * Uses Intersection Observer for performance
 * ============================================
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up');
    
    if (!animatedElements.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class with a small delay for staggered effect
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay * 1000);
                
                // Optionally stop observing after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * ============================================
 * Animated Number Counters
 * Counts up numbers when they come into view
 * ============================================
 */
function initAnimatedCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    if (!counters.length) return;
    
    let hasAnimated = false;
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        const duration = 2000; // 2 seconds
        const startTime = performance.now();
        
        const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4);
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const current = Math.floor(easedProgress * target);
            
            // Format number with commas for Arabic
            counter.textContent = current.toLocaleString('ar-EG');
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString('ar-EG');
            }
        };
        
        requestAnimationFrame(updateCounter);
    };
    
    // Observe the statistics section
    const statsSection = document.querySelector('.statistics');
    
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    counters.forEach((counter, index) => {
                        // Stagger the animations
                        setTimeout(() => {
                            animateCounter(counter);
                        }, index * 150);
                    });
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(statsSection);
    }
}

/**
 * ============================================
 * Floating CTA Button
 * Shows/hides based on scroll position
 * ============================================
 */
function initFloatingCTA() {
    const floatingCta = document.getElementById('floatingCta');
    
    if (!floatingCta) return;
    
    let ticking = false;
    
    const handleScroll = () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Show after scrolling past first viewport
        if (scrollY > windowHeight * 0.5) {
            floatingCta.classList.add('visible');
        } else {
            floatingCta.classList.remove('visible');
        }
        
        // Hide near footer
        const footer = document.querySelector('.footer');
        if (footer) {
            const footerRect = footer.getBoundingClientRect();
            if (footerRect.top < windowHeight) {
                floatingCta.classList.remove('visible');
            }
        }
    };
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * ============================================
 * Active Navigation Links
 * Highlights current section in navbar
 * ============================================
 */
function initActiveNavLinks() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!sections.length || !navLinks.length) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * ============================================
 * Parallax Effects for Background Elements
 * ============================================
 */
function initParallaxEffects() {
    const shapes = document.querySelectorAll('.shape, .cta-shape');
    
    if (!shapes.length) return;
    
    let ticking = false;
    
    const handleScroll = () => {
        const scrollY = window.pageYOffset;
        
        shapes.forEach((shape, index) => {
            const speed = 0.03 + (index * 0.01);
            const yPos = scrollY * speed;
            shape.style.transform = `translateY(${yPos}px)`;
        });
    };
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * ============================================
 * Newsletter Form Handler
 * Handles form submission with feedback
 * ============================================
 */
document.addEventListener('submit', (e) => {
    if (e.target.classList.contains('newsletter-form')) {
        e.preventDefault();
        
        const form = e.target;
        const input = form.querySelector('input[type="email"]');
        const button = form.querySelector('button');
        
        if (input && input.value) {
            // Show loading state
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            button.disabled = true;
            
            // Simulate API call (replace with actual implementation)
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-check"></i>';
                input.value = '';
                
                // Reset after 2 seconds
                setTimeout(() => {
                    button.innerHTML = originalHTML;
                    button.disabled = false;
                }, 2000);
            }, 1000);
        }
    }
});

/**
 * ============================================
 * Image Lazy Loading Enhancement
 * ============================================
 */
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    
    if (!images.length) return;
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    }, { rootMargin: '50px' });
    
    images.forEach(img => imageObserver.observe(img));
});

/**
 * ============================================
 * Accessibility Enhancements
 * ============================================
 */
document.addEventListener('keydown', (e) => {
    // Skip to main content on Tab
    if (e.key === 'Tab' && !document.querySelector('.skip-link')) {
        // Add focus visible class for keyboard navigation
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

/**
 * ============================================
 * Performance Monitoring (Development)
 * ============================================
 */
if (process?.env?.NODE_ENV === 'development') {
    // Log performance metrics
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Metrics:', {
                'DNS Lookup': perfData.domainLookupEnd - perfData.domainLookupStart,
                'TCP Connection': perfData.connectEnd - perfData.connectStart,
                'DOM Content Loaded': perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                'Total Load Time': perfData.loadEventEnd - perfData.loadEventStart
            });
        }, 0);
    });
}

/**
 * ============================================
 * Utility Functions
 * ============================================
 */

// Debounce function for performance
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

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * ============================================
 * Console Welcome Message
 * ============================================
 */
console.log(
    '%c🚀 مبادرة شباب بلا حدود',
    'font-size: 24px; font-weight: bold; color: #2E8B57;'
);
console.log(
    '%cنصنع وعياً… ونصنع أثراً لا ينتهي',
    'font-size: 14px; color: #1E90FF;'
);
console.log(
    '%c💚 انضم إلينا وكن جزءاً من التغيير!',
    'font-size: 12px; color: #666;'
);
