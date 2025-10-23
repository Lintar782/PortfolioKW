// --- GSAP Setup ---
gsap.registerPlugin(ScrollTrigger, Draggable);

// 1. Header Scroll Effect (Glassmorphism)
const header = document.getElementById('main-header');
ScrollTrigger.create({
    trigger: "body",
    start: "top -50", // Setelah scroll 50px
    onEnter: () => header.classList.add('scrolled'),
    onLeaveBack: () => header.classList.remove('scrolled'),
});

// 2. Smooth Scroll CTA
document.querySelector('.cta-explore').addEventListener('click', (e) => {
    e.preventDefault();
    // Animasi GSAP untuk scroll halus ke Projects section
    gsap.to(window, { duration: 1.5, scrollTo: "#projects", ease: "power3.inOut" });

    // Animasi Three.js object saat user scroll (parallaksi)
    if (window.icosahedron) {
         gsap.to(window.icosahedron.position, { 
             duration: 1.5, 
             y: -5, // Bergerak ke bawah saat scroll
             ease: "power3.inOut" 
         });
    }
});

// 3. Project Card Tilt 3D Microinteraction
document.querySelectorAll('.projects-grid .project-tile').forEach(card => {
    
    // Mouse Move (Tilt Effect)
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Hitung persentase posisi mouse (-1 hingga 1)
        const xFactor = (e.clientX - centerX) / rect.width;
        const yFactor = (e.clientY - centerY) / rect.height;
        
        // Tilt maksimal 5 derajat
        const tiltY = xFactor * 5; 
        const tiltX = yFactor * -5;
        
        // Terapkan Transformasi 3D menggunakan GSAP
        gsap.to(card, { 
            transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
            ease: "power1.out",
            duration: 0.4
        });
        
        // Efek Glow (Shadow) mengikuti mouse
        const shadowIntensity = Math.abs(xFactor) + Math.abs(yFactor) + 0.5;
        gsap.to(card, {
            boxShadow: `0 0 ${shadowIntensity * 10}px rgba(0, 198, 255, 0.4)`,
            duration: 0.2
        });
    });
    
    // Mouse Leave (Reset)
    card.addEventListener('mouseleave', () => {
        gsap.to(card, { 
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)', 
            boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
            duration: 0.8,
            ease: "elastic.out(1, 0.5)" // Efek pegas halus
        });
    });
});

// 4. Scroll-Triggered Fade-In Animations
gsap.utils.toArray('.content-section').forEach((section, i) => {
    // Skip Hero Section
    if (i === 0) return; 

    gsap.from(section.children, {
        scrollTrigger: {
            trigger: section,
            start: "top 80%", // Mulai animasi saat section masuk 80% viewport
            toggleActions: "play none none none"
        },
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.2, // Teks muncul satu per satu
        ease: "power2.out"
    });
});