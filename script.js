let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / maxScroll, 1);
      const viewportHeight = window.innerHeight;

      const layer1 = document.querySelector('.layer1');
      const layer2 = document.querySelector('.layer2');
      const layer3 = document.querySelector('.layer3');

      const maxParallaxShift = 200;

      if (progress <= 0.5) {
        const mountainProgress = progress / 0.5;

        if (layer1) {
          layer1.style.transform = `translateY(${mountainProgress * maxParallaxShift * 0.3}px)`;
          layer1.style.opacity = `${1 - mountainProgress}`;
          layer1.style.visibility = 'visible';
        }
        if (layer2) {
          layer2.style.transform = `translateY(${mountainProgress * maxParallaxShift * 0.6}px)`;
          layer2.style.opacity = `${1 - mountainProgress}`;
          layer2.style.visibility = 'visible';
        }
        if (layer3) {
          layer3.style.transform = `translateY(${mountainProgress * maxParallaxShift}px)`;
          layer3.style.opacity = `${1 - mountainProgress}`;
          layer3.style.visibility = 'visible';
        }
      } else {
        if (layer1) {
          layer1.style.opacity = '0';
          layer1.style.visibility = 'hidden';
          layer1.style.transform = `translateY(${maxParallaxShift * 0.3}px)`;
        }
        if (layer2) {
          layer2.style.opacity = '0';
          layer2.style.visibility = 'hidden';
          layer2.style.transform = `translateY(${maxParallaxShift * 0.6}px)`;
        }
        if (layer3) {
          layer3.style.opacity = '0';
          layer3.style.visibility = 'hidden';
          layer3.style.transform = `translateY(${maxParallaxShift}px)`;
        }
      }

      const styleTagId = 'day-transition-style';
      let styleTag = document.getElementById(styleTagId);
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleTagId;
        document.head.appendChild(styleTag);
      }
      styleTag.textContent = `
    body::before {
      opacity: ${progress};
    }
  `;

      const moon = document.querySelector('.moon');
      if (moon) {
        if (progress <= 0.5) {
          const moonProgress = progress / 0.5;
          const moonStartY = 0;
          const moonEndY = viewportHeight + 100;
          const moonY = moonStartY + (moonEndY - moonStartY) * moonProgress;
          moon.style.transform = `translateY(${moonY}px)`;
          moon.style.opacity = `${1 - moonProgress}`;
        } else {
          const moonEndY = viewportHeight + 100;
          moon.style.transform = `translateY(${moonEndY}px)`;
          moon.style.opacity = '0';
        }
      }

      const sun = document.querySelector('.sun');
      if (sun) {
        const sunStartY = viewportHeight + 100;
        const sunEndY = viewportHeight * 0.10;

        if (progress < 0.5) {
          sun.style.transform = `translateY(${sunStartY}px)`;
          sun.style.opacity = '0';
        } else {
          const sunProgress = (progress - 0.5) / 0.5;
          const sunY = sunStartY - (sunStartY - sunEndY) * sunProgress;
          sun.style.transform = `translateY(${sunY}px)`;
          sun.style.opacity = `${sunProgress}`;
        }
      }

      const starContainer = document.querySelector('.stars');
      if (starContainer) {
        if (progress <= 0.5) {
          starContainer.style.opacity = '1';
          starContainer.style.visibility = 'visible';
        } else {
          starContainer.style.opacity = '0';
          starContainer.style.visibility = 'hidden';
        }
      }

      const cloudContainer = document.querySelector('.clouds');
      if (cloudContainer) {
        if (progress > 0.5) {
          cloudContainer.style.opacity = '1';
          cloudContainer.style.visibility = 'visible';
        } else {
          cloudContainer.style.opacity = '0';
          cloudContainer.style.visibility = 'hidden';
        }
      }
      ticking = false;
    });
    ticking = true;
  }
});

const starContainer = document.createElement('div');
starContainer.className = 'stars';
document.body.appendChild(starContainer);

for (let i = 0; i < 100; i++) {
  const star = document.createElement('div');
  star.className = 'star';
  star.style.top = `${Math.random() * 100}vh`;
  star.style.left = `${Math.random() * 100}vw`;
  star.style.animationDelay = `${Math.random() * 2}s`;
  starContainer.appendChild(star);
}

