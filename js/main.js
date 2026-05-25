// main.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // 2. Intersection Observer for scroll-reveal animations
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 3. Intersection Observer for active nav links
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

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
        
        // Track mouse position
        let mouse = { x: width / 2, y: height / 2 };
        // Array to store previous positions for the trail
        let points = [];
        const MAX_POINTS = 20;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            
            // Add new point
            points.push({ x: mouse.x, y: mouse.y, age: 0 });
            if (points.length > MAX_POINTS) {
                points.shift(); // Remove oldest point
            }
        });

        function animate() {
            ctx.clearRect(0, 0, width, height);

            // Draw the trail
            for (let i = 0; i < points.length; i++) {
                const p = points[i];
                p.age += 1;
                
                // Calculate opacity based on age (fades out)
                const life = 1 - (p.age / 30); // 30 frames lifetime roughly
                
                if (life > 0) {
                    const radius = 150 * life; // Size shrinks slightly
                    
                    // Create radial gradient for the heat effect
                    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
                    
                    // Warm amber/green mix
                    // Using rgba to allow transparency
                    gradient.addColorStop(0, `rgba(212, 168, 67, ${0.1 * life})`); // Amber center
                    gradient.addColorStop(0.5, `rgba(58, 107, 82, ${0.05 * life})`); // Green mid
                    gradient.addColorStop(1, 'rgba(20, 20, 24, 0)'); // Transparent edge (matches bg roughly)

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
                    ctx.fillStyle = gradient;
                    ctx.fill();
                }
            }
            
            // Remove dead points
            points = points.filter(p => p.age < 30);

            requestAnimationFrame(animate);
        }

        animate();
    }
});
