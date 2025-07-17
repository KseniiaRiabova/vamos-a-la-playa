// Global variables
let currentVideo = null;
let waves = null;

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
  waves = document.querySelectorAll('.wave');
  showSoundNotification();
});

// Show sound notification
function showSoundNotification() {
  const notification = document.getElementById('soundNotification');
  notification.style.display = 'flex';

  // Auto-hide after 5 seconds
  setTimeout(() => {
    if (!notification.classList.contains('hidden')) {
      hideSoundNotification();
    }
  }, 5000);
}

// Hide sound notification
function hideSoundNotification() {
  const notification = document.getElementById('soundNotification');
  notification.classList.add('hidden');
}

// Play main video (video1.mp4)
function playMainVideo() {
  playVideo('src/video1.mp4');
}

// Play adult video (video2.mp4)
function playAdultVideo() {
  playVideo('src/video2.mp4');
  stopWaveAnimation();
}

// Generic function to play video
function playVideo(videoSrc) {
  const videoContainer = document.getElementById('videoContainer');
  const videoPlayer = document.getElementById('videoPlayer');
  const mainContent = document.getElementById('mainContent');

  // Hide main content
  mainContent.classList.add('hidden');

  // Set video source
  videoPlayer.src = videoSrc;
  currentVideo = videoSrc;

  // Show video container
  videoContainer.classList.add('show');

  // Play video
  videoPlayer.play().catch((e) => {
    console.log('Auto-play prevented:', e);
    // Show a play button overlay or instruction
    showPlayInstruction();
  });

  // Hide sound notification if still visible
  hideSoundNotification();

  // Add event listener for video end
  videoPlayer.addEventListener('ended', closeVideo);

  // Add event listener for escape key
  document.addEventListener('keydown', handleEscapeKey);
}

// Show play instruction if auto-play fails
function showPlayInstruction() {
  // Create overlay with instruction
  const overlay = document.createElement('div');
  overlay.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        z-index: 2002;
        font-size: 18px;
    `;
  overlay.innerHTML = 'Click the play button to start the video';

  const videoContainer = document.getElementById('videoContainer');
  videoContainer.appendChild(overlay);

  // Remove overlay when video starts playing
  const videoPlayer = document.getElementById('videoPlayer');
  videoPlayer.addEventListener(
    'play',
    () => {
      overlay.remove();
    },
    { once: true }
  );
}

// Close video and return to main screen
function closeVideo() {
  const videoContainer = document.getElementById('videoContainer');
  const videoPlayer = document.getElementById('videoPlayer');
  const mainContent = document.getElementById('mainContent');

  // Stop video
  videoPlayer.pause();
  videoPlayer.currentTime = 0;
  videoPlayer.src = '';

  // Hide video container
  videoContainer.classList.remove('show');

  // Show main content
  mainContent.classList.remove('hidden');

  // Resume wave animation if it was stopped
  if (currentVideo === 'src/video2.mp4') {
    resumeWaveAnimation();
  }

  // Clean up
  currentVideo = null;

  // Remove event listeners
  videoPlayer.removeEventListener('ended', closeVideo);
  document.removeEventListener('keydown', handleEscapeKey);
}

// Handle escape key to close video
function handleEscapeKey(event) {
  if (event.key === 'Escape') {
    closeVideo();
  }
}

// Stop wave animation (for 18+ video)
function stopWaveAnimation() {
  waves.forEach((wave) => {
    wave.classList.add('stopped');
  });
}

// Resume wave animation
function resumeWaveAnimation() {
  waves.forEach((wave) => {
    wave.classList.remove('stopped');
  });
}

// Add click outside video to close (optional)
document.addEventListener('click', function (event) {
  const videoContainer = document.getElementById('videoContainer');
  const videoPlayer = document.getElementById('videoPlayer');

  if (
    videoContainer.classList.contains('show') &&
    event.target === videoContainer &&
    !videoPlayer.contains(event.target)
  ) {
    closeVideo();
  }
});

// Prevent context menu on video (optional security)
document.addEventListener('contextmenu', function (event) {
  const videoPlayer = document.getElementById('videoPlayer');
  if (event.target === videoPlayer) {
    event.preventDefault();
  }
});

// Handle orientation change for mobile
window.addEventListener('orientationchange', function () {
  // Small delay to ensure proper rendering after orientation change
  setTimeout(() => {
    const videoPlayer = document.getElementById('videoPlayer');
    if (videoPlayer.src) {
      // Refresh video dimensions
      videoPlayer.style.maxWidth = '100%';
      videoPlayer.style.maxHeight = '100%';
    }
  }, 100);
});

// Touch event handling for mobile
let touchStartY = 0;
document.addEventListener('touchstart', function (event) {
  touchStartY = event.touches[0].clientY;
});

document.addEventListener(
  'touchmove',
  function (event) {
    const videoContainer = document.getElementById('videoContainer');
    if (videoContainer.classList.contains('show')) {
      // Prevent page scrolling when video is playing
      event.preventDefault();
    }
  },
  { passive: false }
);

// Fullscreen functionality for mobile
function toggleFullscreen() {
  const videoPlayer = document.getElementById('videoPlayer');

  if (videoPlayer.requestFullscreen) {
    videoPlayer.requestFullscreen();
  } else if (videoPlayer.webkitRequestFullscreen) {
    videoPlayer.webkitRequestFullscreen();
  } else if (videoPlayer.mozRequestFullScreen) {
    videoPlayer.mozRequestFullScreen();
  } else if (videoPlayer.msRequestFullscreen) {
    videoPlayer.msRequestFullscreen();
  }
}

// Add double-tap to fullscreen on mobile
let lastTouchTime = 0;
document
  .getElementById('videoPlayer')
  .addEventListener('touchend', function (event) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTouchTime;

    if (tapLength < 500 && tapLength > 0) {
      // Double tap detected
      toggleFullscreen();
      event.preventDefault();
    }

    lastTouchTime = currentTime;
  });