const totalClouds = 20;
const cloudContainer = document.createElement('div');
cloudContainer.className = 'clouds';
document.body.appendChild(cloudContainer);

function createAndAnimateCloud() {
  const cloud = document.createElement('img');
  cloud.className = 'cloud';

  const randomCloudNum = Math.floor(Math.random() * 9) + 1;
  cloud.src = `images/cloud${randomCloudNum}.png`;


  cloud.style.top = `${Math.random() * 60}vh`;


  cloud.style.left = `-${200 + Math.random() * 300}px`;

  cloud.style.width = `${200 + Math.random() * 150}px`;
  cloud.style.height = 'auto';
  cloud.style.opacity = '0.3';


  const duration = 35 + Math.random() * 25;
  cloud.style.animationDuration = `${duration}s`;

  cloudContainer.appendChild(cloud);


  let startTime = null;
  const startLeft = parseFloat(cloud.style.left);
  const endLeft = window.innerWidth + 300;

  function animateCloud(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = (timestamp - startTime) / 1000;
    const progress = elapsed / duration;

    if (progress < 1) {

      const currentLeft = startLeft + (endLeft - startLeft) * progress;
      cloud.style.left = `${currentLeft}px`;
      requestAnimationFrame(animateCloud);
    } else {

      cloud.style.left = `-${200 + Math.random() * 300}px`;
      startTime = null;

      cloud.style.top = `${Math.random() * 60}vh`;
      cloud.style.width = `${200 + Math.random() * 150}px`;
      requestAnimationFrame(animateCloud);
    }
  }
  requestAnimationFrame(animateCloud);
}

for (let i = 0; i < totalClouds; i++) {
  setTimeout(createAndAnimateCloud, Math.random() * 60000);
}


const typingSound = new Audio('audio/typing-key.mp3');
typingSound.volume = 0.2;
typingSound.preload = 'auto';

const clickSound = new Audio('audio/click.mp3');
clickSound.volume = 0.7;
clickSound.preload = 'auto';

function anyTypingInProgress() {
  return Array.from(document.querySelectorAll('.content')).some(content => content.typingInterval != null);
}

let isTypingSoundPlaying = false;

function typingSoundEndedHandler() {
  typingSound.currentTime = 0;
  typingSound.play();
}

function startTypingSound() {
  if (!isTypingSoundPlaying) {
    typingSound.addEventListener('ended', typingSoundEndedHandler);
    typingSound.currentTime = 0;
    typingSound.play();
    isTypingSoundPlaying = true;
  }
}

function stopTypingSound() {
  if (isTypingSoundPlaying) {
    typingSound.pause();
    typingSound.currentTime = 0;
    typingSound.removeEventListener('ended', typingSoundEndedHandler);
    isTypingSoundPlaying = false;
  }
}

function typeText(element, text, speed = 5, imagePath = null) {
  element.innerHTML = "";
  let i = 0;

  startTypingSound();

  if (element.typingInterval) {
    clearInterval(element.typingInterval);
  }

  element.typingInterval = setInterval(() => {
    const char = text.charAt(i);
    if (char === "\n") {
      element.innerHTML += "<br>";
    } else {
      element.innerHTML += char;
    }

    i++;
    if (i >= text.length) {
      clearInterval(element.typingInterval);
      element.typingInterval = null;

      if (!anyTypingInProgress()) {
        stopTypingSound();
      }

      setTimeout(() => {
        stopTypingSound();

        const imageData = element.dataset.images || element.dataset.image || "";
        const imagePaths = imageData.split(",").map(path => path.trim()).filter(Boolean);
        const imageWidth = element.dataset.width;
        const imageHeight = element.dataset.height;
        const imageContainer = document.createElement("div");
        imageContainer.className = "side-by-side-images";

        imagePaths.forEach(imgName => {
          const img = document.createElement("img");
          img.src = `images/${imgName}`;
          img.alt = "Image";
          img.className = "fade-in-image";

          if (imageWidth) img.style.width = imageWidth;
          if (imageHeight) img.style.height = imageHeight;

          imageContainer.appendChild(img);
        });

        element.appendChild(imageContainer);

      }, 100);
    }
  }, speed);

  element.style.maxHeight = "none";
  element.style.transition = "opacity 0.3s ease";
  element.style.opacity = "1";
}

