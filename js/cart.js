/* ===== Cart Page JS v2.0 ===== */
/* FIXED: Coupon now actually applies discount to totals */

document.addEventListener('DOMContentLoaded', renderCart);

function renderCart() {
  const cart = getCart();
  const container = document.getElementById('cartContent');

  if (!cart.length) {
    container.innerHTML = `<div class="empty-cart">
      <div class="empty-icon">🛒</div>
      <h2>Your cart is empty</h2>
      <p>Looks like you haven't added anything yet. Let's fix that!</p>
      <a href="${pageUrl('shop.html')}" class="btn btn-primary">Continue Shopping →</a>
    </div>`;
    return;
  }

  const items = cart.map(item => {
    const p = PRODUCTS.find(pr => pr.id === item.id);
    if (!p) return '';
    return `<div class="cart-item">
      <div class="cart-item-img">
        <picture><source srcset="${assetUrl(p.img + '.webp')}" type="image/webp"><img src="${assetUrl(p.img + '.png')}" alt="${p.name}" width="100" height="100"></picture>
      </div>
      <div class="cart-item-info"><h3>${p.name}</h3><p>KMAC Tech</p></div>
      <div class="quantity-selector">
        <button onclick="updateCartQty(${p.id},${item.qty - 1});renderCart()" aria-label="Decrease">−</button>
        <input type="number" value="${item.qty}" min="1" max="10" aria-label="Quantity" onchange="updateCartQty(${p.id},parseInt(this.value));renderCart()">
        <button onclick="updateCartQty(${p.id},${item.qty + 1});renderCart()" aria-label="Increase">+</button>
      </div>
      <div class="cart-item-price">$${(p.price * item.qty).toFixed(2)}</div>
      <button class="cart-item-remove" onclick="removeFromCart(${p.id});renderCart()" aria-label="Remove ${p.name}">✕</button>
    </div>`;
  }).join('');

  // Use the fixed coupon system
  const { subtotal, discount, total, coupon } = getDiscountedTotal();

  // Upsell: suggest products not in cart
  const cartIds = cart.map(i => i.id);
  const upsells = PRODUCTS.filter(p => !cartIds.includes(p.id)).slice(0, 3);

  const couponDisplay = coupon
    ? `<div class="discount-applied">🎉 ${coupon.code} — ${coupon.label} applied <button onclick="removeCoupon();renderCart()" style="margin-left:auto;background:none;border:none;cursor:pointer;font-size:.9rem;" aria-label="Remove coupon">✕</button></div>`
    : '';

  container.innerHTML = `<div class="cart-layout">
    <div>
      <div class="cart-items">${items}</div>
      ${upsells.length ? `<div class="upsell-section"><h3 style="margin-bottom:16px;">You might also like ✨</h3><div class="grid grid-3">${upsells.map(p => renderProductCard(p)).join('')}</div></div>` : ''}
    </div>
    <div class="cart-summary">
      <h2>Order Summary</h2>
      <div class="summary-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
      ${discount > 0 ? `<div class="summary-row" style="color:var(--green);"><span>Discount</span><span>-$${discount.toFixed(2)}</span></div>` : ''}
      <div class="summary-row"><span>Shipping</span><span style="color:var(--green);font-weight:600;">FREE 🎉</span></div>
      ${couponDisplay}
      ${!coupon ? `<div class="coupon-input">
        <label for="couponInput" class="sr-only">Coupon code</label>
        <input type="text" placeholder="Coupon code" id="couponInput">
        <button class="btn btn-secondary btn-sm" onclick="applyCoupon()">Apply</button>
      </div>` : ''}
      <div class="summary-row total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
      <a href="${pageUrl('checkout.html')}" class="btn btn-primary checkout-btn btn-lg">Proceed to Checkout →</a>
      <div style="text-align:center;margin-top:16px;">
        <a href="${pageUrl('shop.html')}" style="color:var(--text-sec);font-size:.85rem;">← Continue Shopping</a>
      </div>
    </div>
  </div>`;
}

function applyCoupon() {
  const code = document.getElementById('couponInput').value.trim();
  if (code && applyCouponCode(code)) {
    renderCart(); // Re-render to show discount
  }
}
