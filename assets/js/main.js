
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});


function initializeApp() {
    initHeaderHeightVar();
    initNavigation();
    initScrollEffects();
    initAnimations();
    initAccessibility();
    initPerformanceOptimizations();
    initActiveNavigation();
}


function initHeaderHeightVar() {
    const header = document.querySelector('.header');
    function setHeaderHeightVar() {
        if (!header) return;
        const h = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', h + 'px');
    }
    setHeaderHeightVar();
    window.addEventListener('resize', debounce(setHeaderHeightVar, 150));
}


function initNavigation() {
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');

    
    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', function() {
            const isExpanded = navbarToggle.getAttribute('aria-expanded') === 'true';
            navbarToggle.setAttribute('aria-expanded', !isExpanded);
            navbarMenu.classList.toggle('active');
            
            
            navbarToggle.classList.toggle('active');
        });
    }

    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarMenu.classList.contains('active')) {
                navbarMenu.classList.remove('active');
                navbarToggle.setAttribute('aria-expanded', 'false');
                navbarToggle.classList.remove('active');
            }
        });
    });

    
    document.addEventListener('click', function(e) {
        if (!navbarToggle.contains(e.target) && !navbarMenu.contains(e.target)) {
            navbarMenu.classList.remove('active');
            navbarToggle.setAttribute('aria-expanded', 'false');
            navbarToggle.classList.remove('active');
        }
    });

    
    if (header) {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', throttle(function() {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollY = currentScrollY;
        }, 100));
    }

    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                
                // Atualizar menu ativo imediatamente
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
                
                // Scroll suave para a seção com offset para o header
                const headerHeight = document.querySelector('.header')?.offsetHeight || 88;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}


function initScrollEffects() {
    
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

    
    const animateElements = document.querySelectorAll('.sensor-card, .cert-card, .building-card, .policy-card, .infra-card, .benefit-item, .saving-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    
    const hero = document.querySelector('.hero');
    if (hero) {
        // Parallax desativado para evitar deslocamento do topo
        // hero.style.transform = '';
    }
}


function initAnimations() {
    
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    
    initFloatingCardsAnimation();

    
    const gridItems = document.querySelectorAll('.sensor-card, .cert-card, .building-card, .policy-card, .infra-card');
    gridItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
}


function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        
        if (target >= 1000) {
            element.textContent = Math.floor(current).toLocaleString();
        } else if (target < 1) {
            element.textContent = current.toFixed(1);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}


function initAccessibility() {
    
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.focus();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    
    const interactiveCards = document.querySelectorAll('.sensor-card, .cert-card, .building-card, .policy-card, .infra-card');
    interactiveCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    
    const navbarToggle = document.querySelector('.navbar-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');
    
    if (navbarToggle && navbarMenu) {
        navbarToggle.addEventListener('click', function() {
            if (navbarMenu.classList.contains('active')) {
                // Focus first menu item when opening
                const firstMenuItem = navbarMenu.querySelector('.nav-link');
                if (firstMenuItem) {
                    setTimeout(() => firstMenuItem.focus(), 100);
                }
            }
        });
    }

    
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);

    window.announceToScreenReader = function(message) {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    };
}


function initPerformanceOptimizations() {
    
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    
    preloadCriticalResources();
}


function preloadCriticalResources() {
    const criticalImages = [
        'assets/images/hero-bg.jpg',
        'assets/images/smart-city-concept.jpg'
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}


function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}


window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    
});


if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}


