// Mama Yum Yum — shared site behaviour
// NOTE: Cart, accounts, and newsletter here are front-end demos only.
// Real checkout/payments/accounts/subscriptions/gift cards/automated emails
// need to be wired up to a commerce backend (e.g. Shopify).

document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      mobileBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.add('hidden')));
  }

  // Order modal (call/email)
  window.openOrderModal = function(){
    const m = document.getElementById('order-modal');
    if (!m) return;
    m.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  window.closeOrderModal = function(){
    const m = document.getElementById('order-modal');
    if (!m) return;
    m.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Account / login modal (UI only — needs Shopify customer accounts)
  window.openAccountModal = function(){
    const m = document.getElementById('account-modal');
    if (!m) return;
    m.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  window.closeAccountModal = function(){
    const m = document.getElementById('account-modal');
    if (!m) return;
    m.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.modal-backdrop').forEach(m => {
    m.addEventListener('click', (e) => { if (e.target === m) m.classList.remove('open'); });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
      document.body.style.overflow = '';
    }
  });

  // Toast helper
  window.showToast = function(msg){
    let t = document.getElementById('siteToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'siteToast';
      t.className = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  };

  // Demo cart (localStorage) — placeholder for real Shopify cart
  const CART_KEY = 'myy_demo_cart_count';
  function getCartCount(){ return parseInt(localStorage.getItem(CART_KEY) || '0', 10); }
  function setCartCount(n){
    localStorage.setItem(CART_KEY, n);
    document.querySelectorAll('.cart-count').forEach(el => el.textContent = n);
  }
  setCartCount(getCartCount());
  document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
    btn.addEventListener('click', () => {
      setCartCount(getCartCount() + 1);
      showToast((btn.dataset.addToCart || 'Item') + ' added to cart');
    });
  });

  // Menu / shop filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('[data-cat]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        card.style.display = (filter === 'all' || card.dataset.cat === filter) ? '' : 'none';
      });
    });
  });

  // FAQ / accordion
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if (panel) panel.classList.toggle('open', !expanded);
    });
  });

  // Newsletter signup (UI only — needs email marketing integration e.g. Mailchimp/Klaviyo)
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast("Thanks for subscribing! 💛");
      newsletterForm.reset();
    });
  }

  // Review submission form (UI only — needs backend to store/moderate reviews)
  const reviewForm = document.getElementById('reviewForm');
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast("Thank you for sharing your experience!");
      reviewForm.reset();
    });
  }
  document.querySelectorAll('.star-input').forEach(group => {
    const stars = group.querySelectorAll('button');
    stars.forEach((star, i) => {
      star.addEventListener('click', () => {
        stars.forEach((s, j) => s.classList.toggle('text-[var(--yellow)]', j <= i));
        group.dataset.value = i + 1;
      });
    });
  });

  // Contact form -> opens a pre-filled email (functional without a backend)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cf-name').value;
      const email = document.getElementById('cf-email').value;
      const message = document.getElementById('cf-message').value;
      const subject = encodeURIComponent('Message from ' + name + ' via mamayummbabyfood.ca');
      const body = encodeURIComponent(message + '\n\nReply to: ' + email);
      window.location.href = `mailto:mamayumm@hotmail.com?subject=${subject}&body=${body}`;
      showToast('Opening your email app…');
    });
  }

  // Login / create account form (UI only — needs Shopify customer accounts)
  const accountForm = document.getElementById('accountForm');
  if (accountForm) {
    accountForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Accounts are launching soon with our online store!');
      closeAccountModal();
    });
  }

  // Smooth scroll for in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior:'smooth', block:'start' }); }
      }
    });
  });
});
