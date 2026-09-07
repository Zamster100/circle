/* ===== password gate ===== */

(function () {
  const SITE_PASSWORD = 'Jerk2026';
  const gate = document.getElementById('passwordGate');
  const input = document.getElementById('passwordInput');
  const error = document.getElementById('passwordError');
  const submitBtn = document.getElementById('passwordSubmitBtn');

  let alreadyUnlocked = false;
  try {
    alreadyUnlocked = sessionStorage.getItem('jerkUnlocked') === '1';
  } catch (e) {
    // sessionStorage unavailable -- fall back to asking every load
  }

  if (alreadyUnlocked) {
    gate.hidden = true;
  } else {
    input.focus();
  }

  function tryUnlock() {
    if (input.value === SITE_PASSWORD) {
      gate.hidden = true;
      try {
        sessionStorage.setItem('jerkUnlocked', '1');
      } catch (e) {
        // ignore -- worst case it asks again next load
      }
    } else {
      error.hidden = false;
      input.value = '';
      input.focus();
    }
  }

  submitBtn.addEventListener('click', tryUnlock);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') tryUnlock();
  });
})();

/* ===== testimonial card (rotating carousel) ===== */

const TESTIMONIALS = [
  {
    quote: "I used to sleep on my brother's couch. Now I sleep on a couch made of pure conviction. $JERK changed my mindset AND my mattress.",
    name: 'Dr. Marv Kessler',
    role: 'Author of "Think and Grow Circular"',
  },
  {
    quote: 'I manifested my first Lambo using nothing but visualization, positive energy, and a 40x leverage position. The universe rewards those who ape in.',
    name: 'Dr. Sunny Prosper',
    role: 'Author of "The Bag Secret"',
  },
  {
    quote: 'I used to think money was the root of all evil. Then I made a lot of it. Turns out I was just poor AND wrong.',
    name: 'Barbara Winsley',
    role: 'Motivational Speaker & Bestselling Author of "Yacht Mode: Activated"',
  },
  {
    quote: 'People ask me, "Coach, how\'d you go from delivering pizzas to owning three islands?" I tell them: ONE COIN. ONE DECISION. ONE JERK.',
    name: 'Marvin "The Wealth Wolf" Doyle',
    role: null,
  },
];

const TESTIMONIAL_INTERVAL = 7000;
let testimonialIndex = 0;
let testimonialTimer = null;

function renderTestimonial(i) {
  const t = TESTIMONIALS[i];
  const quoteEl = document.getElementById('testimonialQuote');
  const authorEl = document.getElementById('testimonialAuthor');
  quoteEl.textContent = '“' + t.quote + '”';
  authorEl.innerHTML = '';
  authorEl.append('— ' + t.name);
  if (t.role) {
    authorEl.append(document.createElement('br'));
    const em = document.createElement('em');
    em.textContent = t.role;
    authorEl.appendChild(em);
  }
  document.querySelectorAll('#testimonialDots .testimonial-dot').forEach((dot, idx) => {
    dot.classList.toggle('active', idx === i);
  });
  [quoteEl, authorEl].forEach((el) => {
    el.classList.remove('testimonial-fade');
    void el.offsetWidth;
    el.classList.add('testimonial-fade');
  });
}

function goToTestimonial(i) {
  testimonialIndex = (i + TESTIMONIALS.length) % TESTIMONIALS.length;
  renderTestimonial(testimonialIndex);
}

function advanceTestimonial() {
  goToTestimonial(testimonialIndex + 1);
}

function startTestimonialCarousel() {
  clearInterval(testimonialTimer);
  testimonialTimer = setInterval(advanceTestimonial, TESTIMONIAL_INTERVAL);
}

const testimonialDots = document.getElementById('testimonialDots');
TESTIMONIALS.forEach((t, i) => {
  const dot = document.createElement('button');
  dot.className = 'testimonial-dot';
  dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
  dot.addEventListener('click', () => {
    goToTestimonial(i);
    startTestimonialCarousel();
  });
  testimonialDots.appendChild(dot);
});

renderTestimonial(testimonialIndex);
startTestimonialCarousel();

document.getElementById('testimonialCloseBtn').addEventListener('click', () => {
  document.getElementById('testimonialCard').hidden = true;
  clearInterval(testimonialTimer);
});

/* ===== clock ===== */

function updateClock() {
  const clockEl = document.getElementById('clock');
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  clockEl.textContent = `${hours}:${minutes} ${ampm}`;
}

updateClock();
setInterval(updateClock, 1000 * 30);

// Placeholder hook for wiring the ring's spin speed to live market cap.
// Fetch your MC from your data source of choice, then scale the
// animation-duration on #ringLogo -- lower duration = faster spin.
//
// async function updateSpinFromMarketCap() {
//   const mc = await fetchMarketCap(); // implement this
//   const ring = document.getElementById('ringLogo');
//   const duration = Math.max(0.4, 3 - mc / 50000); // tune this curve
//   ring.style.animationDuration = duration + 's';
// }
// setInterval(updateSpinFromMarketCap, 5000);

