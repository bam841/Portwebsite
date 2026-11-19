/**
 * Bam Zapico Portfolio — Interactivity, Tab Controls & Optimized 3D Monitor Engine
 */

let isFullscreenActive = false;
let isTransitioning = false;
let wholePcTimer = null;

function switchTab(tabId) {
  const tabs = ['home', 'work', 'about', 'services', 'contact'];
  
  // If in fullscreen monitor, exit first
  if (isFullscreenActive) {
    exitFullscreenState();
  }

  tabs.forEach(id => {
    const pane = document.getElementById('tab-' + id);
    if (pane) {
      if (id === tabId) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    }
  });

  const subNav = document.getElementById('subpage-nav');
  if (subNav) {
    if (tabId === 'home') {
      subNav.classList.add('hidden');
      subNav.classList.remove('flex');
    } else {
      subNav.classList.remove('hidden');
      subNav.classList.add('flex');
    }
  }

  // Update active state in sub navigation buttons
  tabs.forEach(id => {
    const subButtons = document.querySelectorAll('.sub-nav-' + id);
    subButtons.forEach(btn => {
      if (id === tabId) {
        btn.classList.add('text-orange-600', 'font-extrabold');
        btn.classList.remove('text-slate-600');
      } else {
        btn.classList.remove('text-orange-600', 'font-extrabold');
        btn.classList.add('text-slate-600');
      }
    });
  });

  // Re-trigger domino animations on home return
  if (tabId === 'home') {
    triggerHomeDominoAnimations();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function activateDomino(el) {
  if (!el) return;
  el.classList.remove('domino-active');
  void el.offsetWidth; // Force DOM reflow to restart CSS animation
  el.classList.add('domino-active');
  
  // Also activate child domino items
  const children = el.querySelectorAll('.domino-item, .domino-item-down, .picture-pop-in, .pill-pop-in, .aura-bloom');
  children.forEach(child => {
    child.classList.remove('domino-active');
    void child.offsetWidth;
    child.classList.add('domino-active');
  });
}

function deactivateDomino(el) {
  if (!el) return;
  el.classList.remove('domino-active');
  const children = el.querySelectorAll('.domino-item, .domino-item-down, .picture-pop-in, .pill-pop-in, .aura-bloom');
  children.forEach(child => {
    child.classList.remove('domino-active');
  });
}

function triggerHomeDominoAnimations() {
  const homePane = document.getElementById('tab-home');
  if (!homePane) return;
  const clusters = homePane.querySelectorAll(
    '[data-purpose="hero-left-copy"], ' +
    '[data-purpose="hero-portrait-center"], ' +
    '[data-purpose="hero-portrait-mobile"], ' +
    '[data-purpose="hero-right-details"], ' +
    '[data-purpose="top-navigation-bar"], ' +
    '[data-purpose="github-contributions-deck"], ' +
    '.domino-item, .domino-item-down, .picture-pop-in'
  );
  clusters.forEach(el => activateDomino(el));
}

function initScrollDominoObserver() {
  if (!('IntersectionObserver' in window)) {
    // Graceful fallback for non-supporting browsers
    document.querySelectorAll('.domino-item, .domino-item-down, .picture-pop-in, .pill-pop-in, .aura-bloom').forEach(el => {
      el.classList.add('domino-active');
    });
    return;
  }

  const selectors = [
    '[data-purpose="top-navigation-bar"]',
    '[data-purpose="hero-left-copy"]',
    '[data-purpose="hero-portrait-center"]',
    '[data-purpose="hero-portrait-mobile"]',
    '[data-purpose="hero-right-details"]',
    '[data-purpose="github-contributions-deck"]',
    '.domino-item',
    '.domino-item-down',
    '.picture-pop-in'
  ];

  const rawElements = document.querySelectorAll(selectors.join(', '));
  const observedSet = new Set();

  rawElements.forEach(el => {
    if (!el) return;
    const parentCluster = el.closest(
      '[data-purpose="hero-left-copy"], ' +
      '[data-purpose="hero-portrait-center"], ' +
      '[data-purpose="hero-portrait-mobile"], ' +
      '[data-purpose="hero-right-details"], ' +
      '[data-purpose="github-contributions-deck"]'
    );
    if (parentCluster && parentCluster !== el) {
      return;
    }
    observedSet.add(el);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) {
        // Viewport / Screen is ON IT! Trigger animation
        activateDomino(el);
      } else {
        // Scrolled completely off screen: reset so it re-triggers every time screen is on it
        deactivateDomino(el);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -20px 0px',
    threshold: 0.05
  });

  observedSet.forEach(el => observer.observe(el));
}

function scrollToAboutMonitor() {
  const homePane = document.getElementById('tab-home');
  if (homePane && !homePane.classList.contains('active')) {
    switchTab('home');
  }
  
  const monitorSec = document.getElementById('section-about-monitor');
  if (monitorSec) {
    window.scrollTo({ top: monitorSec.offsetTop, behavior: 'smooth' });
    setTimeout(() => {
      enterFullscreenState(false);
    }, 550);
  }
}

// 3D Monitor Perspective Controller
function setMonitorState(state) {
  if (isFullscreenActive) return; // Don't tilt when fullscreen

  const monitor = document.getElementById('monitor-box');
  const btns = {
    angled: document.getElementById('btn-ang'),
    front: document.getElementById('btn-front'),
    tilt: document.getElementById('btn-tilt')
  };

  if (!monitor) return;

  monitor.classList.remove('monitor-state-angled', 'monitor-state-front', 'monitor-state-tilt');

  if (state === 'angled') {
    monitor.classList.add('monitor-state-angled');
  } else if (state === 'front') {
    monitor.classList.add('monitor-state-front');
  } else if (state === 'tilt') {
    monitor.classList.add('monitor-state-tilt');
  }

  // Update button active styles
  Object.keys(btns).forEach(key => {
    if (btns[key]) {
      if (key === state) {
        btns[key].className = 'monitor-btn px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-orange-600 transition-all shadow-md cursor-pointer';
      } else {
        btns[key].className = 'monitor-btn px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer';
      }
    }
  });
}

// Check if the whole PC (monitor + stand base) is completely settled and visible inside the viewport
function isWholePcFullySeen() {
  const pc = document.getElementById('monitor-container');
  if (!pc) return false;

  const rect = pc.getBoundingClientRect();
  const vh = window.innerHeight;

  // If container fits with vertical margins in current window:
  if (rect.height <= (vh - 30)) {
    // Both top bezel and bottom aluminum base must be comfortably inside the viewport
    return rect.top >= 15 && rect.bottom <= (vh - 15);
  }

  // Fallback for compact/short viewports: requires at least 95% visible
  const visibleTop = Math.max(0, rect.top);
  const visibleBottom = Math.min(vh, rect.bottom);
  const visibleHeight = Math.max(0, visibleBottom - visibleTop);
  return rect.height > 0 && (visibleHeight / rect.height) >= 0.95;
}

// Fullscreen State Functions
function enterFullscreenState(scrollIntoPlace = false) {
  if (isFullscreenActive || isTransitioning) return;

  const monitorSec = document.getElementById('section-about-monitor');
  const monitorViewport = document.getElementById('monitor-container');
  const monitorBox = document.getElementById('monitor-box');
  const screenInner = document.getElementById('screen-inner-scroll');
  const stand = document.getElementById('monitor-stand');
  const introBar = document.getElementById('monitor-intro-bar');
  const btnToggle = document.getElementById('btn-monitor-toggle');
  const btnMinimize = document.getElementById('btn-monitor-minimize');

  isFullscreenActive = true;
  isTransitioning = true;

  if (monitorSec) monitorSec.classList.add('is-fullscreen');
  if (monitorViewport) monitorViewport.classList.add('is-fullscreen');
  if (monitorBox) {
    monitorBox.classList.remove('monitor-state-angled', 'monitor-state-tilt');
    monitorBox.classList.add('is-fullscreen');
  }
  if (screenInner) screenInner.classList.add('is-fullscreen');
  if (stand) stand.classList.add('is-hidden');
  if (introBar) introBar.classList.add('is-hidden');
  if (btnToggle) btnToggle.classList.add('hidden');
  if (btnMinimize) {
    btnMinimize.classList.remove('hidden');
    btnMinimize.classList.add('inline-flex');
  }

  if (scrollIntoPlace && monitorSec) {
    window.scrollTo({ top: monitorSec.offsetTop, behavior: 'smooth' });
  }

  setTimeout(() => {
    isTransitioning = false;
  }, 750);
}

function exitFullscreenState() {
  const monitorSec = document.getElementById('section-about-monitor');
  const monitorViewport = document.getElementById('monitor-container');
  const monitorBox = document.getElementById('monitor-box');
  const screenInner = document.getElementById('screen-inner-scroll');
  const stand = document.getElementById('monitor-stand');
  const introBar = document.getElementById('monitor-intro-bar');
  const btnToggle = document.getElementById('btn-monitor-toggle');
  const btnMinimize = document.getElementById('btn-monitor-minimize');

  isFullscreenActive = false;

  if (wholePcTimer !== null) {
    clearTimeout(wholePcTimer);
    wholePcTimer = null;
  }

  if (monitorSec) monitorSec.classList.remove('is-fullscreen');
  if (monitorViewport) monitorViewport.classList.remove('is-fullscreen');
  if (monitorBox) {
    monitorBox.classList.remove('is-fullscreen');
    setMonitorState('front');
  }
  if (screenInner) {
    screenInner.classList.remove('is-fullscreen');
    screenInner.scrollTop = 0;
  }
  if (stand) stand.classList.remove('is-hidden');
  if (introBar) introBar.classList.remove('is-hidden');
  if (btnToggle) btnToggle.classList.remove('hidden');
  if (btnMinimize) {
    btnMinimize.classList.add('hidden');
    btnMinimize.classList.remove('inline-flex');
  }
}

function minimizeMonitorFullscreen() {
  if (isTransitioning) return;
  isTransitioning = true;

  exitFullscreenState();

  // Smoothly scroll back to the top of home
  window.scrollTo({ top: 0, behavior: 'smooth' });

  setTimeout(() => {
    isTransitioning = false;
  }, 750);
}

function toggleMonitorFullscreen() {
  if (isFullscreenActive) {
    minimizeMonitorFullscreen();
  } else {
    enterFullscreenState(true);
  }
}

// Halfway Visibility Trigger & Scroll-Out Detection
function initScrollMonitorZoom() {
  const monitorBox = document.getElementById('monitor-box');
  const monitorSec = document.getElementById('section-about-monitor');
  const screenInner = document.getElementById('screen-inner-scroll');

  if (!monitorBox || !monitorSec) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (isTransitioning) return;

    // Only apply on the Home tab
    const homeTab = document.getElementById('tab-home');
    if (!homeTab || !homeTab.classList.contains('active')) return;

    const currentScrollY = window.scrollY;
    const isScrollingDown = currentScrollY > lastScrollY;
    lastScrollY = currentScrollY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        const wholeSeen = isWholePcFullySeen();

        // 1. Transition takes effect AFTER the whole monitor is seen on screen:
        if (!isFullscreenActive && wholeSeen) {
          // If the user has scrolled the whole PC comfortably into view, start the settle timer
          if (wholePcTimer === null) {
            wholePcTimer = setTimeout(() => {
              if (!isFullscreenActive && isWholePcFullySeen()) {
                enterFullscreenState(true);
              }
              wholePcTimer = null;
            }, 420); // Deliberate settle pause so the user sees the complete 3D monitor sitting on screen first
          }
        } else if (!wholeSeen && wholePcTimer !== null) {
          // Cancel timer if the whole PC was not kept in full view
          clearTimeout(wholePcTimer);
          wholePcTimer = null;
        }

        // 2. Minimize Trigger: if user scrolls back up above the monitor section
        if (isFullscreenActive && !isScrollingDown && currentScrollY < (monitorSec.offsetTop - 120)) {
          minimizeMonitorFullscreen();
        }

        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // 3. Detect "Scroll Out" on mouse wheel inside fullscreen OS
  if (screenInner) {
    screenInner.addEventListener('wheel', (e) => {
      if (!isFullscreenActive || isTransitioning) return;

      // When user is at the top of the OS screen and scrolls up, smoothly minimize back to home!
      if (screenInner.scrollTop <= 0 && e.deltaY < -15) {
        minimizeMonitorFullscreen();
      }
    }, { passive: true });

    // 4. Detect "Scroll Out" on touch devices (Swipe down at top)
    let touchStartY = 0;
    screenInner.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    screenInner.addEventListener('touchmove', (e) => {
      if (!isFullscreenActive || isTransitioning) return;

      if (e.touches.length > 0) {
        const currentY = e.touches[0].clientY;
        const diff = currentY - touchStartY;
        // Swiping down while at the top of the screen
        if (screenInner.scrollTop <= 0 && diff > 45) {
          minimizeMonitorFullscreen();
        }
      }
    }, { passive: true });
  }
}

// AJAX Contact Form Handler
function setupContactForm() {
  const contactForm = document.getElementById('portfolio-contact-form');
  const statusMsg = document.getElementById('contact-status-msg');

  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerText : 'Send';

    const name = (document.getElementById('contact-name') || {}).value || '';
    const email = (document.getElementById('contact-email') || {}).value || '';
    const budget = (document.getElementById('contact-budget') || {}).value || '';
    const brief = (document.getElementById('contact-brief') || {}).value || '';

    const checkedServices = [];
    document.querySelectorAll('input[name="services"]:checked').forEach(cb => {
      checkedServices.push(cb.value);
    });

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerText = 'Sending Inquiry...';
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          services: checkedServices,
          budget: budget,
          brief: brief
        })
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        contactForm.reset();
        if (statusMsg) {
          statusMsg.className = 'p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold mb-4 block';
          statusMsg.innerText = result.message || 'Thank you! Your message has been sent successfully.';
        }
      } else {
        if (statusMsg) {
          statusMsg.className = 'p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold mb-4 block';
          statusMsg.innerText = result.message || 'An error occurred while submitting. Please try again.';
        }
      }
    } catch (err) {
      if (statusMsg) {
        statusMsg.className = 'p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold mb-4 block';
        statusMsg.innerText = 'Network error. Please try again later or reach out directly via GitHub.';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
      }
    }
  });
}

// GitHub Contribution Calendar Heatmap Controller
let currentHeatmapYear = '2026';

async function initGitHubHeatmap() {
  const container = document.getElementById('gh-heatmap-matrix');
  const countEl = document.getElementById('gh-total-count');
  if (!container) return;

  try {
    const res = await fetch('/api/github-contributions?username=bam841');
    const data = await res.json();
    window._ghContributionsData = data;
    renderHeatmap(data, currentHeatmapYear);
  } catch (err) {
    console.error('Failed to load GitHub contributions', err);
    container.innerHTML = '<div class="text-xs text-slate-500 py-4">Unable to load live GitHub feed.</div>';
  }
}

function renderHeatmap(data, year) {
  const container = document.getElementById('gh-heatmap-matrix');
  const countEl = document.getElementById('gh-total-count');
  const monthLabelsEl = document.getElementById('gh-month-labels');
  if (!container) return;

  const contributions = data.contributions || [];
  const totals = data.total || {};
  const yearCount = totals[year] || totals['2026'] || 331;

  if (countEl) {
    countEl.innerText = `${yearCount} contributions in ${year === '2026' ? 'the last year' : year}`;
  }

  // Filter contributions for the selected year or 52 weeks
  let days = contributions;
  if (year && year !== '2026') {
    days = contributions.filter(d => d.date && d.date.startsWith(year));
  }

  // Ensure tooltips exist
  let tooltip = document.getElementById('gh-global-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'gh-global-tooltip';
    tooltip.className = 'gh-tooltip hidden';
    document.body.appendChild(tooltip);
  }

  // Build grid HTML
  container.innerHTML = '';
  
  // Create columns of 7 days (weeks)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let monthPositions = [];
  let currentMonth = -1;

  days.forEach((day, idx) => {
    const cell = document.createElement('div');
    const lvl = typeof day.level === 'number' ? day.level : 0;
    cell.className = `gh-cell gh-lvl-${lvl}`;
    cell.setAttribute('data-date', day.date);
    cell.setAttribute('data-count', day.count);

    // Track month changes for header labels
    if (idx % 7 === 0 && day.date) {
      const colDate = new Date(day.date);
      const m = colDate.getMonth();
      if (m !== currentMonth) {
        monthPositions.push({
          month: months[m],
          colIndex: Math.floor(idx / 7)
        });
        currentMonth = m;
      }
    }

    cell.addEventListener('mouseenter', (e) => {
      const dateObj = new Date(day.date + 'T00:00:00');
      const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const c = day.count;
      const text = c === 0 ? `No contributions on ${dateStr}` : `${c} contribution${c > 1 ? 's' : ''} on ${dateStr}`;
      
      tooltip.innerText = text;
      tooltip.classList.remove('hidden');
      const rect = cell.getBoundingClientRect();
      tooltip.style.left = `${rect.left + rect.width / 2}px`;
      tooltip.style.top = `${rect.top - 8}px`;
    });

    cell.addEventListener('mouseleave', () => {
      tooltip.classList.add('hidden');
    });

    container.appendChild(cell);
  });

  // Render month header labels
  if (monthLabelsEl) {
    monthLabelsEl.innerHTML = '';
    const numCols = Math.ceil(days.length / 7);
    const colWidth = 13; // 10px cell + 3px gap
    monthPositions.forEach(mp => {
      const span = document.createElement('span');
      span.innerText = mp.month;
      span.style.position = 'absolute';
      span.style.left = `${mp.colIndex * colWidth}px`;
      monthLabelsEl.appendChild(span);
    });
  }
}

