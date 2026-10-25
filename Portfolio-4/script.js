/* =========================================================
   Cybersecurity Beginner Portfolio — script.js
   ========================================================= */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Boot screen ---------- */
  const boot = $('#boot');
  const bootLog = $('#bootLog');
  const bootBar = $('#bootBar');
  const bootLines = [
    '<span class="dim">[    0.000]</span> initializing secure session...',
    '<span class="dim">[    0.112]</span> loading kernel modules ........ <span class="ok">[ OK ]</span>',
    '<span class="dim">[    0.240]</span> starting firewall ............. <span class="ok">[ OK ]</span>',
    '<span class="dim">[    0.391]</span> mounting /portfolio ........... <span class="ok">[ OK ]</span>',
    '<span class="dim">[    0.502]</span> verifying certificates ........ <span class="ok">[ OK ]</span>',
    '<span class="dim">[    0.640]</span> access granted. welcome, guest.'
  ];
  document.body.classList.add('is-booting');
  let finished = false;
  const endBoot = () => {
    if (finished) return;
    finished = true;
    bootBar.style.width = '100%';
    setTimeout(() => {
      boot.classList.add('is-done');
      document.body.classList.remove('is-booting');
      document.body.classList.add('is-loaded');
    }, 300);
  };
  if (reduced) {
    bootLog.innerHTML = bootLines.join('\n');
    endBoot();
  } else {
    bootLines.forEach((line, i) => {
      setTimeout(() => {
        bootLog.innerHTML += (i ? '\n' : '') + line;
        bootBar.style.width = ((i + 1) / bootLines.length) * 100 + '%';
        if (i === bootLines.length - 1) setTimeout(endBoot, 450);
      }, 180 + i * 260);
    });
  }
  setTimeout(endBoot, 4000); // safety net
  boot.addEventListener('click', endBoot);

  /* ---------- Matrix rain canvas ---------- */
  const canvas = $('#matrix');
  const ctx = canvas.getContext('2d');
  const chars = '01アイウエオカキクケコ<>/{}[]#$%&*ABCDEF';
  let cols = [], fontSize = 16, W = 0, H = 0;
  const sizeCanvas = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fontSize = W < 600 ? 13 : 16;
    cols = Array.from({ length: Math.ceil(W / fontSize) }, () => Math.random() * -50);
  };
  let last = 0;
  const rain = t => {
    if (t - last > 55) {
      last = t;
      ctx.fillStyle = 'rgba(7, 9, 12, 0.12)';
      ctx.fillRect(0, 0, W, H);
      ctx.font = `${fontSize}px JetBrains Mono, monospace`;
      cols.forEach((y, i) => {
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = Math.random() > 0.975 ? '#e6fff4' : '#00ff9c';
        ctx.fillText(ch, i * fontSize, y * fontSize);
        cols[i] = y * fontSize > H && Math.random() > 0.975 ? 0 : y + 1;
      });
    }
    if (heroVisible) requestAnimationFrame(rain);
  };
  let heroVisible = true;
  sizeCanvas();
  window.addEventListener('resize', sizeCanvas);
  if (!reduced) {
    requestAnimationFrame(rain);
    new IntersectionObserver(([e]) => {
      const was = heroVisible;
      heroVisible = e.isIntersecting;
      if (heroVisible && !was) requestAnimationFrame(rain);
    }).observe($('.hero'));
  }

  /* ---------- Hero video ---------- */
  const heroVideo = $('#heroVideo');
  const showVideo = () => heroVideo.classList.add('is-ready');
  heroVideo.addEventListener('canplay', showVideo);
  if (heroVideo.readyState >= 3) showVideo();
  if (reduced) heroVideo.pause();

  /* ---------- Header + scroll progress ---------- */
  const header = $('#header');
  const progress = $('#progress');
  const journey = $('#journeyList');
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 20);
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

    // Journey line fills as you scroll past it
    const r = journey.getBoundingClientRect();
    const p = Math.min(Math.max((innerHeight * 0.8 - r.top) / (r.height + innerHeight * 0.3), 0), 1);
    journey.style.setProperty('--line', p.toFixed(3));
  };
  window.addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const menuBtn = $('#menuBtn');
  const nav = $('#nav');
  const setMenu = open => {
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  $$('a', nav).forEach(a => a.addEventListener('click', () => setMenu(false)));
  window.addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));
  window.matchMedia('(min-width: 901px)').addEventListener('change', e => e.matches && setMenu(false));

  /* ---------- Active nav link ---------- */
  const navLinks = $$('.nav a');
  const navObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) navLinks.forEach(l => l.classList.toggle('is-active', l.hash === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  navLinks.forEach(l => { const s = $(l.hash); if (s) navObs.observe(s); });

  /* ---------- Reveal on scroll ---------- */
  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => {
    const siblings = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 5) * 80}ms`;
    revealObs.observe(el);
  });

  /* ---------- Typing effect ---------- */
  const words = ['network security', 'ethical hacking', 'threat detection', 'digital forensics', 'incident response'];
  const typed = $('#typed');
  if (!reduced) {
    let w = 0, c = words[0].length, del = true;
    const tick = () => {
      typed.textContent = words[w].slice(0, c);
      if (del) {
        if (--c < 0) { del = false; w = (w + 1) % words.length; c = 0; }
        setTimeout(tick, 40);
      } else {
        if (++c > words[w].length) { del = true; c = words[w].length; return setTimeout(tick, 1800); }
        setTimeout(tick, 85);
      }
    };
    setTimeout(tick, 3200);
  }

  /* ---------- Count-up stats ---------- */
  const countObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.count, start = performance.now();
      const step = now => {
        const p = Math.min((now - start) / 1600, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(el => countObs.observe(el));

  /* ---------- Interactive terminal ---------- */
  const termBody = $('#termBody');
  const termOut = $('#termOut');
  const termForm = $('#termForm');
  const termInput = $('#termInput');
  const history = [];
  let hIndex = 0;

  const commands = {
    help: () => [
      ['hl', 'available commands:'],
      ['res', '  whoami     - who is behind this portfolio'],
      ['res', '  skills     - list my core skills'],
      ['res', '  certs      - certifications'],
      ['res', '  nmap       - scan this portfolio'],
      ['res', '  contact    - how to reach me'],
      ['res', '  clear      - clear the screen']
    ],
    whoami: () => [
      ['hl', 'Your Name'],
      ['res', 'Cybersecurity beginner · aspiring SOC Analyst · Mumbai, IN'],
      ['res', 'I learn by building labs, solving CTFs and writing it all down.']
    ],
    skills: () => [
      ['res', '[network]   nmap · wireshark · tcpdump'],
      ['res', '[defense]   splunk · wazuh · sysmon'],
      ['res', '[offense]   burp suite · metasploit · gobuster'],
      ['res', '[code]      python · bash · powershell']
    ],
    certs: () => [
      ['hl', '✔ Google Cybersecurity Certificate'],
      ['hl', '✔ Cisco Intro to Cybersecurity'],
      ['hl', '✔ TryHackMe Pre-Security'],
      ['warn', '◌ CompTIA Security+ (in progress)']
    ],
    nmap: () => [
      ['res', 'Starting Nmap scan on portfolio.local ...'],
      ['res', 'PORT     STATE  SERVICE'],
      ['hl', '22/tcp   open   curiosity'],
      ['hl', '80/tcp   open   labs'],
      ['hl', '443/tcp  open   certifications'],
      ['warn', '8080/tcp open   hire-me'],
      ['res', 'Nmap done: 1 host up — looks like a great candidate.']
    ],
    contact: () => [
      ['res', 'email:    hello@yourname.dev'],
      ['res', 'linkedin: /in/yourname'],
      ['res', 'tip: scroll to ./contact to send a message']
    ],
    sudo: () => [['err', 'nice try. this incident has been reported.']],
    ls: () => [['res', 'about.txt  skills.txt  labs/  certs/  contact.sh']],
    clear: () => { termOut.innerHTML = ''; return []; }
  };

  const print = (cls, text) => {
    const p = document.createElement('p');
    p.className = cls;
    p.textContent = text;
    termOut.appendChild(p);
  };
  const typeLines = async lines => {
    for (const [cls, text] of lines) {
      print(cls, text);
      termBody.scrollTop = termBody.scrollHeight;
      if (!reduced) await new Promise(r => setTimeout(r, 45));
    }
  };
  const run = async raw => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    history.push(cmd); hIndex = history.length;
    if (cmd !== 'clear') print('cmd', `guest@portfolio:~$ ${raw}`);
    const key = cmd.split(' ')[0];
    const fn = commands[key];
    await typeLines(fn ? fn() : [['err', `command not found: ${key} — try "help"`]]);
    termBody.scrollTop = termBody.scrollHeight;
  };

  termForm.addEventListener('submit', e => {
    e.preventDefault();
    run(termInput.value);
    termInput.value = '';
  });
  termInput.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && hIndex > 0) { termInput.value = history[--hIndex]; e.preventDefault(); }
    if (e.key === 'ArrowDown') { hIndex = Math.min(hIndex + 1, history.length); termInput.value = history[hIndex] || ''; }
  });
  termBody.addEventListener('click', () => termInput.focus({ preventScroll: true }));
  $$('.terminal__hints button').forEach(b => b.addEventListener('click', () => run(b.dataset.cmd)));

  // Auto intro once the boot screen is gone
  setTimeout(() => typeLines([
    ['hl', 'Welcome to my portfolio terminal.'],
    ['res', 'Type "help" or tap a command below to explore.']
  ]), reduced ? 0 : 2600);

  /* ---------- Lab filters ---------- */
  const filters = $$('.filter');
  const labs = $$('.lab');
  filters.forEach(btn => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    filters.forEach(b => { const on = b === btn; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', String(on)); });
    labs.forEach(l => {
      const show = f === 'all' || l.dataset.cat === f;
      l.classList.toggle('is-hidden', !show);
      if (show) l.classList.add('is-visible');
    });
  }));

  /* ---------- Lab video previews ---------- */
  const playLab = (lab, v) => {
    if (!v.src) v.src = v.dataset.src;
    v.play().then(() => lab.classList.add('is-playing')).catch(() => {});
  };
  const stopLab = (lab, v) => { v.pause(); lab.classList.remove('is-playing'); };

  labs.forEach(lab => {
    const v = $('video', lab);
    if (canHover) {
      lab.addEventListener('pointerenter', () => playLab(lab, v));
      lab.addEventListener('pointerleave', () => stopLab(lab, v));
      lab.addEventListener('focusin', () => playLab(lab, v));
      lab.addEventListener('focusout', () => stopLab(lab, v));
    }
  });
  // On touch devices, play previews while the card is mostly on screen
  if (!canHover && !reduced) {
    const labObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const v = $('video', e.target);
        e.isIntersecting ? playLab(e.target, v) : stopLab(e.target, v);
      });
    }, { threshold: 0.6 });
    labs.forEach(l => labObs.observe(l));
    $$('.lab__play').forEach(s => (s.textContent = '▶ preview'));
  }

  /* ---------- Custom video player ---------- */
  const player = $('#player');
  const demo = $('#demoVideo');
  const seek = $('#seek');
  const seekFill = $('#seekFill');
  const hudTime = $('#hudTime');
  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const toggle = () => (demo.paused ? demo.play() : demo.pause());

  demo.addEventListener('play', () => { player.classList.add('is-playing'); $('#playBtn').setAttribute('aria-label', 'Pause'); });
  demo.addEventListener('pause', () => { player.classList.remove('is-playing'); $('#playBtn').setAttribute('aria-label', 'Play'); });
  demo.addEventListener('ended', () => { demo.currentTime = 0; });
  demo.addEventListener('timeupdate', () => {
    const p = demo.duration ? (demo.currentTime / demo.duration) * 100 : 0;
    seekFill.style.width = p + '%';
    seek.setAttribute('aria-valuenow', Math.round(p));
    hudTime.textContent = fmt(demo.currentTime);
  });
  $('#playBig').addEventListener('click', toggle);
  $('#playBtn').addEventListener('click', toggle);
  demo.addEventListener('click', toggle);

  const seekTo = clientX => {
    const r = seek.getBoundingClientRect();
    const p = Math.min(Math.max((clientX - r.left) / r.width, 0), 1);
    if (demo.duration) demo.currentTime = p * demo.duration;
  };
  let dragging = false;
  seek.addEventListener('pointerdown', e => { dragging = true; seek.setPointerCapture(e.pointerId); seekTo(e.clientX); });
  seek.addEventListener('pointermove', e => dragging && seekTo(e.clientX));
  seek.addEventListener('pointerup', () => (dragging = false));
  seek.addEventListener('keydown', e => {
    if (!demo.duration) return;
    if (e.key === 'ArrowRight') demo.currentTime = Math.min(demo.currentTime + 1, demo.duration);
    if (e.key === 'ArrowLeft') demo.currentTime = Math.max(demo.currentTime - 1, 0);
  });

  // Expand toggle: enlarges the player to fill the viewport width
  $('#fsBtn').addEventListener('click', () => {
    const on = player.classList.toggle('is-expanded');
    $('#fsBtn').setAttribute('aria-label', on ? 'Shrink video' : 'Expand video');
    document.body.style.overflow = on ? 'hidden' : '';
  });
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && player.classList.contains('is-expanded')) $('#fsBtn').click();
  });
  new IntersectionObserver(([e]) => { if (!e.isIntersecting && !demo.paused) demo.pause(); }, { threshold: 0.25 }).observe(player);

  /* ---------- Contact form ---------- */
  const form = $('#contactForm');
  const status = $('#formStatus');
  const rules = {
    name: v => v.trim().length >= 2 || 'error: name too short',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'error: invalid email address',
    message: v => v.trim().length >= 10 || 'error: message needs at least 10 characters'
  };
  const validate = input => {
    const res = rules[input.name](input.value);
    const field = input.closest('.field');
    field.classList.toggle('has-error', res !== true);
    $('.error', field).textContent = res === true ? '' : res;
    return res === true;
  };
  $$('input, textarea', form).forEach(i => i.addEventListener('input', () => i.closest('.field').classList.contains('has-error') && validate(i)));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const ok = $$('input, textarea', form).map(validate).every(Boolean);
    if (!ok) { status.textContent = ''; return; }
    const btn = $('button[type="submit"] span', form);
    const steps = ['encrypting payload...', 'establishing TLS handshake...', 'sending...'];
    let i = 0;
    form.querySelector('button').disabled = true;
    const iv = setInterval(() => {
      status.textContent = steps[i++];
      if (i === steps.length) {
        clearInterval(iv);
        setTimeout(() => {
          // Replace this with a real request (e.g. Formspree, EmailJS or your own API)
          form.reset();
          form.querySelector('button').disabled = false;
          btn.textContent = 'Encrypt & send';
          status.textContent = '✔ message delivered securely. I\'ll reply soon.';
        }, 500);
      }
    }, 450);
  });

  /* ---------- Footer year ---------- */
  $('#year').textContent = new Date().getFullYear();
})();
