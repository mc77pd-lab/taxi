/* js/entry.js — Логика стартовой страницы */
document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.getElementById('entryWrapper');
  const carYellow = document.getElementById('carYellow');
  const carBusiness = document.getElementById('carBusiness');
  const langOptions = document.querySelectorAll('.lang-opt');

  // 1. Жёлтое такси: показать/скрыть меню языков
  carYellow.addEventListener('click', () => {
    wrapper.classList.toggle('mode-yellow');
  });

  // 2. Бизнес такси: плавное затухание → переход
  carBusiness.addEventListener('click', () => {
    wrapper.style.transition = 'opacity 0.5s ease';
    wrapper.style.opacity = '0';
    wrapper.style.pointerEvents = 'none'; // Блокируем клики во время затухания
    setTimeout(() => {
      window.location.href = 'buisnes.html'; // Твоё название файла
    }, 500);
  });

  // 3. Выбор языка: сохранение → затухание → переход
  langOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.setItem('taxopark_lang', btn.dataset.lang);
      wrapper.style.transition = 'opacity 0.5s ease';
      wrapper.style.opacity = '0';
      wrapper.style.pointerEvents = 'none';
      setTimeout(() => {
        window.location.href = 'main.html'; // Твой основной сайт
      }, 500);
    });
  });

  // 🔹 Опционально: авто-редирект, если пользователь уже заходил ранее
  // Раскомментируй 2 строки ниже, чтобы пропускать выбор при повторном визите
  /*
  const savedLang = localStorage.getItem('taxopark_lang');
  if (savedLang) window.location.href = 'main.html';
  */
});
/* 🔧 Фикс кнопки «Назад» для мобильных браузеров и GitHub Pages */
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    // Страница восстановлена из кэша → безопасная перезагрузка
    window.location.reload();
  }
});
