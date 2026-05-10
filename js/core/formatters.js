// ===== KMAC Tech — Value Formatters =====

const KMAC_FORMAT = {
  locale: "en-US",
  currency: "USD",
};

function toFiniteNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function formatNumber(value, options = {}) {
  return new Intl.NumberFormat(options.locale || KMAC_FORMAT.locale, {
    maximumFractionDigits: 0,
    ...options,
  }).format(toFiniteNumber(value));
}

function formatCurrency(value, options = {}) {
  return new Intl.NumberFormat(options.locale || KMAC_FORMAT.locale, {
    style: "currency",
    currency: options.currency || KMAC_FORMAT.currency,
    minimumFractionDigits: options.minimumFractionDigits ?? 2,
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
  }).format(toFiniteNumber(value));
}

function formatPrice(value, options = {}) {
  return formatCurrency(value, options);
}

function formatSignedCurrency(value, options = {}) {
  const amount = toFiniteNumber(value);
  const sign = amount < 0 ? "-" : "";
  return sign + formatCurrency(Math.abs(amount), options);
}

function formatFreeOrCurrency(value, options = {}) {
  return toFiniteNumber(value) === 0
    ? '<span style="color:var(--green);font-weight:600;">FREE</span>'
    : formatCurrency(value, options);
}

function formatRating(value) {
  return Math.max(0, Math.min(5, Math.round(toFiniteNumber(value))));
}

function formatReviewCount(value) {
  const count = toFiniteNumber(value);
  return `${formatNumber(count)} review${count === 1 ? "" : "s"}`;
}

function formatProductCount(value) {
  const count = toFiniteNumber(value);
  return `${formatNumber(count)} Product${count === 1 ? "" : "s"}`;
}

function formatDiscountPercent(price, oldPrice) {
  const current = toFiniteNumber(price);
  const original = toFiniteNumber(oldPrice);
  if (original <= 0 || current >= original) return null;
  return Math.round((1 - current / original) * 100);
}
