/**
 * Mobile Enhancements for ELI5 Visualizations
 * Adds touch gestures, responsive optimizations, and PWA install prompt
 */

class MobileEnhancements {
  constructor() {
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchStartTime = 0;
    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    this.init();
  }
  
  init() {
    // Register service worker for PWA
    this.registerServiceWorker();
    
    // Add touch gesture support
    if (this.isTouchDevice) {
      this.addTouchGestures();
      this.addMobileOptimizations();
    }
    
    // Add keyboard shortcuts
    this.addKeyboardShortcuts();
    
    // Setup install prompt
    this.setupInstallPrompt();
    
    // Optimize animations for mobile
    this.optimizeAnimations();
    
    console.log('[Mobile] Enhancements initialized');
  }
  
  /**
   * Register Service Worker for offline support
   */
  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then((registration) => {
            console.log('[SW] Registered successfully:', registration.scope);
            
            // Check for updates periodically
            setInterval(() => {
              registration.update();
            }, 60 * 60 * 1000); // Check every hour
          })
          .catch((error) => {
            console.error('[SW] Registration failed:', error);
          });
      });
    }
  }
  
  /**
   * Add touch gesture handlers
   */
  addTouchGestures() {
    let swipeThreshold = 50; // Minimum distance for swipe
    let tapThreshold = 200; // Maximum time for tap
    
    document.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
      this.touchStartTime = Date.now();
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = Date.now();
      
      const deltaX = touchEndX - this.touchStartX;
      const deltaY = touchEndY - this.touchStartY;
      const deltaTime = touchEndTime - this.touchStartTime;
      
      // Detect swipe left/right
      if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaY) < swipeThreshold) {
        if (deltaX > 0) {
          this.handleSwipeRight();
        } else {
          this.handleSwipeLeft();
        }
      }
      
      // Detect tap
      if (deltaTime < tapThreshold && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
        this.handleTap(e);
      }
      
      // Detect pinch zoom (two fingers)
      if (e.touches && e.touches.length === 2) {
        this.handlePinch(e);
      }
    }, { passive: true });
    
    // Prevent default scroll when swiping in visualizations
    const visualizationAreas = document.querySelectorAll('.visual-area');
    visualizationAreas.forEach(area => {
      area.addEventListener('touchmove', (e) => {
        e.preventDefault();
      }, { passive: false });
    });
  }
  
  handleSwipeLeft() {
    console.log('[Touch] Swipe left detected');
    
    // Navigate to next visualization if on index page
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
      const cards = document.querySelectorAll('.card');
      const currentCard = document.querySelector('.card:focus');
      
      if (currentCard) {
        const currentIndex = Array.from(cards).indexOf(currentCard);
        if (currentIndex < cards.length - 1) {
          cards[currentIndex + 1].focus();
          cards[currentIndex + 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
    
    // Trigger custom event for visualization pages
    window.dispatchEvent(new CustomEvent('swipeleft'));
  }
  
  handleSwipeRight() {
    console.log('[Touch] Swipe right detected');
    
    // Navigate to previous visualization if on index page
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
      const cards = document.querySelectorAll('.card');
      const currentCard = document.querySelector('.card:focus');
      
      if (currentCard) {
        const currentIndex = Array.from(cards).indexOf(currentCard);
        if (currentIndex > 0) {
          cards[currentIndex - 1].focus();
          cards[currentIndex - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
    
    // Trigger custom event for visualization pages
    window.dispatchEvent(new CustomEvent('swiperight'));
  }
  
  handleTap(e) {
    // Handle taps on interactive elements
    const target = e.target;
    
    // If tapping on a card, navigate to it
    if (target.classList.contains('card')) {
      const link = target.querySelector('a');
      if (link) {
        link.click();
      }
    }
  }
  
  handlePinch(e) {
    // Future: implement pinch to zoom for detailed views
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    const distance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
    
    // Dispatch pinch event with scale factor
    window.dispatchEvent(new CustomEvent('pinch', {
      detail: { distance }
    }));
  }
  
  /**
   * Add mobile-specific optimizations
   */
  addMobileOptimizations() {
    // Reduce animation complexity on low-end devices
    const isLowEnd = navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 2;
    
    if (isLowEnd) {
      document.body.classList.add('low-end-device');
      
      // Disable complex animations
      const style = document.createElement('style');
      style.textContent = `
        .low-end-device * {
          animation-duration: 0.3s !important;
          transition-duration: 0.2s !important;
        }
        .low-end-device .complex-animation {
          display: none;
        }
      `;
      document.head.appendChild(style);
      
      console.log('[Mobile] Low-end device detected, reducing animations');
    }
    
    // Optimize for small screens
    if (window.innerWidth < 768) {
      document.body.classList.add('mobile-screen');
      
      // Adjust font sizes
      const style = document.createElement('style');
      style.textContent = `
        .mobile-screen h1 { font-size: 1.8em !important; }
        .mobile-screen h2 { font-size: 1.5em !important; }
        .mobile-screen h3 { font-size: 1.2em !important; }
        .mobile-screen p { font-size: 1em !important; line-height: 1.6 !important; }
        .mobile-screen .container { padding: 15px !important; }
      `;
      document.head.appendChild(style);
      
      console.log('[Mobile] Small screen optimizations applied');
    }
    
    // Prevent zoom on double-tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, { passive: false });
  }
  
  /**
   * Add keyboard shortcuts for desktop users
   */
  addKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Space bar - play/pause animations
      if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('toggleAnimation'));
        console.log('[Keyboard] Toggle animation');
      }
      
      // Arrow keys - navigate between steps or visualizations
      if (e.code === 'ArrowLeft') {
        window.dispatchEvent(new CustomEvent('previousStep'));
        console.log('[Keyboard] Previous step');
      }
      
      if (e.code === 'ArrowRight') {
        window.dispatchEvent(new CustomEvent('nextStep'));
        console.log('[Keyboard] Next step');
      }
      
      // R - reset current visualization
      if (e.code === 'KeyR' && !e.ctrlKey && !e.metaKey) {
        window.dispatchEvent(new CustomEvent('resetVisualization'));
        console.log('[Keyboard] Reset visualization');
      }
      
      // H - show help/hints
      if (e.code === 'KeyH') {
        window.dispatchEvent(new CustomEvent('showHelp'));
        console.log('[Keyboard] Show help');
      }
      
      // Escape - close modals
      if (e.code === 'Escape') {
        const modal = document.querySelector('.quiz-modal, .modal');
        if (modal) {
          modal.remove();
        }
      }
    });
  }
  
  /**
   * Setup PWA install prompt
   */
  setupInstallPrompt() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('[PWA] beforeinstallprompt event fired');
      e.preventDefault();
      deferredPrompt = e;
      
      // Show install button
      this.showInstallButton(deferredPrompt);
    });
    
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App installed successfully');
      this.hideInstallButton();
      
      // Track installation in progress
      if (typeof ProgressTracker !== 'undefined') {
        const tracker = new ProgressTracker();
        tracker.data.installedApp = true;
        tracker.save();
      }
    });
  }
  
  showInstallButton(promptEvent) {
    // Create install button if not exists
    let installBtn = document.getElementById('pwa-install-btn');
    
    if (!installBtn) {
      installBtn = document.createElement('button');
      installBtn.id = 'pwa-install-btn';
      installBtn.innerHTML = '📱 安装应用';
      installBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        font-size: 1em;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        z-index: 999;
        transition: transform 0.2s;
      `;
      installBtn.onmouseover = () => installBtn.style.transform = 'scale(1.05)';
      installBtn.onmouseout = () => installBtn.style.transform = 'scale(1)';
      
      document.body.appendChild(installBtn);
    }
    
    installBtn.onclick = async () => {
      installBtn.style.display = 'none';
      
      try {
        await promptEvent.prompt();
        const result = await promptEvent.userChoice;
        console.log(`[PWA] User response: ${result.outcome}`);
      } catch (error) {
        console.error('[PWA] Install prompt failed:', error);
      }
      
      deferredPrompt = null;
    };
  }
  
  hideInstallButton() {
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
      installBtn.style.display = 'none';
    }
  }
  
  /**
   * Optimize animations for better performance
   */
  optimizeAnimations() {
    // Use Intersection Observer to pause off-screen animations
    if ('IntersectionObserver' in window) {
      const animatedElements = document.querySelectorAll('.node, .bar, .animated');
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
          } else {
            entry.target.style.animationPlayState = 'paused';
          }
        });
      }, {
        threshold: 0.1
      });
      
      animatedElements.forEach(el => observer.observe(el));
      
      console.log('[Mobile] Intersection Observer setup for animations');
    }
    
    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.add('reduce-motion');
      
      const style = document.createElement('style');
      style.textContent = `
        .reduce-motion *,
        .reduce-motion *::before,
        .reduce-motion *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
      document.head.appendChild(style);
      
      console.log('[Mobile] Reduced motion preference respected');
    }
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new MobileEnhancements();
  });
} else {
  new MobileEnhancements();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobileEnhancements;
}
