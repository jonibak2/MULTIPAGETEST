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
