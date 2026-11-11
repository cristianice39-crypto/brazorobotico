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
    }, { threshold: 0.1 });

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

/* =========================================================
   RED NEURONAL DE FONDO + INFORMES
   He eliminado un bloque de código antiguo que causaba un error
   y ajustado los colores para que se vean mejor.
   ========================================================= */
(function () {
  'use strict';

  var RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------- Red de fondo: canvas fijo detrás de la página ---------- */
  var cv = document.createElement('canvas');
  cv.className = 'rn-fondo';
  cv.setAttribute('aria-hidden', 'true');
  document.body.insertBefore(cv, document.body.firstChild);
  var ctx = cv.getContext('2d');

  /* La red empieza donde termina la portada (si no existe, en "Pasos") */
  var hero = document.querySelector('.hero-ingenieria');
  var pasos = document.getElementById('pasos');
  function inicioY() {
    if (hero) return hero.getBoundingClientRect().bottom;
    if (pasos) return pasos.getBoundingClientRect().top;
    return 0;
  }

  /* Para que el fondo se vea, la página y las secciones del mismo color
     no deben tapar el canvas. */
  function opaco(c) {
    var m = c && c.match(/rgba?\(([^)]+)\)/);
    if (!m) return false;
    var p = m[1].split(',');
    return p.length < 4 || parseFloat(p[3]) > 0;
  }
  
  function prepararFondos() {
    try {
      var cb = getComputedStyle(document.body).backgroundColor;
      var ch = getComputedStyle(document.documentElement).backgroundColor;
      
      // Movemos el color de fondo del body al html para que el canvas se vea
      if (opaco(cb)) {
        document.documentElement.style.backgroundColor = cb;
        document.body.style.backgroundColor = 'transparent';
      }
      var base = opaco(cb) ? cb : ch;
      
      // Hacemos transparentes las secciones que impidan ver el fondo
      [].forEach.call(document.querySelectorAll('.seccion, .rn-red'), function (s) {
        var cs = getComputedStyle(s);
        if (opaco(cs.backgroundColor) && cs.backgroundColor === base && cs.backgroundImage === 'none') {
          s.style.backgroundColor = 'transparent';
        }
      });
    } catch (e) { /* si algo falla, la página queda como estaba */ }
  }
  prepararFondos();

  var W = 0, H = 0, dpr = 1;
  var nodos = [], anchors = [], pulsos = [];
  var raf = 0, corriendo = false, ultimo = 0, pendiente = false;
  var mx = -999, my = -999;

  function crearNodos() {
    var n = Math.max(30, Math.min(95, Math.round(W * H / 13000)));
    nodos = [];
    for (var i = 0; i < n; i++) {
      nodos.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: 1.5 + Math.random() * 1.5 // Puntos un poco más grandes
      });
    }
  }
  function medir() {
    var w = window.innerWidth, h = window.innerHeight;
    var cambioGrande = !nodos.length || w !== W || Math.abs(h - H) > 150;
    W = w; H = h;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (cambioGrande) crearNodos();
    else nodos.forEach(function (n) { if (n.y > H) n.y = Math.random() * H; });
  }

  function leerAnclas(y0) {
    var pins = document.querySelectorAll('.rn-pin');
    anchors = [];
    for (var i = 0; i < pins.length; i++) {
      var b = pins[i].getBoundingClientRect();
      var x = b.left + b.width / 2, y = b.top + b.height / 2;
      anchors.push({ x: x, y: y, on: !pins[i].classList.contains('rn-pin--off'), v: y > y0 && y < H && x > 0 && x < W });
    }
  }
  function aristas() {
    var e = [];
    for (var i = 0; i < anchors.length; i++) {
      for (var j = i + 1; j < anchors.length; j++) {
        if (anchors[i].v && anchors[j].v && (i === 0 || j - i === 1)) e.push([i, j]);
      }
    }
    return e;
  }
  function lanzar() {
    var e = aristas();
    if (!e.length) return;
    var par = e[(Math.random() * e.length) | 0], rev = Math.random() < 0.5;
    pulsos.push({ a: rev ? par[1] : par[0], b: rev ? par[0] : par[1], t: 0, v: 0.007 + Math.random() * 0.006 });
  }
  function rafaga(origen, volver) {
    for (var j = 0; j < anchors.length; j++) {
      if (j === origen || !anchors[j].v) continue;
      pulsos.push(volver ? { a: j, b: origen, t: 0, v: 0.016 } : { a: origen, b: j, t: 0, v: 0.016 });
    }
  }
  function dibujarPulso(p) {
    var a = anchors[p.a], b = anchors[p.b];
    if (!a || !b || !a.v || !b.v) return;
    var x = a.x + (b.x - a.x) * p.t, y = a.y + (b.y - a.y) * p.t;
    var tt = Math.max(0, p.t - 0.09);
    var x0 = a.x + (b.x - a.x) * tt, y0 = a.y + (b.y - a.y) * tt;
    var g = ctx.createLinearGradient(x0, y0, x, y);
    // Color amarillo/dorado de tu tema para los pulsos
    g.addColorStop(0, 'rgba(242,183,5,0)');
    g.addColorStop(1, 'rgba(230,165,0,.95)');
    ctx.strokeStyle = g; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y); ctx.stroke();
    ctx.fillStyle = '#f2b705'; ctx.strokeStyle = 'rgba(22,22,22,.75)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(x, y, 3.4, 0, 6.2832); ctx.fill(); ctx.stroke();
  }

  function dibujar(t, mover) {
    ctx.clearRect(0, 0, W, H);
    var y0 = Math.max(0, Math.min(H, inicioY()));
    if (mover) {
      for (var k = 0; k < nodos.length; k++) {
        var q = nodos[k];
        q.x += q.vx; q.y += q.vy;
        if (q.x < 0 || q.x > W) q.vx *= -1;
        if (q.y < 0 || q.y > H) q.vy *= -1;
      }
    }
    if (y0 >= H) { pulsos.length = 0; return; }

    ctx.save();
    ctx.beginPath(); ctx.rect(0, y0, W, H - y0); ctx.clip();
    leerAnclas(y0);

    var i, j, a, b, dx, dy, d;
    for (i = 0; i < nodos.length; i++) {
      a = nodos[i];
      // Color más oscuro y visible para los nodos
      ctx.fillStyle = 'rgba(50,50,50,.6)';
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.2832); ctx.fill();

      for (j = i + 1; j < nodos.length; j++) {
        b = nodos[j]; dx = a.x - b.x; dy = a.y - b.y; d = Math.sqrt(dx * dx + dy * dy);
        if (d < 130) {
          // Líneas grises más visibles
          ctx.strokeStyle = 'rgba(50,50,50,' + (0.25 * (1 - d / 130)).toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      dx = a.x - mx; dy = a.y - my; d = Math.sqrt(dx * dx + dy * dy);
      if (d < 160) {
        // Línea interactiva del mouse en color amarillo
        ctx.strokeStyle = 'rgba(214,150,0,' + (0.8 * (1 - d / 160)).toFixed(3) + ')';
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mx, my); ctx.stroke();
      }
    }

    var ar = aristas();
    for (i = 0; i < ar.length; i++) {
      a = anchors[ar[i][0]]; b = anchors[ar[i][1]];
      ctx.strokeStyle = (a.on && b.on) ? 'rgba(214,150,0,.6)' : 'rgba(50,50,50,.15)';
      ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    for (i = 0; i < anchors.length; i++) {
      a = anchors[i];
      if (!a.v) continue;
      for (j = 0; j < nodos.length; j++) {
        b = nodos[j]; dx = a.x - b.x; dy = a.y - b.y; d = Math.sqrt(dx * dx + dy * dy);
        if (d < 180) {
          ctx.strokeStyle = (a.on ? 'rgba(214,150,0,' : 'rgba(50,50,50,') + ((a.on ? 0.5 : 0.2) * (1 - d / 180)).toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      ctx.fillStyle = a.on ? 'rgba(242,183,5,.3)' : 'rgba(50,50,50,.08)';
      ctx.beginPath(); ctx.arc(a.x, a.y, 17, 0, 6.2832); ctx.fill();
    }

    if (mover) {
      if (t - ultimo > 850) { lanzar(); ultimo = t; }
      for (i = pulsos.length - 1; i >= 0; i--) {
        pulsos[i].t += pulsos[i].v;
        if (pulsos[i].t >= 1) pulsos.splice(i, 1);
        else dibujarPulso(pulsos[i]);
      }
    }
    ctx.restore();
  }

  function ciclo(t) {
    if (!corriendo) return;
    dibujar(t, true);
    raf = requestAnimationFrame(ciclo);
  }
  function actualizarEstado() {
    var debe = !document.hidden && !RM;
    if (debe && !corriendo) { corriendo = true; raf = requestAnimationFrame(ciclo); }
    else if (!debe && corriendo) { corriendo = false; cancelAnimationFrame(raf); }
  }
  function pedirDibujo() {
    if (corriendo || pendiente) return;
    pendiente = true;
    requestAnimationFrame(function () { pendiente = false; dibujar(0, false); });
  }

  window.addEventListener('pointermove', function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
  document.documentElement.addEventListener('mouseleave', function () { mx = -999; my = -999; });
  window.addEventListener('resize', function () { medir(); pedirDibujo(); });
  window.addEventListener('scroll', pedirDibujo, { passive: true });
  document.addEventListener('visibilitychange', actualizarEstado);

  medir();
  dibujar(0, false);
  actualizarEstado();

  /* ---------- Sección de informes ---------- */
  var red = document.getElementById('rn-red');
  if (!red) return;
  red.classList.add('rn-js');

  function contar(nodo) {
    if (RM) return;
    var els = nodo.querySelectorAll('[data-rn-n]');
    if (!els.length) return;
    var t0 = performance.now();
    (function paso(t) {
      var p = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - p, 3);
      for (var i = 0; i < els.length; i++) {
        els[i].textContent = Math.round(parseFloat(els[i].getAttribute('data-rn-n')) * e);
      }
      if (p < 1) requestAnimationFrame(paso);
    })(t0);
  }
  function revelar(nodo) { nodo.classList.add('rn-in'); contar(nodo); }

  var tarjetas = [].slice.call(red.querySelectorAll('.rn-nodo'));
  if ('IntersectionObserver' in window && !RM) {
    var io = new IntersectionObserver(function (items) {
      items.forEach(function (it) {
        if (it.isIntersecting) { revelar(it.target); io.unobserve(it.target); }
      });
    }, { threshold: 0.15 });
    tarjetas.forEach(function (t) { io.observe(t); });
  } else {
    tarjetas.forEach(revelar);
  }

  /* ---------- Botones de descarga ---------- */
  function enlazarBoton(btn) {
    var txt = btn.querySelector('.rn-txt');
    var pct = btn.querySelector('.rn-pct');
    var original = txt.textContent;
    var ocupado = false;

    function indice() {
      var pins = [].slice.call(document.querySelectorAll('.rn-pin'));
      var tarjeta = btn.closest('.rn-nodo');
      return pins.indexOf(tarjeta ? tarjeta.querySelector('.rn-pin') : null);
    }
    function terminar() {
      var a = document.createElement('a');
      a.href = btn.getAttribute('href');
      a.download = btn.getAttribute('download') || '';
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();

      btn.classList.remove('rn-bajando');
      btn.classList.add('rn-ok');
      txt.textContent = 'Descarga completa';
      pct.textContent = '';
      var k = indice();
      if (k >= 0) rafaga(k, true);

      setTimeout(function () {
        btn.classList.remove('rn-ok');
        btn.style.setProperty('--rn-p', 0);
        txt.textContent = original;
        ocupado = false;
      }, 3200);
    }
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (ocupado) return;
      ocupado = true;
      btn.classList.remove('rn-ok');
      btn.classList.add('rn-bajando');
      txt.textContent = 'Descargando';
      var k = indice();
      if (k >= 0) rafaga(k, false);

      var t0 = performance.now(), D = RM ? 200 : 1900;
      (function paso(t) {
        var p = Math.min(1, (t - t0) / D);
        btn.style.setProperty('--rn-p', p);
        pct.textContent = Math.round(p * 100) + '%';
        if (p < 1) requestAnimationFrame(paso);
        else terminar();
      })(t0);
    });
  }
  [].slice.call(red.querySelectorAll('[data-rn-descarga]')).forEach(enlazarBoton);
})();