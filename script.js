/* script.js — Полный код: навигация + карусели + мультиязычность (ФИНАЛЬНАЯ) */
document.addEventListener('DOMContentLoaded', () => {
  console.log('🟢 JS загружен. Навигация + Карусели + i18n.');

  // === 0. МУЛЬТИЯЗЫЧНОСТЬ ===
  const LANG_STORAGE_KEY = 'taxopark_lang';
  const DEFAULT_LANG = 'ru';
  let currentLang = localStorage.getItem(LANG_STORAGE_KEY) || DEFAULT_LANG;
  let translations = {};

  const LANG_MAP = {
    ru: { file: 'ru', flag: 'ru', nameKey: '3' },
    kg: { file: 'kg', flag: 'kg', nameKey: '5' },
    kk: { file: 'kz', flag: 'kz', nameKey: '6' },
    tg: { file: 'tj', flag: 'tj', nameKey: '7' },
    tm: { file: 'tm', flag: 'tm', nameKey: '8' },
    uz: { file: 'uz', flag: 'uz', nameKey: '9' }
  };

  async function loadLanguage(lang) {
    const map = LANG_MAP[lang] || LANG_MAP.ru;
    try {
      const res = await fetch(`translations/${map.file}.json`);
      if (!res.ok) throw new Error('Not found');
      translations = await res.json();
      currentLang = lang;
      localStorage.setItem(LANG_STORAGE_KEY, currentLang);
      
      applyTranslations();
      updateLangUI(map);
      console.log(`✅ Язык: ${lang} (${map.file}.json)`);
    } catch (e) {
      console.warn(`⚠️ ${map.file}.json не найден, остался русский`);
      currentLang = DEFAULT_LANG;
    }
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      // 🔑 Пропускаем кнопку выбора языка
      if (el.closest('#langToggle')) return;
      
      const key = el.getAttribute('data-i18n');
      if (translations[key]) {
        if (el.children.length === 0 || el.querySelector('br')) {
          el.innerHTML = translations[key].replace(/\\n/g, '<br>');
        } else {
          el.childNodes.forEach(node => {
            if (node.nodeType === 3 && node.textContent.trim()) {
              node.textContent = translations[key];
            }
          });
        }
      }
    });
  }

  function updateLangUI(map) {
    // 1. Меняем флаг
    const flag = document.querySelector('#langToggle .flag');
    if (flag) flag.src = `flags/${map.flag}.svg`;

    // 2. 🔑 Меняем текст кнопки на название ТЕКУЩЕГО языка
    const labelSpan = document.querySelector('#langToggle span[data-i18n="3"]');
    if (labelSpan && translations[map.nameKey]) {
      labelSpan.textContent = translations[map.nameKey];
    }

    // 3. Подсвечиваем выбранный язык в меню
    document.querySelectorAll('#langList li').forEach(li => {
      li.classList.toggle('active', li.dataset.lang === currentLang);
    });
  }

  // === 1. МЕНЮ ЯЗЫКОВ ===
  const langBtn = document.getElementById('langToggle');
  const langList = document.getElementById('langList');
  if (langBtn && langList) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      langList.classList.toggle('active');
    });

    langList.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', () => {
        loadLanguage(li.dataset.lang);
        langList.classList.remove('active');
      });
    });

    document.addEventListener('click', (e) => {
      if (!langBtn.contains(e.target) && !langList.contains(e.target)) {
        langList.classList.remove('active');
      }
    });
  }

  // === 2. СКРОЛЛ + АКТИВНАЯ КНОПКА ===
  const navLinks = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.info-section[id]');
  const HEADER_OFFSET = 90;

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('href')?.replace('#', '');
      const target = document.getElementById(id);
      if (target) {
        setTimeout(() => {
          window.scrollTo({ top: target.offsetTop - HEADER_OFFSET, behavior: 'smooth' });
        }, 50);
      }
    });
  });

  function updateActiveNav() {
    const scrollPos = window.scrollY + HEADER_OFFSET + 50;
    let currentId = '';
    sections.forEach(sec => { if (sec.offsetTop <= scrollPos) currentId = sec.id; });
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${currentId}`));
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // === 3. КАРУСЕЛИ ===
  document.querySelectorAll('.carousel').forEach((carousel, i) => {
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.querySelectorAll('.carousel-slide'));
    const dots = carousel.querySelectorAll('.dot');
    if (!track || slides.length < 2) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = slides.indexOf(entry.target);
          if (idx !== -1) {
            dots.forEach((dot, k) => dot.classList.toggle('active', k === idx));
          }
        }
      });
    }, { root: track, threshold: 0.5 });

    slides.forEach(slide => observer.observe(slide));

    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const targetIdx = parseInt(dot.getAttribute('data-index'), 10);
        if (!isNaN(targetIdx) && slides[targetIdx]) {
          slides[targetIdx].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        }
      });
    });

    setTimeout(() => dots[0]?.classList.add('active'), 150);
  });

  // === ЗАПУСК ===
  loadLanguage(currentLang);
});
/* 🔧 Фикс кнопки «Назад» для мобильных браузеров и GitHub Pages */
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    // Страница восстановлена из кэша → безопасная перезагрузка
    window.location.reload();
  }
});