/* ===== placeholder links -- fill these in before going live ===== */

const LINKS = {
  buy: null,
  telegram: null,
  chart: null,
  x: null,
};

function openLink(key, btn) {
  const url = LINKS[key];
  if (url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  } else {
    showNote(btn, 'Link not set yet');
  }
}

function showNote(anchor, text) {
  let note = anchor.nextElementSibling;
  if (!note || !note.classList.contains('copy-feedback')) {
    note = document.createElement('span');
    note.className = 'copy-feedback';
    anchor.insertAdjacentElement('afterend', note);
  }
  note.textContent = text;
  note.hidden = false;
  clearTimeout(note._hideTimer);
  note._hideTimer = setTimeout(() => { note.hidden = true; }, 1800);
}

/* ===== window manager ===== */

const openWindows = new Set();
let zTop = 100;

function winEl(id) {
  return document.getElementById('win-' + id);
}

function windowTitle(id) {
  const el = winEl(id);
  const t = el.querySelector('.win-titlebar .title');
  return t ? t.textContent.trim() : id;
}

function bringToFront(el) {
  zTop += 1;
  el.style.zIndex = zTop;
}

let lastPlacedX = null;
let lastPlacedY = null;

function placeWindowRandomly(el) {
  const w = parseInt(el.style.width, 10) || 280;
  const h = 220;
  const maxX = Math.max(window.innerWidth - w - 24, 20);
  const maxY = Math.max(window.innerHeight - h - 90, 40);

  let x;
  let y;
  let tries = 0;
  do {
    x = Math.floor(Math.random() * maxX) + 12;
    y = Math.floor(Math.random() * maxY) + 40;
    tries += 1;
  } while (
    lastPlacedX !== null &&
    Math.hypot(x - lastPlacedX, y - lastPlacedY) < 160 &&
    tries < 10
  );

  lastPlacedX = x;
  lastPlacedY = y;
  el.style.left = x + 'px';
  el.style.top = y + 'px';
}

function placeOnRight(el) {
  const w = parseInt(el.style.width, 10) || 280;
  const x = Math.max(window.innerWidth - w - 30, 12);
  el.style.left = x + 'px';
  el.style.top = '90px';
}

function placeOnLeft(el) {
  el.style.left = '30px';
  el.style.top = '90px';
}

function placeCentered(el) {
  const w = parseInt(el.style.width, 10) || 280;
  const h = el.offsetHeight || 220;
  const x = Math.max((window.innerWidth - w) / 2, 12);
  const y = Math.max((window.innerHeight - h) / 2, 20);
  el.style.left = x + 'px';
  el.style.top = y + 'px';
}

function openWindow(id) {
  const el = winEl(id);
  if (!el) return;

  const wasHidden = el.hidden;

  if (!openWindows.has(id)) {
    addTaskbarButton(id);
    openWindows.add(id);
  }

  if (wasHidden) {
    el.hidden = false;
    if (id === 'msn') {
      placeOnRight(el);
    } else if (id === 'winamp') {
      placeOnLeft(el);
    } else if (id === 'terms') {
      placeCentered(el);
    } else {
      placeWindowRandomly(el);
    }
  }

  el.hidden = false;
  bringToFront(el);
  setActiveTaskbar(id);
  closeStartMenu();

  if (id === 'winamp' && typeof initWinampPlayer === 'function') {
    initWinampPlayer();
  }
}

function closeWindowById(id) {
  const el = winEl(id);
  if (el) el.hidden = true;
  openWindows.delete(id);
  removeTaskbarButton(id);
}

function minimizeWindow(id) {
  const el = winEl(id);
  if (el) el.hidden = true;
  setActiveTaskbar(null);
}

function toggleWindowFromTaskbar(id) {
  const el = winEl(id);
  if (!el) return;
  if (el.hidden) {
    el.hidden = false;
    bringToFront(el);
    setActiveTaskbar(id);
  } else {
    const isTop = Number(el.style.zIndex) === zTop;
    if (isTop) {
      minimizeWindow(id);
    } else {
      bringToFront(el);
      setActiveTaskbar(id);
    }
  }
}

/* ===== taskbar ===== */

function addTaskbarButton(id) {
  const bar = document.getElementById('taskbarWindows');
  const btn = document.createElement('button');
  btn.className = 'taskbar-btn';
  btn.dataset.win = id;
  btn.type = 'button';
  btn.textContent = windowTitle(id);
  btn.addEventListener('click', () => toggleWindowFromTaskbar(id));
  bar.appendChild(btn);
}

function removeTaskbarButton(id) {
  const btn = document.querySelector(`.taskbar-btn[data-win="${id}"]`);
  if (btn) btn.remove();
}

function setActiveTaskbar(activeId) {
  document.querySelectorAll('.taskbar-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.win === activeId);
  });
}

/* ===== dragging ===== */

