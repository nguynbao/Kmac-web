// ===== KMAC Tech — Cart and Coupon Store =====

const CART_COOKIE = "kmac_cart";
const CART_DAYS = 7;

const COUPONS = {
  KMAC10: { type: "percent", value: 10, label: "10% off" },
  WELCOME5: { type: "fixed", value: 5, label: "$5 off" },
};

function setCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}

function getCookie(name) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];
}

function getCart() {
  try {
    const raw = getCookie(CART_COOKIE);
    return raw ? JSON.parse(decodeURIComponent(raw)) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  setCookie(CART_COOKIE, JSON.stringify(cart), CART_DAYS);
  updateCartCount();
}

function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existing = cart.find((i) => String(i.id) === String(productId));
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: String(productId), qty });
  }
  saveCart(cart);
  showToast("Added to cart! 🛒", "success");
}

function removeFromCart(productId) {
  saveCart(getCart().filter((i) => String(i.id) !== String(productId)));
}

function updateCartQty(productId, qty) {
  const cart = getCart();
  const item = cart.find((i) => String(i.id) === String(productId));
  if (item) {
    item.qty = Math.max(1, qty);
  }
  saveCart(cart);
}

function getCartTotal() {
  return getCart().reduce((sum, item) => {
    const p = PRODUCTS.find((pr) => String(pr.id) === String(item.id));
    return sum + (p ? p.price * item.qty : 0);
  }, 0);
}

function updateCartCount() {
  const count = getCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = count;
  });
}

function getAppliedCoupon() {
  return JSON.parse(localStorage.getItem("kmac_coupon") || "null");
}

function applyCouponCode(code) {
  const coupon = COUPONS[code.toUpperCase()];
  if (coupon) {
    localStorage.setItem(
      "kmac_coupon",
      JSON.stringify({ code: code.toUpperCase(), ...coupon }),
    );
    showToast(`Coupon applied! ${coupon.label} 🎉`, "success");
    return true;
  }
  showToast("Invalid coupon code 😕", "error");
  return false;
}

function removeCoupon() {
  localStorage.removeItem("kmac_coupon");
}

function getDiscountedTotal() {
  const subtotal = getCartTotal();
  const coupon = getAppliedCoupon();
  if (!coupon) return { subtotal, discount: 0, total: subtotal, coupon: null };
  let discount = 0;
  if (coupon.type === "percent") discount = subtotal * (coupon.value / 100);
  else if (coupon.type === "fixed") discount = Math.min(coupon.value, subtotal);
  return { subtotal, discount, total: subtotal - discount, coupon };
}
