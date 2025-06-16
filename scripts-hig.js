// Apple HIG-Inspired Interactions for Documentation
// Focus on effortless, human-centered experiences

// ===== CORE INTERACTION PRINCIPLES =====

/**
 * Mobile menu toggle with smooth animation
 * Principle: Immediate feedback for every action
 */
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const isOpen = sidebar.classList.contains('open');
    
    if (isOpen) {
        sidebar.classList.remove('open');
        // Update aria state for accessibility
        sidebar.setAttribute('aria-hidden', 'true');
    } else {
        sidebar.classList.add('open');
        sidebar.setAttribute('aria-hidden', 'false');
        // Focus management for keyboard users
        const firstNavItem = sidebar.querySelector('.nav-item');
        if (firstNavItem) {
            setTimeout(() => firstNavItem.focus(), 100);
        }
    }
}

/**
 * Progressive disclosure for tabbed content
 * Principle: Show only what users need when they need it
 */
function showTab(tabName) {
    // Find the current tab container
    const container = event.target.closest('.tab-container');
    if (!container) return;
    
    const panes = container.querySelectorAll('.tab-pane');
    const buttons = container.querySelectorAll('.tab-button');
    
    // Hide all tabs with smooth transition
    panes.forEach(pane => {
        pane.classList.remove('active');
        pane.setAttribute('aria-hidden', 'true');
    });
    
    buttons.forEach(button => {
        button.classList.remove('active');
        button.setAttribute('aria-selected', 'false');
    });
    
    // Show selected tab
    const targetPane = container.querySelector(`#${tabName}`);
    if (targetPane) {
        targetPane.classList.add('active');
        targetPane.setAttribute('aria-hidden', 'false');
        event.target.classList.add('active');
        event.target.setAttribute('aria-selected', 'true');
        
        // Gentle scroll to ensure content is visible
        setTimeout(() => {
            targetPane.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 50);
    }
}

/**
 * Enhanced copy functionality with delightful feedback
 * Principle: Forgiving interactions with clear feedback
 */
function copyCode(button) {
    const codeBlock = button.closest('.code-example').querySelector('code');
    const text = codeBlock.textContent;
    
    // Use modern clipboard API with fallback
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showCopySuccess(button);
        }).catch(() => {
            fallbackCopy(text, button);
        });
    } else {
        fallbackCopy(text, button);
    }
}

function fallbackCopy(text, button) {
    // Create temporary textarea off-screen
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess(button);
    } catch (err) {
        console.error('Failed to copy text: ', err);
        showCopyError(button);
    } finally {
        document.body.removeChild(textarea);
    }
}

function showCopySuccess(button) {
    const originalText = button.textContent;
    const originalColor = button.style.color;
    const originalBorder = button.style.borderColor;
    
    // Gentle, encouraging feedback
    button.textContent = 'Copied!';
    button.style.color = 'var(--color-success)';
    button.style.borderColor = 'var(--color-success)';
    button.style.transform = 'scale(1.05)';
    
    // Return to original state with smooth transition
    setTimeout(() => {
        button.style.transition = 'all 0.3s ease';
        button.textContent = originalText;
        button.style.color = originalColor;
        button.style.borderColor = originalBorder;
        button.style.transform = 'scale(1)';
        
        // Clear transition after animation
        setTimeout(() => {
            button.style.transition = '';
        }, 300);
    }, 1500);
}

function showCopyError(button) {
    const originalText = button.textContent;
    
    // Clear, helpful error indication
    button.textContent = 'Error';
    button.style.color = 'var(--color-error)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.color = '';
    }, 2000);
}

// ===== NAVIGATION & SCROLL BEHAVIOR =====

/**
 * Smooth scrolling with proper offset for fixed header
 * Principle: Natural, predictable movement
 */
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerHeight = 80; // Account for fixed header
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active navigation after scroll
                setTimeout(() => {
                    updateActiveNavItem(targetId);
                }, 300);
            }
        });
    });
}

/**
 * Active navigation highlighting with scroll tracking
 * Principle: Clear information hierarchy and current state
 */
function updateActiveNavItem(hash) {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === hash) {
            item.classList.add('active');
        }
    });
}

