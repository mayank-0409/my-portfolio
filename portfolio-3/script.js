/* =========================================================
   Portfolio — script.js
   ========================================================= */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme toggle (saved in memory for this visit) ---------- */
  const root = document.documentElement;
  let theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  root.dataset.theme = theme;
  $('#themeToggle').addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = theme;
  });

  /* ---------- Header on scroll ---------- */
  const header = $('#header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const menuBtn = $('#menuBtn');
  const nav = $('#nav');
  const closeMenu = () => {
    nav.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
  };
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
  $$('a', nav).forEach(a => a.addEventListener('click', closeMenu));

  /* ---------- Active nav link ---------- */
  const links = $$('.nav a');
  const sections = links.map(l => $(l.getAttribute('href')));
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.toggle('is-active', l.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => s && navObserver.observe(s));

  /* ---------- Scroll reveal ---------- */
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  $$('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    revealObserver.observe(el);
  });

  /* ---------- Typing effect ---------- */
  const words = ['fast', 'simple', 'human', 'reliable', 'delightful'];
  const typed = $('#typed');
  if (!prefersReduced) {
    let w = 0, c = words[0].length, deleting = true;
    const tick = () => {
      const word = words[w];
      typed.textContent = word.slice(0, c);
      if (deleting) {
        c--;
        if (c < 0) { deleting = false; w = (w + 1) % words.length; c = 0; }
        setTimeout(tick, 60);
      } else {
        c++;
        if (c > words[w].length) { deleting = true; c = words[w].length; setTimeout(tick, 1800); return; }
        setTimeout(tick, 100);
      }
    };
    setTimeout(tick, 2000);
  }

  /* ---------- Count-up stats ---------- */
  const countObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const start = performance.now();
      const dur = 1400;
      const step = now => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(el => countObserver.observe(el));

  /* ---------- Project filters ---------- */
  const filters = $$('.filter');
  const projects = $$('.project');
  filters.forEach(btn => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    filters.forEach(b => {
      const active = b === btn;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-selected', String(active));
    });
    projects.forEach(p => {
      const show = f === 'all' || p.dataset.cat === f;
      p.classList.toggle('is-hidden', !show);
      if (show) p.classList.add('is-visible');
    });
  }));

  /* ---------- Copy email ---------- */
  const copyBtn = $('#copyEmail');
  const copyLabel = $('#copyLabel');
  copyBtn.addEventListener('click', async () => {
    const email = copyBtn.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      copyLabel.textContent = 'Copied to clipboard';
    } catch {
      window.location.href = `mailto:${email}`;
    }
    setTimeout(() => (copyLabel.textContent = 'Click to copy'), 2000);
  });

  /* ---------- Contact form validation ---------- */
  const form = $('#contactForm');
  const status = $('#formStatus');
  const rules = {
    name: v => v.trim().length >= 2 || 'Please enter your name.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Please enter a valid email.',
    message: v => v.trim().length >= 10 || 'Message should be at least 10 characters.',
  };
  const validate = input => {
    const result = rules[input.name](input.value);
    const field = input.closest('.field');
    const ok = result === true;
    field.classList.toggle('has-error', !ok);
    $('.error', field).textContent = ok ? '' : result;
    return ok;
  };
  $$('input, textarea', form).forEach(i => i.addEventListener('input', () => {
    if (i.closest('.field').classList.contains('has-error')) validate(i);
  }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const inputs = $$('input, textarea', form);
    const allOk = inputs.map(validate).every(Boolean);
    if (!allOk) { status.textContent = ''; return; }

    const btn = $('button[type="submit"]', form);
    btn.disabled = true;
    btn.textContent = 'Sending...';
    // Replace this timeout with a real request (e.g. Formspree, EmailJS or your own API).
    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.textContent = 'Send message';
      status.textContent = "Thanks — your message is on its way. I'll reply soon.";
    }, 1000);
  });


  /* =====================================================
     Animations & video
     ===================================================== */

  /* ---------- Preloader ---------- */
  const loader = $('#preloader');
  const loaderCount = $('#loaderCount');
  let pct = 0;
  const loadTimer = setInterval(() => {
    pct = Math.min(pct + Math.ceil(Math.random() * 12), 100);
    loaderCount.textContent = pct + '%';
    if (pct === 100) clearInterval(loadTimer);
  }, 70);
  const finishLoad = () => {
    clearInterval(loadTimer);
    loaderCount.textContent = '100%';
    setTimeout(() => {
      loader.classList.add('is-done');
      document.body.classList.add('is-loaded');
      $$('.hero__title .word').forEach((w, i) => (w.style.transitionDelay = `${300 + i * 90}ms`));
    }, 250);
  };
  if (document.readyState === 'complete') setTimeout(finishLoad, 900);
  else window.addEventListener('load', () => setTimeout(finishLoad, 600));
  setTimeout(finishLoad, 3500); // safety

  /* ---------- Hero video ---------- */
  const heroVideo = $('#heroVideo');
  const showHeroVideo = () => heroVideo.classList.add('is-ready');
  heroVideo.addEventListener('canplay', showHeroVideo);
  if (heroVideo.readyState >= 3) showHeroVideo();
  if (prefersReduced) heroVideo.pause();

  /* ---------- Scroll progress + parallax + timeline ---------- */
  const progress = $('#progress');
  const heroInner = $('.hero__inner');
  const reel = $('#reel');
  const timeline = $('.timeline');
  const onScrollFx = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (prefersReduced) return;

    if (y < innerHeight) {
      heroInner.style.transform = `translateY(${y * 0.25}px)`;
      heroInner.style.opacity = String(1 - y / (innerHeight * 0.9));
      heroVideo.style.transform = `scale(${1.08 + y * 0.0003})`;
    }
    // Showreel grows as it enters the viewport
    const rr = reel.getBoundingClientRect();
    const t = Math.min(Math.max(1 - (rr.top - innerHeight * 0.15) / innerHeight, 0), 1);
    reel.style.setProperty('--reel-scale', (0.88 + t * 0.12).toFixed(3));
    // Timeline line draws with scroll
    const tr = timeline.getBoundingClientRect();
    const tl = Math.min(Math.max((innerHeight * 0.75 - tr.top) / tr.height, 0), 1);
    timeline.style.setProperty('--line', tl.toFixed(3));
  };
  window.addEventListener('scroll', () => requestAnimationFrame(onScrollFx), { passive: true });
  onScrollFx();

  /* ---------- Custom cursor ---------- */
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (finePointer && !prefersReduced) {
    const cursor = $('#cursor');
    const dot = $('#cursorDot');
    let cx = 0, cy = 0, tx = 0, ty = 0;
    window.addEventListener('pointermove', e => {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = `translate(${tx}px, ${ty}px)`;
      document.body.classList.add('has-cursor');
    });
    document.addEventListener('pointerleave', () => document.body.classList.remove('has-cursor'));
    const follow = () => {
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      cursor.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(follow);
    };
    follow();
    $$('a, button, .project, input, textarea').forEach(el => {
      el.addEventListener('pointerenter', () => cursor.classList.add('is-hover'));
      el.addEventListener('pointerleave', () => cursor.classList.remove('is-hover'));
    });

    /* Magnetic buttons */
    $$('.magnetic').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      btn.addEventListener('pointerleave', () => (btn.style.transform = ''));
    });

    /* 3D tilt + glare on project cards */
    projects.forEach(card => {
      const glare = document.createElement('span');
      glare.className = 'glare';
      card.appendChild(glare);
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.transition = 'transform .1s linear, border-color .3s';
        card.style.transform = `rotateX(${(0.5 - py) * 8}deg) rotateY(${(px - 0.5) * 10}deg) translateY(-6px)`;
        card.style.setProperty('--gx', px * 100 + '%');
        card.style.setProperty('--gy', py * 100 + '%');
      });
      card.addEventListener('pointerleave', () => {
        card.style.transition = '';
        card.style.transform = '';
      });
    });
  }

  /* ---------- Project hover video previews ---------- */
  projects.forEach(card => {
    const v = $('.thumb-video', card);
    if (!v) return;
    const play = () => {
      if (!v.src) v.src = v.dataset.src;
      v.play().then(() => card.classList.add('is-playing')).catch(() => {});
    };
    const stop = () => { v.pause(); card.classList.remove('is-playing'); };
    card.addEventListener('pointerenter', play);
    card.addEventListener('pointerleave', stop);
    card.addEventListener('focusin', play);
    card.addEventListener('focusout', stop);
  });

  /* ---------- Showreel player ---------- */
  const reelVideo = $('#reelVideo');
  const reelPlay = $('#reelPlay');
  const reelProgress = $('#reelProgress');
  const toggleReel = () => {
    if (reelVideo.paused) {
      reelVideo.play();
      reel.classList.add('is-playing');
      reelPlay.setAttribute('aria-label', 'Pause showreel');
      $('span', reelPlay).textContent = 'Pause';
    } else {
      reelVideo.pause();
      reel.classList.remove('is-playing');
      reelPlay.setAttribute('aria-label', 'Play showreel');
      $('span', reelPlay).textContent = 'Play reel';
    }
  };
  reelPlay.addEventListener('click', toggleReel);
  reelVideo.addEventListener('click', toggleReel);
  reelVideo.addEventListener('timeupdate', () => {
    if (reelVideo.duration) reelProgress.style.width = (reelVideo.currentTime / reelVideo.duration) * 100 + '%';
  });
  // Pause the reel when it scrolls out of view
  new IntersectionObserver(([e]) => {
    if (!e.isIntersecting && !reelVideo.paused) toggleReel();
  }, { threshold: 0.2 }).observe(reel);

  /* ---------- Staggered skill tags ---------- */
  $$('.skill-card').forEach(card => {
    $$('.tags li', card).forEach((li, i) => (li.style.transitionDelay = `${200 + i * 60}ms`));
  });

  /* ---------- Footer year ---------- */
  $('#year').textContent = new Date().getFullYear();

  /* ---------- Interactive hero grid (canvas) ---------- */
  const canvas = $('#grid');
  const ctx = canvas.getContext('2d');
  let W, H, dpr, mouse = { x: -999, y: -999 };
  const GAP = 34;

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    const styles = getComputedStyle(root);
    const accent = styles.getPropertyValue('--accent').trim();
    const base = styles.getPropertyValue('--grid').trim();
    for (let x = GAP / 2; x < W; x += GAP) {
      for (let y = GAP / 2; y < H; y += GAP) {
        const d = Math.hypot(x - mouse.x, y - mouse.y);
        const near = Math.max(0, 1 - d / 180);
        ctx.beginPath();
        ctx.arc(x, y, 1.2 + near * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = near > 0.02 ? accent : base;
        ctx.globalAlpha = near > 0.02 ? 0.15 + near * 0.7 : 0.6;
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    if (!prefersReduced) requestAnimationFrame(draw);
  };
  const hero = $('.hero');
  hero.addEventListener('pointermove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  hero.addEventListener('pointerleave', () => (mouse = { x: -999, y: -999 }));
  window.addEventListener('resize', resize);
  resize();
  draw();
})();
