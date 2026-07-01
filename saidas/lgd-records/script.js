/* ===========================================
   LGD RECORDS — Main Script
   =========================================== */

// ─── Header scroll (sticky already, just re-run border on scroll) ───
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  if (header) header.style.borderBottomColor = window.scrollY > 0 ? '#1c1c1c' : '#1c1c1c';
});

// ─── Reveal on scroll ───
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

// ─── Product image pairs: auto-inject front + back via picsum ───
// Each product gets a unique front/back seed pair
const FRONT_SEEDS = [
  'fst01','fst02','fst03','fst04','fst05','fst06','fst07','fst08',
  'fst09','fst10','fst11','fst12','fst13','fst14','fst15','fst16',
  'fst17','fst18','fst19','fst20','fst21','fst22','fst23','fst24'
];

const BACK_SEEDS = [
  'bck01','bck02','bck03','bck04','bck05','bck06','bck07','bck08',
  'bck09','bck10','bck11','bck12','bck13','bck14','bck15','bck16',
  'bck17','bck18','bck19','bck20','bck21','bck22','bck23','bck24'
];

document.querySelectorAll('.pcard-img').forEach((wrap, i) => {
  const fi = FRONT_SEEDS[i % FRONT_SEEDS.length];
  const bi = BACK_SEEDS[i % BACK_SEEDS.length];

  const front = document.createElement('img');
  front.className = 'img-front';
  front.src = `https://picsum.photos/seed/${fi}/600/800`;
  front.alt = '';
  front.loading = i < 8 ? 'eager' : 'lazy';

  const back = document.createElement('img');
  back.className = 'img-back';
  back.src = `https://picsum.photos/seed/${bi}/600/800`;
  back.alt = '';
  back.loading = 'lazy';

  // Preload back image on first hover
  let preloaded = false;
  wrap.closest('.product-card')?.addEventListener('mouseenter', () => {
    if (!preloaded) { back.loading = 'eager'; preloaded = true; }
  }, { once: false });

  wrap.appendChild(front);
  wrap.appendChild(back);
});

// ─── Hero image ───
const heroBg = document.querySelector('.hero');
if (heroBg && !heroBg.querySelector('img')) {
  const img = document.createElement('img');
  img.src = 'https://picsum.photos/seed/lgd-hero-ss25/1920/827';
  img.alt = 'LGD Records SS 2025';
  img.loading = 'eager';
  heroBg.insertBefore(img, heroBg.firstChild);
}

// ─── Cart drawer ───
const cartOverlay = document.getElementById('cartOverlay');
const cartDrawer  = document.getElementById('cartDrawer');
const cartBtn     = document.getElementById('cartBtn');
const cartClose   = document.getElementById('cartClose');

function openCart()  {
  cartOverlay?.classList.add('open');
  cartDrawer?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartOverlay?.classList.remove('open');
  cartDrawer?.classList.remove('open');
  document.body.style.overflow = '';
}

cartBtn?.addEventListener('click', openCart);
cartOverlay?.addEventListener('click', closeCart);
cartClose?.addEventListener('click', closeCart);

// ─── Carousel helper ───
function initCarousel(trackEl, prevBtn, nextBtn, visibleCount) {
  if (!trackEl || !prevBtn || !nextBtn) return;
  let pos = 0;
  const getW = () => {
    const first = trackEl.querySelector('.product-card');
    return first ? first.offsetWidth + 20 : 0;
  };
  nextBtn.addEventListener('click', () => {
    const cards = trackEl.querySelectorAll('.product-card');
    const max = Math.max(0, cards.length - visibleCount);
    pos = Math.min(pos + 1, max);
    trackEl.style.transform = `translateX(-${pos * getW()}px)`;
  });
  prevBtn.addEventListener('click', () => {
    pos = Math.max(0, pos - 1);
    trackEl.style.transform = `translateX(-${pos * getW()}px)`;
  });
}

// Sale carousel (home)
initCarousel(
  document.getElementById('saleTrack'),
  document.querySelector('.prev-btn'),
  document.querySelector('.next-btn'),
  4
);

// Related carousel (product page)
initCarousel(
  document.getElementById('relTrack'),
  document.querySelector('.prev-rel'),
  document.querySelector('.next-rel'),
  4
);

// ─── Size buttons ───
document.querySelectorAll('.size-row').forEach(row => {
  row.querySelectorAll('.sz-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      row.querySelectorAll('.sz-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
});

// ─── Color swatches ───
document.querySelectorAll('.color-row').forEach(row => {
  row.querySelectorAll('.color-swatch').forEach(sw => {
    sw.addEventListener('click', () => {
      row.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
      sw.classList.add('active');
    });
  });
});

// ─── Quantity ───
const qtyN = document.querySelector('.qty-n');
document.querySelector('.qty-plus')?.addEventListener('click',  () => { if (qtyN) qtyN.value = Math.min(10, +qtyN.value + 1); });
document.querySelector('.qty-minus')?.addEventListener('click', () => { if (qtyN) qtyN.value = Math.max(1,  +qtyN.value - 1); });

// ─── Accordion ───
document.querySelectorAll('.accordion-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const acc = btn.closest('.accordion');
    const isOpen = acc.classList.contains('open');
    document.querySelectorAll('.accordion').forEach(a => a.classList.remove('open'));
    if (!isOpen) acc.classList.add('open');
  });
});

// ─── Product page thumbnails ───
const PROD_SEEDS = ['lgdpm1','lgdpm2','lgdpm3','lgdpm4','lgdpm5','lgdpm6'];

document.querySelectorAll('.prod-thumb').forEach((th, i) => {
  const seed = th.dataset.seed || PROD_SEEDS[i] || 'lgdpm1';

  const img = document.createElement('img');
  img.src = `https://picsum.photos/seed/${seed}/300/400`;
  img.alt = '';
  img.loading = 'lazy';
  th.appendChild(img);

  th.addEventListener('click', () => {
    document.querySelectorAll('.prod-thumb').forEach(t => t.classList.remove('active'));
    th.classList.add('active');
    const mainImg = document.querySelector('.prod-main-img img');
    if (mainImg) mainImg.src = `https://picsum.photos/seed/${seed}/800/1067`;
  });
});

// ─── Mobile nav ───
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger?.addEventListener('click', () => {
  mobileNav?.classList.add('open');
  document.body.style.overflow = 'hidden';
});

document.querySelector('.mobile-nav-close')?.addEventListener('click', () => {
  mobileNav?.classList.remove('open');
  document.body.style.overflow = '';
});

// ─── Splash screen ───
const splashEl   = document.getElementById('splash');
const splashExit = document.getElementById('splashExit');
const splashForm = document.getElementById('splashForm');
const skipBtn    = document.getElementById('splashSkip');

function leaveSplash() {
  splashExit?.classList.add('out');
  setTimeout(() => { window.location.href = 'home.html'; }, 550);
}

splashForm?.addEventListener('submit', e => {
  e.preventDefault();
  const email = splashForm.querySelector('input[type=email]')?.value;
  if (email) {
    // Store email (would send to backend in production)
    console.log('Lead:', email);
    leaveSplash();
  }
});

skipBtn?.addEventListener('click', leaveSplash);
