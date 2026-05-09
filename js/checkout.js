/* ===== Checkout JS v2.0 ===== */
/* Uses coupon system, full state dropdown, improved validation */

let shippingCost = 0;

document.addEventListener('DOMContentLoaded', () => {
  populateStates();
  renderOrderSidebar();
});

function populateStates() {
  const stateSelect = document.getElementById('state');
  if (!stateSelect || typeof US_STATES === 'undefined') return;
  US_STATES.forEach(state => {
    const opt = document.createElement('option');
    opt.value = state;
    opt.textContent = state;
    stateSelect.appendChild(opt);
  });
}

function renderOrderSidebar() {
  const cart = getCart();
  const itemsEl = document.getElementById('orderItems');
  const summaryEl = document.getElementById('orderSummary');

  if (!cart.length) {
    itemsEl.innerHTML = '<p style="text-align:center;padding:24px;color:var(--text-sec);">Your cart is empty. <a href="shop.html" style="color:var(--blue-text)">Shop now →</a></p>';
    summaryEl.innerHTML = '';
    return;
  }

  itemsEl.innerHTML = '<h3 style="margin-bottom:16px;font-size:1rem;">Your Order</h3>' +
    cart.map(item => {
      const p = PRODUCTS.find(pr => pr.id === item.id);
      if (!p) return '';
      return `<div class="order-item">
        <div class="order-item-img"><picture><source srcset="${p.img}.webp" type="image/webp"><img src="${p.img}.png" alt="${p.name}" width="56" height="56"></picture></div>
        <div style="flex:1"><div style="font-weight:600;font-size:.85rem;">${p.name}</div><div style="color:var(--text-sec);font-size:.8rem;">Qty: ${item.qty}</div></div>
        <div style="font-weight:700;font-size:.9rem;">$${(p.price * item.qty).toFixed(2)}</div>
      </div>`;
    }).join('');

  const { subtotal, discount, total, coupon } = getDiscountedTotal();
  const finalTotal = total + shippingCost;

  summaryEl.innerHTML = `
    <div class="summary-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
    ${discount > 0 ? `<div class="summary-row" style="color:var(--green);"><span>Discount (${coupon.code})</span><span>-$${discount.toFixed(2)}</span></div>` : ''}
    <div class="summary-row"><span>Shipping</span><span>${shippingCost === 0 ? '<span style="color:var(--green);font-weight:600;">FREE</span>' : '$' + shippingCost.toFixed(2)}</span></div>
    <div class="summary-row total"><span>Total</span><span>$${finalTotal.toFixed(2)}</span></div>`;
}

function selectShipping(el, cost) {
  shippingCost = cost;
  document.querySelectorAll('.shipping-option').forEach(o => o.classList.remove('active'));
  el.classList.add('active');
  renderOrderSidebar();
}

function selectPayment(btn, method) {
  document.querySelectorAll('.payment-method').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-pressed', 'false');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-pressed', 'true');
  const cardFields = document.getElementById('cardFields');
  cardFields.style.display = method === 'card' ? 'grid' : 'none';
}

function placeOrder() {
  const cart = getCart();
  if (!cart.length) { showToast('Your cart is empty! 🛒', 'error'); return; }

  const email = document.getElementById('email').value;
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const address = document.getElementById('address').value;
  const city = document.getElementById('city').value;
  const state = document.getElementById('state').value;
  const zip = document.getElementById('zip').value;

  if (!email || !firstName || !lastName || !address || !city || !state || !zip) {
    showToast('Please fill in all required fields ✏️', 'error');
    return;
  }

  // Simulate order placement
  const { total } = getDiscountedTotal();
  localStorage.removeItem('kmac_cart');
  localStorage.removeItem('kmac_coupon');
  updateCartCount();

  document.querySelector('.checkout-layout').innerHTML = `
    <div style="grid-column:1/-1;text-align:center;padding:80px 24px;">
      <div style="font-size:4rem;margin-bottom:16px;">🎉</div>
      <h2 style="font-size:1.8rem;margin-bottom:12px;">Order Placed Successfully!</h2>
      <p style="color:var(--text-sec);font-size:1.05rem;margin-bottom:8px;">Thank you for shopping with KMAC Tech, ${firstName}!</p>
      <p style="color:var(--text-sec);margin-bottom:8px;">A confirmation email has been sent to <strong>${email}</strong></p>
      <p style="color:var(--text-sec);margin-bottom:32px;">Order total: <strong>$${(total + shippingCost).toFixed(2)}</strong></p>
      <a href="shop.html" class="btn btn-primary btn-lg">Continue Shopping →</a>
    </div>`;
}
