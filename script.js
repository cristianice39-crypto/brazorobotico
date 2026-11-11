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

/* =========================================================
   INFORMES // RED NEURONAL
   Pega todo esto al final de tu script.js.
   Va dentro de su propia función, así que no choca con tus variables.
   ========================================================= */
(function () {
  'use strict';

  var red = document.getElementById('rn-red');
  if (!red) return;

  var cv = red.querySelector('.rn-canvas');
  var ctx = cv.getContext('2d');
  var RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  red.classList.add('rn-js');

  /* ---------- Aparición de las tarjetas y conteo de cifras ---------- */
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
  function revelar(nodo) {
    nodo.classList.add('rn-in');
    contar(nodo);
  }
  var tarjetas = [].slice.call(red.querySelectorAll('.rn-nodo'));
  if ('IntersectionObserver' in window && !RM) {
    var ioT = new IntersectionObserver(function (items) {
      items.forEach(function (it) {
        if (it.isIntersecting) { revelar(it.target); ioT.unobserve(it.target); }
      });
    }, { threshold: 0.15 });
    tarjetas.forEach(function (t) { ioT.observe(t); });
  } else {
    tarjetas.forEach(revelar);
  }

  /* ---------- Red neuronal en el fondo ---------- */
  var W = 0, H = 0, dpr = 1;
  var nodos = [], anchors = [], pulsos = [];
  var raf = 0, corriendo = false, visible = true, ultimo = 0;
  var mx = -999, my = -999;

  function medir() {
    var r = red.getBoundingClientRect();
    W = r.width; H = r.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var n = Math.max(26, Math.min(90, Math.round(W * H / 16000)));
    nodos = [];
    for (var i = 0; i < n; i++) {
      nodos.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: 1 + Math.random() * 1.4
      });
    }
  }

  function leerAnclas() {
    var rr = red.getBoundingClientRect();
    var pins = red.querySelectorAll('.rn-pin');
    anchors = [];
    for (var i = 0; i < pins.length; i++) {
      var b = pins[i].getBoundingClientRect();
      anchors.push({
        x: b.left - rr.left + b.width / 2,
        y: b.top - rr.top + b.height / 2,
        on: !pins[i].classList.contains('rn-pin--off')
      });
    }
  }

  function aristas() {
    var e = [];
    for (var i = 0; i < anchors.length; i++) {
      for (var j = i + 1; j < anchors.length; j++) {
        if (i === 0 || j - i === 1) e.push([i, j]);
      }
    }
    return e;
  }

  function lanzar() {
    var e = aristas();
    if (!e.length) return;
    var par = e[(Math.random() * e.length) | 0];
    var rev = Math.random() < 0.5;
    pulsos.push({ a: rev ? par[1] : par[0], b: rev ? par[0] : par[1], t: 0, v: 0.007 + Math.random() * 0.006 });
  }

  function rafaga(origen, volver) {
    for (var j = 0; j < anchors.length; j++) {
      if (j === origen) continue;
      if (volver) pulsos.push({ a: j, b: origen, t: 0, v: 0.016 });
      else pulsos.push({ a: origen, b: j, t: 0, v: 0.016 });
    }
  }

  function dibujarPulso(p) {
    var a = anchors[p.a], b = anchors[p.b];
    if (!a || !b) return;
    var x = a.x + (b.x - a.x) * p.t, y = a.y + (b.y - a.y) * p.t;
    var tt = Math.max(0, p.t - 0.09);
    var x0 = a.x + (b.x - a.x) * tt, y0 = a.y + (b.y - a.y) * tt;
    var g = ctx.createLinearGradient(x0, y0, x, y);
    g.addColorStop(0, 'rgba(0,255,204,0)');
    g.addColorStop(1, 'rgba(0,255,204,.95)');
    ctx.strokeStyle = g;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x, y); ctx.stroke();
    ctx.fillStyle = '#c4fff0';
    ctx.beginPath(); ctx.arc(x, y, 2.6, 0, 6.2832); ctx.fill();
  }

  function dibujar(t, mover) {
    ctx.clearRect(0, 0, W, H);
    leerAnclas();

    var i, j, a, b, dx, dy, d;
    for (i = 0; i < nodos.length; i++) {
      a = nodos[i];
      if (mover) {
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > W) a.vx *= -1;
        if (a.y < 0 || a.y > H) a.vy *= -1;
      }
      ctx.fillStyle = 'rgba(0,255,204,.8)';
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.2832); ctx.fill();

      for (j = i + 1; j < nodos.length; j++) {
        b = nodos[j]; dx = a.x - b.x; dy = a.y - b.y; d = Math.sqrt(dx * dx + dy * dy);
        if (d < 120) {
          ctx.strokeStyle = 'rgba(0,255,204,' + (0.32 * (1 - d / 120)).toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }

      dx = a.x - mx; dy = a.y - my; d = Math.sqrt(dx * dx + dy * dy);
      if (d < 150) {
        ctx.strokeStyle = 'rgba(56,182,255,' + (0.75 * (1 - d / 150)).toFixed(3) + ')';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mx, my); ctx.stroke();
      }
    }

    /* Conexiones entre los nodos de informes */
    var ar = aristas();
    for (i = 0; i < ar.length; i++) {
      a = anchors[ar[i][0]]; b = anchors[ar[i][1]];
      ctx.strokeStyle = (a.on && b.on) ? 'rgba(0,255,204,.35)' : 'rgba(0,255,204,.14)';
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    for (i = 0; i < anchors.length; i++) {
      a = anchors[i];
      for (j = 0; j < nodos.length; j++) {
        b = nodos[j]; dx = a.x - b.x; dy = a.y - b.y; d = Math.sqrt(dx * dx + dy * dy);
        if (d < 170) {
          ctx.strokeStyle = 'rgba(0,255,204,' + ((a.on ? 0.5 : 0.2) * (1 - d / 170)).toFixed(3) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      ctx.fillStyle = a.on ? 'rgba(0,255,204,.12)' : 'rgba(138,165,179,.07)';
      ctx.beginPath(); ctx.arc(a.x, a.y, 16, 0, 6.2832); ctx.fill();
    }

    /* Pulsos viajando entre nodos */
    if (mover) {
      if (t - ultimo > 850) { lanzar(); ultimo = t; }
      for (i = pulsos.length - 1; i >= 0; i--) {
        pulsos[i].t += pulsos[i].v;
        if (pulsos[i].t >= 1) pulsos.splice(i, 1);
        else dibujarPulso(pulsos[i]);
      }
    }
  }

  function ciclo(t) {
    if (!corriendo) return;
    dibujar(t, true);
    raf = requestAnimationFrame(ciclo);
  }
  function actualizarEstado() {
    var debe = visible && !document.hidden && !RM;
    if (debe && !corriendo) { corriendo = true; raf = requestAnimationFrame(ciclo); }
    else if (!debe && corriendo) { corriendo = false; cancelAnimationFrame(raf); }
  }

  red.addEventListener('pointermove', function (e) {
    var r = red.getBoundingClientRect();
    mx = e.clientX - r.left; my = e.clientY - r.top;
  });
  red.addEventListener('pointerleave', function () { mx = -999; my = -999; });
  document.addEventListener('visibilitychange', actualizarEstado);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (items) {
      visible = items[0].isIntersecting;
      actualizarEstado();
    }).observe(red);
  }

  function reajustar() {
    medir();
    if (RM || !corriendo) dibujar(0, false);
  }
  if ('ResizeObserver' in window) new ResizeObserver(reajustar).observe(red);
  else window.addEventListener('resize', reajustar);

  medir();
  dibujar(0, false);
  actualizarEstado();

  /* ---------- Botones de descarga ---------- */
  function enlazarBoton(btn) {
    var txt = btn.querySelector('.rn-txt');
    var pct = btn.querySelector('.rn-pct');
    var original = txt.textContent;
    var ocupado = false;

    function indice() {
      var pins = [].slice.call(red.querySelectorAll('.rn-pin'));
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
      txt.textContent = 'DESCARGA COMPLETA';
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
      txt.textContent = 'TRANSFIRIENDO';
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
