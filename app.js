/* ==========================================================
   MOHAMMED SHAKIB - EXACT 3D HOLOGRAPHIC SMART CARD ENGINE
   Interactive Parallax Tilt & Export Suite
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const cardWrapper = document.getElementById('cardWrapper');
  const hologramCard = document.getElementById('hologramCard');
  const cardGlare = document.getElementById('cardGlare');
  const flipCardBtn = document.getElementById('flipCardBtn');
  const flipReturnBtn = document.getElementById('flipReturnBtn');
  const downloadCardBtn = document.getElementById('downloadCardBtn');
  const openIgProfileBtn = document.getElementById('openIgProfileBtn');
  const themeBtns = document.querySelectorAll('.theme-btn');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const photoUploadInput = document.getElementById('photoUploadInput');
  const cardAvatarImg = document.getElementById('cardAvatarImg');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');

  // Edit Modal Elements
  const editModal = document.getElementById('editModal');
  const editCardBtn = document.getElementById('editCardBtn');
  const closeEditModalBtn = document.getElementById('closeEditModalBtn');
  const saveCardBtn = document.getElementById('saveCardBtn');

  let isFlipped = false;
  let soundEnabled = true;

  // Web Audio Synthesizer
  let audioCtx = null;
  function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  function playCyberSound(type = 'click') {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1400, audioCtx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.08);
      } else if (type === 'flip') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1100, audioCtx.currentTime + 0.22);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.22);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.22);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime);
        osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.08);
        osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.16);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.32);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.32);
      }
    } catch (e) {}
  }

  // Vector SVG Crystal-Clear QR Code Generation (Zero Blur on any display)
  if (cardQrcode && typeof QRCode !== 'undefined') {
    cardQrcode.innerHTML = '';
    try {
      new QRCode(cardQrcode, {
        text: "https://instagram.com/official_shakib13",
        width: 280,
        height: 280,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
        useSVG: true
      });
    } catch (e) {
      new QRCode(cardQrcode, {
        text: "https://instagram.com/official_shakib13",
        width: 500,
        height: 500,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    }

    // Clean any unwanted title tooltips and apply vector rendering
    setTimeout(() => {
      const qrSvg = cardQrcode.querySelector('svg');
      if (qrSvg) {
        qrSvg.style.width = '100%';
        qrSvg.style.height = '100%';
        qrSvg.style.shapeRendering = 'crispEdges';
        qrSvg.removeAttribute('title');
      }
      const qrImg = cardQrcode.querySelector('img');
      if (qrImg) qrImg.removeAttribute('title');
      const qrCanvas = cardQrcode.querySelector('canvas');
      if (qrCanvas) qrCanvas.removeAttribute('title');
    }, 100);
  }

  // 3D Parallax Tilt Physics
  let bounds;
  function updateBounds() {
    if (cardWrapper) bounds = cardWrapper.getBoundingClientRect();
  }
  updateBounds();
  window.addEventListener('resize', updateBounds);
  window.addEventListener('scroll', updateBounds);

  function handleMouseMove(e) {
    if (isFlipped) return;
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    if (!bounds) updateBounds();
    const leftX = mouseX - bounds.x;
    const topY = mouseY - bounds.y;
    const center = {
      x: leftX - bounds.width / 2,
      y: topY - bounds.height / 2
    };

    const maxTilt = 22; // Degree of 3D tilt
    const rotateX = (center.y / (bounds.height / 2)) * -maxTilt;
    const rotateY = (center.x / (bounds.width / 2)) * maxTilt;

    hologramCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
    
    // Dynamic specular glare reflection
    const glareX = (leftX / bounds.width) * 100;
    const glareY = (topY / bounds.height) * 100;
    if (cardGlare) {
      cardGlare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.06) 50%, transparent 80%)`;
    }
  }

  function handleMouseLeave() {
    if (isFlipped) return;
    hologramCard.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    if (cardGlare) cardGlare.style.background = '';
  }

  if (cardWrapper) {
    cardWrapper.addEventListener('mousemove', handleMouseMove);
    cardWrapper.addEventListener('mouseleave', handleMouseLeave);

    // Mobile Touch Parallax Tilt
    cardWrapper.addEventListener('touchmove', (e) => {
      if (isFlipped || !e.touches[0]) return;
      const touch = e.touches[0];
      handleMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    }, { passive: true });

    cardWrapper.addEventListener('touchend', handleMouseLeave);
  }

  // Mobile Device Orientation Gyro Tilt
  if (window.DeviceOrientationEvent && 'ontouchstart' in window) {
    window.addEventListener('deviceorientation', (e) => {
      if (isFlipped) return;
      const gamma = e.gamma || 0;
      const beta = e.beta || 0;
      const tiltX = Math.min(Math.max((beta - 45) * 0.5, -20), 20);
      const tiltY = Math.min(Math.max(gamma * 0.6, -20), 20);
      hologramCard.style.transform = `rotateX(${-tiltX}deg) rotateY(${tiltY}deg)`;
    });
  }

  // Flip Card Handler
  function toggleFlip() {
    playCyberSound('flip');
    isFlipped = !isFlipped;
    if (isFlipped) {
      hologramCard.classList.add('flipped');
    } else {
      hologramCard.classList.remove('flipped');
      hologramCard.style.transform = `rotateX(0deg) rotateY(0deg)`;
    }
  }

  if (flipCardBtn) flipCardBtn.addEventListener('click', toggleFlip);
  if (flipReturnBtn) flipReturnBtn.addEventListener('click', toggleFlip);

  // Password Protected Photo Upload Handler
  const securePhotoInput = document.getElementById('securePhotoInput');
  const modalPreviewImg = document.getElementById('modalPreviewImg');

  if (securePhotoInput) {
    securePhotoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (cardAvatarImg) cardAvatarImg.src = ev.target.result;
          if (modalPreviewImg) modalPreviewImg.src = ev.target.result;
          playCyberSound('success');
          showToast('✅ Profile Photo Updated!');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Edit Card Modal (Protected with Master Password)
  const modalAuthBox = document.getElementById('modalAuthBox');
  const modalEditFields = document.getElementById('modalEditFields');
  const adminPasswordInput = document.getElementById('adminPasswordInput');
  const unlockEditBtn = document.getElementById('unlockEditBtn');
  const authErrorMsg = document.getElementById('authErrorMsg');
  const modalTitle = document.getElementById('modalTitle');

  const MASTER_PASSWORD = 'MOHDshakib@123';

  function resetModalState() {
    if (modalAuthBox) modalAuthBox.style.display = 'block';
    if (modalEditFields) modalEditFields.style.display = 'none';
    if (adminPasswordInput) adminPasswordInput.value = '';
    if (authErrorMsg) authErrorMsg.style.display = 'none';
    if (modalTitle) modalTitle.innerHTML = '<i class="fa-solid fa-shield-halved" style="color:var(--neon-primary)"></i> Security Verification';
  }

  function handleUnlock() {
    const entered = adminPasswordInput ? adminPasswordInput.value : '';
    if (entered === MASTER_PASSWORD) {
      playCyberSound('success');
      if (modalAuthBox) modalAuthBox.style.display = 'none';
      if (modalEditFields) modalEditFields.style.display = 'block';
      if (modalTitle) modalTitle.innerHTML = '<i class="fa-solid fa-pen-to-square" style="color:var(--neon-primary)"></i> Edit Hologram Card';
      showToast('🔓 Security Verified! Access Granted.');
    } else {
      playCyberSound('click');
      if (authErrorMsg) authErrorMsg.style.display = 'block';
      if (adminPasswordInput) {
        adminPasswordInput.style.borderColor = '#ff3040';
        adminPasswordInput.focus();
      }
      showToast('❌ Incorrect Password! Access Denied.');
    }
  }

  if (unlockEditBtn) unlockEditBtn.addEventListener('click', handleUnlock);
  if (adminPasswordInput) {
    adminPasswordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleUnlock();
    });
    adminPasswordInput.addEventListener('input', () => {
      if (authErrorMsg) authErrorMsg.style.display = 'none';
      adminPasswordInput.style.borderColor = '';
    });
  }

  if (editCardBtn) {
    editCardBtn.addEventListener('click', () => {
      playCyberSound('click');
      resetModalState();
      editModal.classList.add('active');
      setTimeout(() => {
        if (adminPasswordInput) adminPasswordInput.focus();
      }, 200);
    });
  }

  if (closeEditModalBtn) {
    closeEditModalBtn.addEventListener('click', () => {
      editModal.classList.remove('active');
      resetModalState();
    });
  }

  if (saveCardBtn) {
    saveCardBtn.addEventListener('click', () => {
      playCyberSound('success');
      const fullName = document.getElementById('editFullName').value;
      const tagline = document.getElementById('editTagline').value;
      const handle = document.getElementById('editHandle').value;
      const waUser = document.getElementById('editWhatsapp') ? document.getElementById('editWhatsapp').value : 'itz_me_shakib123';
      const posts = document.getElementById('editPosts').value;
      const followers = document.getElementById('editFollowers').value;
      const following = document.getElementById('editFollowing').value;

      if (document.getElementById('cardFullName')) document.getElementById('cardFullName').innerText = fullName;
      if (document.getElementById('cardTagline')) document.getElementById('cardTagline').innerText = `@${handle} • ${tagline}`;
      
      const cardCtaBtn = document.getElementById('cardCtaBtn');
      if (cardCtaBtn) cardCtaBtn.href = `https://instagram.com/${handle}`;

      const cardWaBtn = document.getElementById('cardWaBtn');
      if (cardWaBtn) {
        cardWaBtn.href = `https://wa.me/?text=Hello%20Shakib%20(@${waUser})`;
        cardWaBtn.title = `WhatsApp: @${waUser}`;
      }

      const whatsappLinkCard = document.getElementById('whatsappLinkCard');
      if (whatsappLinkCard) {
        whatsappLinkCard.href = `https://wa.me/?text=Hello%20Shakib%20(@${waUser})`;
        whatsappLinkCard.querySelector('small').innerText = `@${waUser}`;
      }

      editModal.classList.remove('active');
      resetModalState();
      showToast('🔒 Changes Saved & Card Locked!');
    });
  }

  // Theme Switcher
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playCyberSound('click');
      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.body.className = btn.getAttribute('data-theme');
      showToast(`Switched Theme: ${btn.getAttribute('title')}`);
    });
  });

  // Sound FX Toggle
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundToggleBtn.innerHTML = soundEnabled 
        ? '<i class="fa-solid fa-volume-high"></i>' 
        : '<i class="fa-solid fa-volume-xmark"></i>';
      showToast(soundEnabled ? 'Cyber Sound FX Enabled' : 'Cyber Sound FX Muted');
      if (soundEnabled) playCyberSound('click');
    });
  }

  // Download Hologram Card as HD PNG
  if (downloadCardBtn) {
    downloadCardBtn.addEventListener('click', async () => {
      playCyberSound('success');
      showToast('Generating HD Hologram Card...');

      const prevTransform = hologramCard.style.transform;
      hologramCard.style.transform = 'none';

      try {
        const target = isFlipped 
          ? document.querySelector('.card-back') 
          : document.getElementById('cardCaptureTarget');

        const canvas = await html2canvas(target, {
          backgroundColor: null,
          scale: 3, // High DPI HD Export
          useCORS: true,
          logging: false
        });

        const link = document.createElement('a');
        link.download = `Mohammed_Shakib_Instagram_Hologram_Card.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showToast('✅ Hologram Card Saved in HD!');
      } catch (err) {
        showToast('Hologram Card Downloaded!');
      } finally {
        hologramCard.style.transform = prevTransform;
      }
    });
  }

  if (openIgProfileBtn) {
    openIgProfileBtn.addEventListener('click', () => {
      window.open('https://instagram.com/official_shakib13', '_blank');
    });
  }

  // Card Bottom Heart Button
  const cardHeartBtn = document.getElementById('cardHeartBtn');
  if (cardHeartBtn) {
    let cardLikes = 1420;
    let isHearted = false;
    cardHeartBtn.addEventListener('click', () => {
      playCyberSound('success');
      isHearted = !isHearted;
      cardLikes += isHearted ? 1 : -1;
      const countStr = cardLikes >= 1000 ? (cardLikes / 1000).toFixed(1) + 'K' : cardLikes;
      cardHeartBtn.innerHTML = `<i class="fa-solid fa-heart" style="color:${isHearted ? '#ff3040' : '#fff'};"></i> <span>${countStr}</span>`;
      showToast(isHearted ? 'Liked Card! ❤️' : 'Unliked');
    });
  }

  // Photo Preview
  window.openPhotoPreview = function(src, label) {
    playCyberSound('click');
    showToast(`Viewing: ${label}`);
  };

  // Toast Helper
  let toastTimer;
  function showToast(msg) {
    if (toastMsg) toastMsg.innerText = msg;
    if (toast) {
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
    }
  }

  // Starfield Particles Canvas
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.4,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.6 + 0.2
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ff2a85';
        ctx.fill();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

});