function hideAllPins() {
  document.querySelectorAll('.pin, .locator-pin').forEach(pin => {
    pin.style.display = 'none';
  });
}

function updatePinsVisibility() {
  const openDates = Array.from(document.querySelectorAll('.event'))
    .filter(ev => ev.isOpen)
    .map(ev => {
      const dateDiv = ev.querySelector('.date');
      return dateDiv ? dateDiv.textContent.trim().toLowerCase() : '';
    })
    .filter(Boolean);

  hideAllPins();

  if (openDates.length > 0) {
    document.querySelectorAll('.pin, .locator-pin').forEach(pin => {
      const pinEvents = pin.getAttribute('data-events');
      const hideOn = (pin.getAttribute('data-hide-on') || '').toLowerCase();

      if (pinEvents && pinEvents.trim().toLowerCase() === 'always') {
        if (openDates.includes(hideOn)) {
          if (pin.style.display !== 'none' && getComputedStyle(pin).display !== 'none') {
            pin.classList.remove('enlarged', 'shrinking');
            void pin.offsetWidth;
            pin.classList.add('shrinking');
            setTimeout(() => {
              pin.classList.remove('shrinking');
              pin.style.display = 'none';
            }, 400);
          } else {
            pin.classList.remove('enlarged', 'shrinking');
            pin.style.display = 'none';
          }
        } else {
          if (pin.style.display === 'none' || getComputedStyle(pin).display === 'none') {
            pin.classList.remove('enlarged', 'shrinking');
            void pin.offsetWidth;
            pin.classList.add('enlarged');
            setTimeout(() => pin.classList.remove('enlarged'), 700);
          }
          pin.style.display = '';
        }
        return;
      }

      if (pinEvents) {
        const pinEventList = pinEvents.split(',').map(e => e.trim().toLowerCase());
        if (
          pinEvents.trim() === '*' ||
          openDates.some(date => pinEventList.includes(date))
        ) {
          if (pin.style.display === 'none' || getComputedStyle(pin).display === 'none') {
            pin.classList.remove('enlarged', 'shrinking');
            void pin.offsetWidth;
            pin.classList.add('enlarged');
            setTimeout(() => pin.classList.remove('enlarged'), 700);
          }
          pin.style.display = '';
        } else {
          if (pin.style.display !== 'none' && getComputedStyle(pin).display !== 'none') {
            pin.classList.remove('enlarged', 'shrinking');
            void pin.offsetWidth;
            pin.classList.add('shrinking');
            setTimeout(() => {
              pin.classList.remove('shrinking');
              pin.style.display = 'none';
            }, 400);
          } else {
            pin.classList.remove('enlarged', 'shrinking');
            pin.style.display = 'none';
          }
        }
      } else {
        pin.classList.remove('enlarged', 'shrinking');
        pin.style.display = 'none';
      }
    });
  } else {
    document.querySelectorAll('.pin, .locator-pin').forEach(pin => {
      if (pin.style.display !== 'none' && getComputedStyle(pin).display !== 'none') {
        pin.classList.remove('enlarged', 'shrinking');
        void pin.offsetWidth;
        pin.classList.add('shrinking');
        setTimeout(() => {
          pin.classList.remove('shrinking');
          pin.style.display = 'none';
        }, 400);
      } else {
        pin.classList.remove('enlarged', 'shrinking');
        pin.style.display = 'none';
      }
    });
  }
}

hideAllPins();

document.querySelectorAll(".event").forEach(event => {
  const content = event.querySelector(".content");
  content.originalText = content.innerText.trim();
  content.innerHTML = "";
  event.isOpen = false;
});

