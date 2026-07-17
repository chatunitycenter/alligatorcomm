document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const intro = document.getElementById('intro');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileMenu.classList.toggle('active');
    });
    mobileMenu.addEventListener('click', (e) => e.stopPropagation());
  }

  const audioPlayer = document.getElementById('audioPlayer');
  const playBtn = document.getElementById('playBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const stopBtn = document.getElementById('stopBtn');
  const seekBar = document.getElementById('seekBar');
  const currentTimeEl = document.getElementById('currentTime');
  const totalTimeEl = document.getElementById('totalTime');

  function closeIntro(e) {
    if (e && e.target && (e.target.closest('.hamburger') || e.target.closest('.mobile-menu'))) {
      return;
    }
    if (!intro) return;
    intro.style.opacity = '0';

    setTimeout(() => {
      if (audioPlayer) {
        audioPlayer.play().catch(err => {
          console.log('Autoplay bloccato dal browser:', err);
        });
      }
    }, 100);

    setTimeout(() => {
      intro.remove();
    }, 1000);
  }

  if (intro) {
    document.addEventListener('click', closeIntro, { once: true });
    document.addEventListener('touchstart', closeIntro, { once: true });
  }

  if (audioPlayer) {
    audioPlayer.load();

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        audioPlayer.play().catch(err => console.log('Errore riproduzione:', err));
      });
    }

    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => audioPlayer.pause());
    }

    if (stopBtn) {
      stopBtn.addEventListener('click', () => {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        if (seekBar) seekBar.value = 0;
        if (currentTimeEl) currentTimeEl.textContent = '0:00';
      });
    }

    if (seekBar) {
      seekBar.addEventListener('input', (e) => {
        if (!isNaN(audioPlayer.duration)) {
          const time = (e.target.value / 100) * audioPlayer.duration;
          audioPlayer.currentTime = time;
        }
      });
    }

    audioPlayer.addEventListener('timeupdate', () => {
      if (!isNaN(audioPlayer.duration) && audioPlayer.duration > 0) {
        const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        if (seekBar) seekBar.value = percent;
      }
      if (currentTimeEl) currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    });

    audioPlayer.addEventListener('loadedmetadata', () => {
      if (totalTimeEl) totalTimeEl.textContent = formatTime(audioPlayer.duration);
      if (seekBar) seekBar.value = 0;
    });
  }

  function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
  }

  const timelineItems = document.querySelectorAll('.timeline-item');

  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, { threshold: 0.2 });

  timelineItems.forEach((item) => timelineObserver.observe(item));
});