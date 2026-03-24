/* ============================================================
   NANI INTERIOR WORKS — Global Script
   Theme Toggle | Scroll Effects | Animations
   ============================================================ */

(function () {
  'use strict';

  /* ── Theme ── */
  const THEME_KEY = 'nani-theme';

  function getTheme() {
    return localStorage.getItem(THEME_KEY) || 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    document.querySelectorAll('.theme-label').forEach(el => {
      el.textContent = theme === 'dark' ? 'Light' : 'Dark';
    });
  }

  function toggleTheme() {
    const current = getTheme();
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  /* ── Navbar scroll ── */
  function initNavbar() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    function onScroll() {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile menu ── */
  function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navCenter = document.getElementById('navCenter');
    if (!hamburger || !navCenter) return;
    hamburger.addEventListener('click', () => {
      navCenter.classList.toggle('open');
    });
    navCenter.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => navCenter.classList.remove('open'));
    });
  }

  /* ── Scroll Reveal ── */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
  }

  /* ── Count-up ── */
  function formatCount(n, target) {
    if (target >= 1000) return (n / 1000).toFixed(1) + 'K';
    return Math.floor(n).toString();
  }

  function initCountUp() {
    const els = document.querySelectorAll('[data-count]');
    if (!els.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = +el.dataset.count;
        const plus = el.dataset.plus === 'true';
        const duration = 1800;
        let startTime = null;

        function step(ts) {
          if (!startTime) startTime = ts;
          const prog = Math.min((ts - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - prog, 3);
          const cur = eased * target;
          el.textContent = formatCount(cur, target) + (plus ? '+' : '');
          if (prog < 1) requestAnimationFrame(step);
          else el.textContent = formatCount(target, target) + (plus ? '+' : '');
        }
        requestAnimationFrame(step);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });
    els.forEach(el => obs.observe(el));
  }

  /* ── Tag filter ── */
  function initTags() {
    document.querySelectorAll('.tag').forEach(tag => {
      tag.addEventListener('click', () => {
        const group = tag.closest('.items-tags');
        if (group) group.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
        tag.classList.add('active');
      });
    });
  }

  /* ── Active nav on scroll ── */
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-center a');
    if (!sections.length || !links.length) return;

    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 120) current = s.id;
      });
      links.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === '#' + current) a.classList.add('active');
      });
    }, { passive: true });
  }

  /* ── Invoice total calculator ── */
  function initInvoiceCalc() {
    const rows = document.querySelectorAll('.inv-row[data-qty][data-price]');
    if (!rows.length) return;

    let subtotal = 0;
    rows.forEach(row => {
      const qty = parseFloat(row.dataset.qty) || 0;
      const price = parseFloat(row.dataset.price) || 0;
      const total = qty * price;
      subtotal += total;
      const totalCell = row.querySelector('.inv-cell-total');
      if (totalCell) totalCell.textContent = '$' + total.toFixed(2);
    });

    const taxRate = 0.08;
    const tax = subtotal * taxRate;
    const grand = subtotal + tax;

    const subEl = document.getElementById('inv-subtotal');
    const taxEl = document.getElementById('inv-tax');
    const grandEl = document.getElementById('inv-grand');
    if (subEl) subEl.textContent = '$' + subtotal.toFixed(2);
    if (taxEl) taxEl.textContent = '$' + tax.toFixed(2);
    if (grandEl) grandEl.textContent = '$' + grand.toFixed(2);
  }

  /* ── Smooth page nav links ── */
  function initPageLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getTheme());

    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });

    initNavbar();
    initMobileMenu();
    initReveal();
    initCountUp();
    initTags();
    initActiveNav();
    initInvoiceCalc();
    initPageLinks();
  });
})();