document.querySelectorAll(".event").forEach(event => {
  event.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play();

    const content = event.querySelector(".content");
    const imagePath = content.dataset.image || null;

    event.classList.toggle("open");

    if (event.classList.contains("open")) {
      typeText(content, content.originalText, 5, imagePath);
      content.style.maxHeight = "none";
      content.style.opacity = "1";
      event.isOpen = true; 
    } else {
      if (content.typingInterval) {
        clearInterval(content.typingInterval);
        content.typingInterval = null;
      }

      if (!anyTypingInProgress()) {
        stopTypingSound();
      }

      stopTypingSound();

      content.style.maxHeight = "0px";
      content.style.opacity = "0";
      content.innerHTML = "";
      event.isOpen = false; 
    }

    updatePinsVisibility(); 
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, {
  threshold: 0.1
});

document.querySelectorAll(".event").forEach(event => {
  observer.observe(event);
});

document.querySelectorAll(".fade-in-on-scroll").forEach(element => {
  observer.observe(element);
});

const totalHearts = 10;

for (let i = 0; i < totalHearts; i++) {
  setTimeout(() => {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.textContent = '❤';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.setProperty('--i', Math.random());
    heart.style.animationDuration = (5 + Math.random() * 5) + 's';
    heart.style.fontSize = (10 + Math.random() * 20) + 'px';
    document.body.appendChild(heart);
  }, Math.random() * 4000);
}

const bgMusic = document.getElementById('bg-music');
const musicControl = document.getElementById('music-control');

bgMusic.volume = 0.1;


let musicPlaying = false;
let userToggledMusic = false;
let musicWasPlayingBeforeVideo = false;

bgMusic.play().then(() => {
  musicPlaying = true;
  musicControl.textContent = '🔊 Music On';
}).catch(() => {
  musicPlaying = false;
  musicControl.textContent = '🔈 Music Off (click to play)';
});

musicControl.addEventListener('click', () => {
  userToggledMusic = true;
  if (musicPlaying) {
    bgMusic.pause();
    musicPlaying = false;
    musicControl.textContent = '🔈 Music Off';
  } else {
    bgMusic.play();
    musicPlaying = true;
    musicControl.textContent = '🔊 Music On';
  }
});

const slides = document.querySelectorAll('.slide');
let currentSlide = 0;
const galleryRange = document.querySelector('.gallery-range');
const captionIndicator = document.querySelector('.gallery-caption-indicator');

function updateGalleryCaptionIndicator(index) {
  if (!captionIndicator) return;
  const slide = slides[index];
  if (!slide) {
    captionIndicator.textContent = '';
    return;
  }
  // Get caption from data-caption attribute
  const caption = slide.getAttribute('data-caption');
  captionIndicator.textContent = caption ? caption : '';
}

function handleMediaOnSlide(index) {
  const bgMusic = document.getElementById('bg-music');
  slides.forEach((slide, i) => {
    const video = slide.querySelector('video');
    if (video) {
      const source = video.querySelector('source');
      const lowVolumeVideos = ['8_vid.mp4'];
      if (
        source &&
        lowVolumeVideos.some(name => source.src.includes(name))
      ) {
        video.volume = 0.1;
      } else {
        video.volume = 1.0;
      }

      if (i === index) {
        video.onplay = () => {
          // Store if music was playing before video
          musicWasPlayingBeforeVideo = musicPlaying && !userToggledMusic;
          if (!video.paused) {
            bgMusic.pause();
            musicPlaying = false;
            musicControl.textContent = '🔈 Music Off';
          }
        };
        video.onpause = () => {
          // Resume music only if it was playing before and user hasn't toggled music off
          if (musicWasPlayingBeforeVideo && !userToggledMusic) {
            bgMusic.play();
            musicPlaying = true;
            musicControl.textContent = '🔊 Music On';
          }
        };
      } else {
        video.pause();
        video.currentTime = 0;
        video.onplay = null;
        video.onpause = null;
      }
    }
  });

  const current = slides[index];
  // Only auto-play music if not user-toggled and not a video slide
  if (!current.querySelector('video') && !userToggledMusic) {
    bgMusic.play();
    musicPlaying = true;
    musicControl.textContent = '🔊 Music On';
  }
}

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
  handleMediaOnSlide(index);
  // Sync range input if not already set
  if (galleryRange && Number(galleryRange.value) !== index) {
    galleryRange.value = index;
  }
  updateGalleryCaptionIndicator(index);
}

document.querySelector('.prev').addEventListener('click', () => {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
});

document.querySelector('.next').addEventListener('click', () => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
});

// Add this for the range input
if (galleryRange) {
  galleryRange.max = slides.length - 1;
  galleryRange.value = currentSlide;
  galleryRange.addEventListener('input', (e) => {
    currentSlide = Number(e.target.value);
    showSlide(currentSlide);
  });
}

// On page load, ensure correct music state and caption
showSlide(currentSlide);

