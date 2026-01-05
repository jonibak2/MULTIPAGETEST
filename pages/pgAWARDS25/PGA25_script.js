/* SPOTLIGHT */
document.addEventListener("mousemove", e => {
  document.querySelectorAll(".spotlight").forEach((s, i) => {
    s.style.left = e.clientX - 200 + i * 60 + "px";
    s.style.top  = e.clientY - 200 + i * 60 + "px";
  });
});

/* STAGGER ANIMATION */
const cards = document.querySelectorAll(".nomination-card");
const videos = document.querySelectorAll(".video-card, .highlight-video");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.2 });

cards.forEach((card, i) => {
  card.style.transitionDelay = `${i * 70}ms`;
  observer.observe(card);
});

videos.forEach(v => observer.observe(v));

let animationsEnabled = false;

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
  const loader = document.getElementById("page-loader");
  const content = document.getElementById("page-content");
  
  animationsEnabled = true;
  
  if (loader) loader.style.display = "none";
  if (content) content.style.display = "block";
  
  window.scrollTo(0, 0);
}

window.addEventListener("load", () => {
  const loader = document.getElementById("page-loader");
  const content = document.getElementById("page-content");

  // Скролл в самый верх при загрузке
  window.scrollTo(0, 0);
  
  // Инициализируем прогресс-бар
  const progressBar = document.querySelector(".loader-progress");
  if (progressBar) {
    progressBar.style.width = "0";
    progressBar.style.animation = "none";
  }

  // Начинаем загрузку всех медиа-файлов
  preloadAllMedia();
});

/* Скролл вверх при загрузке страницы */
document.addEventListener("DOMContentLoaded", () => {
  window.scrollTo(0, 0);
});

/* YOUTUBE PREVIEW CLICK HANDLER */
document.addEventListener("DOMContentLoaded", () => {
  const youtubePreviews = document.querySelectorAll(".youtube-preview");
  
  youtubePreviews.forEach(preview => {
    preview.addEventListener("click", () => {
      const youtubeUrl = preview.getAttribute("data-youtube-url");
      if (!youtubeUrl) return;
      
      const loader = document.getElementById("page-loader");
      const content = document.getElementById("page-content");
      const progressBar = loader?.querySelector(".loader-progress");
      
      // Сбрасываем анимацию прогресс-бара
      if (progressBar) {
        progressBar.style.width = "0";
        progressBar.style.animation = "none";
        requestAnimationFrame(() => {
          progressBar.style.animation = "loaderProgress 1.5s linear forwards";
        });
      }
      
      // Плавно показываем лоадер
      if (loader) {
        loader.style.display = "flex";
        loader.style.opacity = "0";
        requestAnimationFrame(() => {
          loader.style.transition = "opacity 0.3s ease";
          loader.style.opacity = "1";
        });
      }
      
      // Скрываем контент
      if (content) {
        content.style.transition = "opacity 0.3s ease";
        content.style.opacity = "0";
      }
      
      // После окончания загрузки редиректим
      setTimeout(() => {
        window.location.href = youtubeUrl;
      }, 1500);
    });
  });
});