function makeDraggable(win) {
  const bar = win.querySelector('.win-titlebar');
  if (!bar) return;

  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  function start(clientX, clientY) {
    dragging = true;
    const rect = win.getBoundingClientRect();
    offsetX = clientX - rect.left;
    offsetY = clientY - rect.top;
    bringToFront(win);
    setActiveTaskbar(win.id.replace('win-', ''));
  }

  function move(clientX, clientY) {
    if (!dragging) return;
    const maxX = window.innerWidth - 40;
    const maxY = window.innerHeight - 30;
    const x = Math.min(Math.max(clientX - offsetX, -200), maxX);
    const y = Math.min(Math.max(clientY - offsetY, 0), maxY);
    win.style.left = x + 'px';
    win.style.top = y + 'px';
  }

  function end() {
    dragging = false;
  }

  bar.addEventListener('mousedown', (e) => {
    if (e.target.closest('.win-btn')) return;
    start(e.clientX, e.clientY);
    e.preventDefault();
  });
  window.addEventListener('mousemove', (e) => move(e.clientX, e.clientY));
  window.addEventListener('mouseup', end);

  bar.addEventListener('touchstart', (e) => {
    if (e.target.closest('.win-btn')) return;
    const t = e.touches[0];
    start(t.clientX, t.clientY);
  }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    move(t.clientX, t.clientY);
  }, { passive: true });
  window.addEventListener('touchend', end);
}

function makeResizable(win, handle, minWidth, minHeight) {
  let resizing = false;
  let startX = 0;
  let startY = 0;
  let startW = 0;
  let startH = 0;

  function start(clientX, clientY) {
    resizing = true;
    const rect = win.getBoundingClientRect();
    startX = clientX;
    startY = clientY;
    startW = rect.width;
    startH = rect.height;
    win.style.height = startH + 'px';
    bringToFront(win);
    setActiveTaskbar(win.id.replace('win-', ''));
  }

  function move(clientX, clientY) {
    if (!resizing) return;
    const newW = Math.max(minWidth, startW + (clientX - startX));
    const newH = Math.max(minHeight, startH + (clientY - startY));
    win.style.width = newW + 'px';
    win.style.height = newH + 'px';
  }

  function end() {
    resizing = false;
  }

  handle.addEventListener('mousedown', (e) => {
    start(e.clientX, e.clientY);
    e.preventDefault();
    e.stopPropagation();
  });
  window.addEventListener('mousemove', (e) => move(e.clientX, e.clientY));
  window.addEventListener('mouseup', end);

  handle.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    start(t.clientX, t.clientY);
    e.stopPropagation();
  }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    move(t.clientX, t.clientY);
  }, { passive: true });
  window.addEventListener('touchend', end);
}

document.querySelectorAll('.win95-window').forEach((win) => {
  makeDraggable(win);

  win.addEventListener('mousedown', () => {
    bringToFront(win);
    setActiveTaskbar(win.id.replace('win-', ''));
  });

  win.querySelectorAll('[data-action="close"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target || win.id.replace('win-', '');
      closeWindowById(target);
    });
  });

  win.querySelectorAll('[data-action="minimize"]').forEach((btn) => {
    btn.addEventListener('click', () => minimizeWindow(win.id.replace('win-', '')));
  });
});

const msnResizeHandle = document.getElementById('msnResizeHandle');
if (msnResizeHandle) {
  makeResizable(document.getElementById('win-msn'), msnResizeHandle, 260, 220);
}

/* ===== desktop icons ===== */

document.querySelectorAll('.planet').forEach((planet) => {
  planet.addEventListener('click', () => openWindow(planet.dataset.window));
});

document.getElementById('ringLogo').addEventListener('click', () => openWindow('about'));
document.getElementById('adBanner').addEventListener('click', () => openWindow('ad'));

/* ===== start menu ===== */

const startBtn = document.getElementById('startBtn');
const startMenu = document.getElementById('startMenu');
const programsItem = document.getElementById('programsItem');
const programsSubmenu = document.getElementById('programsSubmenu');

function closeStartMenu() {
  startMenu.hidden = true;
  startBtn.classList.remove('active');
  programsSubmenu.hidden = true;
  programsItem.classList.remove('open');
}

startBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const willOpen = startMenu.hidden;
  closeStartMenu();
  if (willOpen) {
    startMenu.hidden = false;
    startBtn.classList.add('active');
  }
});

programsItem.addEventListener('click', (e) => {
  e.stopPropagation();
  const willOpen = programsSubmenu.hidden;
  programsSubmenu.hidden = !willOpen;
  programsItem.classList.toggle('open', willOpen);
});

document.querySelectorAll('#startMenu [data-open]').forEach((item) => {
  item.addEventListener('click', (e) => {
    e.stopPropagation();
    openWindow(item.dataset.open);
  });
});

document.addEventListener('click', (e) => {
  if (!startMenu.hidden && !startMenu.contains(e.target) && e.target !== startBtn && !startBtn.contains(e.target)) {
    closeStartMenu();
  }
});

/* ===== buy window ===== */