(function () {
  let tooltip = document.getElementById('pin-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'pin-tooltip';
    tooltip.className = 'pin-tooltip';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);
  }

  function showTooltip(e, text) {
    tooltip.textContent = text;
    tooltip.style.display = 'block';
    const offsetY = 18;
    tooltip.style.left = (e.clientX + 8) + 'px';
    tooltip.style.top = (e.clientY + offsetY) + 'px';
  }

  function hideTooltip() {
    tooltip.style.display = 'none';
  }

  document.querySelectorAll('.pin').forEach(pin => {
    pin.addEventListener('mouseenter', e => {
      const message = pin.getAttribute('data-message');
      if (message) showTooltip(e, message);
    });
    pin.addEventListener('mousemove', e => {
      const message = pin.getAttribute('data-message');
      if (message) showTooltip(e, message);
    });
    pin.addEventListener('mouseleave', hideTooltip);
  });

  document.querySelectorAll('.locator-pin').forEach(pin => {
    pin.addEventListener('mouseenter', e => {
      const message = pin.getAttribute('data-message');
      if (message) showTooltip(e, message);
    });
    pin.addEventListener('mousemove', e => {
      const message = pin.getAttribute('data-message');
      if (message) showTooltip(e, message);
    });
    pin.addEventListener('mouseleave', hideTooltip);
  });

  const mapImg = document.querySelector('.map-img');
  if (mapImg) {
    mapImg.addEventListener('mousemove', function (e) {
      const rect = mapImg.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const yOffset = y - 3.5;
      const msg = `top: ${yOffset.toFixed(1)}%; left: ${x.toFixed(1)}%;`;
      showTooltip(e, msg);
    });
    mapImg.addEventListener('mouseleave', hideTooltip);
  }
})();

const loveReasons = [
  "You always make me smile, even on my worst days.",
  "Your laugh is my favorite sound.",
  "You support me in everything I do.",
  "You are so thoughtful and caring.",
  "You make every moment special.",
  "You inspire me to be a better person.",
  "You are my best friend and my love.",
  "I love how you always understand me.",
  "You make my world brighter.",
  "You are simply amazing, just the way you are.",
  "You listen to me, even when I ramble.",
  "You give the best hugs in the world.",
  "You make ordinary days feel magical.",
  "You believe in me when I doubt myself.",
  "You make me feel safe and loved.",
  "You always know how to cheer me up.",
  "You are patient and understanding.",
  "You make every adventure better.",
  "You accept me for who I am.",
  "You make my heart feel at home.",
  "You remember the little things.",
  "You make me laugh until my stomach hurts.",
  "You are my favorite hello and my hardest goodbye.",
  "You make life so much sweeter.",
  "You are my sunshine on cloudy days.",
  "You make me want to be the best version of myself.",
  "You are the reason I believe in love.",
  "You make every moment together unforgettable.",
  "You are my person, always and forever.",
  "You love me even when I’m not easy to love."
];

const loveBtn = document.getElementById('love-reason-btn');
let lastReasonIndex = -1;

function playRandomHeartPop() {
  const popNum = Math.floor(Math.random() * 5) + 1;
  const audio = new Audio(`audio/heart-pop${popNum}.mp3`);
  audio.volume = 0.7;
  audio.play();
}

function showLoveReason() {
  let idx;
  do {
    idx = Math.floor(Math.random() * loveReasons.length);
  } while (idx === lastReasonIndex && loveReasons.length > 1);
  lastReasonIndex = idx;

  const old = document.querySelector('.floating-reason-heart');
  if (old) old.remove();

  const div = document.createElement('div');
  div.className = 'floating-reason-heart';
  div.textContent = loveReasons[idx];

  // Position the popup above the button
  const btn = document.getElementById('love-reason-btn');
  if (btn) {
    const rect = btn.getBoundingClientRect();
    // Center horizontally above the button, with a small gap
    div.style.left = `${rect.left + rect.width / 2}px`;
    div.style.bottom = `calc(100vh - ${rect.top - 12}px)`; // 12px gap above button
    div.style.transform = 'translate(-50%, 0)';
  } else {
    // fallback to center if button not found
    div.style.left = '50%';
    div.style.bottom = '60px';
    div.style.transform = 'translateX(-50%)';
  }

  document.body.appendChild(div);

  playRandomHeartPop();

  setTimeout(() => {
    div.remove();
  }, 3500);
}

