// ── Clickjacking protection ────────────────────────────────
if (window.self !== window.top) {
  window.top.location = window.self.location;
}

document.addEventListener('DOMContentLoaded', function () {

  // ── Mobile nav toggle ──────────────────────────────────────
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');

  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
      });
    });
  }

  // ── Mark active nav link ───────────────────────────────────
  const links = document.querySelectorAll('.nav-links a, .nav-menu a');
  const current = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── SVG flags (inline, no external files needed) ───────────
  const FLAG_GB = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="24" height="12">
    <clipPath id="a"><path d="M0 0v30h60V0z"/></clipPath>
    <clipPath id="b"><path d="M30 15h30v15zv15H0zH0V0zV0h30z"/></clipPath>
    <g clip-path="url(#a)">
      <path d="M0 0v30h60V0z" fill="#012169"/>
      <path d="M0 0l60 30m0-30L0 30" stroke="#fff" stroke-width="6"/>
      <path d="M0 0l60 30m0-30L0 30" clip-path="url(#b)" stroke="#C8102E" stroke-width="4"/>
      <path d="M30 0v30M0 15h60" stroke="#fff" stroke-width="10"/>
      <path d="M30 0v30M0 15h60" stroke="#C8102E" stroke-width="6"/>
    </g>
  </svg>`;

  const FLAG_IT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" width="24" height="16">
    <rect width="1" height="2" fill="#009246"/>
    <rect x="1" width="1" height="2" fill="#fff"/>
    <rect x="2" width="1" height="2" fill="#CE2B37"/>
  </svg>`;

  // ── Language switcher ──────────────────────────────────────
  const langBtn = document.getElementById('lang-toggle');
  if (!langBtn) return;

  const savedLang = localStorage.getItem('lang') || 'en';
  applyLanguage(savedLang);

  langBtn.addEventListener('click', function () {
    const cur = localStorage.getItem('lang') || 'en';
    const next = cur === 'en' ? 'it' : 'en';
    localStorage.setItem('lang', next);
    applyLanguage(next);
  });

  function applyLanguage(lang) {
    // Show both flags; current language flag is full opacity, other is faded
    if (lang === 'en') {
      langBtn.innerHTML =
        '<span style="display:inline-flex;align-items:center;gap:5px;">' +
          '<span style="opacity:1;display:inline-flex;">' + FLAG_GB + '</span>' +
          '<span style="opacity:0.3;display:inline-flex;">' + FLAG_IT + '</span>' +
        '</span>';
      langBtn.title = "Passa all'italiano";
    } else {
      langBtn.innerHTML =
        '<span style="display:inline-flex;align-items:center;gap:5px;">' +
          '<span style="opacity:0.3;display:inline-flex;">' + FLAG_GB + '</span>' +
          '<span style="opacity:1;display:inline-flex;">' + FLAG_IT + '</span>' +
        '</span>';
      langBtn.title = 'Switch to English';
    }

    // Swap all bilingual text (use textContent by default to avoid XSS;
    // elements that contain markup must opt in with the data-html attribute)
    document.querySelectorAll('[data-en]').forEach(function (el) {
      var text = lang === 'en'
        ? el.getAttribute('data-en')
        : el.getAttribute('data-it');
      if (el.hasAttribute('data-html')) {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    });

    document.documentElement.lang = lang;
  }

});