document.getElementById('copyCaBtn').addEventListener('click', (e) => {
  const ca = document.getElementById('caField').textContent.trim();
  const feedback = document.getElementById('copyFeedback');
  const show = (ok) => {
    feedback.textContent = ok ? 'Copied!' : 'Copy failed';
    feedback.hidden = false;
    clearTimeout(feedback._hideTimer);
    feedback._hideTimer = setTimeout(() => { feedback.hidden = true; }, 1500);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(ca).then(() => show(true)).catch(() => show(false));
  } else {
    show(false);
  }
});

document.getElementById('buyLinkBtn').addEventListener('click', (e) => openLink('buy', e.currentTarget));
document.getElementById('followXBtn').addEventListener('click', (e) => openLink('x', e.currentTarget));
document.getElementById('chartLinkBtn').addEventListener('click', (e) => openLink('chart', e.currentTarget));
document.getElementById('telegramLinkBtn').addEventListener('click', (e) => openLink('telegram', e.currentTarget));

/* ===== ad gag ===== */

document.getElementById('adOrderBtn').addEventListener('click', () => {
  document.getElementById('adResult').hidden = false;
});

/* ===== run gag ===== */

document.getElementById('runOkBtn').addEventListener('click', () => {
  document.getElementById('runError').hidden = false;
});

/* ===== shutdown gag ===== */

const shutdownOverlay = document.getElementById('shutdownOverlay');

document.getElementById('shutdownOkBtn').addEventListener('click', () => {
  closeWindowById('shutdown');
  shutdownOverlay.hidden = false;
});

shutdownOverlay.addEventListener('click', () => {
  shutdownOverlay.hidden = true;
});

/* ===== msn messenger ===== */

const MSN_STATUSES = [
  'Jerktillionair (Online)',
  'Definitely Not Selling (Online)',
  'Watching the Chart (Away)',
  'Diamond Hands Only (Busy)',
  'Ghosting My Bags (Invisible)',
];
let msnStatusIndex = 0;

document.getElementById('msnStatusRow').addEventListener('click', () => {
  msnStatusIndex = (msnStatusIndex + 1) % MSN_STATUSES.length;
  document.getElementById('msnStatusText').textContent = MSN_STATUSES[msnStatusIndex];
});

function setupMsnGroup(headerSelector, listId, arrowId) {
  const header = document.querySelector(headerSelector);
  const list = document.getElementById(listId);
  const arrow = document.getElementById(arrowId);
  header.addEventListener('click', () => {
    const nowHidden = !list.hidden;
    list.hidden = nowHidden;
    arrow.style.transform = nowHidden ? 'rotate(-90deg)' : 'rotate(0deg)';
  });
}

setupMsnGroup('[data-group="online"]', 'msnOnlineList', 'msnOnlineArrow');
setupMsnGroup('[data-group="offline"]', 'msnOfflineList', 'msnOfflineArrow');

/* ===== msn presence simulation: some online contacts start offline, then randomly sign in ===== */

function updateMsnGroupCounts() {
  document.getElementById('msnOnlineCount').textContent =
    document.querySelectorAll('#msnOnlineList .msn-contact').length;
  document.getElementById('msnOfflineCount').textContent =
    document.querySelectorAll('#msnOfflineList .msn-contact').length;
}

function showMsnSignInToast(name) {
  const toast = document.getElementById('msnToast');
  const body = document.getElementById('msnToastBody');
  body.textContent = name + ' has signed in.';
  toast.hidden = false;
  toast.style.animation = 'none';
  void toast.offsetWidth;
  toast.style.animation = '';
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => { toast.hidden = true; }, 4000);
}

function initMsnPresenceSimulation() {
  const onlineRows = Array.from(document.querySelectorAll('#msnOnlineList .msn-contact'));
  let pending = onlineRows.filter(() => Math.random() < 0.45);
  if (pending.length < 2) {
    const shuffled = onlineRows.slice().sort(() => Math.random() - 0.5);
    pending = shuffled.slice(0, Math.min(2, shuffled.length));
  }

  const offlineList = document.getElementById('msnOfflineList');
  const onlineList = document.getElementById('msnOnlineList');

  pending.forEach((row) => {
    row.classList.add('offline');
    const dot = row.querySelector('.dot');
    dot.classList.remove('dot-online');
    dot.classList.add('dot-offline');
    const nameEl = row.querySelector('.msn-name');
    nameEl.textContent = '~~' + nameEl.textContent + '~~';
    offlineList.appendChild(row);
  });

  updateMsnGroupCounts();

  function scheduleNext() {
    if (pending.length === 0) return;
    const delay = 8000 + Math.random() * 17000;
    setTimeout(() => {
      const idx = Math.floor(Math.random() * pending.length);
      const row = pending.splice(idx, 1)[0];
      row.classList.remove('offline');
      const dot = row.querySelector('.dot');
      dot.classList.remove('dot-offline');
      dot.classList.add('dot-online');
      const nameEl = row.querySelector('.msn-name');
      nameEl.textContent = nameEl.textContent.replace(/^~~/, '').replace(/~~$/, '');
      onlineList.appendChild(row);
      updateMsnGroupCounts();
      showMsnSignInToast(nameEl.textContent);
      scheduleNext();
    }, delay);
  }

  scheduleNext();
}

