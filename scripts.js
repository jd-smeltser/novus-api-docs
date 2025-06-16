// Mobile menu toggle
function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

// Tab functionality
function showTab(tabName) {
    // Hide all tabs in the current container
    const container = event.target.closest('.tab-container');
    const panes = container.querySelectorAll('.tab-pane');
    const buttons = container.querySelectorAll('.tab-button');
    
    panes.forEach(pane => pane.classList.remove('active'));
    buttons.forEach(button => button.classList.remove('active'));
    
    // Show selected tab
    const targetPane = container.querySelector(`#${tabName}`);
    if (targetPane) {
        targetPane.classList.add('active');
        event.target.classList.add('active');
    }
}

// Copy code functionality
function copyCode(button) {
    const codeBlock = button.closest('.code-example').querySelector('code');
    const text = codeBlock.textContent;
    
    // Create temporary textarea
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        
        // Update button text temporarily
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.color = 'var(--color-success)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.color = '';
        }, 2000);
    } catch (err) {
        console.error('Failed to copy text: ', err);
    } finally {
        document.body.removeChild(textarea);
    }
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Handle anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active nav item
                updateActiveNavItem(this.getAttribute('href'));
            }
        });
    });

    // Initialize syntax highlighting
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }

    // Add scroll-based animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observe elements with animate-in class
    document.querySelectorAll('.animate-in, .api-section').forEach(el => {
        observer.observe(el);
    });

    // Set up active nav highlighting
    setupActiveNavigation();
});

// Active nav item highlighting
function updateActiveNavItem(hash) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === hash) {
            item.classList.add('active');
        }
    });
}

function setupActiveNavigation() {
    const sections = document.querySelectorAll('section[id], .api-section[id]');
    const navItems = document.querySelectorAll('.nav-item[href^="#"]');
    
    if (sections.length === 0) return;

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

    // Throttle scroll events for performance
    let ticking = false;
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
    
    // Set initial active state
    updateActiveNav();
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (sidebar && sidebar.classList.contains('open')) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    }
});

// Handle escape key to close mobile menu
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const sidebar = document.getElementById('sidebar');
        if (sidebar && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    }
});

// Add keyboard navigation for tabs
document.addEventListener('keydown', function(e) {
    if (e.target.classList.contains('tab-button')) {
        const buttons = Array.from(e.target.parentElement.querySelectorAll('.tab-button'));
        const currentIndex = buttons.indexOf(e.target);
        
        let targetIndex;
        
        if (e.key === 'ArrowLeft') {
            targetIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
        } else if (e.key === 'ArrowRight') {
            targetIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
        } else if (e.key === 'Home') {
            targetIndex = 0;
        } else if (e.key === 'End') {
            targetIndex = buttons.length - 1;
        }
        
        if (targetIndex !== undefined) {
            e.preventDefault();
            buttons[targetIndex].focus();
            buttons[targetIndex].click();
        }
    }
});

// Enhanced copy functionality with better feedback
function enhancedCopy(button) {
    const codeBlock = button.closest('.code-example').querySelector('code');
    const text = codeBlock.textContent;
    
    // Use modern clipboard API if available
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
    
    button.textContent = 'Copied!';
    button.style.color = 'var(--color-success)';
    button.style.borderColor = 'var(--color-success)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.color = originalColor;
        button.style.borderColor = '';
    }, 2000);
}

function showCopyError(button) {
    const originalText = button.textContent;
    
    button.textContent = 'Error';
    button.style.color = 'var(--color-error)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.color = '';
    }, 2000);
}

// Replace the basic copyCode function with enhanced version
window.copyCode = enhancedCopy;

// Add search functionality (basic implementation)
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    let searchTimeout;
    
    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(e.target.value);
        }, 300);
    });
}

function performSearch(query) {
    if (!query.trim()) {
        clearSearchHighlights();
        return;
    }
    
    const searchableElements = document.querySelectorAll('.content h2, .content h3, .content p, .content li');
    const results = [];
    
    searchableElements.forEach(element => {
        const text = element.textContent.toLowerCase();
        if (text.includes(query.toLowerCase())) {
            results.push(element);
            highlightSearchTerm(element, query);
        }
    });
    
    // Scroll to first result if any
    if (results.length > 0) {
        results[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function highlightSearchTerm(element, term) {
    // Basic highlighting implementation
    const regex = new RegExp(`(${term})`, 'gi');
    const html = element.innerHTML;
    element.innerHTML = html.replace(regex, '<mark style="background-color: yellow;">$1</mark>');
}

function clearSearchHighlights() {
    const highlights = document.querySelectorAll('mark');
    highlights.forEach(mark => {
        mark.outerHTML = mark.innerHTML;
    });
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeSearch);