let animationsEnabled = false;

function getMoonPhase(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let lp = 2551443;
  let now = new Date(year, month - 1, day);
  let newMoon = new Date(1970, 0, 7, 20, 35, 0);
  let phase = ((now.getTime() - newMoon.getTime()) / 1000) % lp;
  let age = Math.floor(phase / (24 * 3600));

  if (age === 0 || age === 29) return "🌑";
  else if (age >= 1 && age <= 6) return "🌒";
  else if (age === 7 || age === 8) return "🌓";
  else if (age >= 9 && age <= 13) return "🌔";
  else if (age === 14 || age === 15) return "🌕";
  else if (age >= 16 && age <= 20) return "🌖";
  else if (age === 21 || age === 22) return "🌗";
  else if (age >= 23 && age <= 28) return "🌘";
  else return "🌑";
}

// Функция для загрузки всех изображений и видео
function preloadAllMedia() {
  const images = document.querySelectorAll("img");
  const videos = document.querySelectorAll("video");
  const allMedia = [...images, ...videos];
  
  let loadedCount = 0;
  const totalCount = allMedia.length;
  
  if (totalCount === 0) {
    hideLoader();
    return;
  }
  
  const updateProgress = () => {
    const progress = (loadedCount / totalCount) * 100;
    const progressBar = document.querySelector(".loader-progress");
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
  };
  
  allMedia.forEach(media => {
    if (media.complete || (media.readyState && media.readyState >= 3)) {
      loadedCount++;
      updateProgress();
      checkComplete();
    } else {
      media.addEventListener("load", () => {
        loadedCount++;
        updateProgress();
        checkComplete();
      });
      media.addEventListener("error", () => {
        loadedCount++;
        updateProgress();
        checkComplete();
      });
      
      // Для видео также слушаем canplaythrough
      if (media.tagName === "VIDEO") {
        media.addEventListener("canplaythrough", () => {
          loadedCount++;
          updateProgress();
          checkComplete();
        });
      }
    }
  });
  
  function checkComplete() {
    if (loadedCount >= totalCount) {
      // Минимальное время показа загрузки для плавности
      setTimeout(() => {
        hideLoader();
      }, 500);
    }
  }
  
  // Таймаут на случай, если что-то не загрузится
  setTimeout(() => {
    if (loadedCount < totalCount) {
      hideLoader();
    }
  }, 10000);
}

function hideLoader() {
  const loader = document.getElementById('hub-loader');
  const content = document.getElementById('page-content');
  
  animationsEnabled = true;
  
  if (loader) {
    loader.style.display = 'none';
  }
  if (content) {
    content.style.display = 'block';
    // Добавляем класс для запуска анимаций
    requestAnimationFrame(() => {
      content.classList.add('show');
    });
  }
  
  window.scrollTo(0, 0);
}

// Инициализация с прелоадером
document.addEventListener('DOMContentLoaded', () => {
  const moonPhaseElement = document.getElementById('moonPhase');
  const today = new Date();
  if (moonPhaseElement) moonPhaseElement.textContent = getMoonPhase(today);

  const loader = document.getElementById('hub-loader');
  const content = document.getElementById('page-content');

  // Применяем анимации к карточкам с задержкой
  const linkCards = document.querySelectorAll('.link-card');
  linkCards.forEach((card, index) => {
    card.style.animationDelay = `${500 + index * 100}ms`;
  });

  // Инициализируем прогресс-бар
  const progressBar = document.querySelector(".loader-progress");
  if (progressBar) {
    progressBar.style.width = "0";
    progressBar.style.animation = "none";
  }

  // Обработчик клика по фазе луны
  const audio = new Audio('assets/pgHUB/bansuka.mp3');
  let canPlay = true;

  if (moonPhaseElement) {
    moonPhaseElement.addEventListener('click', () => {
      if (canPlay) {
        audio.currentTime = 0;
        audio.play();
        canPlay = false;

        setTimeout(() => {
          canPlay = true;
        }, 7500);
      }
    });
  }
});

window.addEventListener("load", () => {
  window.scrollTo(0, 0);
  // Начинаем загрузку всех медиа-файлов
  preloadAllMedia();
});

const videoButton = document.getElementById('videoButton');
const videoOverlay = document.getElementById('videoOverlay');
const loloVideo = document.getElementById('loloVideo');
let canPlayVideo = true;

if (videoButton) {
  videoButton.addEventListener('click', () => {
    if (canPlayVideo) {
      if (videoOverlay) videoOverlay.style.display = 'block';
      if (loloVideo) loloVideo.play();
      canPlayVideo = false;

      setTimeout(() => {
        canPlayVideo = true;
      }, 15000);
    }
  });
}

if (loloVideo) {
  loloVideo.addEventListener('ended', () => {
    if (videoOverlay) videoOverlay.style.display = 'none';
    loloVideo.currentTime = 0;
  });

  loloVideo.addEventListener('click', () => {
    if (videoOverlay) videoOverlay.style.display = 'none';
    loloVideo.pause();
    loloVideo.currentTime = 0;
  });
}