initMsnPresenceSimulation();

document.querySelectorAll('.msn-action').forEach((action) => {
  action.addEventListener('click', () => {
    showNote(action, action.dataset.msg || 'Coming soon.');
  });
});

/* ===== visitor counter ===== */

(function renderVisitorCounter() {
  let count = 1337;
  try {
    const stored = parseInt(localStorage.getItem('jerkVisitorCount'), 10);
    if (!Number.isNaN(stored)) count = stored;
    count += 1;
    localStorage.setItem('jerkVisitorCount', String(count));
  } catch (e) {
    // localStorage unavailable -- fall back to the static number
  }
  const digitsEl = document.getElementById('visitorDigits');
  const digits = String(count).padStart(6, '0').split('');
  digitsEl.innerHTML = '';
  digits.forEach((d) => {
    const span = document.createElement('span');
    span.className = 'vc-digit';
    span.textContent = d;
    digitsEl.appendChild(span);
  });
})();

/* ===== webring placeholder ===== */

document.querySelectorAll('.webring-link').forEach((btn) => {
  btn.addEventListener('click', () => showNote(btn, btn.dataset.note || 'Coming soon.'));
});

/* ===== draggable ad banner ===== */

function makeDesktopDraggable(el, onClick) {
  let dragging = false;
  let moved = false;
  let startX = 0;
  let startY = 0;
  let startRectLeft = 0;
  let startRectTop = 0;
  let startWidth = 0;
  let offsetX = 0;
  let offsetY = 0;

  function down(clientX, clientY) {
    dragging = true;
    moved = false;
    startX = clientX;
    startY = clientY;
    const rect = el.getBoundingClientRect();
    startRectLeft = rect.left;
    startRectTop = rect.top;
    startWidth = rect.width;
  }

  function activateFixed() {
    el.style.width = startWidth + 'px';
    el.style.position = 'fixed';
    el.style.left = startRectLeft + 'px';
    el.style.top = startRectTop + 'px';
    el.style.margin = '0';
    el.style.zIndex = 4000;
    offsetX = startX - startRectLeft;
    offsetY = startY - startRectTop;
  }

  function move(clientX, clientY) {
    if (!dragging) return;
    if (!moved) {
      if (Math.hypot(clientX - startX, clientY - startY) <= 5) return;
      moved = true;
      activateFixed();
    }
    const maxX = window.innerWidth - el.offsetWidth;
    const maxY = window.innerHeight - el.offsetHeight;
    const x = Math.min(Math.max(clientX - offsetX, 0), Math.max(maxX, 0));
    const y = Math.min(Math.max(clientY - offsetY, 0), Math.max(maxY, 0));
    el.style.left = x + 'px';
    el.style.top = y + 'px';
  }

  function up() {
    dragging = false;
  }

  el.addEventListener('mousedown', (e) => {
    down(e.clientX, e.clientY);
    e.preventDefault();
  });
  window.addEventListener('mousemove', (e) => move(e.clientX, e.clientY));
  window.addEventListener('mouseup', up);

  el.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    down(t.clientX, t.clientY);
  }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    move(t.clientX, t.clientY);
  }, { passive: true });
  window.addEventListener('touchend', up);

  el.addEventListener('click', (e) => {
    if (moved) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
    onClick();
  });
}

makeDesktopDraggable(document.getElementById('adBanner'), () => openWindow('ad'));

/* ===== cursor sparkle trail ===== */

(function initCursorTrail() {
  const sparkles = ['✨', '⭐', '💫'];
  let lastSparkle = 0;

  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSparkle < 45) return;
    lastSparkle = now;
    const el = document.createElement('span');
    el.className = 'cursor-sparkle';
    el.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
    el.style.left = e.clientX + 'px';
    el.style.top = e.clientY + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 650);
  });
})();

/* ===== msn nudge gag ===== */

function playBuzzSound() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    if (ctx.state === 'suspended') ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 220;
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
    setTimeout(() => ctx.close(), 600);
  } catch (e) {
    // Web Audio unavailable/blocked -- the shake still plays without sound
  }
}

document.getElementById('msnNudgeBtn').addEventListener('click', () => {
  const win = document.getElementById('win-msn');
  win.classList.remove('shake');
  void win.offsetWidth;
  win.classList.add('shake');
  win.addEventListener('animationend', () => win.classList.remove('shake'), { once: true });
  playBuzzSound();
});

/* ===== fake chat windows ===== */

const CHAT_LINES = {
  theunipcs: [
    'well i did tell you. still not too late my G.',
    'screenshot this. next DOGE PEPE runner, GOD WILLING.',
    'they called me insane. i screamed this for weeks. multi-billions GOD WILLING.',
    'you have been warned. position now or chase later, your choice.',
    'up big again. VOLUME, listings, team all lining up. dont blindly copytrade tho.',
    'take the day off, touch grass, then we dominate.',
    'chad move if youre still here. top G behavior.',
    'credit God for this one, not me. GOD WILLING we keep going.',
  ],
  cryptogle: [
    'I yelled and yelled and yelled about $bonk at $20m',
    "you can lead a horse to water, but you can't make it drink",
    'INVEST IN TEAMS!',
    'lol are you guys seeing these numbers??? dyor as always',
    'comfy in $pons spot here',
    'people thought I was insane',
    "goofy mf's. dyor as always",
    'very cool, bullish',
    'so umm thanks... I appreciate it. dyor as always',
  ],
  blknoiz06: [
    'yep',
    'DEEPLY',
    'WOW',
    'zcash is crazy',
    "let's dance",
    'we won forever',
    'this is really a generational cycle man',
    "we have billionaires pvp'ing each other for our onchain bags bros this is the greatest timeline to exist",
  ],
  frankdegods: [
    'just do shit.',
    "create motion and you'll figure it out on the way.",
    'game is fuckin game.',
    'lick wounds and get back in the lab.',
    'u probably regret selling good bags today btw.',
    'always the mouthbreathers that got smthn to say.',
    'the risk of failure > certainty of regret. every time.',
    'hold the good. flip the mid.',
    'is what it is.',
  ],
  notanicecat69: [
    "we're fucking back",
    "it's fucking time",
    "let's make some money tho",
    "we're here for asymmetric upside, take a chance",
    'easy mode',
    "the trenches are cooked but that's the scary part where all the money is made\ncomfy",
    'higher for longer retardios',
    "don't right curve this",
    'i hope you all win. may not seem it but these words come from a place of love.',
  ],
  RowdyCrypto: [
    'the dream is alive fren 💫',
    'much love, no risk, no rari',
    'see you on chain anon',
    "are you willing to pay the price?\nthe life you want will cost the life you have. most people aren't willing.",
    'just another day in the office',
    "i'm back",
    'yessir',
    'send it',
  ],
  PoorGoat_: [
    'The horns stay on. Much Meow! 💛🐈',
    'Billion. Dollar. CATE. 💛🐈',
    'CATE WILL FLIP DOGE. 💛🐈',
    'ONBOARD THE WORLD 💛🐈',
    'Everyone buys CATE at the price they deserve. 💛🐈',
    'The catalyst is the community. 💛🐈',
    "We're just getting started. 💛🐈",
    "LET'S COOK 😹 💛🐈",
  ],
  DipWheeler: [
    'generational bottom.',
    'i wake up everyday & unclog toilets.',
    'we have the technology.',
    "for every dip, there's a rip.",
    'i was drunk when i bought fartcoin at 70k mc. lesson in that.',
    'piss off your employed friends szn.',
    'the plumbers are waking up.',
    "we haven't seen shit.",
    'return to memes.',
  ],
  rasmr_eth: [
    'THIS META IS SO BULLISH BRO WHAT',
    'The most PVE memecoin in HISTORY. 🍿',
    'Conviction the whole way brother',
    'Job not finished.',
    'Look at that chad thesis',
    'we are going higher. MUCH higher.',
    "that's when we deploy everything.",
  ],
  Quanterty: [
    "I'm so bullish on myself I could be down a mil tomorrow and I know Imma have that shit back end of week",
    'So fucking proud of myself',
    'I roundtrip a lotttttttttt of stuff tbh',
    'Don\'t copy trade. Thesis post is not a shill.',
    'Onwards and upwards always',
    "Job ain't finished",
    'Crypto is genuinely such an insane sport',
    "down bad this morning, green by 4. job ain't finished.\ni love you",
  ],
  loganlim_x: [
    'I was born in the trenches, aping in 10k mc coins hoping them to hit millies.',
    "yooo i'm a retard even sold the bottom at loss",
    'I make a lot of stupid trades, top blasting, waving in my conviction and cutting losses.',
    'WAGMI and all the best to everyone.',
    'My life motto: Die or Moon',
    'yooo lmao i top blasted again. still here tho. WAGMI',
  ],
  MoneyLord: [
    'I never lose, I either win or learn',
    'we are so back. its MONEY TIME.\nOnward and upward',
    'You are HERE to make MONEY.\nOnward and upward',
    'Generational run coming',
    'Less is more.\nOnward and upward',
    "you either get it or you don't tbh",
    'Skill issue, you either live the game or get eaten',
    'Always reflect and re adapt.\nOnward and upward',
  ],
  EricCryptoman: [
    'GOOD LORD THAT IS BREW-TAL',
    'Did you buy the cat yet or nah?',
    "IT PAYS TO BE A HODLER.\nPunishing jeets szn is my favourite szn bruv.",
    'King shit',
    "Don't fade this. I'll keep saying it.",
    'I look like a zombie bruv',
  ],
  a1lon9: [
    'just getting started',
    'just the beginning.',
    'you cannot stop this train.',
    "let's cook",
    'organic always wins. real communities always win. OGs always win',
    'W',
    'goat',
    "we ship what the trenches actually want\nit is that simple\nSent from my Pumpfun App",
    "just the beginning.\nSent from my Pumpfun App",
  ],
  seyong: [
    'fomo made crypto fun again.',
    'the more i trade equities, the more i realize every market is just trading attention',
    'life is more fun as a video game.',
    'i either do or i dont.',
    'ppl just like to hate',
    'bullish',
    "there's never been a better time to build.",
    'the time to cope and seethe was the bottom. pls leave that energy there.',
  ],
  toly: [
    "lol. that's lame.",
    'there is a mountain of work left to do on all fronts.',
    "don't bring back last cycle eth killer bs. it's lame.",
    'what is dead cannot die.',
    "as an engineer, if it's not going to happen in two weeks, there's a 50% chance it's never going to happen.",
    "solana isn't designed for max throughput, it's designed to sync state to as many boxes as physics allows.",
    'sleeper agent behavior. mountain of work left. just ship.',
  ],
  vladtenev: [
    "What's the concern?",
    'We are still early.',
    'This is worth fighting for.',
    'Everyone should be able to access high-quality financial assets, wherever they live.',
    'We built this because the old way excludes too many people. We are still early.',
    'No caveats. We are already building the answer.',
  ],
  cz_binance: [
    'Fly at night, talk crypto from sunrise.',
    'Health is wealth.',
    'Onwards.',
    'Real progress!',
    'I buy and hold.',
    'I strongly believe the best investments happen in the depth of winter.',
    'Long day. Team shipped. Onwards.',
  ],
  jessepollak: [
    'bm.',
    'all onchain.',
    'proud to be building with you 🫡',
    'this is why we do it',
    'bring it on',
    "it's a privilege to be in the trenches with all of you",
    'more options, more long tail, more liquidity. more experimentation is good',
  ],
};

