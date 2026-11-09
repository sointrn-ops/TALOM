(function () {
  'use strict';
  const KEY = 'talom-cart';
  const read = () => { try { const value = JSON.parse(localStorage.getItem(KEY) || '{}'); return value && typeof value === 'object' ? value : {}; } catch { return {}; } };
  const cart = read();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (error) { console.warn('TALOM cart storage unavailable', error); } };
  const count = () => Object.values(cart).reduce((sum, value) => sum + (Number.isInteger(value) && value > 0 ? value : 0), 0);
  const updateCount = () => { const badge = document.getElementById('cartCount'); if (badge) badge.textContent = String(count()); };
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-cart-add]');
    if (!button) return;
    const id = button.dataset.cartAdd;
    if (!id) return;
    const next = (Number(cart[id]) || 0) + 1;
    if (next > 10) { window.alert('حداکثر تعداد هر محصول ۱۰ عدد است.'); return; }
    cart[id] = next; save(); updateCount();
    button.textContent = 'اضافه شد';
    window.setTimeout(() => { button.textContent = 'افزودن به سبد خرید'; }, 1200);
  });
  document.addEventListener('DOMContentLoaded', updateCount);
  updateCount();
})();
