document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. Efecto Máquina de Escribir (Portada)
    // ==========================================
    const texto = "Bienvenido al Proyecto";
    const elemento = document.getElementById("typewriter");
    let i = 0;

    function escribir() {
        if (elemento && i < texto.length) {
            elemento.innerHTML += texto.charAt(i);
            i++;
            setTimeout(escribir, 80);
        }
    }
    escribir();

    // ==========================================
    // 2. Animación de entrada (Tarjetas Objetivos)
    // ==========================================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, {
        threshold: 0.1
    });

    const tarjetas = document.querySelectorAll('.animar-entrada');
    tarjetas.forEach(tarjeta => observer.observe(tarjeta));

    // ==========================================
    // 3. Lógica del Carrusel Tecnológico (Pasos)
    // ==========================================
    const track = document.getElementById('carousel-track');
    
    if (track) {
        const slides = Array.from(track.children);
        const nextBtn = document.getElementById('btn-next');
        const prevBtn = document.getElementById('btn-prev');
        const indicatorsContainer = document.getElementById('carousel-indicators');
        
        let currentIndex = 0;

        // Crear los puntitos indicadores
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('indicator');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(dot);
        });

        const indicators = Array.from(indicatorsContainer.children);

        // Función para mover el carrusel
        function goToSlide(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            
            track.style.transform = `translateX(-${index * 100}%)`;
            
            indicators.forEach(dot => dot.classList.remove('active'));
            indicators[index].classList.add('active');

            const videos = track.querySelectorAll('video');
            videos.forEach(video => video.pause());

            currentIndex = index;
        }

        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));

        // Reloj de la cámara (Efecto tecnológico)
        setInterval(() => {
            const timeEl = document.getElementById('carousel-time');
            if(timeEl) {
                const now = new Date();
                timeEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
            }
        }, 1000);
    }
});