let currentChatContact = null;
const chatLineIndex = {};

function nextCannedLine(name) {
  const lines = CHAT_LINES[name] || ['...'];
  if (chatLineIndex[name] === undefined) chatLineIndex[name] = 0;
  const idx = chatLineIndex[name] % lines.length;
  chatLineIndex[name] += 1;
  return lines[idx];
}

function appendChatLine(who, text, mine) {
  const log = document.getElementById('chatLog');
  const div = document.createElement('div');
  div.className = 'chat-line ' + (mine ? 'me' : 'them');
  const whoSpan = document.createElement('span');
  whoSpan.className = 'who';
  whoSpan.textContent = (mine ? 'You' : who) + ':';
  div.appendChild(whoSpan);
  div.append(' ' + text);
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function openChat(name) {
  currentChatContact = name;
  document.getElementById('chatTitle').textContent = '💬 Chat - ' + name;
  document.getElementById('chatLog').innerHTML = '';
  appendChatLine(name, nextCannedLine(name));
  openWindow('chat');
  document.getElementById('chatInput').focus();
}

function sendChat() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text || !currentChatContact) return;
  appendChatLine('You', text, true);
  input.value = '';
  const contact = currentChatContact;
  setTimeout(() => {
    if (currentChatContact === contact) {
      appendChatLine(contact, nextCannedLine(contact));
    }
  }, 500);
}

document.querySelectorAll('.msn-contact[data-contact]').forEach((row) => {
  row.addEventListener('click', () => {
    if (row.dataset.contact === 'a1lon9') showAlonPopup();
    openChat(row.dataset.contact);
  });
});

/* ===== alon popup (gif + laugh sound for 20s) ===== */

const ALON_POPUP_DURATION = 10000;
let alonPopupTimer = null;

function hideAlonPopup() {
  clearTimeout(alonPopupTimer);
  alonPopupTimer = null;
  document.getElementById('alonPopup').hidden = true;
  const audio = document.getElementById('alonLaughAudio');
  audio.pause();
  audio.currentTime = 0;
}

function showAlonPopup() {
  clearTimeout(alonPopupTimer);
  document.getElementById('alonPopup').hidden = false;
  const audio = document.getElementById('alonLaughAudio');
  audio.currentTime = 0;
  audio.play().catch(() => {});
  alonPopupTimer = setTimeout(hideAlonPopup, ALON_POPUP_DURATION);
}

document.getElementById('alonPopupClose').addEventListener('click', hideAlonPopup);

document.getElementById('chatSendBtn').addEventListener('click', sendChat);
document.getElementById('chatInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendChat();
});

/* ===== winamp (plays local files from Songs/) ===== */

const WINAMP_TRACKS = [
  { title: 'Eye Of The Tiger', artist: 'Survivor', file: 'Survivor - Eye Of The Tiger Official HD Video.mp3' },
  { title: "Livin' On A Prayer", artist: 'Bon Jovi', file: "Bon Jovi - Livin' On A Prayer.mp3" },
  { title: 'Take On Me', artist: 'a-ha', file: 'Take On Me Official Video.mp3' },
  { title: 'My Heart Will Go On', artist: 'Celine Dion', file: 'Cline Dion - My Heart Will Go On Official 25th Anniversary Alternate Music Video.mp3' },
  { title: 'Where The Hood At?', artist: 'DMX', file: 'DMX - Where The Hood At_ Dirty Music Video HQ (1).mp3' },
  { title: 'Sing It Back', artist: 'Moloko', file: 'Moloko - Sing It Back Official HD Video.mp3' },
];