function setupScrollBasedNavigation() {
    const sections = document.querySelectorAll('section[id], .api-section[id]');
    const navItems = document.querySelectorAll('.nav-item[href^="#"]');
    
    if (sections.length === 0) return;

    let ticking = false;
    
    function updateActiveNav() {
        let current = '';
        const scrollPosition = window.scrollY + 120; // Account for fixed header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    }

    // Throttled scroll handler for performance
    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveNav();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', handleScroll);
    updateActiveNav(); // Set initial state
}

// ===== ACCESSIBILITY & KEYBOARD NAVIGATION =====

/**
 * Enhanced keyboard navigation for tabs
 * Principle: Accessibility as foundation
 */
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (e.target.classList.contains('tab-button')) {
            const buttons = Array.from(e.target.parentElement.querySelectorAll('.tab-button'));
            const currentIndex = buttons.indexOf(e.target);
            
            let targetIndex;
            
            switch(e.key) {
                case 'ArrowLeft':
                    targetIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
                    break;
                case 'ArrowRight':
                    targetIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
                    break;
                case 'Home':
                    targetIndex = 0;
                    break;
                case 'End':
                    targetIndex = buttons.length - 1;
                    break;
            }
            
            if (targetIndex !== undefined) {
                e.preventDefault();
                buttons[targetIndex].focus();
                buttons[targetIndex].click();
            }
        }
    });
}

/**
 * Close mobile menu on outside click or escape
 * Principle: Forgiving interactions
 */
function initializeMenuClosing() {
    // Close on outside click
    document.addEventListener('click', function(e) {
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        
        if (sidebar && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('open');
                sidebar.setAttribute('aria-hidden', 'true');
            }
        }
    });

    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const sidebar = document.getElementById('sidebar');
            if (sidebar && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
                sidebar.setAttribute('aria-hidden', 'true');
                // Return focus to menu toggle
                const menuToggle = document.querySelector('.mobile-menu-toggle');
                if (menuToggle) menuToggle.focus();
            }
        }
    });
}

// ===== VISUAL ENHANCEMENTS & MICRO-INTERACTIONS =====

/**
 * Intersection Observer for fade-in animations
 * Principle: Purposeful motion that guides attention
 */
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                // Stagger animations for multiple elements
                const delay = Math.random() * 100;
                setTimeout(() => {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out';
                    entry.target.classList.add('animated');
                }, delay);
            }
        });
    }, observerOptions);

    // Observe elements that should animate in
    document.querySelectorAll('.animate-in, .api-section, .feature-card').forEach(el => {
        observer.observe(el);
    });
}

/**
 * Enhanced hover states for interactive elements
 * Principle: Immediate feedback for interactions
 */
function initializeHoverEnhancements() {
    // Add subtle hover effects to feature cards
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.transition = 'all 0.2s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add focus styles for keyboard navigation
    document.querySelectorAll('.nav-item, .button, .tab-button').forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--color-primary)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
}

/**
 * Reduce motion for users who prefer it
 * Principle: Respect user preferences
 */
function respectMotionPreferences() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (prefersReducedMotion.matches) {
        // Disable animations for users who prefer reduced motion
        const style = document.createElement('style');
        style.textContent = `
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====

/**
 * Lazy load syntax highlighting
 * Principle: Performance as experience
 */
function initializeSyntaxHighlighting() {
    if (typeof Prism !== 'undefined') {
        // Only highlight visible code blocks initially
        const codeBlocks = document.querySelectorAll('pre code');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('highlighted')) {
                    Prism.highlightElement(entry.target);
                    entry.target.classList.add('highlighted');
                    observer.unobserve(entry.target);
                }
            });
        });

        codeBlocks.forEach(block => observer.observe(block));
    }
}

/**
 * Preload critical navigation targets
 * Principle: Anticipate user needs
 */
function preloadCriticalPages() {
    const criticalLinks = document.querySelectorAll('a[href$=".html"]');
    
    criticalLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const href = this.getAttribute('href');
            if (href && !document.querySelector(`link[href="${href}"]`)) {
                const preloadLink = document.createElement('link');
                preloadLink.rel = 'prefetch';
                preloadLink.href = href;
                document.head.appendChild(preloadLink);
            }
        });
    });
}

// ===== INITIALIZATION =====

/**
 * Initialize all interactions when DOM is ready
 * Principle: Progressive enhancement
 */
document.addEventListener('DOMContentLoaded', function() {
    // Core functionality
    initializeSmoothScrolling();
    setupScrollBasedNavigation();
    
    // Accessibility
    initializeKeyboardNavigation();
    initializeMenuClosing();
    
    // Visual enhancements
    initializeScrollAnimations();
    initializeHoverEnhancements();
    
    // Performance
    initializeSyntaxHighlighting();
    preloadCriticalPages();
    
    // User preferences
    respectMotionPreferences();
    
    // Set initial ARIA states
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.setAttribute('aria-hidden', 'true');
    }
    
    // Initialize tab ARIA states
    document.querySelectorAll('.tab-button').forEach((button, index) => {
        button.setAttribute('role', 'tab');
        button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
    });
    
    document.querySelectorAll('.tab-pane').forEach((pane, index) => {
        pane.setAttribute('role', 'tabpanel');
        pane.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
    });
});

// ===== EXPOSED GLOBAL FUNCTIONS =====
// These need to be global for onclick handlers in HTML

window.toggleMobileMenu = toggleMobileMenu;
window.showTab = showTab;
window.copyCode = copyCode;