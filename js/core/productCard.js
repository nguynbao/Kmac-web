// ===== KMAC Tech — Product Render Helpers =====

function renderStars(rating) {
  const roundedRating = formatRating(rating);
  return "★".repeat(roundedRating) + "☆".repeat(5 - roundedRating);
}

function renderProductCard(product) {
  let badgeHTML = "";
  if (product.badge === "best") {
    badgeHTML = '<span class="badge badge-best">Best Seller</span>';
  } else if (product.badge === "new") {
    badgeHTML = '<span class="badge badge-new">New</span>';
  } else if (product.badge === "sale") {
    const discountPercent = formatDiscountPercent(product.price, product.oldPrice);
    badgeHTML = discountPercent
      ? `<span class="badge badge-sale">-${discountPercent}%</span>`
      : '<span class="badge badge-sale">Sale</span>';
  }

  const priceHTML = product.oldPrice
    ? `${formatPrice(product.price)} <span class="old-price">${formatPrice(product.oldPrice)}</span>`
    : formatPrice(product.price);

  return `<a href="${pageUrl(`product.html?id=${product.id}`)}" class="product-card">
    <div class="product-img">
      ${badgeHTML ? '<div class="product-badges">' + badgeHTML + "</div>" : ""}
      ${imgPicture(product.img, product.name)}
    </div>
    <div class="product-info">
      <div class="product-rating"><span class="stars">${renderStars(product.rating)}</span> (${formatReviewCount(product.reviews)})</div>
      <h3 class="product-name">${product.name}</h3>
      <div class="product-price">${priceHTML}</div>
      <div class="product-actions"><button class="btn btn-cart" onclick="event.preventDefault();addToCart('${product.id}')">Add to Cart</button></div>
    </div>
  </a>`;
}
