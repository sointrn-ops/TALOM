(function () {
  'use strict';
  const KEY = 'talom-cart';
  const read = () => { try { const value = JSON.parse(localStorage.getItem(KEY) || '{}'); return value && typeof value === 'object' ? value : {}; } catch { return {}; } };
  const cart = read();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (error) { console.warn('TALOM cart storage unavailable', error); } };
  const count = () => Object.values(cart).reduce((sum, value) => sum + (Number.isInteger(value.qty) && value.qty > 0 ? value.qty : 0), 0);
  const updateCount = () => { const badge = document.getElementById('cartCount'); if (badge) badge.textContent = String(count()); };
  const render = () => { const list = document.getElementById('cartItems'); const empty = document.getElementById('cartEmpty'); if (!list || !empty) return; list.replaceChildren(); const entries = Object.entries(cart); empty.hidden = entries.length > 0; entries.forEach(([id, item]) => { const row = document.createElement('div'); row.className = 'cart-line'; const info = document.createElement('span'); info.textContent = item.name + ' × ' + item.qty + ' — ' + item.price; row.appendChild(info); const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = 'حذف'; remove.dataset.cartRemove = id; row.appendChild(remove); list.appendChild(row); }); updateCount(); };
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-cart-add]');
    if (!button) { if (event.target.closest('#cartOpenButton')) { const modal = document.getElementById('cartModal'); if (modal) modal.classList.add('open'); render(); } const close = event.target.closest('[data-cart-close]'); if (close) document.getElementById('cartModal')?.classList.remove('open'); const remove = event.target.closest('[data-cart-remove]'); if (remove) { delete cart[remove.dataset.cartRemove]; save(); render(); } return; }
    const id = button.dataset.cartAdd;
    if (!id) return;
    const next = (Number(cart[id]) || 0) + 1;
    if (next > 10) { window.alert('حداکثر تعداد هر محصول ۱۰ عدد است.'); return; }
    const card = button.closest('.product-card');
    const name = card?.querySelector('.product-name')?.textContent || 'TALOM';
    const price = card?.querySelector('.product-price')?.textContent || '';
    cart[id] = { qty: next, name, price }; save(); updateCount(); render();
    button.textContent = 'اضافه شد';
    window.setTimeout(() => { button.textContent = 'افزودن به سبد خرید'; }, 1200);
  });
  document.addEventListener('DOMContentLoaded', updateCount);
  updateCount();
  render();
})();
