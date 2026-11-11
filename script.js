console.log('Proyecto Brazo Robótico cargado');

        // 3. Lógica del Carrusel Tecnológico
        const track = document.getElementById('carousel-track');
        const slides = Array.from(track.children);
        const nextBtn = document.getElementById('btn-next');
        const prevBtn = document.getElementById('btn-prev');
        const indicatorsContainer = document.getElementById('carousel-indicators');
        
        let currentIndex = 0;

        // Crear los puntitos indicadores dinámicamente
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
            
            // Actualizar indicadores
            indicators.forEach(dot => dot.classList.remove('active'));
            indicators[index].classList.add('active');

            // Pausar videos si se cambia de slide
            const videos = track.querySelectorAll('video');
            videos.forEach(video => video.pause());

            currentIndex = index;
        }

        // Eventos de los botones
        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));

        // Actualizar el tiempo simulado de la cámara (opcional para el toque tech)
        setInterval(() => {
            const timeEl = document.getElementById('carousel-time');
            if(timeEl) {
                const now = new Date();
                timeEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
            }
        }, 1000);