if (loveBtn) {
  loveBtn.addEventListener('click', showLoveReason);
}

// --- Gallery Preview on Hover ---
let galleryPreviewDiv = null;

function createGalleryPreview() {
  if (!galleryPreviewDiv) {
    galleryPreviewDiv = document.createElement('div');
    galleryPreviewDiv.className = 'gallery-preview';
    document.body.appendChild(galleryPreviewDiv);
  }
}

function showGalleryPreview(index, clientX, clientY) {
  if (!galleryPreviewDiv) createGalleryPreview();
  const slide = slides[index];
  if (!slide) return;

  // Clear previous content
  galleryPreviewDiv.innerHTML = '';

  // Clone image or video for preview
  let previewContent;
  const img = slide.querySelector('img');
  const video = slide.querySelector('video');
  if (img) {
    previewContent = document.createElement('img');
    previewContent.src = img.src;
    previewContent.alt = img.alt || '';
    previewContent.style.maxWidth = '180px';
    previewContent.style.maxHeight = '120px';
    previewContent.style.borderRadius = '10px';
    previewContent.style.display = 'block';
  } else if (video) {
    previewContent = document.createElement('video');
    previewContent.src = video.querySelector('source')?.src || '';
    previewContent.muted = true;
    previewContent.autoplay = true;
    previewContent.loop = true;
    previewContent.style.maxWidth = '180px';
    previewContent.style.maxHeight = '120px';
    previewContent.style.borderRadius = '10px';
    previewContent.style.display = 'block';
  } else {
    // Collage
    const collage = slide.querySelector('.collage, .collage-2x1');
    if (collage) {
      previewContent = collage.cloneNode(true);
      previewContent.style.maxWidth = '180px';
      previewContent.style.maxHeight = '120px';
      previewContent.style.borderRadius = '10px';
      previewContent.style.overflow = 'hidden';
    }
  }

  if (previewContent) {
    galleryPreviewDiv.appendChild(previewContent);
  }

  // Add caption
  const caption = slide.getAttribute('data-caption');
  if (caption) {
    const captionDiv = document.createElement('div');
    captionDiv.textContent = caption;
    captionDiv.style.fontFamily = "'Dancing Script', cursive";
    captionDiv.style.fontSize = '1em';
    captionDiv.style.color = '#d377f5';
    captionDiv.style.marginTop = '6px';
    captionDiv.style.textAlign = 'center';
    captionDiv.style.textShadow = '0 2px 8px rgba(106,47,184,0.13)';
    galleryPreviewDiv.appendChild(captionDiv);
  }

  // Position preview near cursor, but not off screen
  const previewWidth = 200;
  const previewHeight = 150;
  let left = clientX + 18;
  let top = clientY - previewHeight / 2;
  if (left + previewWidth > window.innerWidth) left = window.innerWidth - previewWidth - 10;
  if (top < 0) top = 10;
  if (top + previewHeight > window.innerHeight) top = window.innerHeight - previewHeight - 10;

  galleryPreviewDiv.style.display = 'block';
  galleryPreviewDiv.style.left = left + 'px';
  galleryPreviewDiv.style.top = top + 'px';
}

function hideGalleryPreview() {
  if (galleryPreviewDiv) {
    galleryPreviewDiv.style.display = 'none';
  }
}

const galleryRangeElem = document.querySelector('.gallery-range');
if (galleryRangeElem) {
  galleryRangeElem.addEventListener('mousemove', function (e) {
    const rect = galleryRangeElem.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const slideIdx = Math.max(0, Math.min(slides.length - 1, Math.round(percent * (slides.length - 1))));
    showGalleryPreview(slideIdx, e.clientX, e.clientY);
  });
  galleryRangeElem.addEventListener('mouseleave', hideGalleryPreview);
  galleryRangeElem.addEventListener('mouseout', hideGalleryPreview);
  galleryRangeElem.addEventListener('mouseenter', function (e) {
    const rect = galleryRangeElem.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const slideIdx = Math.max(0, Math.min(slides.length - 1, Math.round(percent * (slides.length - 1))));
    showGalleryPreview(slideIdx, e.clientX, e.clientY);
  });
}
