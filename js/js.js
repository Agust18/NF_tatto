
(function() {

  window.addEventListener('load', function() {
    const modalElement = document.getElementById('modalBienvenida');
    if (modalElement) {
      const welcomeModal = new bootstrap.Modal(modalElement, {
        backdrop: 'static',
        keyboard: true
      });
      
      setTimeout(() => {
        welcomeModal.show();
      }, 300);
    }
  });

  // LAZY LOADING
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });
    
    document.querySelectorAll('.lazy-img').forEach(img => {
      imageObserver.observe(img);
    });
    
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target;
          if (video.preload !== 'auto') {
            video.preload = 'auto';
            video.load();
          }
          videoObserver.unobserve(video);
        }
      });
    }, { rootMargin: '100px' });
    
    document.querySelectorAll('video[preload="none"]').forEach(video => {
      videoObserver.observe(video);
    });
  }
  

  const lightboxModal = document.createElement('div');
  lightboxModal.className = 'lightbox-modal';
  lightboxModal.innerHTML = `
    <span class="lightbox-close" id="lightboxClose">&times;</span>
    <span class="lightbox-prev" id="lightboxPrev">&#10094;</span>
    <span class="lightbox-next" id="lightboxNext">&#10095;</span>
    <img class="lightbox-img" id="lightboxImg" src="" alt="">
    <div class="lightbox-counter" id="lightboxCounter"></div>
  `;
  document.body.appendChild(lightboxModal);
  
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCounter = document.getElementById('lightboxCounter');
  
  let currentImages = [];
  let currentIndex = 0;
  
  document.querySelectorAll('.gallery-item').forEach((item, index) => {
    item.addEventListener('click', function(e) {
      e.stopPropagation();
      const gallery = this.closest('.gallery-grid');
      currentImages = Array.from(gallery.querySelectorAll('.gallery-item')).map(el => el.dataset.src);
      currentIndex = Array.from(gallery.querySelectorAll('.gallery-item')).indexOf(this);
      
      showImage(currentIndex);
      lightboxModal.classList.add('active');
    });
  });
  
  function showImage(index) {
    if (index >= 0 && index < currentImages.length) {
      lightboxImg.src = currentImages[index];
      lightboxCounter.textContent = (index + 1) + ' / ' + currentImages.length;
    }
  }
  
  lightboxClose.addEventListener('click', () => lightboxModal.classList.remove('active'));
  
  lightboxPrev.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    showImage(currentIndex);
  });
  
  lightboxNext.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % currentImages.length;
    showImage(currentIndex);
  });
  
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) lightboxModal.classList.remove('active');
  });
  
  // Swipe táctil
  let touchStartX = 0;
  lightboxModal.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  lightboxModal.addEventListener('touchend', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        currentIndex = (currentIndex + 1) % currentImages.length;
      } else {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
      }
      showImage(currentIndex);
    }
  }, { passive: true });
  
  // REPRODUCIR VIDEOS
  document.querySelectorAll('.video-item video').forEach(video => {
    const item = video.closest('.video-item');
    
    if (video.autoplay) item.classList.add('playing');
    
    item.addEventListener('click', function(e) {
      e.stopPropagation();
      if (video.paused) {
        video.play().then(() => item.classList.add('playing'));
      } else {
        video.pause();
        item.classList.remove('playing');
      }
    });
    
    video.addEventListener('ended', () => item.classList.remove('playing'));
  });
})();

