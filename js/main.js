// main.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Set current year in footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // 2. Intersection Observer for scroll-reveal animations
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 3. Navigation Logic
    const nav = document.querySelector('.nav');
    const navToggle = document.querySelector('.nav__toggle');
    const navLinksList = document.querySelector('.nav__links');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav__link');

    // Mobile Menu Toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navLinksList.classList.toggle('open');
            document.body.style.overflow = navLinksList.classList.contains('open') ? 'hidden' : '';
        });
    }

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle?.classList.remove('open');
            navLinksList?.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // Scroll Background Change
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Intersection Observer for active nav links
    const navOptions = {
        threshold: 0.3,
        rootMargin: "-100px 0px -100px 0px"
    };

    const navObserver = new IntersectionObserver((entries) => {
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
    }, navOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // 4. Canvas Cursor Heat Trail
    const canvas = document.getElementById('cursor-canvas');
    if (canvas && window.matchMedia("(pointer: fine)").matches) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        let mouse = { x: width / 2, y: height / 2 };
        let points = [];
        const MAX_POINTS = 24;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            
            points.push({ x: mouse.x, y: mouse.y, age: 0 });
            if (points.length > MAX_POINTS) {
                points.shift();
            }
        });

        function animate() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < points.length; i++) {
                const p = points[i];
                p.age += 1;
                
                const life = 1 - (p.age / 40);
                
                if (life > 0) {
                    const radius = 180 * life;
                    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
                    
                    gradient.addColorStop(0, `rgba(212, 168, 67, ${0.12 * life})`); 
                    gradient.addColorStop(0.4, `rgba(58, 107, 82, ${0.06 * life})`);
                    gradient.addColorStop(1, 'rgba(20, 20, 24, 0)');

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
                    ctx.fillStyle = gradient;
                    ctx.fill();
                }
            }
            
            points = points.filter(p => p.age < 40);
            requestAnimationFrame(animate);
        }

        animate();
    }
});