function switchHeatmapYear(year) {
  currentHeatmapYear = year;
  const buttons = document.querySelectorAll('.gh-year-btn');
  buttons.forEach(btn => {
    if (btn.getAttribute('data-year') === year) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  if (window._ghContributionsData) {
    renderHeatmap(window._ghContributionsData, year);
  }
}

// Window Load Initialization
window.addEventListener('DOMContentLoaded', () => {
  setupContactForm();
  initScrollMonitorZoom();
  initGitHubHeatmap();
  initScrollDominoObserver();

  // Escape key shortcut to exit fullscreen and return to Home
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isFullscreenActive) {
      minimizeMonitorFullscreen();
    }
  });

  // Mouse Parallax Effect on 3D Monitor when not fullscreen
  const monitorContainer = document.getElementById('monitor-container');
  const monitorBox = document.getElementById('monitor-box');
  if (monitorContainer && monitorBox) {
    monitorContainer.addEventListener('mousemove', (e) => {
      if (isFullscreenActive || !monitorBox.classList.contains('monitor-state-front')) return;
      const rect = monitorContainer.getBoundingClientRect();
      const x = e.clientX - rect.left - (rect.width / 2);
      const y = e.clientY - rect.top - (rect.height / 2);
      const rotX = -(y / rect.height) * 8;
      const rotY = (x / rect.width) * 12;
      monitorBox.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.01)`;
    });
    monitorContainer.addEventListener('mouseleave', () => {
      if (isFullscreenActive) return;
      if (monitorBox.classList.contains('monitor-state-front')) {
        monitorBox.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
      }
    });
  }
});