function initFloatingCardsAnimation() {
    const floatingCards = document.querySelectorAll('.floating-card');
    
    if (floatingCards.length === 0) return;
    
    // Configurações para cada card
    const cardConfigs = [
        { amplitude: 20, frequency: 0.8, phase: 0, speed: 1.2 },
        { amplitude: 25, frequency: 0.6, phase: Math.PI / 2, speed: 0.9 },
        { amplitude: 18, frequency: 1.0, phase: Math.PI, speed: 1.5 },
        { amplitude: 22, frequency: 0.7, phase: 3 * Math.PI / 2, speed: 1.1 }
    ];
    
    let animationId;
    let startTime = Date.now();
    
    function animateCards() {
        const elapsed = (Date.now() - startTime) / 1000; // tempo em segundos
        
        floatingCards.forEach((card, index) => {
            const config = cardConfigs[index] || cardConfigs[0];
            
            // Movimento vertical principal
            const verticalOffset = Math.sin(elapsed * config.frequency + config.phase) * config.amplitude;
            
            // Movimento horizontal sutil
            const horizontalOffset = Math.cos(elapsed * config.frequency * 0.5 + config.phase) * 8;
            
            // Rotação sutil
            const rotation = Math.sin(elapsed * config.frequency * 0.3 + config.phase) * 3;
            
            // Escala dinâmica
            const scale = 1 + Math.sin(elapsed * config.frequency * 0.4 + config.phase) * 0.05;
            
            // Aplicar transformações
            card.style.transform = `
                translateY(${verticalOffset}px) 
                translateX(${horizontalOffset}px) 
                rotate(${rotation}deg) 
                scale(${scale})
            `;
            
            // Opacidade fixa para melhor visibilidade
            card.style.opacity = 1;
        });
        
        animationId = requestAnimationFrame(animateCards);
    }
    
    // Iniciar animação
    animateCards();
    
    // Pausar animação quando a página não está visível (performance)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            startTime = Date.now() - (Date.now() - startTime); // Ajustar tempo
            animateCards();
        }
    });
    
    // Adicionar efeitos de hover mais dinâmicos
    floatingCards.forEach((card, index) => {
        let hoverAnimationId;
        
        card.addEventListener('mouseenter', function() {
            const originalTransform = card.style.transform;
            
            function hoverAnimate() {
                const time = Date.now() / 1000;
                const hoverScale = 1.1 + Math.sin(time * 8) * 0.05;
                const hoverRotation = Math.sin(time * 6) * 5;
                
                card.style.transform = originalTransform + ` scale(${hoverScale}) rotate(${hoverRotation}deg)`;
                card.style.background = `rgba(255, 255, 255, ${0.4 + Math.sin(time * 4) * 0.05})`;
                
                hoverAnimationId = requestAnimationFrame(hoverAnimate);
            }
            
            hoverAnimate();
        });
        
        card.addEventListener('mouseleave', function() {
            cancelAnimationFrame(hoverAnimationId);
            card.style.background = 'rgba(255, 255, 255, 0.25)';
        });
    });
}

function initActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const sections = document.querySelectorAll('section[id]');
    
    if (navLinks.length === 0 || sections.length === 0) return;
    
    let isScrolling = false;
    let scrollTimeout;
    
    // Função para atualizar o menu ativo baseado no scroll
    function updateActiveNav() {
        if (isScrolling) return; // Não atualizar se estiver fazendo scroll programático
        
        const headerHeight = document.querySelector('.header')?.offsetHeight || 88;
        const scrollPos = window.scrollY + headerHeight + 50; // Offset maior para melhor detecção
        
        let currentSection = '';
        let closestSection = '';
        let closestDistance = Infinity;
        
        // Encontrar a seção atual baseada na posição do scroll
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;
            
            // Se a seção está visível na tela
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                currentSection = section.getAttribute('id');
            }
            
            // Calcular distância para encontrar a mais próxima
            const distance = Math.abs(scrollPos - sectionTop);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestSection = section.getAttribute('id');
            }
        });
        
        // Se não encontrou nenhuma seção visível, usar a mais próxima
        if (!currentSection) {
            currentSection = closestSection;
        }
        
        // Remover classe active de todos os links
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Adicionar classe active ao link correspondente
        if (currentSection) {
            const activeLink = document.querySelector(`.nav-link[href="#${currentSection}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }
    
    // Detectar quando o scroll programático termina
    window.addEventListener('scroll', function() {
        isScrolling = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            isScrolling = false;
            updateActiveNav();
        }, 200); // Aumentei o timeout para dar mais tempo
    });
    
    // Atualizar na inicialização
    updateActiveNav();
    
    // Atualizar no resize da janela
    window.addEventListener('resize', debounce(updateActiveNav, 150));
}

window.FuturoDasCidades = {
    animateCounter,
    throttle,
    debounce,
    announceToScreenReader: window.announceToScreenReader,
    initFloatingCardsAnimation,
    initActiveNavigation
};

