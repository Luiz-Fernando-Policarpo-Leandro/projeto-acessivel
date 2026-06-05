document.addEventListener("DOMContentLoaded", () => {
    // 1. Inicializa o Lenis com as configurações de suavidade
    const lenis = new Lenis({
        duration: 1.2, // Tempo do deslize em segundos
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Curva de aceleração suave
        smoothWheel: true
    });

    // 2. Integração com o GSAP (se ele existir na página)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        
        lenis.on('scroll', () => {
            ScrollTrigger.update();
        });
        
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        
        gsap.ticker.lagSmoothing(0);
        
        console.log("Lenis inicializado com integração ao GSAP!");
    } else {
        // 3. Modo nativo para as páginas sem GSAP (Login e Perfil)
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        
        console.log("Lenis inicializado no modo nativo!");
    }
});