/* ═══════════════════════════════════════════
   FLAME OF NARAKA — Scripts
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── LOADER ───
    const loader = document.getElementById('loader');
    const loaderBar = document.getElementById('loaderBar');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress > 100) progress = 100;
        
        loaderBar.style.width = `${progress}%`;
        
        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('is-hidden');
            }, 400);
        }
    }, 100);

    // Safety fallback
    setTimeout(() => {
        if (!loader.classList.contains('is-hidden')) {
            clearInterval(interval);
            loaderBar.style.width = '100%';
            loader.classList.add('is-hidden');
        }
    }, 3000);


    // ─── SCROLL PROGRESS ───
    const scrollProgress = document.getElementById('scrollProgress');
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + '%';
    }, { passive: true });


    // ─── NAVBAR & MOBILE MENU ───
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav__link');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('is-scrolled');
        } else {
            nav.classList.remove('is-scrolled');
        }
    }, { passive: true });

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('is-active');
            navMenu.classList.toggle('is-open');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('is-open')) {
                navToggle.classList.remove('is-active');
                navMenu.classList.remove('is-open');
            }
        });
    });


    // ─── SMOOTH SCROLLING ───
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ─── ACTIVE NAV LINK ON SCROLL ───
    const sections = document.querySelectorAll('section, header');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });


    // ─── INTERSECTION OBSERVER ANIMATIONS ───
    const animElements = document.querySelectorAll('.anim');
    
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                animObserver.unobserve(entry.target); // trigger once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    animElements.forEach(el => animObserver.observe(el));


    // ─── NUMBER COUNTERS ───
    const statNumbers = document.querySelectorAll('[data-count]');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                const suffix = el.getAttribute('data-suffix') || '';
                
                if (isNaN(target)) return;

                let current = 0;
                const duration = 2000;
                const startTime = performance.now();

                function updateCounter(now) {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                    
                    current = Math.floor(easeOutQuart * target);
                    el.textContent = current + suffix;
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.textContent = target + suffix; // ensure exact match
                    }
                }
                requestAnimationFrame(updateCounter);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));


    // ─── CANVAS ENHANCEMENT (Subtle red ash/embers) ───
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * -1 - 0.5; // move UP mostly
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.size > 0.2) this.size -= 0.005;
            if (this.y < 0 || this.x < 0 || this.x > canvas.width) {
                this.y = canvas.height;
                this.x = Math.random() * canvas.width;
                this.size = Math.random() * 2 + 0.5;
            }
        }
        draw() {
            ctx.fillStyle = `rgba(216, 0, 26, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    function initCanvas() {
        particlesArray = [];
        const numParticles = (canvas.width * canvas.height) / 15000;
        for (let i = 0; i < numParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    
    function animateCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateCanvas);
    }
    
    initCanvas();
    animateCanvas();

});