const winampAudio = document.getElementById('winampAudio');
let winampIndex = -1;
let winampVizTimer = null;

function formatTime(sec) {
  if (!Number.isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function setWinampNote(text) {
  const note = document.getElementById('winampNote');
  note.hidden = !text;
  note.textContent = text || '';
}

function highlightWinampRow() {
  document.querySelectorAll('.winamp-row').forEach((row) => {
    row.classList.toggle('active', Number(row.dataset.index) === winampIndex);
  });
}

function startWinampViz() {
  stopWinampViz();
  const bars = document.querySelectorAll('#winampViz span');
  winampVizTimer = setInterval(() => {
    bars.forEach((bar) => {
      bar.style.height = (10 + Math.random() * 90) + '%';
    });
  }, 120);
}

function stopWinampViz() {
  if (winampVizTimer) {
    clearInterval(winampVizTimer);
    winampVizTimer = null;
  }
  document.querySelectorAll('#winampViz span').forEach((bar) => { bar.style.height = '10%'; });
}

function updateWinampPlayIcon() {
  document.getElementById('winampPlay').textContent = winampAudio.paused ? '▶' : '⏸';
}

function loadWinampTrack(i, autoplay) {
  if (i < 0 || i >= WINAMP_TRACKS.length) return;
  winampIndex = i;
  const track = WINAMP_TRACKS[i];
  document.getElementById('winampTrack').textContent = track.artist + ' - ' + track.title;
  setWinampNote('');
  winampAudio.src = 'Songs/' + encodeURIComponent(track.file);
  highlightWinampRow();
  if (autoplay) {
    winampAudio.play().catch(() => {
      setWinampNote('Could not play "' + track.file + '". Check the file exists in Songs/ and is a valid MP3.');
    });
  }
}

function renderWinampPlaylist() {
  const list = document.getElementById('winampPlaylist');
  list.innerHTML = '';
  WINAMP_TRACKS.forEach((track, i) => {
    const row = document.createElement('div');
    row.className = 'winamp-row';
    row.dataset.index = i;
    const nameSpan = document.createElement('span');
    nameSpan.textContent = (i + 1) + '. ' + track.title;
    const artistSpan = document.createElement('span');
    artistSpan.className = 'wa-artist';
    artistSpan.textContent = track.artist;
    row.appendChild(nameSpan);
    row.appendChild(artistSpan);
    row.addEventListener('click', () => loadWinampTrack(i, true));
    list.appendChild(row);
  });
}

document.getElementById('winampPlay').addEventListener('click', () => {
  if (winampIndex === -1) {
    loadWinampTrack(0, true);
    return;
  }
  if (winampAudio.paused) {
    winampAudio.play().catch(() => {
      const track = WINAMP_TRACKS[winampIndex];
      setWinampNote('Could not play "' + track.file + '". Check the file exists in Songs/ and is a valid MP3.');
    });
  } else {
    winampAudio.pause();
  }
});

document.getElementById('winampStop').addEventListener('click', () => {
  winampAudio.pause();
  winampAudio.currentTime = 0;
});

document.getElementById('winampPrev').addEventListener('click', () => {
  const next = winampIndex <= 0 ? WINAMP_TRACKS.length - 1 : winampIndex - 1;
  loadWinampTrack(next, true);
});

document.getElementById('winampNext').addEventListener('click', () => {
  const next = winampIndex >= WINAMP_TRACKS.length - 1 ? 0 : winampIndex + 1;
  loadWinampTrack(next, true);
});

winampAudio.addEventListener('play', () => { updateWinampPlayIcon(); startWinampViz(); });
winampAudio.addEventListener('pause', () => { updateWinampPlayIcon(); stopWinampViz(); });
winampAudio.addEventListener('ended', () => {
  const next = winampIndex >= WINAMP_TRACKS.length - 1 ? 0 : winampIndex + 1;
  loadWinampTrack(next, true);
});
winampAudio.addEventListener('error', () => {
  if (winampIndex === -1) return;
  const track = WINAMP_TRACKS[winampIndex];
  setWinampNote('Could not play "' + track.file + '". Check the file exists in Songs/ and is a valid MP3.');
  stopWinampViz();
});
winampAudio.addEventListener('timeupdate', () => {
  const seek = document.getElementById('winampSeek');
  if (winampAudio.duration) {
    seek.value = (winampAudio.currentTime / winampAudio.duration) * 100;
  }
  document.getElementById('winampTime').textContent =
    formatTime(winampAudio.currentTime) + ' / ' + formatTime(winampAudio.duration || 0);
});

document.getElementById('winampSeek').addEventListener('input', (e) => {
  if (winampAudio.duration) {
    winampAudio.currentTime = (e.target.value / 100) * winampAudio.duration;
  }
});

document.getElementById('winampVolume').addEventListener('input', (e) => {
  winampAudio.volume = e.target.value / 100;
});
winampAudio.volume = 0.7;

renderWinampPlaylist();

openWindow('winamp');
openWindow('msn');
